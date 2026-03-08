"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMPLICIT_DEFAULT_RELEASE_GROUP = void 0;
exports.createNxReleaseConfig = createNxReleaseConfig;
exports.handleNxReleaseConfigError = handleNxReleaseConfigError;
/**
 * `nx release` is a powerful feature which spans many possible use cases. The possible variations
 * of configuration are therefore quite complex, particularly when you consider release groups.
 *
 * We want to provide the best possible DX for users so that they can harness the power of `nx release`
 * most effectively, therefore we need to both provide sensible defaults for common scenarios (to avoid
 * verbose nx.json files wherever possible), and proactively handle potential sources of config issues
 * in more complex use-cases.
 *
 * This file is the source of truth for all `nx release` configuration reconciliation, including sensible
 * defaults and user overrides, as well as handling common errors, up front to produce a single, consistent,
 * and easy to consume config object for all the `nx release` command implementations.
 */
const node_path_1 = require("node:path");
const fileutils_1 = require("../../../utils/fileutils");
const find_matching_projects_1 = require("../../../utils/find-matching-projects");
const output_1 = require("../../../utils/output");
const workspace_root_1 = require("../../../utils/workspace-root");
const resolve_changelog_renderer_1 = require("../utils/resolve-changelog-renderer");
const resolve_nx_json_error_message_1 = require("../utils/resolve-nx-json-error-message");
const conventional_commits_1 = require("./conventional-commits");
exports.IMPLICIT_DEFAULT_RELEASE_GROUP = '__default__';
// Apply default configuration to any optional user configuration and handle known errors
async function createNxReleaseConfig(projectGraph, projectFileMap, userConfig = {}) {
    if (userConfig.projects && userConfig.groups) {
        return {
            error: {
                code: 'PROJECTS_AND_GROUPS_DEFINED',
                data: {},
            },
            nxReleaseConfig: null,
        };
    }
    if (hasInvalidGitConfig(userConfig)) {
        return {
            error: {
                code: 'GLOBAL_GIT_CONFIG_MIXED_WITH_GRANULAR_GIT_CONFIG',
                data: {},
            },
            nxReleaseConfig: null,
        };
    }
    if (hasInvalidConventionalCommitsConfig(userConfig)) {
        return {
            error: {
                code: 'CONVENTIONAL_COMMITS_SHORTHAND_MIXED_WITH_OVERLAPPING_GENERATOR_OPTIONS',
                data: {},
            },
            nxReleaseConfig: null,
        };
    }
    const gitDefaults = {
        commit: false,
        commitMessage: 'chore(release): publish {version}',
        commitArgs: '',
        tag: false,
        tagMessage: '',
        tagArgs: '',
        stageChanges: false,
    };
    const versionGitDefaults = {
        ...gitDefaults,
        stageChanges: true,
    };
    const changelogGitDefaults = {
        ...gitDefaults,
        commit: true,
        tag: true,
    };
    const defaultFixedReleaseTagPattern = 'v{version}';
    /**
     * TODO: in v20, make it so that this pattern is used by default when any custom groups are used
     */
    const defaultFixedGroupReleaseTagPattern = '{releaseGroupName}-v{version}';
    const defaultIndependentReleaseTagPattern = '{projectName}@{version}';
    const workspaceProjectsRelationship = userConfig.projectsRelationship || 'fixed';
    const defaultGeneratorOptions = {};
    if (userConfig.version?.conventionalCommits) {
        defaultGeneratorOptions.currentVersionResolver = 'git-tag';
        defaultGeneratorOptions.specifierSource = 'conventional-commits';
    }
    if (userConfig.versionPlans) {
        defaultGeneratorOptions.specifierSource = 'version-plans';
    }
    const userGroups = Object.values(userConfig.groups ?? {});
    const disableWorkspaceChangelog = userGroups.length > 1 ||
        (userGroups.length === 1 &&
            userGroups[0].projectsRelationship === 'independent') ||
        (userConfig.projectsRelationship === 'independent' &&
            !userGroups.some((g) => g.projectsRelationship === 'fixed'));
    const defaultRendererPath = (0, node_path_1.join)(__dirname, '../../../../release/changelog-renderer');
    const WORKSPACE_DEFAULTS = {
        // By default all projects in all groups are released together
        projectsRelationship: workspaceProjectsRelationship,
        git: gitDefaults,
        version: {
            git: versionGitDefaults,
            conventionalCommits: userConfig.version?.conventionalCommits || false,
            generator: '@nx/js:release-version',
            generatorOptions: defaultGeneratorOptions,
            preVersionCommand: userConfig.version?.preVersionCommand || '',
        },
        changelog: {
            git: changelogGitDefaults,
            workspaceChangelog: disableWorkspaceChangelog
                ? false
                : {
                    createRelease: false,
                    entryWhenNoChanges: 'This was a version bump only, there were no code changes.',
                    file: '{workspaceRoot}/CHANGELOG.md',
                    renderer: defaultRendererPath,
                    renderOptions: {
                        authors: true,
                        mapAuthorsToGitHubUsernames: true,
                        commitReferences: true,
                        versionTitleDate: true,
                    },
                },
            // For projectChangelogs if the user has set any changelog config at all, then use one set of defaults, otherwise default to false for the whole feature
            projectChangelogs: userConfig.changelog?.projectChangelogs
                ? {
                    createRelease: false,
                    file: '{projectRoot}/CHANGELOG.md',
                    entryWhenNoChanges: 'This was a version bump only for {projectName} to align it with other projects, there were no code changes.',
                    renderer: defaultRendererPath,
                    renderOptions: {
                        authors: true,
                        mapAuthorsToGitHubUsernames: true,
                        commitReferences: true,
                        versionTitleDate: true,
                    },
                }
                : false,
            automaticFromRef: false,
        },
        releaseTagPattern: userConfig.releaseTagPattern ||
            // The appropriate default releaseTagPattern is dependent upon the projectRelationships
            (workspaceProjectsRelationship === 'independent'
                ? defaultIndependentReleaseTagPattern
                : defaultFixedReleaseTagPattern),
        conventionalCommits: conventional_commits_1.DEFAULT_CONVENTIONAL_COMMITS_CONFIG,
        versionPlans: false,
    };
    const groupProjectsRelationship = userConfig.projectsRelationship || WORKSPACE_DEFAULTS.projectsRelationship;
    const GROUP_DEFAULTS = {
        projectsRelationship: groupProjectsRelationship,
        version: {
            conventionalCommits: false,
            generator: '@nx/js:release-version',
            generatorOptions: {},
        },
        changelog: {
            createRelease: false,
            entryWhenNoChanges: 'This was a version bump only for {projectName} to align it with other projects, there were no code changes.',
            file: '{projectRoot}/CHANGELOG.md',
            renderer: defaultRendererPath,
            renderOptions: {
                authors: true,
                mapAuthorsToGitHubUsernames: true,
                commitReferences: true,
                versionTitleDate: true,
            },
        },
        releaseTagPattern: 
        // The appropriate group default releaseTagPattern is dependent upon the projectRelationships
        groupProjectsRelationship === 'independent'
            ? defaultIndependentReleaseTagPattern
            : WORKSPACE_DEFAULTS.releaseTagPattern,
        versionPlans: false,
    };
    /**
     * We first process root level config and apply defaults, so that we know how to handle the group level
     * overrides, if applicable.
     */
    const rootGitConfig = deepMergeDefaults([WORKSPACE_DEFAULTS.git], userConfig.git);
    const rootVersionConfig = deepMergeDefaults([
        WORKSPACE_DEFAULTS.version,
        // Merge in the git defaults from the top level
        { git: versionGitDefaults },
        {
            git: userConfig.git,
        },
    ], userConfig.version);
    if (userConfig.changelog?.workspaceChangelog) {
        userConfig.changelog.workspaceChangelog = normalizeTrueToEmptyObject(userConfig.changelog.workspaceChangelog);
    }
    if (userConfig.changelog?.projectChangelogs) {
        userConfig.changelog.projectChangelogs = normalizeTrueToEmptyObject(userConfig.changelog.projectChangelogs);
    }
    const rootChangelogConfig = deepMergeDefaults([
        WORKSPACE_DEFAULTS.changelog,
        // Merge in the git defaults from the top level
        { git: changelogGitDefaults },
        {
            git: userConfig.git,
        },
    ], normalizeTrueToEmptyObject(userConfig.changelog));
    const rootVersionPlansConfig = userConfig.versionPlans ?? WORKSPACE_DEFAULTS.versionPlans;
    const rootConventionalCommitsConfig = deepMergeDefaults([WORKSPACE_DEFAULTS.conventionalCommits], fillUnspecifiedConventionalCommitsProperties(normalizeConventionalCommitsConfig(userConfig.conventionalCommits)));
    // these options are not supported at the group level, only the root/command level
    const rootVersionWithoutGlobalOptions = { ...rootVersionConfig };
    delete rootVersionWithoutGlobalOptions.git;
    delete rootVersionWithoutGlobalOptions.preVersionCommand;
    // Apply conventionalCommits shorthand to the final group defaults if explicitly configured in the original user config
    if (userConfig.version?.conventionalCommits === true) {
        rootVersionWithoutGlobalOptions.generatorOptions = {
            ...rootVersionWithoutGlobalOptions.generatorOptions,
            currentVersionResolver: 'git-tag',
            specifierSource: 'conventional-commits',
        };
    }
    if (userConfig.version?.conventionalCommits === false) {
        delete rootVersionWithoutGlobalOptions.generatorOptions
            .currentVersionResolver;
        delete rootVersionWithoutGlobalOptions.generatorOptions.specifierSource;
    }
    // Apply versionPlans shorthand to the final group defaults if explicitly configured in the original user config
    if (userConfig.versionPlans) {
        rootVersionWithoutGlobalOptions.generatorOptions = {
            ...rootVersionWithoutGlobalOptions.generatorOptions,
            specifierSource: 'version-plans',
        };
    }
    if (userConfig.versionPlans === false) {
        delete rootVersionWithoutGlobalOptions.generatorOptions.specifierSource;
    }
    const groups = userConfig.groups && Object.keys(userConfig.groups).length
        ? ensureProjectsConfigIsArray(userConfig.groups)
        : /**
           * No user specified release groups, so we treat all projects (or any any user-defined subset via the top level "projects" property)
           * as being in one release group together in which the projects are released in lock step.
           */
            {
                [exports.IMPLICIT_DEFAULT_RELEASE_GROUP]: {
                    projectsRelationship: GROUP_DEFAULTS.projectsRelationship,
                    projects: userConfig.projects
                        ? // user-defined top level "projects" config takes priority if set
                            (0, find_matching_projects_1.findMatchingProjects)(ensureArray(userConfig.projects), projectGraph.nodes)
                        : await getDefaultProjects(projectGraph, projectFileMap),
                    /**
                     * For properties which are overriding config at the root, we use the root level config as the
                     * default values to merge with so that the group that matches a specific project will always
                     * be the valid source of truth for that type of config.
                     */
                    version: deepMergeDefaults([GROUP_DEFAULTS.version], rootVersionWithoutGlobalOptions),
                    // If the user has set something custom for releaseTagPattern at the top level, respect it for the implicit default group
                    releaseTagPattern: userConfig.releaseTagPattern || GROUP_DEFAULTS.releaseTagPattern,
                    // Directly inherit the root level config for projectChangelogs, if set
                    changelog: rootChangelogConfig.projectChangelogs || false,
                    versionPlans: rootVersionPlansConfig || GROUP_DEFAULTS.versionPlans,
                },
            };
    /**
     * Resolve all the project names into their release groups, and check
     * that individual projects are not found in multiple groups.
     */
    const releaseGroups = {};
    const alreadyMatchedProjects = new Set();
    for (const [releaseGroupName, releaseGroup] of Object.entries(groups)) {
        // Ensure that the config for the release group can resolve at least one project
        const matchingProjects = (0, find_matching_projects_1.findMatchingProjects)(releaseGroup.projects, projectGraph.nodes);
        if (!matchingProjects.length) {
            return {
                error: {
                    code: 'RELEASE_GROUP_MATCHES_NO_PROJECTS',
                    data: {
                        releaseGroupName: releaseGroupName,
                    },
                },
                nxReleaseConfig: null,
            };
        }
        // If provided, ensure release tag pattern is valid
        if (releaseGroup.releaseTagPattern) {
            const error = ensureReleaseGroupReleaseTagPatternIsValid(releaseGroup.releaseTagPattern, releaseGroupName);
            if (error) {
                return {
                    error,
                    nxReleaseConfig: null,
                };
            }
        }
        for (const project of matchingProjects) {
            if (alreadyMatchedProjects.has(project)) {
                return {
                    error: {
                        code: 'PROJECT_MATCHES_MULTIPLE_GROUPS',
                        data: {
                            project,
                        },
                    },
                    nxReleaseConfig: null,
                };
            }
            alreadyMatchedProjects.add(project);
        }
        // First apply any group level defaults, then apply actual root level config (if applicable), then group level config
        const groupChangelogDefaults = [GROUP_DEFAULTS.changelog];
        if (rootChangelogConfig.projectChangelogs) {
            groupChangelogDefaults.push(rootChangelogConfig.projectChangelogs);
        }
        const projectsRelationship = releaseGroup.projectsRelationship || GROUP_DEFAULTS.projectsRelationship;
        if (releaseGroup.changelog) {
            releaseGroup.changelog = normalizeTrueToEmptyObject(releaseGroup.changelog);
        }
        const groupDefaults = {
            projectsRelationship,
            projects: matchingProjects,
            version: deepMergeDefaults(
            // First apply any group level defaults, then apply actual root level config, then group level config
            [GROUP_DEFAULTS.version, rootVersionWithoutGlobalOptions], releaseGroup.version),
            // If the user has set any changelog config at all, including at the root level, then use one set of defaults, otherwise default to false for the whole feature
            changelog: releaseGroup.changelog || rootChangelogConfig.projectChangelogs
                ? deepMergeDefaults(groupChangelogDefaults, releaseGroup.changelog || {})
                : false,
            releaseTagPattern: releaseGroup.releaseTagPattern ||
                // The appropriate group default releaseTagPattern is dependent upon the projectRelationships
                (projectsRelationship === 'independent'
                    ? defaultIndependentReleaseTagPattern
                    : userConfig.releaseTagPattern || defaultFixedReleaseTagPattern),
            versionPlans: releaseGroup.versionPlans ?? rootVersionPlansConfig,
        };
        const finalReleaseGroup = deepMergeDefaults([groupDefaults], {
            ...releaseGroup,
            // Ensure that the resolved project names take priority over the original user config (which could have contained unresolved globs etc)
            projects: matchingProjects,
        });
        // Apply conventionalCommits shorthand to the final group if explicitly configured in the original group
        if (releaseGroup.version?.conventionalCommits === true) {
            finalReleaseGroup.version.generatorOptions = {
                ...finalReleaseGroup.version.generatorOptions,
                currentVersionResolver: 'git-tag',
                specifierSource: 'conventional-commits',
            };
        }
        if (releaseGroup.version?.conventionalCommits === false &&
            releaseGroupName !== exports.IMPLICIT_DEFAULT_RELEASE_GROUP) {
            delete finalReleaseGroup.version.generatorOptions.currentVersionResolver;
            delete finalReleaseGroup.version.generatorOptions.specifierSource;
        }
        // Apply versionPlans shorthand to the final group if explicitly configured in the original group
        if (releaseGroup.versionPlans) {
            finalReleaseGroup.version = {
                ...finalReleaseGroup.version,
                generatorOptions: {
                    ...finalReleaseGroup.version?.generatorOptions,
                    specifierSource: 'version-plans',
                },
            };
        }
        if (releaseGroup.versionPlans === false &&
            releaseGroupName !== exports.IMPLICIT_DEFAULT_RELEASE_GROUP) {
            delete finalReleaseGroup.version.generatorOptions.specifierSource;
        }
        releaseGroups[releaseGroupName] = finalReleaseGroup;
    }
    ensureChangelogRenderersAreResolvable(releaseGroups, rootChangelogConfig);
    return {
        error: null,
        nxReleaseConfig: {
            projectsRelationship: WORKSPACE_DEFAULTS.projectsRelationship,
            releaseTagPattern: WORKSPACE_DEFAULTS.releaseTagPattern,
            git: rootGitConfig,
            version: rootVersionConfig,
            changelog: rootChangelogConfig,
            groups: releaseGroups,
            conventionalCommits: rootConventionalCommitsConfig,
            versionPlans: rootVersionPlansConfig,
        },
    };
}
/**
 * In some cases it is much cleaner and more intuitive for the user to be able to
 * specify `true` in their config when they want to use the default config for a
 * particular property, rather than having to specify an empty object.
 */
