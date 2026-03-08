export type PackageManager = 'yarn' | 'pnpm' | 'npm' | 'bun';
export interface PackageManagerCommands {
    preInstall?: string;
    install: string;
    ciInstall: string;
    updateLockFile: string;
    add: string;
    addDev: string;
    rm: string;
    exec: string;
    dlx: string;
    list: string;
    run: (script: string, args?: string) => string;
    getRegistryUrl?: string;
}
/**
 * Detects which package manager is used in the workspace based on the lock file.
 */
export declare function detectPackageManager(dir?: string): PackageManager;
/**
 * Returns true if the workspace is using npm workspaces, yarn workspaces, or pnpm workspaces.
 * @param packageManager The package manager to use. If not provided, it will be detected based on the lock file.
 * @param root The directory the commands will be ran inside of. Defaults to the current workspace's root.
 */
export declare function isWorkspacesEnabled(packageManager?: PackageManager, root?: string): boolean;
/**
 * Returns commands for the package manager used in the workspace.
 * By default, the package manager is derived based on the lock file,
 * but it can also be passed in explicitly.
 *
 * Example:
 *
 * ```javascript
 * execSync(`${getPackageManagerCommand().addDev} my-dev-package`);
 * ```
 *
 * @param packageManager The package manager to use. If not provided, it will be detected based on the lock file.
 * @param root The directory the commands will be ran inside of. Defaults to the current workspace's root.
 */
export declare function getPackageManagerCommand(packageManager?: PackageManager, root?: string): PackageManagerCommands;
/**
 * Returns the version of the package manager used in the workspace.
 * By default, the package manager is derived based on the lock file,
 * but it can also be passed in explicitly.
 */
export declare function getPackageManagerVersion(packageManager?: PackageManager, cwd?: string): string;
/**
 * Checks for a project level npmrc file by crawling up the file tree until
 * hitting a package.json file, as this is how npm finds them as well.
 */
export declare function findFileInPackageJsonDirectory(file: string, directory?: string): string | null;
/**
 * We copy yarnrc.yml to the temporary directory to ensure things like the specified
 * package registry are still used. However, there are a few relative paths that can
 * cause issues, so we modify them to fit the new directory.
 *
 * Exported for testing - not meant to be used outside of this file.
 *
 * @param contents The string contents of the yarnrc.yml file
 * @returns Updated string contents of the yarnrc.yml file
 */
export declare function modifyYarnRcYmlToFitNewDirectory(contents: string): string;
/**
 * We copy .yarnrc to the temporary directory to ensure things like the specified
 * package registry are still used. However, there are a few relative paths that can
 * cause issues, so we modify them to fit the new directory.
 *
 * Exported for testing - not meant to be used outside of this file.
 *
 * @param contents The string contents of the yarnrc.yml file
 * @returns Updated string contents of the yarnrc.yml file
 */
export declare function modifyYarnRcToFitNewDirectory(contents: string): string;
export declare function copyPackageManagerConfigurationFiles(root: string, destination: string): void;
/**
 * Creates a temporary directory where you can run package manager commands safely.
 *
 * For cases where you'd want to install packages that require an `.npmrc` set up,
 * this function looks up for the nearest `.npmrc` (if exists) and copies it over to the
 * temp directory.
 */
export declare function createTempNpmDirectory(): {
    dir: string;
    cleanup: () => Promise<void>;
};
/**
 * Returns the resolved version for a given package and version tag using the
 * NPM registry (when using Yarn it will fall back to NPM to fetch the info).
 */
export declare function resolvePackageVersionUsingRegistry(packageName: string, version: string): Promise<string>;
/**
 * Return the resolved version for a given package and version tag using by
 * installing it in a temporary directory and fetching the version from the
 * package.json.
 */
export declare function resolvePackageVersionUsingInstallation(packageName: string, version: string): Promise<string>;
export declare function packageRegistryView(pkg: string, version: string, args: string): Promise<string>;
export declare function packageRegistryPack(cwd: string, pkg: string, version: string): Promise<{
    tarballPath: string;
}>;
