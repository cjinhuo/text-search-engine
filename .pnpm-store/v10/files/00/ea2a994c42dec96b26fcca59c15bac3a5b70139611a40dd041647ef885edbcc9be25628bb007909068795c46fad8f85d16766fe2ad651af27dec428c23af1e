"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printSuccessMessage = printSuccessMessage;
exports.connectToNxCloud = connectToNxCloud;
const child_process_1 = require("child_process");
const output_1 = require("../../../utils/output");
const json_1 = require("../../../generators/utils/json");
const nx_json_1 = require("../../../generators/utils/nx-json");
const format_changed_files_with_prettier_if_available_1 = require("../../../generators/internal-utils/format-changed-files-with-prettier-if-available");
const url_shorten_1 = require("../../utilities/url-shorten");
const get_cloud_options_1 = require("../../utilities/get-cloud-options");
const path_1 = require("path");
function printCloudConnectionDisabledMessage() {
    output_1.output.error({
        title: `Connections to Nx Cloud are disabled for this workspace`,
        bodyLines: [
            `This was an intentional decision by someone on your team.`,
            `Nx Cloud cannot and will not be enabled.`,
            ``,
            `To allow connections to Nx Cloud again, remove the 'neverConnectToCloud'`,
            `property in nx.json.`,
        ],
    });
}
function getRootPackageName(tree) {
    let packageJson;
    try {
        packageJson = (0, json_1.readJson)(tree, 'package.json');
    }
    catch (e) { }
    return packageJson?.name ?? 'my-workspace';
}
function getNxInitDate() {
    try {
        const nxInitIso = (0, child_process_1.execSync)('git log --diff-filter=A --follow --format=%aI -- nx.json | tail -1', { stdio: 'pipe' })
            .toString()
            .trim();
        const nxInitDate = new Date(nxInitIso);
        return nxInitDate.toISOString();
    }
    catch (e) {
        return null;
    }
}
async function createNxCloudWorkspace(workspaceName, installationSource, nxInitDate) {
    const apiUrl = (0, get_cloud_options_1.getCloudUrl)();
    const response = await require('axios').post(`${apiUrl}/nx-cloud/create-org-and-workspace`, {
        workspaceName,
        installationSource,
        nxInitDate,
    });
    if (response.data.message) {
        throw new Error(response.data.message);
    }
    return response.data;
}
async function printSuccessMessage(token, installationSource, usesGithub) {
    const connectCloudUrl = await (0, url_shorten_1.createNxCloudOnboardingURL)(installationSource, token, usesGithub);
    output_1.output.note({
        title: `Your Nx Cloud workspace is ready.`,
        bodyLines: [
            `To claim it, connect it to your Nx Cloud account:`,
            `- Commit and push your changes.`,
            `- Create a pull request for the changes.`,
            `- Go to the following URL to connect your workspace to Nx Cloud:`,
            '',
            `${connectCloudUrl}`,
        ],
    });
    return connectCloudUrl;
}
function addNxCloudOptionsToNxJson(tree, token, directory = '') {
    const nxJsonPath = (0, path_1.join)(directory, 'nx.json');
    if (tree.exists(nxJsonPath)) {
        (0, json_1.updateJson)(tree, (0, path_1.join)(directory, 'nx.json'), (nxJson) => {
            const overrideUrl = process.env.NX_CLOUD_API || process.env.NRWL_API;
            if (overrideUrl) {
                nxJson.nxCloudUrl = overrideUrl;
            }
            nxJson.nxCloudAccessToken = token;
            return nxJson;
        });
    }
}
async function connectToNxCloud(tree, schema, nxJson = (0, nx_json_1.readNxJson)(tree)) {
    schema.installationSource ??= 'user';
    if (nxJson?.neverConnectToCloud) {
        printCloudConnectionDisabledMessage();
        return null;
    }
    else {
        const usesGithub = schema.github ?? (await (0, url_shorten_1.repoUsesGithub)(schema.github));
        let responseFromCreateNxCloudWorkspace;
        // do NOT create Nx Cloud token (createNxCloudWorkspace)
        // if user is using github and is running nx-connect
        if (!(usesGithub &&
            (schema.installationSource === 'nx-connect' ||
                schema.installationSource === 'nx-console'))) {
            responseFromCreateNxCloudWorkspace = await createNxCloudWorkspace(getRootPackageName(tree), schema.installationSource, getNxInitDate());
            addNxCloudOptionsToNxJson(tree, responseFromCreateNxCloudWorkspace?.token, schema.directory);
            await (0, format_changed_files_with_prettier_if_available_1.formatChangedFilesWithPrettierIfAvailable)(tree, {
                silent: schema.hideFormatLogs,
            });
            return responseFromCreateNxCloudWorkspace.token;
        }
    }
}
async function connectToNxCloudGenerator(tree, options) {
    await connectToNxCloud(tree, options);
}
exports.default = connectToNxCloudGenerator;
