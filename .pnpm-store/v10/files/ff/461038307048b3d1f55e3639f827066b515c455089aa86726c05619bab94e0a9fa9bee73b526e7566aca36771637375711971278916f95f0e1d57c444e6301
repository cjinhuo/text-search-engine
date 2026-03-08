"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workspace_root_1 = require("../src/utils/workspace-root");
const package_json_1 = require("../src/plugins/package-json");
const plugin = {
    name: 'nx-all-package-jsons-plugin',
    createNodes: [
        '*/**/package.json',
        (f) => (0, package_json_1.createNodeFromPackageJson)(f, workspace_root_1.workspaceRoot),
    ],
};
module.exports = plugin;
