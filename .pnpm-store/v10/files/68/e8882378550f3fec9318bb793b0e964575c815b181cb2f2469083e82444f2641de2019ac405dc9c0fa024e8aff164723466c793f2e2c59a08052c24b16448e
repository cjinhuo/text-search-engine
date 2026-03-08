"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messaging_1 = require("./messaging");
const loader_1 = require("../loader");
const serializable_error_1 = require("../../../utils/serializable-error");
const consume_messages_from_socket_1 = require("../../../utils/consume-messages-from-socket");
const net_1 = require("net");
const fs_1 = require("fs");
if (process.env.NX_PERF_LOGGING === 'true') {
    require('../../../utils/perf-logging');
}
global.NX_GRAPH_CREATION = true;
let plugin;
const socketPath = process.argv[2];
const server = (0, net_1.createServer)((socket) => {
    socket.on('data', (0, consume_messages_from_socket_1.consumeMessagesFromSocket)((raw) => {
        const message = JSON.parse(raw.toString());
        if (!(0, messaging_1.isPluginWorkerMessage)(message)) {
            return;
        }
        return (0, messaging_1.consumeMessage)(socket, message, {
            load: async ({ plugin: pluginConfiguration, root }) => {
                process.chdir(root);
                try {
                    const [promise] = (0, loader_1.loadNxPlugin)(pluginConfiguration, root);
                    plugin = await promise;
                    return {
                        type: 'load-result',
                        payload: {
                            name: plugin.name,
                            include: plugin.include,
                            exclude: plugin.exclude,
                            createNodesPattern: plugin.createNodes?.[0],
                            hasCreateDependencies: 'createDependencies' in plugin && !!plugin.createDependencies,
                            hasProcessProjectGraph: 'processProjectGraph' in plugin &&
                                !!plugin.processProjectGraph,
                            hasCreateMetadata: 'createMetadata' in plugin && !!plugin.createMetadata,
                            success: true,
                        },
                    };
                }
                catch (e) {
                    return {
                        type: 'load-result',
                        payload: {
                            success: false,
                            error: (0, serializable_error_1.createSerializableError)(e),
                        },
                    };
                }
            },
            createNodes: async ({ configFiles, context, tx }) => {
                try {
                    const result = await plugin.createNodes[1](configFiles, context);
                    return {
                        type: 'createNodesResult',
                        payload: { result, success: true, tx },
                    };
                }
                catch (e) {
                    return {
                        type: 'createNodesResult',
                        payload: {
                            success: false,
                            error: (0, serializable_error_1.createSerializableError)(e),
                            tx,
                        },
                    };
                }
            },
            createDependencies: async ({ context, tx }) => {
                try {
                    const result = await plugin.createDependencies(context);
                    return {
                        type: 'createDependenciesResult',
                        payload: { dependencies: result, success: true, tx },
                    };
                }
                catch (e) {
                    return {
                        type: 'createDependenciesResult',
                        payload: {
                            success: false,
                            error: (0, serializable_error_1.createSerializableError)(e),
                            tx,
                        },
                    };
                }
            },
            processProjectGraph: async ({ graph, ctx, tx }) => {
                try {
                    const result = await plugin.processProjectGraph(graph, ctx);
                    return {
                        type: 'processProjectGraphResult',
                        payload: { graph: result, success: true, tx },
                    };
                }
                catch (e) {
                    return {
                        type: 'processProjectGraphResult',
                        payload: {
                            success: false,
                            error: (0, serializable_error_1.createSerializableError)(e),
                            tx,
                        },
                    };
                }
            },
            createMetadata: async ({ graph, context, tx }) => {
                try {
                    const result = await plugin.createMetadata(graph, context);
                    return {
                        type: 'createMetadataResult',
                        payload: { metadata: result, success: true, tx },
                    };
                }
                catch (e) {
                    return {
                        type: 'createMetadataResult',
                        payload: {
                            success: false,
                            error: (0, serializable_error_1.createSerializableError)(e),
                            tx,
                        },
                    };
                }
            },
        });
    }));
});
server.listen(socketPath);
const exitHandler = (exitCode) => () => {
    server.close();
    try {
        (0, fs_1.unlinkSync)(socketPath);
    }
    catch (e) { }
    process.exit(exitCode);
};
const events = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'exit'];
events.forEach((event) => process.once(event, exitHandler(0)));
process.once('uncaughtException', exitHandler(1));
process.once('unhandledRejection', exitHandler(1));
