"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRemoteNxPlugin = loadRemoteNxPlugin;
const child_process_1 = require("child_process");
const path = require("path");
const net_1 = require("net");
// TODO (@AgentEnder): After scoped verbose logging is implemented, re-add verbose logs here.
// import { logger } from '../../utils/logger';
const internal_api_1 = require("../internal-api");
const socket_utils_1 = require("../../../daemon/socket-utils");
const consume_messages_from_socket_1 = require("../../../utils/consume-messages-from-socket");
const exit_codes_1 = require("../../../utils/exit-codes");
const messaging_1 = require("./messaging");
const cleanupFunctions = new Set();
const pluginNames = new Map();
const PLUGIN_TIMEOUT_HINT_TEXT = 'As a last resort, you can set NX_PLUGIN_NO_TIMEOUTS=true to bypass this timeout.';
const MINUTES = 10;
const MAX_MESSAGE_WAIT = process.env.NX_PLUGIN_NO_TIMEOUTS === 'true'
    ? undefined
    : 1000 * 60 * MINUTES; // 10 minutes
const nxPluginWorkerCache = (global['nxPluginWorkerCache'] ??= new Map());
async function loadRemoteNxPlugin(plugin, root) {
    const cacheKey = JSON.stringify({ plugin, root });
    if (nxPluginWorkerCache.has(cacheKey)) {
        return [nxPluginWorkerCache.get(cacheKey), () => { }];
    }
    const { worker, socket } = await startPluginWorker();
    const pendingPromises = new Map();
    const exitHandler = createWorkerExitHandler(worker, pendingPromises);
    const cleanupFunction = () => {
        worker.off('exit', exitHandler);
        socket.destroy();
        shutdownPluginWorker(worker);
        nxPluginWorkerCache.delete(cacheKey);
    };
    cleanupFunctions.add(cleanupFunction);
    const pluginPromise = new Promise((res, rej) => {
        (0, messaging_1.sendMessageOverSocket)(socket, {
            type: 'load',
            payload: { plugin, root },
        });
        // logger.verbose(`[plugin-worker] started worker: ${worker.pid}`);
        const loadTimeout = MAX_MESSAGE_WAIT
            ? setTimeout(() => {
                rej(new Error(`Loading "${plugin}" timed out after ${MINUTES} minutes. ${PLUGIN_TIMEOUT_HINT_TEXT}`));
            }, MAX_MESSAGE_WAIT)
            : undefined;
        socket.on('data', (0, consume_messages_from_socket_1.consumeMessagesFromSocket)(createWorkerHandler(worker, pendingPromises, (val) => {
            if (loadTimeout)
                clearTimeout(loadTimeout);
            res(val);
        }, rej, socket)));
        worker.on('exit', exitHandler);
    });
    nxPluginWorkerCache.set(cacheKey, pluginPromise);
    return [pluginPromise, cleanupFunction];
}
function shutdownPluginWorker(worker) {
    // Clears the plugin cache so no refs to the workers are held
    internal_api_1.nxPluginCache.clear();
    // logger.verbose(`[plugin-pool] starting worker shutdown`);
    worker.kill('SIGINT');
}
/**
 * Creates a message handler for the given worker.
 * @param worker Instance of plugin-worker
 * @param pending Set of pending promises
 * @param onload Resolver for RemotePlugin promise
 * @param onloadError Rejecter for RemotePlugin promise
 * @returns Function to handle messages from the worker
 */
