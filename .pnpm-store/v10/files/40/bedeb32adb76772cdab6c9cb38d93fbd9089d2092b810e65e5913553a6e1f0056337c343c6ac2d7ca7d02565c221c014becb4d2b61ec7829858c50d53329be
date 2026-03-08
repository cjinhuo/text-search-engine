"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUpFiles = cleanUpFiles;
const fs_extra_1 = require("fs-extra");
const fileutils_1 = require("../../../../utils/fileutils");
function cleanUpFiles(appName, isStandalone) {
    // Delete targets from project since we delegate to npm scripts.
    const projectJsonPath = isStandalone
        ? 'project.json'
        : `apps/${appName}/project.json`;
    const json = (0, fileutils_1.readJsonFile)(projectJsonPath);
    delete json.targets;
    if (isStandalone) {
        if (json.sourceRoot) {
            json.sourceRoot = json.sourceRoot.replace(`apps/${appName}/`, '');
        }
        if (json['$schema']) {
            json['$schema'] = json['$schema'].replace('../../node_modules', 'node_modules');
        }
    }
    (0, fileutils_1.writeJsonFile)(projectJsonPath, json);
    (0, fs_extra_1.removeSync)('temp-workspace');
    if (isStandalone) {
        (0, fs_extra_1.removeSync)('babel.config.json');
        (0, fs_extra_1.removeSync)('jest.preset.js');
        (0, fs_extra_1.removeSync)('jest.config.ts');
        (0, fs_extra_1.removeSync)('libs');
        (0, fs_extra_1.removeSync)('tools');
    }
}
