"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readRawVersionPlans = readRawVersionPlans;
exports.setVersionPlansOnGroups = setVersionPlansOnGroups;
exports.getVersionPlansAbsolutePath = getVersionPlansAbsolutePath;
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const semver_1 = require("semver");
const workspace_root_1 = require("../../../utils/workspace-root");
const config_1 = require("./config");
const fm = require('front-matter');
const versionPlansDirectory = (0, path_1.join)('.nx', 'version-plans');
async function readRawVersionPlans() {
    const versionPlansPath = getVersionPlansAbsolutePath();
    const versionPlansPathExists = await (0, fs_extra_1.pathExists)(versionPlansPath);
    if (!versionPlansPathExists) {
        return [];
    }
    const versionPlans = [];
    const versionPlanFiles = (0, fs_1.readdirSync)(versionPlansPath);
    for (const versionPlanFile of versionPlanFiles) {
        const filePath = (0, path_1.join)(versionPlansPath, versionPlanFile);
        const versionPlanContent = (0, fs_1.readFileSync)(filePath).toString();
        const versionPlanStats = await (0, fs_extra_1.stat)(filePath);
        const parsedContent = fm(versionPlanContent);
        versionPlans.push({
            absolutePath: filePath,
            relativePath: (0, path_1.join)(versionPlansDirectory, versionPlanFile),
            fileName: versionPlanFile,
            content: parsedContent.attributes,
            message: getSingleLineMessage(parsedContent.body),
            createdOnMs: versionPlanStats.birthtimeMs,
        });
    }
    return versionPlans;
}
function setVersionPlansOnGroups(rawVersionPlans, releaseGroups, allProjectNamesInWorkspace) {
    const groupsByName = releaseGroups.reduce((acc, group) => acc.set(group.name, group), new Map());
    const isDefaultGroup = isDefault(releaseGroups);
    for (const rawVersionPlan of rawVersionPlans) {
        for (const [key, value] of Object.entries(rawVersionPlan.content)) {
            if (groupsByName.has(key)) {
                const group = groupsByName.get(key);
                if (!group.versionPlans) {
                    if (isDefaultGroup) {
                        throw new Error(`Found a version bump in '${rawVersionPlan.fileName}' but version plans are not enabled.`);
                    }
                    else {
                        throw new Error(`Found a version bump for group '${key}' in '${rawVersionPlan.fileName}' but the group does not have version plans enabled.`);
                    }
                }
                if (group.projectsRelationship === 'independent') {
                    if (isDefaultGroup) {
                        throw new Error(`Found a version bump in '${rawVersionPlan.fileName}' but projects are configured to be independently versioned. Individual projects should be bumped instead.`);
                    }
                    else {
                        throw new Error(`Found a version bump for group '${key}' in '${rawVersionPlan.fileName}' but the group's projects are independently versioned. Individual projects of '${key}' should be bumped instead.`);
                    }
                }
                if (!isReleaseType(value)) {
                    if (isDefaultGroup) {
                        throw new Error(`Found a version bump in '${rawVersionPlan.fileName}' with an invalid release type. Please specify one of ${semver_1.RELEASE_TYPES.join(', ')}.`);
                    }
                    else {
                        throw new Error(`Found a version bump for group '${key}' in '${rawVersionPlan.fileName}' with an invalid release type. Please specify one of ${semver_1.RELEASE_TYPES.join(', ')}.`);
                    }
                }
                const existingPlan = (group.versionPlans.find((plan) => plan.fileName === rawVersionPlan.fileName));
                if (existingPlan) {
                    if (existingPlan.groupVersionBump !== value) {
                        if (isDefaultGroup) {
                            throw new Error(`Found a version bump in '${rawVersionPlan.fileName}' that conflicts with another version bump. When in fixed versioning mode, all version bumps must match.`);
                        }
                        else {
                            throw new Error(`Found a version bump for group '${key}' in '${rawVersionPlan.fileName}' that conflicts with another version bump for this group. When the group is in fixed versioning mode, all groups' version bumps within the same version plan must match.`);
                        }
                    }
                }
                else {
                    group.versionPlans.push({
                        absolutePath: rawVersionPlan.absolutePath,
                        relativePath: rawVersionPlan.relativePath,
                        fileName: rawVersionPlan.fileName,
                        createdOnMs: rawVersionPlan.createdOnMs,
                        message: rawVersionPlan.message,
                        groupVersionBump: value,
                    });
                }
            }
            else {
                const groupForProject = releaseGroups.find((group) => group.projects.includes(key));
                if (!groupForProject) {
                    if (!allProjectNamesInWorkspace.includes(key)) {
                        throw new Error(`Found a version bump for project '${key}' in '${rawVersionPlan.fileName}' but the project does not exist in the workspace.`);
                    }
                    if (isDefaultGroup) {
                        throw new Error(`Found a version bump for project '${key}' in '${rawVersionPlan.fileName}' but the project is not configured for release. Ensure it is included by the 'release.projects' globs in nx.json.`);
                    }
                    else {
                        throw new Error(`Found a version bump for project '${key}' in '${rawVersionPlan.fileName}' but the project is not in any configured release groups.`);
                    }
                }
                if (!groupForProject.versionPlans) {
                    if (isDefaultGroup) {
                        throw new Error(`Found a version bump for project '${key}' in '${rawVersionPlan.fileName}' but version plans are not enabled.`);
                    }
                    else {
                        throw new Error(`Found a version bump for project '${key}' in '${rawVersionPlan.fileName}' but the project's group '${groupForProject.name}' does not have version plans enabled.`);
                    }
                }
                if (!isReleaseType(value)) {
                    throw new Error(`Found a version bump for project '${key}' in '${rawVersionPlan.fileName}' with an invalid release type. Please specify one of ${semver_1.RELEASE_TYPES.join(', ')}.`);
                }
                if (groupForProject.projectsRelationship === 'independent') {
                    const existingPlan = (groupForProject.versionPlans.find((plan) => plan.fileName === rawVersionPlan.fileName));
                    if (existingPlan) {
                        existingPlan.projectVersionBumps[key] = value;
                    }
                    else {
                        groupForProject.versionPlans.push({
                            absolutePath: rawVersionPlan.absolutePath,
                            relativePath: rawVersionPlan.relativePath,
                            fileName: rawVersionPlan.fileName,
                            createdOnMs: rawVersionPlan.createdOnMs,
                            message: rawVersionPlan.message,
                            projectVersionBumps: {
                                [key]: value,
                            },
                        });
                    }
                }
                else {
                    const existingPlan = (groupForProject.versionPlans.find((plan) => plan.fileName === rawVersionPlan.fileName));
                    // This can occur if the same fixed release group has multiple entries for different projects within
                    // the same version plan file. This will be the case when users are using the default release group.
                    if (existingPlan) {
                        if (existingPlan.groupVersionBump !== value) {
                            if (isDefaultGroup) {
                                throw new Error(`Found a version bump for project '${key}' in '${rawVersionPlan.fileName}' that conflicts with another version bump. When in fixed versioning mode, all version bumps must match.`);
                            }
                            else {
                                throw new Error(`Found a version bump for project '${key}' in '${rawVersionPlan.fileName}' that conflicts with another project's version bump in the same release group '${groupForProject.name}'. When the group is in fixed versioning mode, all projects' version bumps within the same group must match.`);
                            }
                        }
                    }
                    else {
                        groupForProject.versionPlans.push({
                            absolutePath: rawVersionPlan.absolutePath,
                            relativePath: rawVersionPlan.relativePath,
                            fileName: rawVersionPlan.fileName,
                            createdOnMs: rawVersionPlan.createdOnMs,
                            message: rawVersionPlan.message,
                            // This is a fixed group, so the version bump is for the group, even if a project within it was specified
                            groupVersionBump: value,
                        });
                    }
                }
            }
        }
    }
    // Order the plans from newest to oldest
    releaseGroups.forEach((group) => {
        if (group.versionPlans) {
            group.versionPlans.sort((a, b) => b.createdOnMs - a.createdOnMs);
        }
    });
    return releaseGroups;
}
function isDefault(releaseGroups) {
    return (releaseGroups.length === 1 &&
        releaseGroups.some((group) => group.name === config_1.IMPLICIT_DEFAULT_RELEASE_GROUP));
}
function getVersionPlansAbsolutePath() {
    return (0, path_1.join)(workspace_root_1.workspaceRoot, versionPlansDirectory);
}
function isReleaseType(value) {
    return semver_1.RELEASE_TYPES.includes(value);
}
// changelog messages may only be a single line long, so ignore anything else
function getSingleLineMessage(message) {
    return message.trim().split('\n')[0];
}
