import { Argv } from 'yargs';
interface ExcludeOptions {
    exclude: string[];
}
export declare function withExcludeOption(yargs: Argv): Argv<ExcludeOptions>;
export interface RunOptions {
    exclude: string;
    parallel: string;
    maxParallel: number;
    runner: string;
    prod: boolean;
    graph: string;
    verbose: boolean;
    nxBail: boolean;
    nxIgnoreCycles: boolean;
    skipNxCache: boolean;
    cloud: boolean;
    dte: boolean;
    batch: boolean;
    useAgents: boolean;
}
export declare function withRunOptions<T>(yargs: Argv<T>): Argv<T & RunOptions>;
export declare function withTargetAndConfigurationOption(yargs: Argv, demandOption?: boolean): Argv<{
    configuration: string;
} & {
    targets: string;
}>;
export declare function withConfiguration(yargs: Argv): Argv<{
    configuration: string;
}>;
export declare function withVerbose(yargs: Argv): Argv<{
    verbose: boolean;
}>;
export declare function withBatch(yargs: Argv): any;
export declare function withAffectedOptions(yargs: Argv): Argv<ExcludeOptions & {
    files: string;
} & {
    uncommitted: boolean;
} & {
    untracked: boolean;
} & {
    base: string;
} & {
    head: string;
}>;
export interface RunManyOptions extends RunOptions {
    projects: string[];
    /**
     * @deprecated This is deprecated
     */
    all: boolean;
}
export declare function withRunManyOptions<T>(yargs: Argv<T>): Argv<T & RunManyOptions>;
export declare function withOverrides<T extends {
    _: Array<string | number>;
}>(args: T, commandLevel?: number): T & {
    __overrides_unparsed__: string[];
};
declare const allOutputStyles: readonly ["dynamic", "static", "stream", "stream-without-prefixes", "compact"];
export type OutputStyle = (typeof allOutputStyles)[number];
export declare function withOutputStyleOption(yargs: Argv, choices?: ReadonlyArray<OutputStyle>): Argv<{
    "output-style": string;
}>;
export declare function withRunOneOptions(yargs: Argv): Argv<{
    "output-style": string;
} & RunOptions & {
    project: string;
} & {
    help: boolean;
}>;
export declare function parseCSV(args: string[] | string): string[];
export {};
