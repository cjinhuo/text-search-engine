import { TaskStatus } from '../tasks-runner';
import type { LifeCycle } from '../life-cycle';
import { Task } from '../../config/task-graph';
export declare class InvokeRunnerTerminalOutputLifeCycle implements LifeCycle {
    private readonly tasks;
    failedTasks: Task[];
    cachedTasks: Task[];
    constructor(tasks: Task[]);
    startCommand(): void;
    endCommand(): void;
    endTasks(taskResults: {
        task: Task;
        status: TaskStatus;
        code: number;
    }[]): void;
    printTaskTerminalOutput(task: Task, cacheStatus: TaskStatus, terminalOutput: string): void;
}
