"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WRITE_TASK_RUNS_TO_HISTORY = exports.GET_TASK_HISTORY_FOR_HASHES = void 0;
exports.isHandleGetTaskHistoryForHashesMessage = isHandleGetTaskHistoryForHashesMessage;
exports.isHandleWriteTaskRunsToHistoryMessage = isHandleWriteTaskRunsToHistoryMessage;
exports.GET_TASK_HISTORY_FOR_HASHES = 'GET_TASK_HISTORY_FOR_HASHES';
function isHandleGetTaskHistoryForHashesMessage(message) {
    return (typeof message === 'object' &&
        message !== null &&
        'type' in message &&
        message['type'] === exports.GET_TASK_HISTORY_FOR_HASHES);
}
exports.WRITE_TASK_RUNS_TO_HISTORY = 'WRITE_TASK_RUNS_TO_HISTORY';
function isHandleWriteTaskRunsToHistoryMessage(message) {
    return (typeof message === 'object' &&
        message !== null &&
        'type' in message &&
        message['type'] === exports.WRITE_TASK_RUNS_TO_HISTORY);
}
