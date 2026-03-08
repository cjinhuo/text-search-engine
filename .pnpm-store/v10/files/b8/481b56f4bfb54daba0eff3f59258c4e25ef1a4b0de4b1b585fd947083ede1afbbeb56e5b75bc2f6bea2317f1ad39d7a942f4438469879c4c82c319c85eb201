"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiAxiosInstance = createApiAxiosInstance;
const path_1 = require("path");
const environment_1 = require("./environment");
const axios = require('axios');
function createApiAxiosInstance(options) {
    let axiosConfigBuilder = (axiosConfig) => axiosConfig;
    const baseUrl = process.env.NX_CLOUD_API || options.url || 'https://cloud.nx.app';
    const accessToken = environment_1.ACCESS_TOKEN ? environment_1.ACCESS_TOKEN : options.accessToken;
    if (!accessToken) {
        throw new Error(`Unable to authenticate. Either define accessToken in nx.json or set the NX_CLOUD_ACCESS_TOKEN env variable.`);
    }
    if (options.customProxyConfigPath) {
        const { nxCloudProxyConfig } = require((0, path_1.join)(process.cwd(), options.customProxyConfigPath));
        axiosConfigBuilder = nxCloudProxyConfig ?? axiosConfigBuilder;
    }
    return axios.create(axiosConfigBuilder({
        baseURL: baseUrl,
        timeout: environment_1.NX_CLOUD_NO_TIMEOUTS ? environment_1.UNLIMITED_TIMEOUT : 10000,
        headers: { authorization: accessToken },
    }));
}