function normalizeTrueToEmptyObject(value) {
    return value === true ? {} : value;
}
function normalizeConventionalCommitsConfig(userConventionalCommitsConfig) {
    if (!userConventionalCommitsConfig || !userConventionalCommitsConfig.types) {
        return userConventionalCommitsConfig;
    }
    const types = {};
    for (const [t, typeConfig] of Object.entries(userConventionalCommitsConfig.types)) {
        if (typeConfig === false) {
            types[t] = {
                semverBump: 'none',
                changelog: {
                    hidden: true,
                },
            };
            continue;
        }
        if (typeConfig === true) {
            types[t] = {};
            continue;
        }
        if (typeConfig.changelog === false) {
            types[t] = {
                ...typeConfig,
                changelog: {
                    hidden: true,
                },
            };
            continue;
        }
        if (typeConfig.changelog === true) {
            types[t] = {
                ...typeConfig,
                changelog: {},
            };
            continue;
        }
        types[t] = typeConfig;
    }
    return {
        ...userConventionalCommitsConfig,
        types,
    };
}
/**
 * New, custom types specified by users will not be given the appropriate
 * defaults with `deepMergeDefaults`, so we need to fill in the gaps here.
 */
function fillUnspecifiedConventionalCommitsProperties(config) {
    if (!config || !config.types) {
        return config;
    }
    const types = {};
    for (const [t, typeConfig] of Object.entries(config.types)) {
        const defaultTypeConfig = conventional_commits_1.DEFAULT_CONVENTIONAL_COMMITS_CONFIG.types[t];
        const semverBump = typeConfig.semverBump ||
            // preserve our default semver bump if it's not 'none'
            // this prevents a 'feat' from becoming a 'patch' just
            // because they modified the changelog config for 'feat'
            (defaultTypeConfig?.semverBump !== 'none' &&
                defaultTypeConfig?.semverBump) ||
            'patch';
        // don't preserve our default behavior for hidden, ever.
        // we should assume that if users are explicitly enabling a
        // type, then they intend it to be visible in the changelog
        const hidden = typeConfig.changelog?.hidden || false;
        const title = typeConfig.changelog?.title ||
            // our default title is better than just the unmodified type name
            defaultTypeConfig?.changelog.title ||
            t;
        types[t] = {
            semverBump,
            changelog: {
                hidden,
                title,
            },
        };
    }
    return {
        ...config,
        types,
    };
}
async function handleNxReleaseConfigError(error) {
    switch (error.code) {
        case 'PROJECTS_AND_GROUPS_DEFINED':
            {
                const nxJsonMessage = await (0, resolve_nx_json_error_message_1.resolveNxJsonConfigErrorMessage)([
                    'release',
                    'projects',
                ]);
                output_1.output.error({
                    title: `"projects" is not valid when explicitly defining release groups, and everything should be expressed within "groups" in that case. If you are using "groups" then you should remove the "projects" property`,
                    bodyLines: [nxJsonMessage],
                });
            }
            break;
        case 'RELEASE_GROUP_MATCHES_NO_PROJECTS':
            {
                const nxJsonMessage = await (0, resolve_nx_json_error_message_1.resolveNxJsonConfigErrorMessage)([
                    'release',
                    'groups',
                ]);
                output_1.output.error({
                    title: `Release group "${error.data.releaseGroupName}" matches no projects. Please ensure all release groups match at least one project:`,
                    bodyLines: [nxJsonMessage],
                });
            }
            break;
        case 'PROJECT_MATCHES_MULTIPLE_GROUPS':
            {
                const nxJsonMessage = await (0, resolve_nx_json_error_message_1.resolveNxJsonConfigErrorMessage)([
                    'release',
                    'groups',
                ]);
                output_1.output.error({
                    title: `Project "${error.data.project}" matches multiple release groups. Please ensure all projects are part of only one release group:`,
                    bodyLines: [nxJsonMessage],
                });
            }
            break;
        case 'RELEASE_GROUP_RELEASE_TAG_PATTERN_VERSION_PLACEHOLDER_MISSING_OR_EXCESSIVE':
            {
                const nxJsonMessage = await (0, resolve_nx_json_error_message_1.resolveNxJsonConfigErrorMessage)([
                    'release',
                    'groups',
                    error.data.releaseGroupName,
                    'releaseTagPattern',
                ]);
                output_1.output.error({
                    title: `Release group "${error.data.releaseGroupName}" has an invalid releaseTagPattern. Please ensure the pattern contains exactly one instance of the "{version}" placeholder`,
                    bodyLines: [nxJsonMessage],
                });
            }
            break;
        case 'CONVENTIONAL_COMMITS_SHORTHAND_MIXED_WITH_OVERLAPPING_GENERATOR_OPTIONS':
            {
                const nxJsonMessage = await (0, resolve_nx_json_error_message_1.resolveNxJsonConfigErrorMessage)([
                    'release',
                ]);
                output_1.output.error({
                    title: `You have configured both the shorthand "version.conventionalCommits" and one or more of the related "version.generatorOptions" that it sets for you. Please use one or the other:`,
                    bodyLines: [nxJsonMessage],
                });
            }
            break;
        case 'GLOBAL_GIT_CONFIG_MIXED_WITH_GRANULAR_GIT_CONFIG':
            {
                const nxJsonMessage = await (0, resolve_nx_json_error_message_1.resolveNxJsonConfigErrorMessage)([
                    'release',
                    'git',
                ]);
                output_1.output.error({
                    title: `You have duplicate conflicting git configurations. If you are using the top level 'nx release' command, then remove the 'release.version.git' and 'release.changelog.git' properties in favor of 'release.git'. If you are using the subcommands or the programmatic API, then remove the 'release.git' property in favor of 'release.version.git' and 'release.changelog.git':`,
                    bodyLines: [nxJsonMessage],
                });
            }
            break;
        default:
            throw new Error(`Unhandled error code: ${error.code}`);
    }
    process.exit(1);
}
function ensureReleaseGroupReleaseTagPatternIsValid(releaseTagPattern, releaseGroupName) {
    // ensure that any provided releaseTagPattern contains exactly one instance of {version}
    return releaseTagPattern.split('{version}').length === 2
        ? null
        : {
            code: 'RELEASE_GROUP_RELEASE_TAG_PATTERN_VERSION_PLACEHOLDER_MISSING_OR_EXCESSIVE',
            data: {
                releaseGroupName,
            },
        };
}
function ensureProjectsConfigIsArray(groups) {
    const result = {};
    for (const [groupName, groupConfig] of Object.entries(groups)) {
        result[groupName] = {
            ...groupConfig,
            projects: ensureArray(groupConfig.projects),
        };
    }
    return result;
}
function ensureArray(value) {
    return Array.isArray(value) ? value : [value];
}
function isObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
}
// Helper function to merge two config objects
function mergeConfig(objA, objB) {
    const merged = { ...objA };
    for (const key in objB) {
        if (objB.hasOwnProperty(key)) {
            // If objB[key] is explicitly set to false, null or 0, respect that value
            if (objB[key] === false || objB[key] === null || objB[key] === 0) {
                merged[key] = objB[key];
            }
            // If both objA[key] and objB[key] are objects, recursively merge them
            else if (isObject(merged[key]) && isObject(objB[key])) {
                merged[key] = mergeConfig(merged[key], objB[key]);
            }
            // If objB[key] is defined, use it (this will overwrite any existing value in merged[key])
            else if (objB[key] !== undefined) {
                merged[key] = objB[key];
            }
        }
    }
    return merged;
}
/**
 * This function takes in a strictly typed collection of all possible default values in a particular section of config,
 * and an optional set of partial user config, and returns a single, deeply merged config object, where the user
 * config takes priority over the defaults in all cases (only an `undefined` value in the user config will be
 * overwritten by the defaults, all other falsey values from the user will be respected).
 */
