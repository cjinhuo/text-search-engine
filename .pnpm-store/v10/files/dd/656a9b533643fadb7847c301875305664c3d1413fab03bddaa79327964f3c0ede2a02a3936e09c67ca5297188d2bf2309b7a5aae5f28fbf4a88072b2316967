import { Task, TaskGraph } from '../config/task-graph';
import { TaskHasher } from './task-hasher';
import { ProjectGraph } from '../config/project-graph';
import { NxJsonConfiguration } from '../config/nx-json';
export declare function hashTasksThatDoNotDependOnOutputsOfOtherTasks(hasher: TaskHasher, projectGraph: ProjectGraph, taskGraph: TaskGraph, nxJson: NxJsonConfiguration): Promise<void>;
export declare function hashTask(hasher: TaskHasher, projectGraph: ProjectGraph, taskGraph: TaskGraph, task: Task, env: NodeJS.ProcessEnv): Promise<void>;
