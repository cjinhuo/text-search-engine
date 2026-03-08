"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = require("semver");
const github_1 = require("../../src/command-line/release/utils/github");
// axios types and values don't seem to match
const _axios = require("axios");
const axios = _axios;
/**
 * The default ChangelogRenderer implementation that nx exports for the common case of generating markdown
 * from the given commits and other metadata.
 */
const defaultChangelogRenderer = async ({ projectGraph, changes, releaseVersion, project, entryWhenNoChanges, changelogRenderOptions, dependencyBumps, repoSlug, conventionalCommitsConfig, }) => {
    const changeTypes = conventionalCommitsConfig.types;
    const markdownLines = [];
    const breakingChanges = [];
    // If the current range of changes contains both a commit and its revert, we strip them both from the final list. Changes from version plans are unaffected, as they have no hashes.
    for (const change of changes) {
        if (change.type === 'revert' && change.revertedHashes) {
            for (const revertedHash of change.revertedHashes) {
                const revertedCommit = changes.find((c) => c.shortHash && revertedHash.startsWith(c.shortHash));
                if (revertedCommit) {
                    changes.splice(changes.indexOf(revertedCommit), 1);
                    changes.splice(changes.indexOf(change), 1);
                }
            }
        }
    }
    let relevantChanges = changes;
    // workspace root level changelog
    if (project === null) {
        // No changes for the workspace
        if (relevantChanges.length === 0) {
            if (dependencyBumps?.length) {
                applyAdditionalDependencyBumps({
                    markdownLines,
                    dependencyBumps,
                    releaseVersion,
                    changelogRenderOptions,
                });
            }
            else if (entryWhenNoChanges) {
                markdownLines.push('', `${createVersionTitle(releaseVersion, changelogRenderOptions)}\n\n${entryWhenNoChanges}`, '');
            }
            return markdownLines.join('\n').trim();
        }
        const typeGroups = groupBy(relevantChanges, 'type');
        markdownLines.push('', createVersionTitle(releaseVersion, changelogRenderOptions), '');
        for (const type of Object.keys(changeTypes)) {
            const group = typeGroups[type];
            if (!group || group.length === 0) {
                continue;
            }
            markdownLines.push('', '### ' + changeTypes[type].changelog.title, '');
            /**
             * In order to make the final changelog most readable, we organize changes as follows:
             * - By scope, where scopes are in alphabetical order (changes with no scope are listed first)
             * - Within a particular scope grouping, we list changes in chronological order
             */
            const changesInChronologicalOrder = group.reverse();
            const changesGroupedByScope = groupBy(changesInChronologicalOrder, 'scope');
            const scopesSortedAlphabetically = Object.keys(changesGroupedByScope).sort();
            for (const scope of scopesSortedAlphabetically) {
                const changes = changesGroupedByScope[scope];
                for (const change of changes) {
                    const line = formatChange(change, changelogRenderOptions, repoSlug);
                    markdownLines.push(line);
                    if (change.isBreaking) {
                        const breakingChangeExplanation = extractBreakingChangeExplanation(change.body);
                        breakingChanges.push(breakingChangeExplanation
                            ? `- ${change.scope ? `**${change.scope.trim()}:** ` : ''}${breakingChangeExplanation}`
                            : line);
                    }
                }
            }
        }
    }
    else {
        // project level changelog
        relevantChanges = relevantChanges.filter((c) => c.affectedProjects &&
            (c.affectedProjects === '*' || c.affectedProjects.includes(project)));
        // Generating for a named project, but that project has no relevant changes in the current set of commits, exit early
        if (relevantChanges.length === 0) {
            if (dependencyBumps?.length) {
                applyAdditionalDependencyBumps({
                    markdownLines,
                    dependencyBumps,
                    releaseVersion,
                    changelogRenderOptions,
                });
            }
            else if (entryWhenNoChanges) {
                markdownLines.push('', `${createVersionTitle(releaseVersion, changelogRenderOptions)}\n\n${entryWhenNoChanges}`, '');
            }
            return markdownLines.join('\n').trim();
        }
        markdownLines.push('', createVersionTitle(releaseVersion, changelogRenderOptions), '');
        const typeGroups = groupBy(
        // Sort the relevant changes to have the unscoped changes first, before grouping by type
        relevantChanges.sort((a, b) => (b.scope ? 1 : 0) - (a.scope ? 1 : 0)), 'type');
        for (const type of Object.keys(changeTypes)) {
            const group = typeGroups[type];
            if (!group || group.length === 0) {
                continue;
            }
            markdownLines.push('', `### ${changeTypes[type].changelog.title}`, '');
            const changesInChronologicalOrder = group.reverse();
            for (const change of changesInChronologicalOrder) {
                const line = formatChange(change, changelogRenderOptions, repoSlug);
                markdownLines.push(line + '\n');
                if (change.isBreaking) {
                    const breakingChangeExplanation = extractBreakingChangeExplanation(change.body);
                    breakingChanges.push(breakingChangeExplanation
                        ? `- ${change.scope ? `**${change.scope.trim()}:** ` : ''}${breakingChangeExplanation}`
                        : line);
                }
            }
        }
    }
    if (breakingChanges.length > 0) {
        markdownLines.push('', '#### ⚠️  Breaking Changes', '', ...breakingChanges);
    }
    if (dependencyBumps?.length) {
        applyAdditionalDependencyBumps({
            markdownLines,
            dependencyBumps,
            releaseVersion,
            changelogRenderOptions,
        });
    }
    if (changelogRenderOptions.authors) {
        const _authors = new Map();
        for (const change of relevantChanges) {
            if (!change.author) {
                continue;
            }
            const name = formatName(change.author.name);
            if (!name || name.includes('[bot]')) {
                continue;
            }
            if (_authors.has(name)) {
                const entry = _authors.get(name);
                entry.email.add(change.author.email);
            }
            else {
                _authors.set(name, { email: new Set([change.author.email]) });
            }
        }
        // Try to map authors to github usernames
        if (repoSlug && changelogRenderOptions.mapAuthorsToGitHubUsernames) {
            await Promise.all([..._authors.keys()].map(async (authorName) => {
                const meta = _authors.get(authorName);
                for (const email of meta.email) {
                    // For these pseudo-anonymized emails we can just extract the Github username from before the @
                    // It could either be in the format: username@ or github_id+username@
                    if (email.endsWith('@users.noreply.github.com')) {
                        const match = email.match(/^(\d+\+)?([^@]+)@users\.noreply\.github\.com$/);
                        if (match && match[2]) {
                            meta.github = match[2];
                            break;
                        }
                    }
                    // Look up any other emails against the ungh.cc API
                    const { data } = await axios
                        .get(`https://ungh.cc/users/find/${email}`)
                        .catch(() => ({ data: { user: null } }));
                    if (data?.user) {
                        meta.github = data.user.username;
                        break;
                    }
                }
            }));
        }
        const authors = [..._authors.entries()].map((e) => ({
            name: e[0],
            ...e[1],
        }));
        if (authors.length > 0) {
            markdownLines.push('', '### ' + '❤️  Thank You', '', ...authors
                // Sort the contributors by name
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((i) => {
                // Tag the author's Github username if we were able to resolve it so that Github adds them as a contributor
                const github = i.github ? ` @${i.github}` : '';
                return `- ${i.name}${github}`;
            }));
        }
    }
    return markdownLines.join('\n').trim();
};
exports.default = defaultChangelogRenderer;
function applyAdditionalDependencyBumps({ markdownLines, dependencyBumps, releaseVersion, changelogRenderOptions, }) {
    if (markdownLines.length === 0) {
        markdownLines.push('', `${createVersionTitle(releaseVersion, changelogRenderOptions)}\n`, '');
    }
    else {
        markdownLines.push('');
    }
    markdownLines.push('### 🧱 Updated Dependencies\n');
    dependencyBumps.forEach(({ dependencyName, newVersion }) => {
        markdownLines.push(`- Updated ${dependencyName} to ${newVersion}`);
    });
    markdownLines.push('');
}
function formatName(name = '') {
    return name
        .split(' ')
        .map((p) => p.trim())
        .join(' ');
}
function groupBy(items, key) {
    const groups = {};
    for (const item of items) {
        groups[item[key]] = groups[item[key]] || [];
        groups[item[key]].push(item);
    }
    return groups;
}
function formatChange(change, changelogRenderOptions, repoSlug) {
    let changeLine = '- ' +
        (change.isBreaking ? '⚠️  ' : '') +
        (change.scope ? `**${change.scope.trim()}:** ` : '') +
        change.description;
    if (repoSlug && changelogRenderOptions.commitReferences) {
        changeLine += (0, github_1.formatReferences)(change.githubReferences, repoSlug);
    }
    return changeLine;
}
/**
 * It is common to add further information about a breaking change in the commit body,
 * and it is naturally that information that should be included in the BREAKING CHANGES
 * section of changelog, rather than repeating the commit title/description.
 */
