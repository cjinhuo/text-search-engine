import { ProjectGraph, ProjectGraphProjectNode } from '../config/project-graph';
import { Task, TaskGraph } from '../config/task-graph';
import { TargetDefaults, TargetDependencies } from '../config/nx-json';
export declare class ProcessTasks {
    private readonly extraTargetDependencies;
    private readonly projectGraph;
    private readonly seen;
    readonly tasks: {
        [id: string]: Task;
    };
    readonly dependencies: {
        [k: string]: string[];
    };
    private readonly allTargetNames;
    constructor(extraTargetDependencies: TargetDependencies, projectGraph: ProjectGraph);
    processTasks(projectNames: string[], targets: string[], configuration: string, overrides: Object, excludeTaskDependencies: boolean): string[];
    processTask(task: Task, projectUsedToDeriveDependencies: string, configuration: string, overrides: Object): void;
    private processTasksForMultipleProjects;
    private processTasksForSingleProject;
    private processTasksForDependencies;
    createTask(id: string, project: ProjectGraphProjectNode, target: string, resolvedConfiguration: string | undefined, overrides: Object): Task;
    resolveConfiguration(project: ProjectGraphProjectNode, target: string, configuration: string | undefined): string;
    getId(project: string, target: string, configuration: string | undefined): string;
}
export declare function createTaskGraph(projectGraph: ProjectGraph, extraTargetDependencies: TargetDependencies, projectNames: string[], targets: string[], configuration: string | undefined, overrides: Object, excludeTaskDependencies?: boolean): TaskGraph;
export declare function mapTargetDefaultsToDependencies(defaults: TargetDefaults | undefined): TargetDependencies;
