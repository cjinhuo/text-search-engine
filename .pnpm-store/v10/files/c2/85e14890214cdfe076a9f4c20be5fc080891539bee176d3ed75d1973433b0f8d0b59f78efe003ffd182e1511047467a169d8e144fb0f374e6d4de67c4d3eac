import { PluginConfiguration } from '../../config/nx-json';
import { NxPluginV1 } from '../../utils/nx-plugin.deprecated';
import { CreateDependencies, CreateDependenciesContext, CreateMetadata, CreateMetadataContext, CreateNodesContextV2, CreateNodesResult, NxPluginV2 } from './public-api';
import { ProjectGraph, ProjectGraphProcessor } from '../../config/project-graph';
export declare class LoadedNxPlugin {
    readonly name: string;
    readonly createNodes?: [
        filePattern: string,
        fn: (matchedFiles: string[], context: CreateNodesContextV2) => Promise<Array<readonly [plugin: string, file: string, result: CreateNodesResult]>>
    ];
    readonly createDependencies?: (context: CreateDependenciesContext) => ReturnType<CreateDependencies>;
    readonly createMetadata?: (graph: ProjectGraph, context: CreateMetadataContext) => ReturnType<CreateMetadata>;
    readonly processProjectGraph?: ProjectGraphProcessor;
    readonly options?: unknown;
    readonly include?: string[];
    readonly exclude?: string[];
    constructor(plugin: NormalizedPlugin, pluginDefinition: PluginConfiguration);
}
export type CreateNodesResultWithContext = CreateNodesResult & {
    file: string;
    pluginName: string;
};
export type NormalizedPlugin = NxPluginV2 & Pick<NxPluginV1, 'processProjectGraph'>;
export declare const nxPluginCache: Map<unknown, [
    Promise<LoadedNxPlugin>,
    () => void
]>;
export declare function loadNxPlugins(plugins: PluginConfiguration[], root?: string): Promise<readonly [LoadedNxPlugin[], () => void]>;
export declare function getDefaultPlugins(root: string): Promise<string[]>;