function createWorkerHandler(worker, pending, onload, onloadError, socket) {
    let pluginName;
    let txId = 0;
    return function (raw) {
        const message = JSON.parse(raw);
        if (!(0, messaging_1.isPluginWorkerResult)(message)) {
            return;
        }
        return (0, messaging_1.consumeMessage)(socket, message, {
            'load-result': (result) => {
                if (result.success) {
                    const { name, createNodesPattern, include, exclude } = result;
                    pluginName = name;
                    pluginNames.set(worker, pluginName);
                    onload({
                        name,
                        include,
                        exclude,
                        createNodes: createNodesPattern
                            ? [
                                createNodesPattern,
                                (configFiles, ctx) => {
                                    const tx = pluginName + worker.pid + ':createNodes:' + txId++;
                                    return registerPendingPromise(tx, pending, () => {
                                        (0, messaging_1.sendMessageOverSocket)(socket, {
                                            type: 'createNodes',
                                            payload: { configFiles, context: ctx, tx },
                                        });
                                    }, {
                                        plugin: pluginName,
                                        operation: 'createNodes',
                                    });
                                },
                            ]
                            : undefined,
                        createDependencies: result.hasCreateDependencies
                            ? (ctx) => {
                                const tx = pluginName + worker.pid + ':createDependencies:' + txId++;
                                return registerPendingPromise(tx, pending, () => {
                                    (0, messaging_1.sendMessageOverSocket)(socket, {
                                        type: 'createDependencies',
                                        payload: { context: ctx, tx },
                                    });
                                }, {
                                    plugin: pluginName,
                                    operation: 'createDependencies',
                                });
                            }
                            : undefined,
                        processProjectGraph: result.hasProcessProjectGraph
                            ? (graph, ctx) => {
                                const tx = pluginName + worker.pid + ':processProjectGraph:' + txId++;
                                return registerPendingPromise(tx, pending, () => {
                                    (0, messaging_1.sendMessageOverSocket)(socket, {
                                        type: 'processProjectGraph',
                                        payload: { graph, ctx, tx },
                                    });
                                }, {
                                    operation: 'processProjectGraph',
                                    plugin: pluginName,
                                });
                            }
                            : undefined,
                        createMetadata: result.hasCreateMetadata
                            ? (graph, ctx) => {
                                const tx = pluginName + worker.pid + ':createMetadata:' + txId++;
                                return registerPendingPromise(tx, pending, () => {
                                    (0, messaging_1.sendMessageOverSocket)(socket, {
                                        type: 'createMetadata',
                                        payload: { graph, context: ctx, tx },
                                    });
                                }, {
                                    plugin: pluginName,
                                    operation: 'createMetadata',
                                });
                            }
                            : undefined,
                    });
                }
                else if (result.success === false) {
                    onloadError(result.error);
                }
            },
            createDependenciesResult: ({ tx, ...result }) => {
                const { resolver, rejector } = pending.get(tx);
                if (result.success) {
                    resolver(result.dependencies);
                }
                else if (result.success === false) {
                    rejector(result.error);
                }
            },
            createNodesResult: ({ tx, ...result }) => {
                const { resolver, rejector } = pending.get(tx);
                if (result.success) {
                    resolver(result.result);
                }
                else if (result.success === false) {
                    rejector(result.error);
                }
            },
            processProjectGraphResult: ({ tx, ...result }) => {
                const { resolver, rejector } = pending.get(tx);
                if (result.success) {
                    resolver(result.graph);
                }
                else if (result.success === false) {
                    rejector(result.error);
                }
            },
            createMetadataResult: ({ tx, ...result }) => {
                const { resolver, rejector } = pending.get(tx);
                if (result.success) {
                    resolver(result.metadata);
                }
                else if (result.success === false) {
                    rejector(result.error);
                }
            },
        });
    };
}
function createWorkerExitHandler(worker, pendingPromises) {
    return () => {
        for (const [_, pendingPromise] of pendingPromises) {
            pendingPromise.rejector(new Error(`Plugin worker ${pluginNames.get(worker) ?? worker.pid} exited unexpectedly with code ${worker.exitCode}`));
        }
    };
}
let cleanedUp = false;
const exitHandler = () => {
    for (const fn of cleanupFunctions) {
        fn();
    }
    cleanedUp = true;
};
process.on('exit', exitHandler);
process.on('SIGINT', () => {
    exitHandler();
    process.exit((0, exit_codes_1.signalToCode)('SIGINT'));
});
process.on('SIGTERM', exitHandler);
function registerPendingPromise(tx, pending, callback, context) {
    let resolver, rejector, timeout;
    const promise = new Promise((res, rej) => {
        rejector = rej;
        resolver = res;
        timeout = MAX_MESSAGE_WAIT
            ? setTimeout(() => {
                rej(new Error(`${context.plugin} timed out after ${MINUTES} minutes during ${context.operation}. ${PLUGIN_TIMEOUT_HINT_TEXT}`));
            }, MAX_MESSAGE_WAIT)
            : undefined;
        callback();
    }).finally(() => {
        pending.delete(tx);
        if (timeout)
            clearTimeout(timeout);
    });
    pending.set(tx, {
        promise,
        resolver,
        rejector,
    });
    return promise;
}
global.nxPluginWorkerCount ??= 0;
async function startPluginWorker() {
    // this should only really be true when running unit tests within
    // the Nx repo. We still need to start the worker in this case,
    // but its typescript.
    const isWorkerTypescript = path.extname(__filename) === '.ts';
    const workerPath = path.join(__dirname, 'plugin-worker');
    const env = {
        ...process.env,
        ...(isWorkerTypescript
            ? {
                // Ensures that the worker uses the same tsconfig as the main process
                TS_NODE_PROJECT: path.join(__dirname, '../../../../tsconfig.lib.json'),
            }
            : {}),
    };
    const ipcPath = (0, socket_utils_1.getPluginOsSocketPath)([process.pid, global.nxPluginWorkerCount++].join('-'));
    const worker = (0, child_process_1.spawn)(process.execPath, [
        ...(isWorkerTypescript ? ['--require', 'ts-node/register'] : []),
        workerPath,
        ipcPath,
    ], {
        stdio: 'inherit',
        env,
        detached: true,
        shell: false,
        windowsHide: true,
    });
    worker.unref();
    let attempts = 0;
    return new Promise((resolve, reject) => {
        const id = setInterval(async () => {
            const socket = await isServerAvailable(ipcPath);
            if (socket) {
                socket.unref();
                clearInterval(id);
                resolve({
                    worker,
                    socket,
                });
            }
            else if (attempts > 1000) {
                // daemon fails to start, the process probably exited
                // we print the logs and exit the client
                reject('Failed to start plugin worker.');
            }
            else {
                attempts++;
            }
        }, 10);
    });
}
function isServerAvailable(ipcPath) {
    return new Promise((resolve) => {
        try {
            const socket = (0, net_1.connect)(ipcPath, () => {
                resolve(socket);
            });
            socket.once('error', () => {
                resolve(false);
            });
        }
        catch (err) {
            resolve(false);
        }
    });
}
