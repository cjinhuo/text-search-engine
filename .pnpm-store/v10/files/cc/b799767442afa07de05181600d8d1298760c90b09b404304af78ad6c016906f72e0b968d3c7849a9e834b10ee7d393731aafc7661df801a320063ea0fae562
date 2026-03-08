"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGitHubRepoSlug = getGitHubRepoSlug;
exports.createOrUpdateGithubRelease = createOrUpdateGithubRelease;
exports.resolveGithubToken = resolveGithubToken;
exports.getGithubReleaseByTag = getGithubReleaseByTag;
exports.formatReferences = formatReferences;
const chalk = require("chalk");
const enquirer_1 = require("enquirer");
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const node_os_1 = require("node:os");
const output_1 = require("../../../utils/output");
const path_1 = require("../../../utils/path");
const print_changes_1 = require("./print-changes");
const shared_1 = require("./shared");
// axios types and values don't seem to match
const _axios = require("axios");
const axios = _axios;
function getGitHubRepoSlug(remoteName = 'origin') {
    try {
        const remoteUrl = (0, node_child_process_1.execSync)(`git remote get-url ${remoteName}`, {
            encoding: 'utf8',
            stdio: 'pipe',
        }).trim();
        // Extract the 'user/repo' part from the URL
        const regex = /github\.com[/:]([\w-]+\/[\w-]+)/;
        const match = remoteUrl.match(regex);
        if (match && match[1]) {
            return match[1];
        }
        else {
            throw new Error(`Could not extract "user/repo" data from the resolved remote URL: ${remoteUrl}`);
        }
    }
    catch (error) {
        return null;
    }
}
async function createOrUpdateGithubRelease(releaseVersion, changelogContents, latestCommit, { dryRun }) {
    const githubRepoSlug = getGitHubRepoSlug();
    if (!githubRepoSlug) {
        output_1.output.error({
            title: `Unable to create a GitHub release because the GitHub repo slug could not be determined.`,
            bodyLines: [
                `Please ensure you have a valid GitHub remote configured. You can run \`git remote -v\` to list your current remotes.`,
            ],
        });
        process.exit(1);
    }
    const token = await resolveGithubToken();
    const githubRequestConfig = {
        repo: githubRepoSlug,
        token,
    };
    let existingGithubReleaseForVersion;
    try {
        existingGithubReleaseForVersion = await getGithubReleaseByTag(githubRequestConfig, releaseVersion.gitTag);
    }
    catch (err) {
        if (err.response?.status === 401) {
            output_1.output.error({
                title: `Unable to resolve data via the GitHub API. You can use any of the following options to resolve this:`,
                bodyLines: [
                    '- Set the `GITHUB_TOKEN` or `GH_TOKEN` environment variable to a valid GitHub token with `repo` scope',
                    '- Have an active session via the official gh CLI tool (https://cli.github.com) in your current terminal',
                ],
            });
            process.exit(1);
        }
        if (err.response?.status === 404) {
            // No existing release found, this is fine
        }
        else {
            // Rethrow unknown errors for now
            throw err;
        }
    }
    const logTitle = `https://github.com/${githubRepoSlug}/releases/tag/${releaseVersion.gitTag}`;
    if (existingGithubReleaseForVersion) {
        console.error(`${chalk.white('UPDATE')} ${logTitle}${dryRun ? chalk.keyword('orange')(' [dry-run]') : ''}`);
    }
    else {
        console.error(`${chalk.green('CREATE')} ${logTitle}${dryRun ? chalk.keyword('orange')(' [dry-run]') : ''}`);
    }
    console.log('');
    (0, print_changes_1.printDiff)(existingGithubReleaseForVersion ? existingGithubReleaseForVersion.body : '', changelogContents, 3, shared_1.noDiffInChangelogMessage);
    if (!dryRun) {
        await createOrUpdateGithubReleaseInternal(githubRequestConfig, {
            version: releaseVersion.gitTag,
            prerelease: releaseVersion.isPrerelease,
            body: changelogContents,
            commit: latestCommit,
        }, existingGithubReleaseForVersion);
    }
}
async function createOrUpdateGithubReleaseInternal(githubRequestConfig, release, existingGithubReleaseForVersion) {
    const result = await syncGithubRelease(githubRequestConfig, release, existingGithubReleaseForVersion);
    /**
     * If something went wrong POSTing to Github we can still pre-populate the web form on github.com
     * to allow the user to manually complete the release if they so choose.
     */
    if (result.status === 'manual') {
        if (result.error) {
            process.exitCode = 1;
            if (result.error.response?.data) {
                // There's a nicely formatted error from GitHub we can display to the user
                output_1.output.error({
                    title: `A GitHub API Error occurred when creating/updating the release`,
                    bodyLines: [
                        `GitHub Error: ${JSON.stringify(result.error.response.data)}`,
                        `---`,
                        `Request Data:`,
                        `Repo: ${githubRequestConfig.repo}`,
                        `Token: ${githubRequestConfig.token}`,
                        `Body: ${JSON.stringify(result.requestData)}`,
                    ],
                });
            }
            else {
                console.log(result.error);
                console.error(`An unknown error occurred while trying to create a release on GitHub, please report this on https://github.com/nrwl/nx (NOTE: make sure to redact your GitHub token from the error message!)`);
            }
        }
        const shouldContinueInGitHub = await promptForContinueInGitHub();
        if (!shouldContinueInGitHub) {
            return;
        }
        const open = require('open');
        await open(result.url)
            .then(() => {
            console.info(`\nFollow up in the browser to manually create the release:\n\n` +
                chalk.underline(chalk.cyan(result.url)) +
                `\n`);
        })
            .catch(() => {
            console.info(`Open this link to manually create a release: \n` +
                chalk.underline(chalk.cyan(result.url)) +
                '\n');
        });
    }
    /**
     * If something went wrong POSTing to Github we can still pre-populate the web form on github.com
     * to allow the user to manually complete the release.
     */
    if (result.status === 'manual') {
        if (result.error) {
            console.error(result.error);
            process.exitCode = 1;
        }
        const open = require('open');
        await open(result.url)
            .then(() => {
            console.info(`Follow up in the browser to manually create the release.`);
        })
            .catch(() => {
            console.info(`Open this link to manually create a release: \n` +
                chalk.underline(chalk.cyan(result.url)) +
                '\n');
        });
    }
}
async function promptForContinueInGitHub() {
    try {
        const reply = await (0, enquirer_1.prompt)([
            {
                name: 'open',
                message: 'Do you want to finish creating the release manually in your browser?',
                type: 'autocomplete',
                choices: [
                    {
                        name: 'Yes',
                        hint: 'It will pre-populate the form for you',
                    },
                    {
                        name: 'No',
                    },
                ],
                initial: 0,
            },
        ]);
        return reply.open === 'Yes';
    }
    catch (e) {
        // Handle the case where the user exits the prompt with ctrl+c
        process.exit(1);
    }
}
async function syncGithubRelease(githubRequestConfig, release, existingGithubReleaseForVersion) {
    const ghRelease = {
        tag_name: release.version,
        name: release.version,
        body: release.body,
        prerelease: release.prerelease,
    };
    try {
        const newGhRelease = await (existingGithubReleaseForVersion
            ? updateGithubRelease(githubRequestConfig, existingGithubReleaseForVersion.id, ghRelease)
            : createGithubRelease(githubRequestConfig, {
                ...ghRelease,
                target_commitish: release.commit,
            }));
        return {
            status: existingGithubReleaseForVersion ? 'updated' : 'created',
            id: newGhRelease.id,
            url: newGhRelease.html_url,
        };
    }
    catch (error) {
        return {
            status: 'manual',
            error,
            url: githubNewReleaseURL(githubRequestConfig, release),
            requestData: ghRelease,
        };
    }
}
async function resolveGithubToken() {
    // Try and resolve from the environment
    const tokenFromEnv = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    if (tokenFromEnv) {
        return tokenFromEnv;
    }
    // Try and resolve from gh CLI installation
    const ghCLIPath = (0, path_1.joinPathFragments)(process.env.XDG_CONFIG_HOME || (0, path_1.joinPathFragments)((0, node_os_1.homedir)(), '.config'), 'gh', 'hosts.yml');
    if ((0, node_fs_1.existsSync)(ghCLIPath)) {
        const yamlContents = await node_fs_1.promises.readFile(ghCLIPath, 'utf8');
        const { load } = require('@zkochan/js-yaml');
        const ghCLIConfig = load(yamlContents);
        if (ghCLIConfig['github.com']) {
            // Web based session (the token is already embedded in the config)
            if (ghCLIConfig['github.com'].oauth_token) {
                return ghCLIConfig['github.com'].oauth_token;
            }
            // SSH based session (we need to dynamically resolve a token using the CLI)
            if (ghCLIConfig['github.com'].user &&
                ghCLIConfig['github.com'].git_protocol === 'ssh') {
                return (0, node_child_process_1.execSync)(`gh auth token`, {
                    encoding: 'utf8',
                    stdio: 'pipe',
                }).trim();
            }
        }
    }
    return null;
}
async function getGithubReleaseByTag(config, tag) {
    return await makeGithubRequest(config, `/repos/${config.repo}/releases/tags/${tag}`, {});
}
async function makeGithubRequest(config, url, opts = {}) {
    return (await axios(url, {
        ...opts,
        baseURL: 'https://api.github.com',
        headers: {
            ...opts.headers,
            Authorization: config.token ? `Bearer ${config.token}` : undefined,
        },
    })).data;
}
async function createGithubRelease(config, body) {
    return await makeGithubRequest(config, `/repos/${config.repo}/releases`, {
        method: 'POST',
        data: body,
    });
}
async function updateGithubRelease(config, id, body) {
    return await makeGithubRequest(config, `/repos/${config.repo}/releases/${id}`, {
        method: 'PATCH',
        data: body,
    });
}
function githubNewReleaseURL(config, release) {
    return `https://github.com/${config.repo}/releases/new?tag=${release.version}&title=${release.version}&body=${encodeURIComponent(release.body)}`;
}
const providerToRefSpec = {
    github: { 'pull-request': 'pull', hash: 'commit', issue: 'issues' },
};
function formatReference(ref, repoSlug) {
    const refSpec = providerToRefSpec['github'];
    return `[${ref.value}](https://github.com/${repoSlug}/${refSpec[ref.type]}/${ref.value.replace(/^#/, '')})`;
}
function formatReferences(references, repoSlug) {
    const pr = references.filter((ref) => ref.type === 'pull-request');
    const issue = references.filter((ref) => ref.type === 'issue');
    if (pr.length > 0 || issue.length > 0) {
        return (' (' +
            [...pr, ...issue]
                .map((ref) => formatReference(ref, repoSlug))
                .join(', ') +
            ')');
    }
    if (references.length > 0) {
        return ' (' + formatReference(references[0], repoSlug) + ')';
    }
    return '';
}
