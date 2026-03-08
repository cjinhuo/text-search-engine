import type { NxPluginV1 } from '../../utils/nx-plugin.deprecated';
import type { LoadedNxPlugin, NormalizedPlugin } from './internal-api';
import { CreateNodesContextV2, CreateNodesFunction, CreateNodesResult, type NxPlugin, type NxPluginV2 } from './public-api';
export declare function isNxPluginV2(plugin: NxPlugin): plugin is NxPluginV2;
export declare function isNxPluginV1(plugin: NxPlugin | LoadedNxPlugin): plugin is NxPluginV1;
export declare function normalizeNxPlugin(plugin: NxPlugin): NormalizedPlugin;
export type AsyncFn<T extends Function> = T extends (...args: infer A) => infer R ? (...args: A) => Promise<Awaited<R>> : never;
export declare function createNodesFromFiles<T = unknown>(createNodes: CreateNodesFunction<T>, configFiles: readonly string[], options: T, context: CreateNodesContextV2): Promise<[file: string, value: CreateNodesResult][]>;
