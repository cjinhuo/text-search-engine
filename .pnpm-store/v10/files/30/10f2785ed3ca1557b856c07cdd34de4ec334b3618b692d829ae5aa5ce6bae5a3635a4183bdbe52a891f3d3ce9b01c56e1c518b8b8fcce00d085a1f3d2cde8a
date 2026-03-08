"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWriteTaskRunsToHistory = handleWriteTaskRunsToHistory;
const task_history_1 = require("../../utils/task-history");
async function handleWriteTaskRunsToHistory(taskRuns) {
    await (0, task_history_1.writeTaskRunsToHistory)(taskRuns);
    return {
        response: 'true',
        description: 'handleWriteTaskRunsToHistory',
    };
}
