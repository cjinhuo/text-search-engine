"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNxCloudUsed = isNxCloudUsed;
exports.getNxCloudUrl = getNxCloudUrl;
exports.getNxCloudToken = getNxCloudToken;
function isNxCloudUsed(nxJson) {
    return (!!process.env.NX_CLOUD_ACCESS_TOKEN ||
        !!nxJson.nxCloudAccessToken ||
        !!Object.values(nxJson.tasksRunnerOptions ?? {}).find((r) => r.runner == '@nrwl/nx-cloud' || r.runner == 'nx-cloud'));
}
function getNxCloudUrl(nxJson) {
    const cloudRunner = Object.values(nxJson.tasksRunnerOptions ?? {}).find((r) => r.runner == '@nrwl/nx-cloud' || r.runner == 'nx-cloud');
    if (!cloudRunner &&
        !(nxJson.nxCloudAccessToken || process.env.NX_CLOUD_ACCESS_TOKEN))
        throw new Error('nx-cloud runner not found in nx.json');
    return cloudRunner?.options?.url ?? nxJson.nxCloudUrl ?? 'https://nx.app';
}
function getNxCloudToken(nxJson) {
    const cloudRunner = Object.values(nxJson.tasksRunnerOptions ?? {}).find((r) => r.runner == '@nrwl/nx-cloud' || r.runner == 'nx-cloud');
    if (!cloudRunner &&
        !(nxJson.nxCloudAccessToken || process.env.NX_CLOUD_ACCESS_TOKEN))
        throw new Error('nx-cloud runner not found in nx.json');
    return (process.env.NX_CLOUD_ACCESS_TOKEN ??
        cloudRunner?.options.accessToken ??
        nxJson.nxCloudAccessToken);
}
