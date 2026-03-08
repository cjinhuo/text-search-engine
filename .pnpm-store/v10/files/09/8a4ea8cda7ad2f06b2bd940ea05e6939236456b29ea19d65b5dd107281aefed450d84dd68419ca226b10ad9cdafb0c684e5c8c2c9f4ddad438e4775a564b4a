"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releasePublishCLIHandler = void 0;
exports.releasePublish = releasePublish;
const nx_json_1 = require("../../config/nx-json");
const file_map_utils_1 = require("../../project-graph/file-map-utils");
const project_graph_1 = require("../../project-graph/project-graph");
const run_command_1 = require("../../tasks-runner/run-command");
const command_line_utils_1 = require("../../utils/command-line-utils");
const output_1 = require("../../utils/output");
const params_1 = require("../../utils/params");
const project_graph_utils_1 = require("../../utils/project-graph-utils");
const graph_1 = require("../graph/graph");
const config_1 = require("./config/config");
const filter_release_groups_1 = require("./config/filter-release-groups");
const releasePublishCLIHandler = (args) => (0, params_1.handleErrors)(args.verbose, () => releasePublish(args, true));
exports.releasePublishCLIHandler = releasePublishCLIHandler;
/**
 * NOTE: This function is also exported for programmatic usage and forms part of the public API
 * of Nx. We intentionally do not wrap the implementation with handleErrors because users need
 * to have control over their own error handling when using the API.
 */
async function releasePublish(args, isCLI = false) {
    /**
     * When used via the CLI, the args object will contain a __overrides_unparsed__ property that is
     * important for invoking the relevant executor behind the scenes.
     *
     * We intentionally do not include that in the function signature, however, so as not to cause
     * confusing errors for programmatic consumers of this function.
     */
    const _args = args;
    const projectGraph = await (0, project_graph_1.createProjectGraphAsync)({ exitOnError: true });
    const nxJson = (0, nx_json_1.readNxJson)();
    if (_args.verbose) {
        process.env.NX_VERBOSE_LOGGING = 'true';
    }
    // Apply default configuration to any optional user configuration
    const { error: configError, nxReleaseConfig } = await (0, config_1.createNxReleaseConfig)(projectGraph, await (0, file_map_utils_1.createProjectFileMapUsingProjectGraph)(projectGraph), nxJson.release);
    if (configError) {
        return await (0, config_1.handleNxReleaseConfigError)(configError);
    }
    const { error: filterError, releaseGroups, releaseGroupToFilteredProjects, } = (0, filter_release_groups_1.filterReleaseGroups)(projectGraph, nxReleaseConfig, _args.projects, _args.groups);
    if (filterError) {
        output_1.output.error(filterError);
        process.exit(1);
    }
    /**
     * If the user is filtering to a subset of projects or groups, we should not run the publish task
     * for dependencies, because that could cause projects outset of the filtered set to be published.
     */
    const shouldExcludeTaskDependencies = _args.projects?.length > 0 || _args.groups?.length > 0;
    let overallExitStatus = 0;
    if (args.projects?.length) {
        /**
         * Run publishing for all remaining release groups and filtered projects within them
         */
        for (const releaseGroup of releaseGroups) {
            const status = await runPublishOnProjects(_args, projectGraph, nxJson, Array.from(releaseGroupToFilteredProjects.get(releaseGroup)), isCLI, {
                excludeTaskDependencies: shouldExcludeTaskDependencies,
                loadDotEnvFiles: process.env.NX_LOAD_DOT_ENV_FILES !== 'false',
            });
            if (status !== 0) {
                overallExitStatus = status || 1;
            }
        }
        return overallExitStatus;
    }
    /**
     * Run publishing for all remaining release groups
     */
    for (const releaseGroup of releaseGroups) {
        const status = await runPublishOnProjects(_args, projectGraph, nxJson, releaseGroup.projects, isCLI, {
            excludeTaskDependencies: shouldExcludeTaskDependencies,
            loadDotEnvFiles: process.env.NX_LOAD_DOT_ENV_FILES !== 'false',
        });
        if (status !== 0) {
            overallExitStatus = status || 1;
        }
    }
    return overallExitStatus;
}
async function runPublishOnProjects(args, projectGraph, nxJson, projectNames, isCLI, extraOptions) {
    const projectsToRun = projectNames.map((projectName) => projectGraph.nodes[projectName]);
    const overrides = (0, command_line_utils_1.createOverrides)(args.__overrides_unparsed__);
    if (args.registry) {
        overrides.registry = args.registry;
    }
    if (args.tag) {
        overrides.tag = args.tag;
    }
    if (args.otp) {
        overrides.otp = args.otp;
    }
    if (args.dryRun) {
        overrides.dryRun = args.dryRun;
        /**
         * Ensure the env var is set too, so that any and all publish executors triggered
         * indirectly via dependsOn can also pick up on the fact that this is a dry run.
         */
        process.env.NX_DRY_RUN = 'true';
    }
    if (args.verbose) {
        process.env.NX_VERBOSE_LOGGING = 'true';
    }
    if (args.firstRelease) {
        overrides.firstRelease = args.firstRelease;
    }
    const requiredTargetName = 'nx-release-publish';
    if (args.graph) {
        const file = (0, command_line_utils_1.readGraphFileFromGraphArg)(args);
        const projectNamesWithTarget = projectsToRun
            .map((t) => t.name)
            .filter((projectName) => (0, project_graph_utils_1.projectHasTarget)(projectGraph.nodes[projectName], requiredTargetName));
        await (0, graph_1.generateGraph)({
            watch: true,
            all: false,
            open: true,
            view: 'tasks',
            targets: [requiredTargetName],
            projects: projectNamesWithTarget,
            file,
        }, projectNamesWithTarget);
        return 0;
    }
    const projectsWithTarget = projectsToRun.filter((project) => (0, project_graph_utils_1.projectHasTarget)(project, requiredTargetName));
    if (projectsWithTarget.length === 0) {
        throw new Error(`Based on your config, the following projects were matched for publishing but do not have the "${requiredTargetName}" target specified:\n${[
            ...projectsToRun.map((p) => `- ${p.name}`),
            '',
            `This is usually caused by not having an appropriate plugin, such as "@nx/js" installed, which will add the appropriate "${requiredTargetName}" target for you automatically.`,
        ].join('\n')}\n`);
    }
    /**
     * Run the relevant nx-release-publish executor on each of the selected projects.
     */
    const status = await (0, run_command_1.runCommand)(projectsWithTarget, projectGraph, { nxJson }, {
        targets: [requiredTargetName],
        outputStyle: 'static',
        ...args,
        // It is possible for workspaces to have circular dependencies between packages and still release them to a registry
        nxIgnoreCycles: true,
    }, overrides, null, {}, extraOptions);
    if (status !== 0) {
        // In order to not add noise to the overall CLI output, do not throw an additional error
        if (isCLI) {
            return status;
        }
        // Throw an additional error for programmatic API usage
        throw new Error('One or more of the selected projects could not be published');
    }
    return 0;
}
