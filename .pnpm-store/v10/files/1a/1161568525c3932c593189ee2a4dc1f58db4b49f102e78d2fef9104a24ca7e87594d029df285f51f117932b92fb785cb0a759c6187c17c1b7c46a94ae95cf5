import { ChangelogChange } from '../../src/command-line/release/changelog';
import { NxReleaseConfig } from '../../src/command-line/release/config/config';
import { GitCommit } from '../../src/command-line/release/utils/git';
import { RepoSlug } from '../../src/command-line/release/utils/github';
import type { ProjectGraph } from '../../src/config/project-graph';
/**
 * The ChangelogRenderOptions are specific to each ChangelogRenderer implementation, and are taken
 * from the user's nx.json configuration and passed as is into the ChangelogRenderer function.
 */
export type ChangelogRenderOptions = Record<string, unknown>;
/**
 * When versioning projects independently and enabling `"updateDependents": "always"`, there could
 * be additional dependency bump information that is not captured in the commit data, but that nevertheless
 * should be included in the rendered changelog.
 */
export type DependencyBump = {
    dependencyName: string;
    newVersion: string;
};
/**
 * A ChangelogRenderer function takes in the extracted commits and other relevant metadata
 * and returns a string, or a Promise of a string of changelog contents (usually markdown).
 *
 * @param {Object} config The configuration object for the ChangelogRenderer
 * @param {ProjectGraph} config.projectGraph The project graph for the workspace
 * @param {GitCommit[]} config.commits DEPRECATED [Use 'config.changes' instead] - The collection of extracted commits to generate a changelog for
 * @param {ChangelogChange[]} config.changes The collection of changes to show in the changelog
 * @param {string} config.releaseVersion The version that is being released
 * @param {string | null} config.project The name of specific project to generate a changelog for, or `null` if the overall workspace changelog
 * @param {string | false} config.entryWhenNoChanges The (already interpolated) string to use as the changelog entry when there are no changes, or `false` if no entry should be generated
 * @param {ChangelogRenderOptions} config.changelogRenderOptions The options specific to the ChangelogRenderer implementation
 * @param {DependencyBump[]} config.dependencyBumps Optional list of additional dependency bumps that occurred as part of the release, outside of the commit data
 */
export type ChangelogRenderer = (config: {
    projectGraph: ProjectGraph;
    commits?: GitCommit[];
    changes?: ChangelogChange[];
    releaseVersion: string;
    project: string | null;
    entryWhenNoChanges: string | false;
    changelogRenderOptions: DefaultChangelogRenderOptions;
    dependencyBumps?: DependencyBump[];
    repoSlug?: RepoSlug;
    conventionalCommitsConfig: NxReleaseConfig['conventionalCommits'];
}) => Promise<string> | string;
/**
 * The specific options available to the default implementation of the ChangelogRenderer that nx exports
 * for the common case.
 */
export interface DefaultChangelogRenderOptions extends ChangelogRenderOptions {
    /**
     * Whether or not the commit authors should be added to the bottom of the changelog in a "Thank You"
     * section. Defaults to true.
     */
    authors?: boolean;
    /**
     * If authors is enabled, controls whether or not to try to map the authors to their GitHub usernames
     * using https://ungh.cc (from https://github.com/unjs/ungh) and the email addresses found in the commits.
     * Defaults to true.
     */
    mapAuthorsToGitHubUsernames?: boolean;
    /**
     * Whether or not the commit references (such as commit and/or PR links) should be included in the changelog.
     * Defaults to true.
     */
    commitReferences?: boolean;
    /**
     * Whether or not to include the date in the version title. It can be set to false to disable it, or true to enable
     * with the default of (YYYY-MM-DD). Defaults to true.
     */
    versionTitleDate?: boolean;
}
/**
 * The default ChangelogRenderer implementation that nx exports for the common case of generating markdown
 * from the given commits and other metadata.
 */
declare const defaultChangelogRenderer: ChangelogRenderer;
export default defaultChangelogRenderer;
