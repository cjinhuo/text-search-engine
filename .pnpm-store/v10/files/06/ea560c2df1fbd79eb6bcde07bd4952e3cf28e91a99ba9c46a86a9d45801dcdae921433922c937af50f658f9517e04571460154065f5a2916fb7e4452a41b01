import { NxJsonConfiguration } from '../config/nx-json';
import { FileData, ProjectFileMap, ProjectGraph } from '../config/project-graph';
import { Task, TaskGraph } from '../config/task-graph';
import { PartialHash, TaskHasherImpl } from './task-hasher';
export declare class NodeTaskHasherImpl implements TaskHasherImpl {
    private readonly nxJson;
    private readonly legacyRuntimeInputs;
    private readonly legacyFilesetInputs;
    private readonly projectFileMap;
    private readonly allWorkspaceFiles;
    private readonly projectGraph;
    private readonly options;
    private filesetHashes;
    private runtimeHashes;
    private externalDependencyHashes;
    private allExternalDependenciesHash;
    private projectRootMappings;
    constructor(nxJson: NxJsonConfiguration, legacyRuntimeInputs: {
        runtime: string;
    }[], legacyFilesetInputs: {
        fileset: string;
    }[], projectFileMap: ProjectFileMap, allWorkspaceFiles: FileData[], projectGraph: ProjectGraph, options: {
        selectivelyHashTsConfig: boolean;
    });
    hashTasks(tasks: Task[], taskGraph: TaskGraph, env: NodeJS.ProcessEnv): Promise<PartialHash[]>;
    hashTask(task: Task, taskGraph: TaskGraph, env: NodeJS.ProcessEnv, visited?: string[]): Promise<PartialHash>;
    private hashNamedInputForDependencies;
    private hashSelfAndDepsInputs;
    private combinePartialHashes;
    private hashDepsInputs;
    private hashDepsOutputs;
    private hashDepOuputs;
    private hashFiles;
    private getExternalDependencyHash;
    private hashSingleExternalDependency;
    private hashExternalDependency;
    private hashTarget;
    private findExternalDependencyNodeName;
    private hashSingleProjectInputs;
    private hashProjectInputs;
    private hashRootFileset;
    private hashProjectConfig;
    private hashTsConfig;
    private hashProjectFileset;
    private hashRuntime;
    private hashEnv;
    private calculateExternalDependencyHashes;
}
