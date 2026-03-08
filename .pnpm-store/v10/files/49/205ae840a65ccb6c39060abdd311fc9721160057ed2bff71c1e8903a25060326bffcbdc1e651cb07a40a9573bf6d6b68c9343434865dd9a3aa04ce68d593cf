"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlugins = getPlugins;
exports.cleanupPlugins = cleanupPlugins;
const file_hasher_1 = require("../../hasher/file-hasher");
const nx_json_1 = require("../../config/nx-json");
const internal_api_1 = require("../../project-graph/plugins/internal-api");
const workspace_root_1 = require("../../utils/workspace-root");
let currentPluginsConfigurationHash;
let loadedPlugins;
let cleanup;
async function getPlugins() {
    const pluginsConfiguration = (0, nx_json_1.readNxJson)().plugins ?? [];
    const pluginsConfigurationHash = (0, file_hasher_1.hashObject)(pluginsConfiguration);
    // If the plugins configuration has not changed, reuse the current plugins
    if (loadedPlugins &&
        pluginsConfigurationHash === currentPluginsConfigurationHash) {
        return loadedPlugins;
    }
    // Cleanup current plugins before loading new ones
    if (cleanup) {
        cleanup();
    }
    currentPluginsConfigurationHash = pluginsConfigurationHash;
    const [result, cleanupFn] = await (0, internal_api_1.loadNxPlugins)(pluginsConfiguration, workspace_root_1.workspaceRoot);
    cleanup = cleanupFn;
    loadedPlugins = result;
    return result;
}
function cleanupPlugins() {
    cleanup();
}
