"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetTaskHistoryForHashes = handleGetTaskHistoryForHashes;
const task_history_1 = require("../../utils/task-history");
async function handleGetTaskHistoryForHashes(hashes) {
    const history = await (0, task_history_1.getHistoryForHashes)(hashes);
    return {
        response: JSON.stringify(history),
        description: 'handleGetTaskHistoryForHashes',
    };
}
