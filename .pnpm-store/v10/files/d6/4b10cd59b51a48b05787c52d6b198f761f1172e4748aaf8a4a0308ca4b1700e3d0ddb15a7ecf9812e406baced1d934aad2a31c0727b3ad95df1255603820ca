import { ProjectFileMap, ProjectGraphDependency, ProjectGraphProjectNode } from '../../config/project-graph';
import { TaskGraph } from '../../config/task-graph';
export interface GraphError {
    message: string;
    stack: string;
    cause: unknown;
    name: string;
    pluginName: string;
    fileName?: string;
}
export interface ProjectGraphClientResponse {
    hash: string;
    projects: ProjectGraphProjectNode[];
    dependencies: Record<string, ProjectGraphDependency[]>;
    fileMap?: ProjectFileMap;
    layout: {
        appsDir: string;
        libsDir: string;
    };
    affected: string[];
    focus: string;
    groupByFolder: boolean;
    exclude: string[];
    isPartial: boolean;
    errors?: GraphError[];
    connectedToCloud?: boolean;
}
export interface TaskGraphClientResponse {
    taskGraphs: Record<string, TaskGraph>;
    plans?: Record<string, string[]>;
    errors: Record<string, string>;
}
export interface ExpandedTaskInputsReponse {
    [taskId: string]: Record<string, string[]>;
}
export declare function generateGraph(args: {
    file?: string;
    host?: string;
    port?: number;
    groupByFolder?: boolean;
    watch?: boolean;
    open?: boolean;
    view: 'projects' | 'tasks' | 'project-details';
    projects?: string[];
    all?: boolean;
    targets?: string[];
    focus?: string;
    exclude?: string[];
    affected?: boolean;
}, affectedProjects: string[]): Promise<void>;