function extractBreakingChangeExplanation(message) {
    if (!message) {
        return null;
    }
    const breakingChangeIdentifier = 'BREAKING CHANGE:';
    const startIndex = message.indexOf(breakingChangeIdentifier);
    if (startIndex === -1) {
        // "BREAKING CHANGE:" not found in the message
        return null;
    }
    const startOfBreakingChange = startIndex + breakingChangeIdentifier.length;
    const endOfBreakingChange = message.indexOf('\n', startOfBreakingChange);
    if (endOfBreakingChange === -1) {
        // No newline character found, extract till the end of the message
        return message.substring(startOfBreakingChange).trim();
    }
    // Extract and return the breaking change message
    return message.substring(startOfBreakingChange, endOfBreakingChange).trim();
}
function createVersionTitle(version, changelogRenderOptions) {
    // Normalize by removing any leading `v` during comparison
    const isMajorVersion = `${(0, semver_1.major)(version)}.0.0` === version.replace(/^v/, '');
    let maybeDateStr = '';
    if (changelogRenderOptions.versionTitleDate) {
        // YYYY-MM-DD
        const dateStr = new Date().toISOString().slice(0, 10);
        maybeDateStr = ` (${dateStr})`;
    }
    if (isMajorVersion) {
        return `# ${version}${maybeDateStr}`;
    }
    return `## ${version}${maybeDateStr}`;
}
