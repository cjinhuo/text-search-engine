"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yargsInternalMigrateCommand = exports.yargsMigrateCommand = void 0;
const path = require("path");
const child_process_1 = require("../../utils/child-process");
const documentation_1 = require("../yargs-utils/documentation");
const child_process_2 = require("child_process");
const package_manager_1 = require("../../utils/package-manager");
const fileutils_1 = require("../../utils/fileutils");
const workspace_root_1 = require("../../utils/workspace-root");
exports.yargsMigrateCommand = {
    command: 'migrate [packageAndVersion]',
    describe: `Creates a migrations file or runs migrations from the migrations file.
  - Migrate packages and create migrations.json (e.g., nx migrate @nx/workspace@latest)
  - Run migrations (e.g., nx migrate --run-migrations=migrations.json). Use flag --if-exists to run migrations only if the migrations file exists.`,
    builder: (yargs) => (0, documentation_1.linkToNxDevAndExamples)(withMigrationOptions(yargs), 'migrate'),
    handler: () => {
        runMigration();
        process.exit(0);
    },
};
exports.yargsInternalMigrateCommand = {
    command: '_migrate [packageAndVersion]',
    describe: false,
    builder: (yargs) => withMigrationOptions(yargs),
    handler: async (args) => process.exit(await (await Promise.resolve().then(() => require('./migrate'))).migrate(process.cwd(), args, process.argv.slice(3))),
};
function withMigrationOptions(yargs) {
    const defaultCommitPrefix = 'chore: [nx migration] ';
    return yargs
        .positional('packageAndVersion', {
        describe: `The target package and version (e.g, @nx/workspace@16.0.0)`,
        type: 'string',
    })
        .option('runMigrations', {
        describe: `Execute migrations from a file (when the file isn't provided, execute migrations from migrations.json)`,
        type: 'string',
    })
        .option('ifExists', {
        describe: `Run migrations only if the migrations file exists, if not continues successfully`,
        type: 'boolean',
        default: false,
    })
        .option('from', {
        describe: 'Use the provided versions for packages instead of the ones installed in node_modules (e.g., --from="@nx/react@16.0.0,@nx/js@16.0.0")',
        type: 'string',
    })
        .option('to', {
        describe: 'Use the provided versions for packages instead of the ones calculated by the migrator (e.g., --to="@nx/react@16.0.0,@nx/js@16.0.0")',
        type: 'string',
    })
        .option('createCommits', {
        describe: 'Automatically create a git commit after each migration runs',
        type: 'boolean',
        alias: ['C'],
        default: false,
    })
        .option('commitPrefix', {
        describe: 'Commit prefix to apply to the commit for each migration, when --create-commits is enabled',
        type: 'string',
        default: defaultCommitPrefix,
    })
        .option('interactive', {
        describe: 'Enable prompts to confirm whether to collect optional package updates and migrations',
        type: 'boolean',
        default: false,
    })
        .option('excludeAppliedMigrations', {
        describe: 'Exclude migrations that should have been applied on previous updates. To be used with --from',
        type: 'boolean',
        default: false,
    })
        .check(({ createCommits, commitPrefix, from, excludeAppliedMigrations }) => {
        if (!createCommits && commitPrefix !== defaultCommitPrefix) {
            throw new Error('Error: Providing a custom commit prefix requires --create-commits to be enabled');
        }
        if (excludeAppliedMigrations && !from) {
            throw new Error('Error: Excluding migrations that should have been previously applied requires --from to be set');
        }
        return true;
    });
}
function runMigration() {
    const runLocalMigrate = () => {
        (0, child_process_1.runNxSync)(`_migrate ${process.argv.slice(3).join(' ')}`, {
            stdio: ['inherit', 'inherit', 'inherit'],
        });
    };
    if (process.env.NX_MIGRATE_USE_LOCAL === undefined) {
        const p = nxCliPath();
        if (p === null) {
            runLocalMigrate();
        }
        else {
            // ensure local registry from process is not interfering with the install
            // when we start the process from temp folder the local registry would override the custom registry
            if (process.env.npm_config_registry &&
                process.env.npm_config_registry.match(/^https:\/\/registry\.(npmjs\.org|yarnpkg\.com)/)) {
                delete process.env.npm_config_registry;
            }
            (0, child_process_2.execSync)(`${p} _migrate ${process.argv.slice(3).join(' ')}`, {
                stdio: ['inherit', 'inherit', 'inherit'],
            });
        }
    }
    else {
        runLocalMigrate();
    }
}
function nxCliPath() {
    const version = process.env.NX_MIGRATE_CLI_VERSION || 'latest';
    try {
        const packageManager = (0, package_manager_1.detectPackageManager)();
        const pmc = (0, package_manager_1.getPackageManagerCommand)(packageManager);
        const { dirSync } = require('tmp');
        const tmpDir = dirSync().name;
        (0, fileutils_1.writeJsonFile)(path.join(tmpDir, 'package.json'), {
            dependencies: {
                nx: version,
            },
            license: 'MIT',
        });
        (0, package_manager_1.copyPackageManagerConfigurationFiles)(workspace_root_1.workspaceRoot, tmpDir);
        if (pmc.preInstall) {
            // ensure package.json and repo in tmp folder is set to a proper package manager state
            (0, child_process_2.execSync)(pmc.preInstall, {
                cwd: tmpDir,
                stdio: ['ignore', 'ignore', 'ignore'],
            });
            // if it's berry ensure we set the node_linker to node-modules
            if (packageManager === 'yarn' && pmc.ciInstall.includes('immutable')) {
                (0, child_process_2.execSync)('yarn config set nodeLinker node-modules', {
                    cwd: tmpDir,
                    stdio: ['ignore', 'ignore', 'ignore'],
                });
            }
        }
        (0, child_process_2.execSync)(pmc.install, {
            cwd: tmpDir,
            stdio: ['ignore', 'ignore', 'ignore'],
        });
        // Set NODE_PATH so that these modules can be used for module resolution
        addToNodePath(path.join(tmpDir, 'node_modules'));
        addToNodePath(path.join(workspace_root_1.workspaceRoot, 'node_modules'));
        return path.join(tmpDir, `node_modules`, '.bin', 'nx');
    }
    catch (e) {
        console.error(`Failed to install the ${version} version of the migration script. Using the current version.`);
        if (process.env.NX_VERBOSE_LOGGING) {
            console.error(e);
        }
        return null;
    }
}
function addToNodePath(dir) {
    // NODE_PATH is a delimited list of paths.
    // The delimiter is different for windows.
    const delimiter = require('os').platform() === 'win32' ? ';' : ':';
    const paths = process.env.NODE_PATH
        ? process.env.NODE_PATH.split(delimiter)
        : [];
    // Add the tmp path
    paths.push(dir);
    // Update the env variable.
    process.env.NODE_PATH = paths.join(delimiter);
}
