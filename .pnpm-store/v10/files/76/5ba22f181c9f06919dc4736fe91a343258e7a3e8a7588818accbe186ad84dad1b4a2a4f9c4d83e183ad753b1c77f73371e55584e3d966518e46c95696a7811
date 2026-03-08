import { NxArgs } from '../utils/command-line-utils';
import { Task, TaskGraph } from '../config/task-graph';
export declare function initTasksRunner(nxArgs: NxArgs): Promise<{
    invoke: (opts: {
        tasks: Task[];
        parallel: number;
    }) => Promise<{
        status: number;
        taskGraph: TaskGraph;
    }>;
}>;
