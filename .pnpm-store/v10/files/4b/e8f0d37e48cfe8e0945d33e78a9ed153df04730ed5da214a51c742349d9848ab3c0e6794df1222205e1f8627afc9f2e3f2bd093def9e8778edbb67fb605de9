"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTouchedProjectsFromProjectGlobChanges = void 0;
const minimatch_1 = require("minimatch");
const workspace_root_1 = require("../../../utils/workspace-root");
const path_1 = require("path");
const fs_1 = require("fs");
const retrieve_workspace_files_1 = require("../../utils/retrieve-workspace-files");
const internal_api_1 = require("../../plugins/internal-api");
const globs_1 = require("../../../utils/globs");
const getTouchedProjectsFromProjectGlobChanges = async (touchedFiles, projectGraphNodes, nxJson) => {
    const [plugins] = await (0, internal_api_1.loadNxPlugins)(nxJson?.plugins ?? [], workspace_root_1.workspaceRoot);
    const globPattern = (0, globs_1.combineGlobPatterns)((0, retrieve_workspace_files_1.configurationGlobs)(plugins));
    const touchedProjects = new Set();
    for (const touchedFile of touchedFiles) {
        const isProjectFile = (0, minimatch_1.minimatch)(touchedFile.file, globPattern, {
            dot: true,
        });
        if (isProjectFile) {
            // If the file no longer exists on disk, then it was deleted
            if (!(0, fs_1.existsSync)((0, path_1.join)(workspace_root_1.workspaceRoot, touchedFile.file))) {
                // If any project has been deleted, we must assume all projects were affected
                return Object.keys(projectGraphNodes);
            }
            // Modified project config files are under a project's root, and implicitly
            // mark it as affected. Thus, we don't need to handle it here.
        }
    }
    return Array.from(touchedProjects);
};
exports.getTouchedProjectsFromProjectGlobChanges = getTouchedProjectsFromProjectGlobChanges;
