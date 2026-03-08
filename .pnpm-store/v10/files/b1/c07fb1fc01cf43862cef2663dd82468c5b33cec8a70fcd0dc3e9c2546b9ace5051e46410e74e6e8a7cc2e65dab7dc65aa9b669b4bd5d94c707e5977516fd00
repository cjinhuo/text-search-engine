import { ProjectGraph, ProjectGraphProjectNode } from '../../config/project-graph';
import { VersionOptions } from './command-object';
import { NxReleaseConfig } from './config/config';
import { ReleaseGroupWithName } from './config/filter-release-groups';
import { VersionData } from './utils/shared';
export { deriveNewSemverVersion } from './utils/semver';
export type { ReleaseVersionGeneratorResult, VersionData, } from './utils/shared';
export declare const validReleaseVersionPrefixes: readonly ["auto", "", "~", "^", "="];
export interface ReleaseVersionGeneratorSchema {
    projects: ProjectGraphProjectNode[];
    releaseGroup: ReleaseGroupWithName;
    projectGraph: ProjectGraph;
    specifier?: string;
    specifierSource?: 'prompt' | 'conventional-commits' | 'version-plans';
    preid?: string;
    packageRoot?: string;
    currentVersionResolver?: 'registry' | 'disk' | 'git-tag';
    currentVersionResolverMetadata?: Record<string, unknown>;
    fallbackCurrentVersionResolver?: 'disk';
    firstRelease?: boolean;
    versionPrefix?: (typeof validReleaseVersionPrefixes)[number];
    skipLockFileUpdate?: boolean;
    installArgs?: string;
    installIgnoreScripts?: boolean;
    conventionalCommitsConfig?: NxReleaseConfig['conventionalCommits'];
    deleteVersionPlans?: boolean;
    /**
     * 'auto' allows users to opt into dependents being updated (a patch version bump) when a dependency is versioned.
     * This is only applicable to independently released projects.
     */
    updateDependents?: 'never' | 'auto';
}
export interface NxReleaseVersionResult {
    /**
     * In one specific (and very common) case, an overall workspace version is relevant, for example when there is
     * only a single release group in which all projects have a fixed relationship to each other. In this case, the
     * overall workspace version is the same as the version of the release group (and every project within it). This
     * version could be a `string`, or it could be `null` if using conventional commits and no changes were detected.
     *
     * In all other cases (independent versioning, multiple release groups etc), the overall workspace version is
     * not applicable and will be `undefined` here. If a user attempts to use this value later when it is `undefined`
     * (for example in the changelog command), we will throw an appropriate error.
     */
    workspaceVersion: (string | null) | undefined;
    projectsVersionData: VersionData;
}
export declare const releaseVersionCLIHandler: (args: VersionOptions) => Promise<number>;
/**
 * NOTE: This function is also exported for programmatic usage and forms part of the public API
 * of Nx. We intentionally do not wrap the implementation with handleErrors because users need
 * to have control over their own error handling when using the API.
 */
export declare function releaseVersion(args: VersionOptions): Promise<NxReleaseVersionResult>;
