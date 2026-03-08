import type { CloudTaskRunnerOptions } from './nx-cloud-tasks-runner-shell';
import { TasksRunner } from '../tasks-runner/tasks-runner';
export declare class NxCloudEnterpriseOutdatedError extends Error {
    constructor(url: string);
}
export declare class NxCloudClientUnavailableError extends Error {
    constructor();
}
export interface NxCloudClient {
    configureLightClientRequire: () => (paths: string[]) => void;
    commands: Record<string, () => Promise<void>>;
    nxCloudTasksRunner: TasksRunner<CloudTaskRunnerOptions>;
}
export declare function verifyOrUpdateNxCloudClient(options: CloudTaskRunnerOptions): Promise<{
    nxCloudClient: NxCloudClient;
    version: string;
} | null>;
