import { NxReleaseChangelogConfiguration } from '../../config/nx-json';
import { ChangelogOptions } from './command-object';
import { Reference } from './utils/git';
import { ReleaseVersion } from './utils/shared';
export interface NxReleaseChangelogResult {
    workspaceChangelog?: {
        releaseVersion: ReleaseVersion;
        contents: string;
    };
    projectChangelogs?: {
        [projectName: string]: {
            releaseVersion: ReleaseVersion;
            contents: string;
        };
    };
}
export interface ChangelogChange {
    type: string;
    scope: string;
    description: string;
    affectedProjects: string[] | '*';
    body?: string;
    isBreaking?: boolean;
    githubReferences?: Reference[];
    author?: {
        name: string;
        email: string;
    };
    shortHash?: string;
    revertedHashes?: string[];
}
export declare const releaseChangelogCLIHandler: (args: ChangelogOptions) => Promise<number>;
/**
 * NOTE: This function is also exported for programmatic usage and forms part of the public API
 * of Nx. We intentionally do not wrap the implementation with handleErrors because users need
 * to have control over their own error handling when using the API.
 */
export declare function releaseChangelog(args: ChangelogOptions): Promise<NxReleaseChangelogResult>;
export declare function shouldCreateGitHubRelease(changelogConfig: NxReleaseChangelogConfiguration | false | undefined, createReleaseArg?: ChangelogOptions['createRelease'] | undefined): boolean;