function deepMergeDefaults(defaultConfigs, userConfig) {
    let result;
    // First merge defaultConfigs sequentially (meaning later defaults will override earlier ones)
    for (const defaultConfig of defaultConfigs) {
        if (!result) {
            result = defaultConfig;
            continue;
        }
        result = mergeConfig(result, defaultConfig);
    }
    // Finally, merge the userConfig
    if (userConfig) {
        result = mergeConfig(result, userConfig);
    }
    return result;
}
/**
 * We want to prevent users from setting both the conventionalCommits shorthand and any of the related
 * generatorOptions at the same time, since it is at best redundant, and at worst invalid.
 */
function hasInvalidConventionalCommitsConfig(userConfig) {
    // at the root
    if (userConfig.version?.conventionalCommits === true &&
        (userConfig.version?.generatorOptions?.currentVersionResolver ||
            userConfig.version?.generatorOptions?.specifierSource)) {
        return true;
    }
    // within any groups
    if (userConfig.groups) {
        for (const group of Object.values(userConfig.groups)) {
            if (group.version?.conventionalCommits === true &&
                (group.version?.generatorOptions?.currentVersionResolver ||
                    group.version?.generatorOptions?.specifierSource)) {
                return true;
            }
        }
    }
    return false;
}
/**
 * We want to prevent users from setting both the global and granular git configurations. Users should prefer the
 * global configuration if using the top level nx release command and the granular configuration if using
 * the subcommands or the programmatic API.
 */
