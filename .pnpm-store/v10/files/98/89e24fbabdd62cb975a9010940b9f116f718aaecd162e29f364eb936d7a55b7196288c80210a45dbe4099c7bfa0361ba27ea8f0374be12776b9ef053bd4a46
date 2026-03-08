"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releasePlanCLIHandler = void 0;
exports.releasePlan = releasePlan;
const enquirer_1 = require("enquirer");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const semver_1 = require("semver");
const nx_json_1 = require("../../config/nx-json");
const file_map_utils_1 = require("../../project-graph/file-map-utils");
const project_graph_1 = require("../../project-graph/project-graph");
const output_1 = require("../../utils/output");
const params_1 = require("../../utils/params");
const config_1 = require("./config/config");
const filter_release_groups_1 = require("./config/filter-release-groups");
const version_plans_1 = require("./config/version-plans");
const generate_version_plan_content_1 = require("./utils/generate-version-plan-content");
const git_1 = require("./utils/git");
const print_changes_1 = require("./utils/print-changes");
const releasePlanCLIHandler = (args) => (0, params_1.handleErrors)(args.verbose, () => releasePlan(args));
exports.releasePlanCLIHandler = releasePlanCLIHandler;
async function releasePlan(args) {
    const projectGraph = await (0, project_graph_1.createProjectGraphAsync)({ exitOnError: true });
    const nxJson = (0, nx_json_1.readNxJson)();
    if (args.verbose) {
        process.env.NX_VERBOSE_LOGGING = 'true';
    }
    // Apply default configuration to any optional user configuration
    const { error: configError, nxReleaseConfig } = await (0, config_1.createNxReleaseConfig)(projectGraph, await (0, file_map_utils_1.createProjectFileMapUsingProjectGraph)(projectGraph), nxJson.release);
    if (configError) {
        return await (0, config_1.handleNxReleaseConfigError)(configError);
    }
    const { error: filterError, releaseGroups, releaseGroupToFilteredProjects, } = (0, filter_release_groups_1.filterReleaseGroups)(projectGraph, nxReleaseConfig, args.projects, args.groups);
    if (filterError) {
        output_1.output.error(filterError);
        process.exit(1);
    }
    const versionPlanBumps = {};
    const setBumpIfNotNone = (projectOrGroup, version) => {
        if (version !== 'none') {
            versionPlanBumps[projectOrGroup] = version;
        }
    };
    if (args.message) {
        const message = (0, git_1.parseConventionalCommitsMessage)(args.message);
        if (!message) {
            output_1.output.error({
                title: 'Changelog message is not in conventional commits format.',
                bodyLines: [
                    'Please ensure your message is in the form of:',
                    '  type(optional scope): description',
                    '',
                    'For example:',
                    '  feat(pkg-b): add new feature',
                    '  fix(pkg-a): correct a bug',
                    '  chore: update build process',
                    '  fix(core)!: breaking change in core package',
                ],
            });
            process.exit(1);
        }
    }
    if (releaseGroups[0].name === config_1.IMPLICIT_DEFAULT_RELEASE_GROUP) {
        const group = releaseGroups[0];
        if (group.projectsRelationship === 'independent') {
            for (const project of group.projects) {
                setBumpIfNotNone(project, args.bump ||
                    (await promptForVersion(`How do you want to bump the version of the project "${project}"?`)));
            }
        }
        else {
            // TODO: use project names instead of the implicit default release group name? (though this might be confusing, as users might think they can just delete one of the project bumps to change the behavior to independent versioning)
            setBumpIfNotNone(group.name, args.bump ||
                (await promptForVersion(`How do you want to bump the versions of all projects?`)));
        }
    }
    else {
        for (const group of releaseGroups) {
            if (group.projectsRelationship === 'independent') {
                for (const project of releaseGroupToFilteredProjects.get(group)) {
                    setBumpIfNotNone(project, args.bump ||
                        (await promptForVersion(`How do you want to bump the version of the project "${project}" within group "${group.name}"?`)));
                }
            }
            else {
                setBumpIfNotNone(group.name, args.bump ||
                    (await promptForVersion(`How do you want to bump the versions of the projects in the group "${group.name}"?`)));
            }
        }
    }
    if (!Object.keys(versionPlanBumps).length) {
        output_1.output.warn({
            title: 'No version bumps were selected so no version plan file was created.',
        });
        return 0;
    }
    const versionPlanMessage = args.message || (await promptForMessage());
    const versionPlanFileContent = (0, generate_version_plan_content_1.generateVersionPlanContent)(versionPlanBumps, versionPlanMessage);
    const versionPlanFileName = `version-plan-${new Date().getTime()}.md`;
    if (args.dryRun) {
        output_1.output.logSingleLine(`Would create version plan file "${versionPlanFileName}", but --dry-run was set.`);
        (0, print_changes_1.printDiff)('', versionPlanFileContent, 1);
    }
    else {
        output_1.output.logSingleLine(`Creating version plan file "${versionPlanFileName}"`);
        (0, print_changes_1.printDiff)('', versionPlanFileContent, 1);
        const versionPlansAbsolutePath = (0, version_plans_1.getVersionPlansAbsolutePath)();
        await (0, fs_extra_1.ensureDir)(versionPlansAbsolutePath);
        await (0, fs_extra_1.writeFile)((0, path_1.join)(versionPlansAbsolutePath, versionPlanFileName), versionPlanFileContent);
    }
    return 0;
}
async function promptForVersion(message) {
    try {
        const reply = await (0, enquirer_1.prompt)([
            {
                name: 'version',
                message,
                type: 'select',
                choices: [...semver_1.RELEASE_TYPES, 'none'],
            },
        ]);
        return reply.version;
    }
    catch (e) {
        output_1.output.log({
            title: 'Cancelled version plan creation.',
        });
        process.exit(0);
    }
}
async function promptForMessage() {
    let message;
    do {
        message = await _promptForMessage();
    } while (!message);
    return message;
}
// TODO: support non-conventional commits messages (will require significant changelog renderer changes)
async function _promptForMessage() {
    try {
        const reply = await (0, enquirer_1.prompt)([
            {
                name: 'message',
                message: 'What changelog message would you like associated with this change?',
                type: 'input',
            },
        ]);
        const conventionalCommitsMessage = (0, git_1.parseConventionalCommitsMessage)(reply.message);
        if (!conventionalCommitsMessage) {
            output_1.output.warn({
                title: 'Changelog message is not in conventional commits format.',
                bodyLines: [
                    'Please ensure your message is in the form of:',
                    '  type(optional scope): description',
                    '',
                    'For example:',
                    '  feat(pkg-b): add new feature',
                    '  fix(pkg-a): correct a bug',
                    '  chore: update build process',
                    '  fix(core)!: breaking change in core package',
                ],
            });
            return null;
        }
        return reply.message;
    }
    catch (e) {
        output_1.output.log({
            title: 'Cancelled version plan creation.',
        });
        process.exit(0);
    }
}
