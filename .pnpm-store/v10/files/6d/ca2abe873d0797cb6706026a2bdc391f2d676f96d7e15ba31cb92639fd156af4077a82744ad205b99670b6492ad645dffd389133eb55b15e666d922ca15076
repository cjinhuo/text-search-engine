"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGithubSlugOrNull = getGithubSlugOrNull;
exports.extractUserAndRepoFromGitHubUrl = extractUserAndRepoFromGitHubUrl;
exports.commitChanges = commitChanges;
exports.getLatestCommitSha = getLatestCommitSha;
const child_process_1 = require("child_process");
const devkit_exports_1 = require("../devkit-exports");
function getGithubSlugOrNull() {
    try {
        const gitRemote = (0, child_process_1.execSync)('git remote -v', {
            stdio: 'pipe',
        }).toString();
        // If there are no remotes, we default to github
        if (!gitRemote || gitRemote.length === 0) {
            return 'github';
        }
        return extractUserAndRepoFromGitHubUrl(gitRemote);
    }
    catch (e) {
        // Probably git is not set up, so we default to github
        return 'github';
    }
}
function extractUserAndRepoFromGitHubUrl(gitRemotes) {
    const regex = /^\s*(\w+)\s+(git@github\.com:|https:\/\/github\.com\/)([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\.git/gm;
    const remotesPriority = ['origin', 'upstream', 'base'];
    const foundRemotes = {};
    let firstGitHubUrl = null;
    let match;
    while ((match = regex.exec(gitRemotes)) !== null) {
        const remoteName = match[1];
        const url = match[2] + match[3] + '/' + match[4] + '.git';
        foundRemotes[remoteName] = url;
        if (!firstGitHubUrl) {
            firstGitHubUrl = url;
        }
    }
    for (const remote of remotesPriority) {
        if (foundRemotes[remote]) {
            return parseGitHubUrl(foundRemotes[remote]);
        }
    }
    return firstGitHubUrl ? parseGitHubUrl(firstGitHubUrl) : null;
}
function parseGitHubUrl(url) {
    const sshPattern = /git@github\.com:([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\.git/;
    const httpsPattern = /https:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)\.git/;
    let match = url.match(sshPattern) || url.match(httpsPattern);
    if (match) {
        return `${match[1]}/${match[2]}`;
    }
    return null;
}
function commitChanges(commitMessage, directory) {
    try {
        (0, child_process_1.execSync)('git add -A', { encoding: 'utf8', stdio: 'pipe' });
        (0, child_process_1.execSync)('git commit --no-verify -F -', {
            encoding: 'utf8',
            stdio: 'pipe',
            input: commitMessage,
            cwd: directory,
        });
    }
    catch (err) {
        if (directory) {
            // We don't want to throw during create-nx-workspace
            // because maybe there was an error when setting up git
            // initially.
            devkit_exports_1.logger.verbose(`Git may not be set up correctly for this new workspace.
        ${err}`);
        }
        else {
            throw new Error(`Error committing changes:\n${err.stderr}`);
        }
    }
    return getLatestCommitSha();
}
function getLatestCommitSha() {
    try {
        return (0, child_process_1.execSync)('git rev-parse HEAD', {
            encoding: 'utf8',
            stdio: 'pipe',
        }).trim();
    }
    catch {
        return null;
    }
}
