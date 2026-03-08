export interface DaemonProcessJson {
    processId: number;
}
export declare const serverProcessJsonPath: string;
export declare function readDaemonProcessJsonCache(): Promise<DaemonProcessJson | null>;
export declare function deleteDaemonJsonProcessCache(): void;
export declare function writeDaemonJsonProcessCache(daemonJson: DaemonProcessJson): Promise<void>;
export declare function safelyCleanUpExistingProcess(): Promise<void>;
export declare function getDaemonProcessIdSync(): number | null;
