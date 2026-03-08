import { ProjectGraph } from '../config/project-graph';
import { TaskGraph } from '../config/task-graph';
export declare function findCycle(graph: {
    dependencies: Record<string, string[]>;
}): string[] | null;
export declare function makeAcyclic(graph: {
    roots: string[];
    dependencies: Record<string, string[]>;
}): void;
export declare function validateNoAtomizedTasks(taskGraph: TaskGraph, projectGraph: ProjectGraph): void;
