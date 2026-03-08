import { Reference } from './git';
import { ReleaseVersion } from './shared';
export type RepoSlug = `${string}/${string}`;
export interface GithubRequestConfig {
    repo: string;
    token: string | null;
}
export interface GithubRelease {
    id?: string;
    tag_name: string;
    target_commitish?: string;
    name?: string;
    body?: string;
    draft?: boolean;
    prerelease?: boolean;
}
export declare function getGitHubRepoSlug(remoteName?: string): RepoSlug;
export declare function createOrUpdateGithubRelease(releaseVersion: ReleaseVersion, changelogContents: string, latestCommit: string, { dryRun }: {
    dryRun: boolean;
}): Promise<void>;
export declare function resolveGithubToken(): Promise<string | null>;
export declare function getGithubReleaseByTag(config: GithubRequestConfig, tag: string): Promise<GithubRelease>;
export declare function formatReferences(references: Reference[], repoSlug: RepoSlug): string;
