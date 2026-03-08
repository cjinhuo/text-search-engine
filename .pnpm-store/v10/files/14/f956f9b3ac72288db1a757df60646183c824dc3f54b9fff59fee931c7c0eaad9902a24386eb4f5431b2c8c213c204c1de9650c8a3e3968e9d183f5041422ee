"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = removeProjectNameAndRootFormat;
const json_1 = require("../../generators/utils/json");
const format_changed_files_with_prettier_if_available_1 = require("../../generators/internal-utils/format-changed-files-with-prettier-if-available");
async function removeProjectNameAndRootFormat(tree) {
    if (!tree.exists('nx.json')) {
        return;
    }
    (0, json_1.updateJson)(tree, 'nx.json', (nxJson) => {
        if (!nxJson.workspaceLayout) {
            return nxJson;
        }
        delete nxJson.workspaceLayout.projectNameAndRootFormat;
        if (Object.keys(nxJson.workspaceLayout).length === 0) {
            delete nxJson.workspaceLayout;
        }
        return nxJson;
    });
    await (0, format_changed_files_with_prettier_if_available_1.formatChangedFilesWithPrettierIfAvailable)(tree);
}
