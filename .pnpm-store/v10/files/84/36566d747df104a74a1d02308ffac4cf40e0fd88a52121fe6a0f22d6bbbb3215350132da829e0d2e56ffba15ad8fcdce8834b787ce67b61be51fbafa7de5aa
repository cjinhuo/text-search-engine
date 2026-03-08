"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreNxPluginVersions = void 0;
exports.addHandler = addHandler;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const ora = require("ora");
const angular_json_1 = require("../../adapter/angular-json");
const nx_json_1 = require("../../config/nx-json");
const child_process_2 = require("../../utils/child-process");
const fileutils_1 = require("../../utils/fileutils");
const logger_1 = require("../../utils/logger");
const output_1 = require("../../utils/output");
const package_manager_1 = require("../../utils/package-manager");
const params_1 = require("../../utils/params");
const plugins_1 = require("../../utils/plugins");
const versions_1 = require("../../utils/versions");
const workspace_root_1 = require("../../utils/workspace-root");
const add_nx_scripts_1 = require("../init/implementation/dot-nx/add-nx-scripts");
function addHandler(options) {
    if (options.verbose) {
        process.env.NX_VERBOSE_LOGGING = 'true';
    }
    const isVerbose = process.env.NX_VERBOSE_LOGGING === 'true';
    return (0, params_1.handleErrors)(isVerbose, async () => {
        output_1.output.addNewline();
        const [pkgName, version] = parsePackageSpecifier(options.packageSpecifier);
        const nxJson = (0, nx_json_1.readNxJson)();
        await installPackage(pkgName, version, nxJson);
        await initializePlugin(pkgName, options, nxJson);
        output_1.output.success({
            title: `Package ${pkgName} added successfully.`,
        });
    });
}
async function installPackage(pkgName, version, nxJson) {
    const spinner = ora(`Installing ${pkgName}@${version}...`);
    spinner.start();
    if ((0, fs_1.existsSync)('package.json')) {
        const pmc = (0, package_manager_1.getPackageManagerCommand)();
        await new Promise((resolve) => (0, child_process_1.exec)(`${pmc.addDev} ${pkgName}@${version}`, (error, stdout) => {
            if (error) {
                spinner.fail();
                output_1.output.addNewline();
                logger_1.logger.error(stdout);
                output_1.output.error({
                    title: `Failed to install ${pkgName}. Please check the error above for more details.`,
                });
                process.exit(1);
            }
            return resolve();
        }));
    }
    else {
        nxJson.installation.plugins ??= {};
        nxJson.installation.plugins[pkgName] = (0, add_nx_scripts_1.normalizeVersionForNxJson)(pkgName, version);
        (0, fileutils_1.writeJsonFile)('nx.json', nxJson);
        try {
            await (0, child_process_2.runNxAsync)('--help', { silent: true });
        }
        catch (e) {
            // revert adding the plugin to nx.json
            nxJson.installation.plugins[pkgName] = undefined;
            (0, fileutils_1.writeJsonFile)('nx.json', nxJson);
            spinner.fail();
            output_1.output.addNewline();
            logger_1.logger.error(e.message);
            output_1.output.error({
                title: `Failed to install ${pkgName}. Please check the error above for more details.`,
            });
            process.exit(1);
        }
    }
    spinner.succeed();
}
async function initializePlugin(pkgName, options, nxJson) {
    const capabilities = await (0, plugins_1.getPluginCapabilities)(workspace_root_1.workspaceRoot, pkgName, {});
    const generators = capabilities?.generators;
    if (!generators) {
        output_1.output.log({
            title: `No generators found in ${pkgName}. Skipping initialization.`,
        });
        return;
    }
    const initGenerator = findInitGenerator(generators);
    if (!initGenerator) {
        output_1.output.log({
            title: `No "init" generator found in ${pkgName}. Skipping initialization.`,
        });
        return;
    }
    const spinner = ora(`Initializing ${pkgName}...`);
    spinner.start();
    try {
        const args = [];
        if (exports.coreNxPluginVersions.has(pkgName)) {
            args.push(`--keepExistingVersions`);
            if (options.updatePackageScripts ||
                (options.updatePackageScripts === undefined &&
                    nxJson.useInferencePlugins !== false &&
                    process.env.NX_ADD_PLUGINS !== 'false')) {
                args.push(`--updatePackageScripts`);
            }
        }
        if (options.__overrides_unparsed__.length) {
            args.push(...options.__overrides_unparsed__);
        }
        await (0, child_process_2.runNxAsync)(`g ${pkgName}:${initGenerator} ${args.join(' ')}`, {
            silent: !options.verbose,
        });
    }
    catch (e) {
        spinner.fail();
        output_1.output.addNewline();
        logger_1.logger.error(e.message);
        output_1.output.error({
            title: `Failed to initialize ${pkgName}. Please check the error above for more details.`,
        });
        process.exit(1);
    }
    spinner.succeed();
}
function findInitGenerator(generators) {
    if (generators['init']) {
        return 'init';
    }
    const angularPluginInstalled = (0, angular_json_1.isAngularPluginInstalled)();
    if (angularPluginInstalled && generators['ng-add']) {
        return 'ng-add';
    }
    return Object.keys(generators).find((name) => generators[name].aliases?.includes('init') ||
        (angularPluginInstalled && generators[name].aliases?.includes('ng-add')));
}
function parsePackageSpecifier(packageSpecifier) {
    const i = packageSpecifier.lastIndexOf('@');
    if (i <= 0) {
        if (exports.coreNxPluginVersions.has(packageSpecifier)) {
            return [packageSpecifier, exports.coreNxPluginVersions.get(packageSpecifier)];
        }
        return [packageSpecifier, 'latest'];
    }
    const pkgName = packageSpecifier.substring(0, i);
    const version = packageSpecifier.substring(i + 1);
    return [pkgName, version];
}
exports.coreNxPluginVersions = require('../../../package.json')['nx-migrations'].packageGroup.reduce((map, entry) => {
    const packageName = typeof entry === 'string' ? entry : entry.package;
    const version = typeof entry === 'string' ? versions_1.nxVersion : entry.version;
    return map.set(packageName, version);
}, 
// Package Name -> Desired Version
new Map());
