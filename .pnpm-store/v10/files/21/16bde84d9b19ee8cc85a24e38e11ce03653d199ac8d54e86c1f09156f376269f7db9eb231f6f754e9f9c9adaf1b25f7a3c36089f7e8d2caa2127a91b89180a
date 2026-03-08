"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNxPluginV2 = isNxPluginV2;
exports.isNxPluginV1 = isNxPluginV1;
exports.normalizeNxPlugin = normalizeNxPlugin;
exports.createNodesFromFiles = createNodesFromFiles;
const node_path_1 = require("node:path");
const to_project_name_1 = require("../../config/to-project-name");
const globs_1 = require("../../utils/globs");
const error_types_1 = require("../error-types");
function isNxPluginV2(plugin) {
    return 'createNodes' in plugin || 'createDependencies' in plugin;
}
function isNxPluginV1(plugin) {
    return 'processProjectGraph' in plugin || 'projectFilePatterns' in plugin;
}
function normalizeNxPlugin(plugin) {
    if (isNxPluginV2(plugin)) {
        return plugin;
    }
    if (isNxPluginV1(plugin) && plugin.projectFilePatterns) {
        return {
            ...plugin,
            createNodes: [
                `*/**/${(0, globs_1.combineGlobPatterns)(plugin.projectFilePatterns)}`,
                (configFilePath) => {
                    const root = (0, node_path_1.dirname)(configFilePath);
                    return {
                        projects: {
                            [root]: {
                                name: (0, to_project_name_1.toProjectName)(configFilePath),
                                targets: plugin.registerProjectTargets?.(configFilePath),
                            },
                        },
                    };
                },
            ],
        };
    }
    return plugin;
}
async function createNodesFromFiles(createNodes, configFiles, options, context) {
    const results = [];
    const errors = [];
    await Promise.all(configFiles.map(async (file) => {
        try {
            const value = await createNodes(file, options, {
                ...context,
                configFiles,
            });
            if (value) {
                results.push([file, value]);
            }
        }
        catch (e) {
            errors.push([file, e]);
        }
    }));
    if (errors.length > 0) {
        throw new error_types_1.AggregateCreateNodesError(errors, results);
    }
    return results;
}
