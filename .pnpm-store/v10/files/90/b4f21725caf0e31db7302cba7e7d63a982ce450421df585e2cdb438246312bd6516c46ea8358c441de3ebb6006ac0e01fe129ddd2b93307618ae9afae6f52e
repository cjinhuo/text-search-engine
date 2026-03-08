"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const format_changed_files_with_prettier_if_available_1 = require("../../generators/internal-utils/format-changed-files-with-prettier-if-available");
const project_configuration_1 = require("../../generators/utils/project-configuration");
const nx_json_1 = require("../../generators/utils/nx-json");
const path_1 = require("../../utils/path");
const path_2 = require("path");
const json_1 = require("../../generators/utils/json");
const skippedFiles = [
    'package.json', // Not to be added to filesets
    'babel.config.json', // Will be handled by various plugins
    'karma.conf.js', // Will be handled by @nx/angular
    'jest.preset.js', // Will be handled by @nx/jest
    '.storybook', // Will be handled by @nx/storybook
    // Will be handled by @nx/eslint
    '.eslintrc.json',
    '.eslintrc.js',
];
async function default_1(tree) {
    // If the workspace doesn't have a nx.json, don't make any changes
    if (!tree.exists('nx.json')) {
        return;
    }
    const nxJson = (0, nx_json_1.readNxJson)(tree);
    // If this is a npm workspace, don't make any changes
    if (nxJson.extends === 'nx/presets/npm.json') {
        return;
    }
    nxJson.namedInputs ??= {
        default: ['{projectRoot}/**/*', 'sharedGlobals'],
        sharedGlobals: [],
        production: ['default'],
    };
    if (nxJson.namedInputs.default) {
        if (!nxJson.namedInputs.production) {
            nxJson.namedInputs.production = ['default'];
        }
        else if (!nxJson.namedInputs.production.includes('default')) {
            nxJson.namedInputs.production = [
                'default',
                ...nxJson.namedInputs.production,
            ];
        }
    }
    if (isBuildATarget(tree)) {
        nxJson.targetDefaults ??= {};
        nxJson.targetDefaults.build ??= {};
        nxJson.targetDefaults.build.inputs ??= ['production', '^production'];
    }
    if (nxJson.implicitDependencies) {
        const projects = (0, project_configuration_1.getProjects)(tree);
        for (const [files, dependents] of Object.entries(nxJson.implicitDependencies)) {
            // Skip these because other plugins take care of them
            if (skippedFiles.includes(files)) {
                continue;
            }
            else if (Array.isArray(dependents)) {
                nxJson.namedInputs.projectSpecificFiles = [];
                const defaultFileset = new Set(nxJson.namedInputs.default ?? ['{projectRoot}/**/*', 'sharedGlobals']);
                defaultFileset.add('projectSpecificFiles');
                nxJson.namedInputs.default = Array.from(defaultFileset);
                for (const dependent of dependents) {
                    const project = projects.get(dependent);
                    project.namedInputs ??= {};
                    const projectSpecificFileset = new Set(project.namedInputs.projectSpecificFiles ?? []);
                    projectSpecificFileset.add((0, path_1.joinPathFragments)('{workspaceRoot}', files));
                    project.namedInputs.projectSpecificFiles = Array.from(projectSpecificFileset);
                    try {
                        (0, project_configuration_1.updateProjectConfiguration)(tree, dependent, project);
                    }
                    catch {
                        if (tree.exists((0, path_2.join)(project.root, 'package.json'))) {
                            (0, json_1.updateJson)(tree, (0, path_2.join)(project.root, 'package.json'), (json) => {
                                json.nx ??= {};
                                json.nx.namedInputs ??= {};
                                json.nx.namedInputs.projectSpecificFiles ??=
                                    project.namedInputs.projectSpecificFiles;
                                return json;
                            });
                        }
                    }
                }
            }
            else {
                nxJson.namedInputs.sharedGlobals.push((0, path_1.joinPathFragments)('{workspaceRoot}', files));
            }
        }
        delete nxJson.implicitDependencies;
    }
    (0, nx_json_1.updateNxJson)(tree, nxJson);
    await (0, format_changed_files_with_prettier_if_available_1.formatChangedFilesWithPrettierIfAvailable)(tree);
}
function isBuildATarget(tree) {
    const projects = (0, project_configuration_1.getProjects)(tree);
    for (const [_, project] of projects) {
        if (project.targets?.build) {
            return true;
        }
    }
    return false;
}
