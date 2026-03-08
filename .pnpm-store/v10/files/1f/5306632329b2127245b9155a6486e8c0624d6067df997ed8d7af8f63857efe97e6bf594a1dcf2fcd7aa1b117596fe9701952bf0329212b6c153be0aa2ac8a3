"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceConfigurationCheck = workspaceConfigurationCheck;
const workspace_root_1 = require("./workspace-root");
const fs_1 = require("fs");
const path_1 = require("path");
const output_1 = require("./output");
const fileutils_1 = require("../utils/fileutils");
//TODO: vsavkin remove after Nx 19
function workspaceConfigurationCheck() {
    if ((0, fs_1.existsSync)((0, path_1.join)(workspace_root_1.workspaceRoot, 'workspace.json'))) {
        output_1.output.warn({
            title: 'workspace.json is ignored',
            bodyLines: [
                'Nx no longer reads configuration from workspace.json.',
                'Run "nx g @nx/workspace:fix-configuration" to split workspace.json into individual project.json files.',
            ],
        });
        return;
    }
    if ((0, fs_1.existsSync)((0, path_1.join)(workspace_root_1.workspaceRoot, 'angular.json'))) {
        const angularJson = (0, fileutils_1.readJsonFile)((0, path_1.join)(workspace_root_1.workspaceRoot, 'angular.json'));
        const v2Props = Object.values(angularJson.projects).find((p) => !!p.targets);
        if (angularJson.version === 2 || v2Props) {
            output_1.output.error({
                title: 'angular.json format is incorrect',
                bodyLines: [
                    'Nx no longer supports the v2 format of angular.json.',
                    'Run "nx g @nx/workspace:fix-configuration" to split angular.json into individual project.json files. (Recommended)',
                    'If you want to preserve angular.json, run "nx g @nx/workspace:fix-configuration --reformat"',
                ],
            });
            process.exit(1);
        }
    }
}
