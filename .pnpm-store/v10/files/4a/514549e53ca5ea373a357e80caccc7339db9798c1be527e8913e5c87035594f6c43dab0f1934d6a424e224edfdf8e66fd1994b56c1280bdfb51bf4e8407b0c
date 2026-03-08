"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const workspace_root_1 = require("../utils/workspace-root");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const perf_hooks_1 = require("perf_hooks");
const child_process_1 = require("child_process");
const cache_directory_1 = require("../utils/cache-directory");
const node_machine_id_1 = require("node-machine-id");
class Cache {
    constructor(options) {
        this.options = options;
        this.root = workspace_root_1.workspaceRoot;
        this.cachePath = this.createCacheDir();
        this.terminalOutputsDir = this.createTerminalOutputsDir();
        this._currentMachineId = null;
    }
    removeOldCacheRecords() {
        /**
         * Even though spawning a process is fast, we don't want to do it every time
         * the user runs a command. Instead, we want to do it once in a while.
         */
        const shouldSpawnProcess = Math.floor(Math.random() * 50) === 1;
        if (shouldSpawnProcess) {
            const scriptPath = require.resolve('./remove-old-cache-records.js');
            try {
                const p = (0, child_process_1.spawn)('node', [scriptPath, `${this.cachePath}`], {
                    stdio: 'ignore',
                    detached: true,
                    shell: false,
                });
                p.unref();
            }
            catch (e) {
                console.log(`Unable to start remove-old-cache-records script:`);
                console.log(e.message);
            }
        }
    }
    async currentMachineId() {
        if (!this._currentMachineId) {
            try {
                this._currentMachineId = await (0, node_machine_id_1.machineId)();
            }
            catch (e) {
                if (process.env.NX_VERBOSE_LOGGING == 'true') {
                    console.log(`Unable to get machineId. Error: ${e.message}`);
                }
                this._currentMachineId = '';
            }
        }
        return this._currentMachineId;
    }
    async get(task) {
        const res = await this.getFromLocalDir(task);
        if (res) {
            await this.assertLocalCacheValidity(task);
            return { ...res, remote: false };
        }
        else if (this.options.remoteCache) {
            // didn't find it locally but we have a remote cache
            // attempt remote cache
            await this.options.remoteCache.retrieve(task.hash, this.cachePath);
            // try again from local cache
            const res2 = await this.getFromLocalDir(task);
            return res2 ? { ...res2, remote: true } : null;
        }
        else {
            return null;
        }
    }
    async put(task, terminalOutput, outputs, code) {
        return this.tryAndRetry(async () => {
            const td = (0, path_1.join)(this.cachePath, task.hash);
            const tdCommit = (0, path_1.join)(this.cachePath, `${task.hash}.commit`);
            // might be left overs from partially-completed cache invocations
            await this.remove(tdCommit);
            await this.remove(td);
            await (0, fs_extra_1.mkdir)(td);
            await (0, fs_extra_1.writeFile)((0, path_1.join)(td, 'terminalOutput'), terminalOutput ?? 'no terminal output');
            await (0, fs_extra_1.mkdir)((0, path_1.join)(td, 'outputs'));
            const expandedOutputs = await this.expandOutputsInWorkspace(outputs);
            await Promise.all(expandedOutputs.map(async (f) => {
                const src = (0, path_1.join)(this.root, f);
                if (await (0, fs_extra_1.pathExists)(src)) {
                    const cached = (0, path_1.join)(td, 'outputs', f);
                    await this.copy(src, cached);
                }
            }));
            // we need this file to account for partial writes to the cache folder.
            // creating this file is atomic, whereas creating a folder is not.
            // so if the process gets terminated while we are copying stuff into cache,
            // the cache entry won't be used.
            await (0, fs_extra_1.writeFile)((0, path_1.join)(td, 'code'), code.toString());
            await (0, fs_extra_1.writeFile)((0, path_1.join)(td, 'source'), await this.currentMachineId());
            await (0, fs_extra_1.writeFile)(tdCommit, 'true');
            if (this.options.remoteCache) {
                await this.options.remoteCache.store(task.hash, this.cachePath);
            }
            if (terminalOutput) {
                const outputPath = this.temporaryOutputPath(task);
                await (0, fs_extra_1.writeFile)(outputPath, terminalOutput);
            }
        });
    }
    async copyFilesFromCache(hash, cachedResult, outputs) {
        return this.tryAndRetry(async () => {
            const expandedOutputs = await this.expandOutputsInCache(outputs, cachedResult);
            await Promise.all(expandedOutputs.map(async (f) => {
                const cached = (0, path_1.join)(cachedResult.outputsPath, f);
                if (await (0, fs_extra_1.pathExists)(cached)) {
                    const src = (0, path_1.join)(this.root, f);
                    await this.remove(src);
                    await this.copy(cached, src);
                }
            }));
        });
    }
    temporaryOutputPath(task) {
        return (0, path_1.join)(this.terminalOutputsDir, task.hash);
    }
    async expandOutputsInWorkspace(outputs) {
        return this._expandOutputs(outputs, workspace_root_1.workspaceRoot);
    }
    async expandOutputsInCache(outputs, cachedResult) {
        return this._expandOutputs(outputs, cachedResult.outputsPath);
    }
    async _expandOutputs(outputs, cwd) {
        const { expandOutputs } = require('../native');
        perf_hooks_1.performance.mark('expandOutputs:start');
        const results = expandOutputs(cwd, outputs);
        perf_hooks_1.performance.mark('expandOutputs:end');
        perf_hooks_1.performance.measure('expandOutputs', 'expandOutputs:start', 'expandOutputs:end');
        return results;
    }
    async copy(src, destination) {
        const { copy } = require('../native');
        // 'cp -a /path/dir/ dest/' operates differently to 'cp -a /path/dir dest/'
        // --> which means actual build works but subsequent populate from cache (using cp -a) does not
        // --> the fix is to remove trailing slashes to ensure consistent & expected behaviour
        src = src.replace(/[\/\\]$/, '');
        return new Promise((res, rej) => {
            try {
                copy(src, destination);
                res();
            }
            catch (e) {
                rej(e);
            }
        });
    }
    async remove(path) {
        const { remove } = require('../native');
        return new Promise((res, rej) => {
            try {
                remove(path);
                res();
            }
            catch (e) {
                rej(e);
            }
        });
    }
    async getFromLocalDir(task) {
        const tdCommit = (0, path_1.join)(this.cachePath, `${task.hash}.commit`);
        const td = (0, path_1.join)(this.cachePath, task.hash);
        if (await (0, fs_extra_1.pathExists)(tdCommit)) {
            const terminalOutput = await (0, fs_extra_1.readFile)((0, path_1.join)(td, 'terminalOutput'), 'utf-8');
            let code = 0;
            try {
                code = Number(await (0, fs_extra_1.readFile)((0, path_1.join)(td, 'code'), 'utf-8'));
            }
            catch { }
            return {
                terminalOutput,
                outputsPath: (0, path_1.join)(td, 'outputs'),
                code,
            };
        }
        else {
            return null;
        }
    }
    async assertLocalCacheValidity(task) {
        const td = (0, path_1.join)(this.cachePath, task.hash);
        let sourceMachineId = null;
        try {
            sourceMachineId = await (0, fs_extra_1.readFile)((0, path_1.join)(td, 'source'), 'utf-8');
        }
        catch { }
        if (sourceMachineId && sourceMachineId != (await this.currentMachineId())) {
            if (process.env.NX_REJECT_UNKNOWN_LOCAL_CACHE != '0' &&
                process.env.NX_REJECT_UNKNOWN_LOCAL_CACHE != 'false') {
                const error = [
                    `Invalid Cache Directory for Task "${task.id}"`,
                    `The local cache artifact in "${td}" was not generated on this machine.`,
                    `As a result, the cache's content integrity cannot be confirmed, which may make cache restoration potentially unsafe.`,
                    `If your machine ID has changed since the artifact was cached, run "nx reset" to fix this issue.`,
                    `Read about the error and how to address it here: https://nx.dev/troubleshooting/unknown-local-cache`,
                    ``,
                ].join('\n');
                throw new Error(error);
            }
        }
    }
    createCacheDir() {
        (0, fs_extra_1.mkdirSync)(cache_directory_1.cacheDir, { recursive: true });
        return cache_directory_1.cacheDir;
    }
    createTerminalOutputsDir() {
        const path = (0, path_1.join)(this.cachePath, 'terminalOutputs');
        (0, fs_extra_1.mkdirSync)(path, { recursive: true });
        return path;
    }
    tryAndRetry(fn) {
        let attempts = 0;
        const baseTimeout = 5;
        // Generate a random number between 2 and 4 to raise to the power of attempts
        const baseExponent = Math.random() * 2 + 2;
        const _try = async () => {
            try {
                attempts++;
                return await fn();
            }
            catch (e) {
                // Max time is 5 * 4^3 = 20480ms
                if (attempts === 6) {
                    // After enough attempts, throw the error
                    throw e;
                }
                await new Promise((res) => setTimeout(res, baseExponent ** attempts));
                return await _try();
            }
        };
        return _try();
    }
}
exports.Cache = Cache;
