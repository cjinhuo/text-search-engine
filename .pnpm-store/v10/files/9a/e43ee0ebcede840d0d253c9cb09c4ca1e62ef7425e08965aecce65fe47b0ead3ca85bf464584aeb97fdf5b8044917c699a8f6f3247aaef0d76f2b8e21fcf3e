import {
  cyan,
  dim,
  green,
  magenta,
  yellow
} from "./chunk-UB6OAFZF.js";

// src/utils.ts
function slash(str) {
  return str.replace(/\\/g, "/");
}
function resolveBasePath(base) {
  if (isAbsolute(base))
    return base;
  return !base.startsWith("/") && !base.startsWith("./") ? `/${base}` : base;
}
function isAbsolute(url) {
  return url.match(/^(?:[a-z]+:)?\/\//i);
}
function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

// src/log.ts
import { relative } from "node:path";
function logSWViteBuild(version, swName, viteOptions, format) {
  const { logLevel = "info" } = viteOptions;
  if (logLevel === "silent")
    return;
  if (logLevel === "info") {
    console.info([
      "",
      `${cyan(`PWA v${version}`)}`,
      `Building ${magenta(swName)} service worker ("${magenta(format)}" format)...`
    ].join("\n"));
  }
}
function logWorkboxResult(version, throwMaximumFileSizeToCacheInBytes, strategy, buildResult, viteOptions, format = "none") {
  if (throwMaximumFileSizeToCacheInBytes) {
    const entries = buildResult.warnings.filter((w) => w.includes("maximumFileSizeToCacheInBytes"));
    if (entries.length) {
      const prefix = strategy === "generateSW" ? "workbox" : "injectManifest";
      throw new Error(`
  Configure "${prefix}.maximumFileSizeToCacheInBytes" to change the limit: the default value is 2 MiB.
  Check https://vite-pwa-org.netlify.app/guide/faq.html#missing-assets-from-sw-precache-manifest for more information.
  Assets exceeding the limit:
${entries.map((w) => `  - ${w.replace(". Configure maximumFileSizeToCacheInBytes to change this limit", "")}`).join("\n")}
`);
    }
  }
  const { root, logLevel = "info" } = viteOptions;
  if (logLevel === "silent")
    return;
  const { count, size, filePaths, warnings } = buildResult;
  if (logLevel === "info") {
    const entries = [
      "",
      `${cyan(`PWA v${version}`)}`,
      `mode      ${magenta(strategy)}`
    ];
    if (strategy === "injectManifest")
      entries.push(`format:   ${magenta(format)}`);
    entries.push(
      `precache  ${green(`${count} entries`)} ${dim(`(${(size / 1024).toFixed(2)} KiB)`)}`,
      "files generated",
      ...filePaths.map((p) => `  ${dim(normalizePath(relative(root, p)))}`)
    );
    console.info(entries.join("\n"));
  }
  warnings && warnings.length > 0 && console.warn(yellow([
    "warnings",
    ...warnings.map((w) => `  ${w}`),
    ""
  ].join("\n")));
}

export {
  slash,
  resolveBasePath,
  normalizePath,
  logSWViteBuild,
  logWorkboxResult
};
