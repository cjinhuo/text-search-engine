"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseCLIHandler = void 0;
exports.release = release;
const enquirer_1 = require("enquirer");
const fs_extra_1 = require("fs-extra");
const nx_json_1 = require("../../config/nx-json");
const file_map_utils_1 = require("../../project-graph/file-map-utils");
const project_graph_1 = require("../../project-graph/project-graph");
const output_1 = require("../../utils/output");
const params_1 = require("../../utils/params");
const changelog_1 = require("./changelog");
const config_1 = require("./config/config");
const filter_release_groups_1 = require("./config/filter-release-groups");
const version_plans_1 = require("./config/version-plans");
const publish_1 = require("./publish");
const git_1 = require("./utils/git");
const github_1 = require("./utils/github");
const resolve_nx_json_error_message_1 = require("./utils/resolve-nx-json-error-message");
const shared_1 = require("./utils/shared");
const version_1 = require("./version");
const releaseCLIHandler = (args) => (0, params_1.handleErrors)(args.verbose, () => release(args));
exports.releaseCLIHandler = releaseCLIHandler;
async function release(args) {
    const projectGraph = await (0, project_graph_1.createProjectGraphAsync)({ exitOnError: true });
    const nxJson = (0, nx_json_1.readNxJson)();
    if (args.verbose) {
        process.env.NX_VERBOSE_LOGGING = 'true';
    }
    const hasVersionGitConfig = Object.keys(nxJson.release?.version?.git ?? {}).length > 0;
    const hasChangelogGitConfig = Object.keys(nxJson.release?.changelog?.git ?? {}).length > 0;
    if (hasVersionGitConfig || hasChangelogGitConfig) {
        const jsonConfigErrorPath = hasVersionGitConfig
            ? ['release', 'version', 'git']
            : ['release', 'changelog', 'git'];
        const nxJsonMessage = await (0, resolve_nx_json_error_message_1.resolveNxJsonConfigErrorMessage)(jsonConfigErrorPath);
        output_1.output.error({
            title: `The "release" top level command cannot be used with granular git configuration. Instead, configure git options in the "release.git" property in nx.json, or use the version, changelog, and publish subcommands or programmatic API directly.`,
            bodyLines: [nxJsonMessage],
        });
        process.exit(1);
    }
    // Apply default configuration to any optional user configuration
    const { error: configError, nxReleaseConfig } = await (0, config_1.createNxReleaseConfig)(projectGraph, await (0, file_map_utils_1.createProjectFileMapUsingProjectGraph)(projectGraph), nxJson.release);
    if (configError) {
        return await (0, config_1.handleNxReleaseConfigError)(configError);
    }
    // These properties must never be undefined as this command should
    // always explicitly override the git operations of the subcommands.
    const shouldCommit = nxJson.release?.git?.commit ?? true;
    const shouldStage = (shouldCommit || nxJson.release?.git?.stageChanges) ?? false;
    const shouldTag = nxJson.release?.git?.tag ?? true;
    const versionResult = await (0, version_1.releaseVersion)({
        ...args,
        stageChanges: shouldStage,
        gitCommit: false,
        gitTag: false,
        deleteVersionPlans: false,
    });
    const changelogResult = await (0, changelog_1.releaseChangelog)({
        ...args,
        versionData: versionResult.projectsVersionData,
        version: versionResult.workspaceVersion,
        stageChanges: shouldStage,
        gitCommit: false,
        gitTag: false,
        createRelease: false,
        deleteVersionPlans: false,
    });
    const { error: filterError, releaseGroups, releaseGroupToFilteredProjects, } = (0, filter_release_groups_1.filterReleaseGroups)(projectGraph, nxReleaseConfig, args.projects, args.groups);
    if (filterError) {
        output_1.output.error(filterError);
        process.exit(1);
    }
    const rawVersionPlans = await (0, version_plans_1.readRawVersionPlans)();
    (0, version_plans_1.setVersionPlansOnGroups)(rawVersionPlans, releaseGroups, Object.keys(projectGraph.nodes));
    const planFiles = new Set();
    releaseGroups.forEach((group) => {
        if (group.versionPlans) {
            if (group.name === config_1.IMPLICIT_DEFAULT_RELEASE_GROUP) {
                output_1.output.logSingleLine(`Removing version plan files`);
            }
            else {
                output_1.output.logSingleLine(`Removing version plan files for group ${group.name}`);
            }
            group.versionPlans.forEach((plan) => {
                if (!args.dryRun) {
                    (0, fs_extra_1.removeSync)(plan.absolutePath);
                    if (args.verbose) {
                        console.log(`Removing ${plan.relativePath}`);
                    }
                }
                else {
                    if (args.verbose) {
                        console.log(`Would remove ${plan.relativePath}, but --dry-run was set`);
                    }
                }
                planFiles.add(plan.relativePath);
            });
        }
    });
    const deletedFiles = Array.from(planFiles);
    if (deletedFiles.length > 0) {
        await (0, git_1.gitAdd)({
            changedFiles: [],
            deletedFiles,
            dryRun: args.dryRun,
            verbose: args.verbose,
        });
    }
    if (shouldCommit) {
        output_1.output.logSingleLine(`Committing changes with git`);
        const commitMessage = nxReleaseConfig.git.commitMessage;
        const commitMessageValues = (0, shared_1.createCommitMessageValues)(releaseGroups, releaseGroupToFilteredProjects, versionResult.projectsVersionData, commitMessage);
        await (0, git_1.gitCommit)({
            messages: commitMessageValues,
            additionalArgs: nxReleaseConfig.git.commitArgs,
            dryRun: args.dryRun,
            verbose: args.verbose,
        });
    }
    if (shouldTag) {
        output_1.output.logSingleLine(`Tagging commit with git`);
        // Resolve any git tags as early as possible so that we can hard error in case of any duplicates before reaching the actual git command
        const gitTagValues = (0, shared_1.createGitTagValues)(releaseGroups, releaseGroupToFilteredProjects, versionResult.projectsVersionData);
        (0, shared_1.handleDuplicateGitTags)(gitTagValues);
        for (const tag of gitTagValues) {
            await (0, git_1.gitTag)({
                tag,
                message: nxReleaseConfig.git.tagMessage,
                additionalArgs: nxReleaseConfig.git.tagArgs,
                dryRun: args.dryRun,
                verbose: args.verbose,
            });
        }
    }
    const shouldCreateWorkspaceRelease = (0, changelog_1.shouldCreateGitHubRelease)(nxReleaseConfig.changelog.workspaceChangelog);
    let hasPushedChanges = false;
    let latestCommit;
    if (shouldCreateWorkspaceRelease && changelogResult.workspaceChangelog) {
        output_1.output.logSingleLine(`Pushing to git remote`);
        // Before we can create/update the release we need to ensure the commit exists on the remote
        await (0, git_1.gitPush)({
            dryRun: args.dryRun,
            verbose: args.verbose,
        });
        hasPushedChanges = true;
        output_1.output.logSingleLine(`Creating GitHub Release`);
        latestCommit = await (0, git_1.getCommitHash)('HEAD');
        await (0, github_1.createOrUpdateGithubRelease)(changelogResult.workspaceChangelog.releaseVersion, changelogResult.workspaceChangelog.contents, latestCommit, { dryRun: args.dryRun });
    }
    for (const releaseGroup of releaseGroups) {
        const shouldCreateProjectReleases = (0, changelog_1.shouldCreateGitHubRelease)(releaseGroup.changelog);
        if (shouldCreateProjectReleases && changelogResult.projectChangelogs) {
            const projects = args.projects?.length
                ? // If the user has passed a list of projects, we need to use the filtered list of projects within the release group
                    Array.from(releaseGroupToFilteredProjects.get(releaseGroup))
                : // Otherwise, we use the full list of projects within the release group
                    releaseGroup.projects;
            const projectNodes = projects.map((name) => projectGraph.nodes[name]);
            for (const project of projectNodes) {
                const changelog = changelogResult.projectChangelogs[project.name];
                if (!changelog) {
                    continue;
                }
                if (!hasPushedChanges) {
                    output_1.output.logSingleLine(`Pushing to git remote`);
                    // Before we can create/update the release we need to ensure the commit exists on the remote
                    await (0, git_1.gitPush)({
                        dryRun: args.dryRun,
                        verbose: args.verbose,
                    });
                    hasPushedChanges = true;
                }
                output_1.output.logSingleLine(`Creating GitHub Release`);
                if (!latestCommit) {
                    latestCommit = await (0, git_1.getCommitHash)('HEAD');
                }
                await (0, github_1.createOrUpdateGithubRelease)(changelog.releaseVersion, changelog.contents, latestCommit, { dryRun: args.dryRun });
            }
        }
    }
    let hasNewVersion = false;
    // null means that all projects are versioned together but there were no changes
    if (versionResult.workspaceVersion !== null) {
        hasNewVersion = Object.values(versionResult.projectsVersionData).some((version) => version.newVersion !== null);
    }
    let shouldPublish = !!args.yes && !args.skipPublish && hasNewVersion;
    const shouldPromptPublishing = !args.yes && !args.skipPublish && !args.dryRun && hasNewVersion;
    if (shouldPromptPublishing) {
        shouldPublish = await promptForPublish();
    }
    if (shouldPublish) {
        await (0, publish_1.releasePublish)(args);
    }
    else {
        output_1.output.logSingleLine('Skipped publishing packages.');
    }
    return versionResult;
}
async function promptForPublish() {
    try {
        const reply = await (0, enquirer_1.prompt)([
            {
                name: 'confirmation',
                message: 'Do you want to publish these versions?',
                type: 'confirm',
            },
        ]);
        return reply.confirmation;
    }
    catch (e) {
        // Handle the case where the user exits the prompt with ctrl+c
        return false;
    }
}
