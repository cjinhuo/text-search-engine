"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultTasksRunner = void 0;
const task_orchestrator_1 = require("./task-orchestrator");
const defaultTasksRunner = async (tasks, options, context) => {
    if (options['parallel'] === 'false' ||
        options['parallel'] === false) {
        options['parallel'] = 1;
    }
    else if (options['parallel'] === 'true' ||
        options['parallel'] === true ||
        options['parallel'] === undefined ||
        options['parallel'] === '') {
        options['parallel'] = Number(options['maxParallel'] || 3);
    }
    await options.lifeCycle.startCommand();
    try {
        return await runAllTasks(tasks, options, context);
    }
    finally {
        await options.lifeCycle.endCommand();
    }
};
exports.defaultTasksRunner = defaultTasksRunner;
async function runAllTasks(tasks, options, context) {
    const orchestrator = new task_orchestrator_1.TaskOrchestrator(context.hasher, context.initiatingProject, context.projectGraph, context.taskGraph, options, context.nxArgs?.nxBail, context.daemon);
    return orchestrator.run();
}
exports.default = exports.defaultTasksRunner;
