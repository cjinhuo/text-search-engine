"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initHandler = initHandler;
const fs_1 = require("fs");
const semver_1 = require("semver");
const output_1 = require("../../utils/output");
const package_manager_1 = require("../../utils/package-manager");
const add_nx_scripts_1 = require("./implementation/dot-nx/add-nx-scripts");
const child_process_1 = require("../../utils/child-process");
const fileutils_1 = require("../../utils/fileutils");
const versions_1 = require("../../utils/versions");
const utils_1 = require("./implementation/utils");
const enquirer_1 = require("enquirer");
const child_process_2 = require("child_process");
const angular_1 = require("./implementation/angular");
const workspace_context_1 = require("../../utils/workspace-context");
const connect_to_nx_cloud_1 = require("../connect/connect-to-nx-cloud");
const add_nx_to_npm_repo_1 = require("./implementation/add-nx-to-npm-repo");
const add_nx_to_monorepo_1 = require("./implementation/add-nx-to-monorepo");
async function initHandler(options) {
    process.env.NX_RUNNING_NX_INIT = 'true';
    const version = process.env.NX_VERSION ?? ((0, semver_1.prerelease)(versions_1.nxVersion) ? 'next' : 'latest');
    if (process.env.NX_VERSION) {
        output_1.output.log({ title: `Using version ${process.env.NX_VERSION}` });
    }
    if (!(0, fs_1.existsSync)('package.json') || options.useDotNxInstallation) {
        if (process.platform !== 'win32') {
            console.log('Setting Nx up installation in `.nx`. You can run Nx commands like: `./nx --help`');
        }
        else {
            console.log('Setting Nx up installation in `.nx`. You can run Nx commands like: `./nx.bat --help`');
        }
        (0, add_nx_scripts_1.generateDotNxSetup)(version);
        const { plugins } = await detectPlugins();
        plugins.forEach((plugin) => {
            (0, child_process_2.execSync)(`./nx add ${plugin}`, {
                stdio: 'inherit',
            });
        });
        // invokes the wrapper, thus invoking the initial installation process
        (0, child_process_1.runNxSync)('--version', { stdio: 'ignore' });
        return;
    }
    // TODO(jack): Remove this Angular logic once `@nx/angular` is compatible with inferred targets.
    if ((0, fs_1.existsSync)('angular.json')) {
        await (0, angular_1.addNxToAngularCliRepo)({
            ...options,
            integrated: !!options.integrated,
        });
        (0, utils_1.printFinalMessage)({
            learnMoreLink: 'https://nx.dev/recipes/angular/migration/angular',
        });
        return;
    }
    output_1.output.log({ title: '🧐 Checking dependencies' });
    const { plugins, updatePackageScripts } = await detectPlugins();
    const packageJson = (0, fileutils_1.readJsonFile)('package.json');
    if ((0, utils_1.isMonorepo)(packageJson)) {
        await (0, add_nx_to_monorepo_1.addNxToMonorepo)({
            interactive: options.interactive,
            nxCloud: false,
        });
    }
    else {
        await (0, add_nx_to_npm_repo_1.addNxToNpmRepo)({
            interactive: options.interactive,
            nxCloud: false,
        });
    }
    const learnMoreLink = (0, utils_1.isMonorepo)(packageJson)
        ? 'https://nx.dev/getting-started/tutorials/npm-workspaces-tutorial'
        : 'https://nx.dev/recipes/adopting-nx/adding-to-existing-project';
    const useNxCloud = options.nxCloud ??
        (options.interactive ? await (0, connect_to_nx_cloud_1.connectExistingRepoToNxCloudPrompt)() : false);
    const repoRoot = process.cwd();
    const pmc = (0, package_manager_1.getPackageManagerCommand)();
    (0, utils_1.createNxJsonFile)(repoRoot, [], [], {});
    (0, utils_1.updateGitIgnore)(repoRoot);
    (0, utils_1.addDepsToPackageJson)(repoRoot, plugins);
    output_1.output.log({ title: '📦 Installing Nx' });
    (0, utils_1.runInstall)(repoRoot, pmc);
    if (plugins.length > 0) {
        output_1.output.log({ title: '🔨 Configuring plugins' });
        for (const plugin of plugins) {
            (0, child_process_2.execSync)(`${pmc.exec} nx g ${plugin}:init --keepExistingVersions ${updatePackageScripts ? '--updatePackageScripts' : ''} --no-interactive`, {
                stdio: [0, 1, 2],
                cwd: repoRoot,
            });
        }
    }
    if (useNxCloud) {
        output_1.output.log({ title: '🛠️ Setting up Nx Cloud' });
        await (0, utils_1.initCloud)('nx-init');
    }
    (0, utils_1.printFinalMessage)({
        learnMoreLink,
    });
}
const npmPackageToPluginMap = {
    // Generic JS tools
    eslint: '@nx/eslint',
    storybook: '@nx/storybook',
    // Bundlers
    vite: '@nx/vite',
    vitest: '@nx/vite',
    webpack: '@nx/webpack',
    rollup: '@nx/rollup',
    // Testing tools
    jest: '@nx/jest',
    cypress: '@nx/cypress',
    '@playwright/test': '@nx/playwright',
    // Frameworks
    detox: '@nx/detox',
    expo: '@nx/expo',
    next: '@nx/next',
    nuxt: '@nx/nuxt',
    'react-native': '@nx/react-native',
    '@remix-run/dev': '@nx/remix',
};
async function detectPlugins() {
    let files = ['package.json'].concat(await (0, workspace_context_1.globWithWorkspaceContext)(process.cwd(), ['**/*/package.json']));
    const detectedPlugins = new Set();
    for (const file of files) {
        if (!(0, fs_1.existsSync)(file))
            continue;
        let packageJson;
        try {
            packageJson = (0, fileutils_1.readJsonFile)(file);
        }
        catch {
            // Could have malformed JSON for unit tests, etc.
            continue;
        }
        const deps = {
            ...packageJson.dependencies,
            ...packageJson.devDependencies,
        };
        for (const [dep, plugin] of Object.entries(npmPackageToPluginMap)) {
            if (deps[dep]) {
                detectedPlugins.add(plugin);
            }
        }
    }
    if ((0, fs_1.existsSync)('gradlew') || (0, fs_1.existsSync)('gradlew.bat')) {
        detectedPlugins.add('@nx/gradle');
    }
    const plugins = Array.from(detectedPlugins);
    if (plugins.length === 0) {
        return {
            plugins: [],
            updatePackageScripts: false,
        };
    }
    output_1.output.log({
        title: `Recommended Plugins:`,
        bodyLines: [
            `Add these Nx plugins to integrate with the tools used in your workspace.`,
        ],
    });
    const pluginsToInstall = await (0, enquirer_1.prompt)([
        {
            name: 'plugins',
            type: 'multiselect',
            message: `Which plugins would you like to add? Press <Space> to select and <Enter> to submit.`,
            choices: plugins.map((p) => ({ name: p, value: p })),
            /**
             * limit is missing from the interface but it limits the amount of options shown
             */
            limit: process.stdout.rows - 4, // 4 leaves room for the header above, the prompt and some whitespace
        },
    ]).then((r) => r.plugins);
    if (pluginsToInstall?.length === 0)
        return {
            plugins: [],
            updatePackageScripts: false,
        };
    const updatePackageScripts = (0, fs_1.existsSync)('package.json') &&
        (await (0, enquirer_1.prompt)([
            {
                name: 'updatePackageScripts',
                type: 'autocomplete',
                message: `Do you want to start using Nx in your package.json scripts?`,
                choices: [
                    {
                        name: 'Yes',
                    },
                    {
                        name: 'No',
                    },
                ],
                initial: 0,
            },
        ]).then((r) => r.updatePackageScripts === 'Yes'));
    return { plugins: pluginsToInstall, updatePackageScripts };
}