function hasInvalidGitConfig(userConfig) {
    return (!!userConfig.git && !!(userConfig.version?.git || userConfig.changelog?.git));
}
async function getDefaultProjects(projectGraph, projectFileMap) {
    // default to all library projects in the workspace with a package.json file
    return (0, find_matching_projects_1.findMatchingProjects)(['*'], projectGraph.nodes).filter((project) => projectGraph.nodes[project].type === 'lib' &&
        // Exclude all projects with "private": true in their package.json because this is
        // a common indicator that a project is not intended for release.
        // Users can override this behavior by explicitly defining the projects they want to release.
        isProjectPublic(project, projectGraph, projectFileMap));
}
function isProjectPublic(project, projectGraph, projectFileMap) {
    const projectNode = projectGraph.nodes[project];
    const packageJsonPath = (0, node_path_1.join)(projectNode.data.root, 'package.json');
    if (!projectFileMap[project]?.find((f) => f.file === packageJsonPath)) {
        return false;
    }
    try {
        const fullPackageJsonPath = (0, node_path_1.join)(workspace_root_1.workspaceRoot, packageJsonPath);
        const packageJson = (0, fileutils_1.readJsonFile)(fullPackageJsonPath);
        return !(packageJson.private === true);
    }
    catch (e) {
        // do nothing and assume that the project is not public if there is a parsing issue
        // this will result in it being excluded from the default projects list
        return false;
    }
}
function ensureChangelogRenderersAreResolvable(releaseGroups, rootChangelogConfig) {
    /**
     * If any form of changelog config is enabled, ensure that any provided changelog renderers are resolvable
     * up front so that we do not end up erroring only after the versioning step has been completed.
     */
    const uniqueRendererPaths = new Set();
    if (rootChangelogConfig.workspaceChangelog &&
        typeof rootChangelogConfig.workspaceChangelog !== 'boolean' &&
        rootChangelogConfig.workspaceChangelog.renderer?.length) {
        uniqueRendererPaths.add(rootChangelogConfig.workspaceChangelog.renderer);
    }
    if (rootChangelogConfig.projectChangelogs &&
        typeof rootChangelogConfig.projectChangelogs !== 'boolean' &&
        rootChangelogConfig.projectChangelogs.renderer?.length) {
        uniqueRendererPaths.add(rootChangelogConfig.projectChangelogs.renderer);
    }
    for (const group of Object.values(releaseGroups)) {
        if (group.changelog &&
            typeof group.changelog !== 'boolean' &&
            group.changelog.renderer?.length) {
            uniqueRendererPaths.add(group.changelog.renderer);
        }
    }
    if (!uniqueRendererPaths.size) {
        return;
    }
    for (const rendererPath of uniqueRendererPaths) {
        try {
            (0, resolve_changelog_renderer_1.resolveChangelogRenderer)(rendererPath);
        }
        catch (e) {
            const workspaceRelativePath = (0, node_path_1.relative)(workspace_root_1.workspaceRoot, rendererPath);
            output_1.output.error({
                title: `There was an error when resolving the configured changelog renderer at path: ${workspaceRelativePath}`,
            });
            throw e;
        }
    }
}
