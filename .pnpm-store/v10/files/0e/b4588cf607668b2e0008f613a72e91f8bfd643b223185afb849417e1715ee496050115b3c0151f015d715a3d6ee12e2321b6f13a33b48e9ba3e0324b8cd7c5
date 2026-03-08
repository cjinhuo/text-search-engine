"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadNxPluginInIsolation = loadNxPluginInIsolation;
const workspace_root_1 = require("../../../utils/workspace-root");
const plugin_pool_1 = require("./plugin-pool");
async function loadNxPluginInIsolation(plugin, root = workspace_root_1.workspaceRoot) {
    const [loadingPlugin, cleanup] = await (0, plugin_pool_1.loadRemoteNxPlugin)(plugin, root);
    return [
        loadingPlugin,
        () => {
            cleanup();
        },
    ];
}
