import { DefaultTasksRunnerOptions } from './default-tasks-runner';
import { Task, TaskGraph } from '../config/task-graph';
import { ProjectGraph } from '../config/project-graph';
export interface Batch {
    executorName: string;
    taskGraph: TaskGraph;
}
export declare class TasksSchedule {
    private readonly projectGraph;
    private readonly taskGraph;
    private readonly options;
    private notScheduledTaskGraph;
    private reverseTaskDeps;
    private reverseProjectGraph;
    private scheduledBatches;
    private scheduledTasks;
    private runningTasks;
    private completedTasks;
    private scheduleRequestsExecutionChain;
    constructor(projectGraph: ProjectGraph, taskGraph: TaskGraph, options: DefaultTasksRunnerOptions);
    scheduleNextTasks(): Promise<void>;
    hasTasks(): boolean;
    complete(taskIds: string[]): void;
    getAllScheduledTasks(): {
        scheduledTasks: string[];
        scheduledBatches: Batch[];
    };
    nextTask(): Task;
    nextBatch(): Batch;
    private scheduleTasks;
    private scheduleTask;
    private scheduleBatches;
    private scheduleBatch;
    private processTaskForBatches;
    private canBatchTaskBeScheduled;
    private canBeScheduled;
}
