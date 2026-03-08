"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeTaskHasherImpl = void 0;
const find_project_for_path_1 = require("../project-graph/utils/find-project-for-path");
const file_hasher_1 = require("./file-hasher");
const utils_1 = require("../tasks-runner/utils");
const workspace_root_1 = require("../utils/workspace-root");
const minimatch_1 = require("minimatch");
const path_1 = require("path");
const native_1 = require("../native");
const project_graph_utils_1 = require("../utils/project-graph-utils");
const find_matching_projects_1 = require("../utils/find-matching-projects");
const child_process_1 = require("child_process");
const task_hasher_1 = require("./task-hasher");
const hasher_1 = require("../plugins/js/hasher/hasher");
class NodeTaskHasherImpl {
    constructor(nxJson, legacyRuntimeInputs, legacyFilesetInputs, projectFileMap, allWorkspaceFiles, projectGraph, options) {
        this.nxJson = nxJson;
        this.legacyRuntimeInputs = legacyRuntimeInputs;
        this.legacyFilesetInputs = legacyFilesetInputs;
        this.projectFileMap = projectFileMap;
        this.allWorkspaceFiles = allWorkspaceFiles;
        this.projectGraph = projectGraph;
        this.options = options;
        this.filesetHashes = {};
        this.runtimeHashes = {};
        this.externalDependencyHashes = new Map();
        this.projectRootMappings = (0, find_project_for_path_1.createProjectRootMappings)(this.projectGraph.nodes);
        // External Dependencies are all calculated up front in a deterministic order
        this.calculateExternalDependencyHashes();
    }
    hashTasks(tasks, taskGraph, env) {
        return Promise.all(tasks.map((t) => this.hashTask(t, taskGraph, env, [])));
    }
    async hashTask(task, taskGraph, env, visited = []) {
        return Promise.resolve().then(async () => {
            const { selfInputs, depsInputs, depsOutputs, projectInputs } = (0, task_hasher_1.getInputs)(task, this.projectGraph, this.nxJson);
            const selfAndInputs = await this.hashSelfAndDepsInputs(task.target.project, task, selfInputs, depsInputs, depsOutputs, projectInputs, taskGraph, env, visited);
            const target = this.hashTarget(task.target.project, task.target.target, selfInputs);
            if (target) {
                return this.combinePartialHashes([selfAndInputs, target]);
            }
            return selfAndInputs;
        });
    }
    async hashNamedInputForDependencies(projectName, task, namedInput, taskGraph, env, visited) {
        const projectNode = this.projectGraph.nodes[projectName];
        const namedInputs = {
            default: [{ fileset: '{projectRoot}/**/*' }],
            ...this.nxJson.namedInputs,
            ...projectNode.data.namedInputs,
        };
        const expandedInputs = (0, task_hasher_1.expandNamedInput)(namedInput, namedInputs);
        const selfInputs = expandedInputs.filter(task_hasher_1.isSelfInput);
        const depsOutputs = expandedInputs.filter(task_hasher_1.isDepsOutput);
        const depsInputs = [{ input: namedInput, dependencies: true }]; // true is boolean by default
        return this.hashSelfAndDepsInputs(projectName, task, selfInputs, depsInputs, depsOutputs, [], taskGraph, env, visited);
    }
    async hashSelfAndDepsInputs(projectName, task, selfInputs, depsInputs, depsOutputs, projectInputs, taskGraph, env, visited) {
        const projectGraphDeps = this.projectGraph.dependencies[projectName] ?? [];
        // we don't want random order of dependencies to change the hash
        projectGraphDeps.sort((a, b) => a.target.localeCompare(b.target));
        const self = await this.hashSingleProjectInputs(projectName, selfInputs, env);
        const deps = await this.hashDepsInputs(task, depsInputs, projectGraphDeps, taskGraph, env, visited);
        const depsOut = await this.hashDepsOutputs(task, depsOutputs, taskGraph);
        const projects = await this.hashProjectInputs(projectInputs, env);
        return this.combinePartialHashes([
            ...self,
            ...deps,
            ...projects,
            ...depsOut,
        ]);
    }
    combinePartialHashes(partialHashes) {
        if (partialHashes.length === 1) {
            return partialHashes[0];
        }
        const details = {};
        const hashValues = [];
        for (const partial of partialHashes) {
            hashValues.push(partial.value);
            Object.assign(details, partial.details);
        }
        const value = (0, file_hasher_1.hashArray)(hashValues);
        return { value, details };
    }
    async hashDepsInputs(task, inputs, projectGraphDeps, taskGraph, env, visited) {
        return (await Promise.all(inputs.map(async (input) => {
            return await Promise.all(projectGraphDeps.map(async (d) => {
                if (visited.indexOf(d.target) > -1) {
                    return null;
                }
                else {
                    visited.push(d.target);
                    if (this.projectGraph.nodes[d.target]) {
                        return await this.hashNamedInputForDependencies(d.target, task, input.input || 'default', taskGraph, env, visited);
                    }
                    else {
                        return this.getExternalDependencyHash(d.target);
                    }
                }
            }));
        })))
            .flat()
            .filter((r) => !!r);
    }
    async hashDepsOutputs(task, depsOutputs, taskGraph) {
        if (depsOutputs.length === 0) {
            return [];
        }
        const result = [];
        for (const { dependentTasksOutputFiles, transitive } of depsOutputs) {
            result.push(...(await this.hashDepOuputs(task, dependentTasksOutputFiles, taskGraph, transitive)));
        }
        return result;
    }
    async hashDepOuputs(task, dependentTasksOutputFiles, taskGraph, transitive) {
        // task has no dependencies
        if (!taskGraph.dependencies[task.id]) {
            return [];
        }
        const partialHashes = [];
        for (const d of taskGraph.dependencies[task.id]) {
            const childTask = taskGraph.tasks[d];
            const outputs = (0, utils_1.getOutputsForTargetAndConfiguration)(childTask.target, childTask.overrides, this.projectGraph.nodes[childTask.target.project]);
            const { getFilesForOutputs } = require('../native');
            const outputFiles = getFilesForOutputs(workspace_root_1.workspaceRoot, outputs);
            const filteredFiles = outputFiles.filter((p) => p === dependentTasksOutputFiles ||
                (0, minimatch_1.minimatch)(p, dependentTasksOutputFiles, { dot: true }));
            const hashDetails = {};
            const hashes = [];
            for (const [file, hash] of this.hashFiles(filteredFiles.map((p) => (0, path_1.join)(workspace_root_1.workspaceRoot, p)))) {
                hashes.push(hash);
            }
            let hash = (0, file_hasher_1.hashArray)(hashes);
            partialHashes.push({
                value: hash,
                details: {
                    [`${dependentTasksOutputFiles}:${outputs.join(',')}`]: hash,
                },
            });
            if (transitive) {
                partialHashes.push(...(await this.hashDepOuputs(childTask, dependentTasksOutputFiles, taskGraph, transitive)));
            }
        }
        return partialHashes;
    }
    hashFiles(files) {
        const r = new Map();
        for (let f of files) {
            r.set(f, (0, native_1.hashFile)(f));
        }
        return r;
    }
    getExternalDependencyHash(externalNodeName) {
        const combinedHash = this.combinePartialHashes(this.externalDependencyHashes.get(externalNodeName));
        // Set the combined hash into the hashes so it's not recalculated next time
        this.externalDependencyHashes.set(externalNodeName, [combinedHash]);
        return combinedHash;
    }
    hashSingleExternalDependency(externalNodeName) {
        const node = this.projectGraph.externalNodes[externalNodeName];
        if (node.data.hash) {
            // we already know the hash of this dependency
            return {
                value: node.data.hash,
                details: {
                    [externalNodeName]: node.data.hash,
                },
            };
        }
        else {
            // we take version as a hash
            return {
                value: node.data.version,
                details: {
                    [externalNodeName]: node.data.version,
                },
            };
        }
    }
    hashExternalDependency(externalNodeName) {
        const partialHashes = new Set();
        partialHashes.add(this.hashSingleExternalDependency(externalNodeName));
        const deps = (0, project_graph_utils_1.findAllProjectNodeDependencies)(externalNodeName, this.projectGraph, true);
        for (const dep of deps) {
            partialHashes.add(this.hashSingleExternalDependency(dep));
        }
        return Array.from(partialHashes);
    }
    hashTarget(projectName, targetName, selfInputs) {
        const projectNode = this.projectGraph.nodes[projectName];
        const target = projectNode.data.targets[targetName];
        if (!target) {
            return;
        }
        let hash;
        // we can only vouch for @nx packages's executor dependencies
        // if it's "run commands" or third-party we skip traversing since we have no info what this command depends on
        if (target.executor.startsWith(`@nrwl/`) ||
            target.executor.startsWith(`@nx/`)) {
            const executorPackage = target.executor.split(':')[0];
            const executorNodeName = this.findExternalDependencyNodeName(executorPackage);
            // This is either a local plugin or a non-existent executor
            if (!executorNodeName) {
                // TODO: This should not return null if it is a local plugin's executor
                return null;
            }
            return this.getExternalDependencyHash(executorNodeName);
        }
        else {
            // use command external dependencies if available to construct the hash
            const partialHashes = [];
            let hasCommandExternalDependencies = false;
            for (const input of selfInputs) {
                if (input['externalDependencies']) {
                    // if we have externalDependencies with empty array we still want to override the default hash
                    hasCommandExternalDependencies = true;
                    const externalDependencies = input['externalDependencies'];
                    for (let dep of externalDependencies) {
                        dep = this.findExternalDependencyNodeName(dep);
                        if (!dep) {
                            throw new Error(`The externalDependency "${dep}" for "${projectName}:${targetName}" could not be found`);
                        }
                        partialHashes.push(this.getExternalDependencyHash(dep));
                    }
                }
            }
            if (hasCommandExternalDependencies) {
                return this.combinePartialHashes(partialHashes);
            }
            else {
                // cache the hash of the entire external dependencies tree
                if (this.allExternalDependenciesHash) {
                    return this.allExternalDependenciesHash;
                }
                else {
                    hash = (0, file_hasher_1.hashObject)(this.projectGraph.externalNodes);
                    this.allExternalDependenciesHash = {
                        value: hash,
                        details: {
                            AllExternalDependencies: hash,
                        },
                    };
                    return this.allExternalDependenciesHash;
                }
            }
        }
    }
    findExternalDependencyNodeName(packageName) {
        if (this.projectGraph.externalNodes[packageName]) {
            return packageName;
        }
        if (this.projectGraph.externalNodes[`npm:${packageName}`]) {
            return `npm:${packageName}`;
        }
        for (const node of Object.values(this.projectGraph.externalNodes)) {
            if (node.data.packageName === packageName) {
                return node.name;
            }
        }
        // not found
        return null;
    }
    async hashSingleProjectInputs(projectName, inputs, env) {
        const filesets = (0, task_hasher_1.extractPatternsFromFileSets)(inputs);
        const projectFilesets = [];
        const workspaceFilesets = [];
        let invalidFilesetNoPrefix = null;
        let invalidFilesetWorkspaceRootNegative = null;
        for (let f of filesets) {
            if (f.startsWith('{projectRoot}/') || f.startsWith('!{projectRoot}/')) {
                projectFilesets.push(f);
            }
            else if (f.startsWith('{workspaceRoot}/') ||
                f.startsWith('!{workspaceRoot}/')) {
                workspaceFilesets.push(f);
            }
            else {
                invalidFilesetNoPrefix = f;
            }
        }
        if (invalidFilesetNoPrefix) {
            throw new Error([
                `"${invalidFilesetNoPrefix}" is an invalid fileset.`,
                'All filesets have to start with either {workspaceRoot} or {projectRoot}.',
                'For instance: "!{projectRoot}/**/*.spec.ts" or "{workspaceRoot}/package.json".',
                `If "${invalidFilesetNoPrefix}" is a named input, make sure it is defined in, for instance, nx.json.`,
            ].join('\n'));
        }
        if (invalidFilesetWorkspaceRootNegative) {
            throw new Error([
                `"${invalidFilesetWorkspaceRootNegative}" is an invalid fileset.`,
                'It is not possible to negative filesets starting with {workspaceRoot}.',
            ].join('\n'));
        }
        const notFilesets = inputs.filter((r) => !r['fileset']);
        return Promise.all([
            this.hashProjectFileset(projectName, projectFilesets),
            this.hashProjectConfig(projectName),
            this.hashTsConfig(projectName),
            ...[
                ...workspaceFilesets,
                ...this.legacyFilesetInputs.map((r) => r.fileset),
            ].map((fileset) => this.hashRootFileset(fileset)),
            ...[...notFilesets, ...this.legacyRuntimeInputs].map((r) => r['runtime']
                ? this.hashRuntime(env, r['runtime'])
                : this.hashEnv(env, r['env'])),
        ]);
    }
    async hashProjectInputs(projectInputs, env) {
        const partialHashes = [];
        for (const input of projectInputs) {
            const projects = (0, find_matching_projects_1.findMatchingProjects)(input.projects, this.projectGraph.nodes);
            for (const project of projects) {
                const namedInputs = (0, task_hasher_1.getNamedInputs)(this.nxJson, this.projectGraph.nodes[project]);
                const expandedInput = (0, task_hasher_1.expandSingleProjectInputs)([{ input: input.input }], namedInputs);
                partialHashes.push(this.hashSingleProjectInputs(project, expandedInput, env));
            }
        }
        return Promise.all(partialHashes).then((hashes) => hashes.flat());
    }
    async hashRootFileset(fileset) {
        const mapKey = fileset;
        const withoutWorkspaceRoot = fileset.substring(16);
        if (!this.filesetHashes[mapKey]) {
            this.filesetHashes[mapKey] = new Promise(async (res) => {
                const parts = [];
                const matchingFile = this.allWorkspaceFiles.find((t) => t.file === withoutWorkspaceRoot);
                if (matchingFile) {
                    parts.push(matchingFile.hash);
                }
                else {
                    this.allWorkspaceFiles
                        .filter((f) => (0, minimatch_1.minimatch)(f.file, withoutWorkspaceRoot))
                        .forEach((f) => {
                        parts.push(f.hash);
                    });
                }
                const value = (0, file_hasher_1.hashArray)(parts);
                res({
                    value,
                    details: { [mapKey]: value },
                });
            });
        }
        return this.filesetHashes[mapKey];
    }
    hashProjectConfig(projectName) {
        const p = this.projectGraph.nodes[projectName];
        const projectConfig = (0, file_hasher_1.hashArray)([
            JSON.stringify({ ...p.data, files: undefined }),
        ]);
        return {
            value: projectConfig,
            details: {
                [`${projectName}:ProjectConfiguration`]: projectConfig,
            },
        };
    }
    hashTsConfig(projectName) {
        const p = this.projectGraph.nodes[projectName];
        const tsConfig = (0, file_hasher_1.hashArray)([
            (0, hasher_1.hashTsConfig)(p, this.projectRootMappings, this.options),
        ]);
        return {
            value: tsConfig,
            details: {
                [`${projectName}:TsConfig`]: tsConfig,
            },
        };
    }
    async hashProjectFileset(projectName, filesetPatterns) {
        const mapKey = `${projectName}:${filesetPatterns.join(',')}`;
        if (!this.filesetHashes[mapKey]) {
            this.filesetHashes[mapKey] = new Promise(async (res) => {
                const p = this.projectGraph.nodes[projectName];
                const filteredFiles = (0, task_hasher_1.filterUsingGlobPatterns)(p.data.root, this.projectFileMap[projectName] || [], filesetPatterns);
                const files = [];
                for (const { file, hash } of filteredFiles) {
                    files.push(file, hash);
                }
                const value = (0, file_hasher_1.hashArray)(files);
                res({
                    value,
                    details: { [mapKey]: value },
                });
            });
        }
        return this.filesetHashes[mapKey];
    }
    async hashRuntime(env, runtime) {
        const env_key = JSON.stringify(env);
        const mapKey = `runtime:${runtime}-${env_key}`;
        if (!this.runtimeHashes[mapKey]) {
            this.runtimeHashes[mapKey] = new Promise((res, rej) => {
                (0, child_process_1.exec)(runtime, {
                    windowsHide: true,
                    cwd: workspace_root_1.workspaceRoot,
                    env,
                }, (err, stdout, stderr) => {
                    if (err) {
                        rej(new Error(`Nx failed to execute {runtime: '${runtime}'}. ${err}.`));
                    }
                    else {
                        const value = (0, file_hasher_1.hashArray)([`${stdout}${stderr}`.trim()]);
                        res({
                            details: { [`runtime:${runtime}`]: value },
                            value,
                        });
                    }
                });
            });
        }
        return this.runtimeHashes[mapKey];
    }
    async hashEnv(env, envVarName) {
        const value = (0, file_hasher_1.hashArray)([env[envVarName] ?? '']);
        return {
            details: { [`env:${envVarName}`]: value },
            value,
        };
    }
    calculateExternalDependencyHashes() {
        const keys = Object.keys(this.projectGraph.externalNodes);
        for (const externalNodeName of keys) {
            this.externalDependencyHashes.set(externalNodeName, this.hashExternalDependency(externalNodeName));
        }
    }
}
exports.NodeTaskHasherImpl = NodeTaskHasherImpl;
