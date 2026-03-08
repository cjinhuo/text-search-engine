import {
  logWorkboxResult,
  normalizePath,
  resolveBasePath,
  slash
} from "./chunk-5JSAQONO.js";
import {
  extractIcons
} from "./chunk-SF7B43FO.js";
import {
  __require,
  cyan,
  yellow
} from "./chunk-UB6OAFZF.js";

// src/context.ts
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
function createContext(userOptions) {
  const _dirname2 = typeof __dirname !== "undefined" ? __dirname : dirname(fileURLToPath(import.meta.url));
  const { version } = JSON.parse(
    readFileSync(resolve(_dirname2, "../package.json"), "utf-8")
  );
  return {
    version,
    userOptions,
    options: void 0,
    viteConfig: void 0,
    useImportRegister: false,
    devEnvironment: false,
    pwaAssetsGenerator: Promise.resolve(void 0)
  };
}

// src/constants.ts
var FILE_SW_REGISTER = "registerSW.js";
var VIRTUAL_MODULES_MAP = {
  "virtual:pwa-register": "register",
  "virtual:pwa-register/vue": "vue",
  "virtual:pwa-register/svelte": "svelte",
  "virtual:pwa-register/react": "react",
  "virtual:pwa-register/preact": "preact",
  "virtual:pwa-register/solid": "solid"
};
var VIRTUAL_MODULES_RESOLVE_PREFIX = "/@vite-plugin-pwa/";
var VIRTUAL_MODULES = Object.keys(VIRTUAL_MODULES_MAP);
var defaultInjectManifestVitePlugins = [
  "alias",
  "commonjs",
  "vite:resolve",
  "vite:esbuild",
  "replace",
  "vite:define",
  "rollup-plugin-dynamic-import-variables",
  "vite:esbuild-transpile",
  "vite:json",
  "vite:terser"
];
var PWA_INFO_VIRTUAL = "virtual:pwa-info";
var RESOLVED_PWA_INFO_VIRTUAL = `\0${PWA_INFO_VIRTUAL}`;
var PWA_ASSETS_HEAD_VIRTUAL = "virtual:pwa-assets/head";
var RESOLVED_PWA_ASSETS_HEAD_VIRTUAL = `\0${PWA_ASSETS_HEAD_VIRTUAL}`;
var PWA_ASSETS_ICONS_VIRTUAL = "virtual:pwa-assets/icons";
var RESOLVED_PWA_ASSETS_ICONS_VIRTUAL = `\0${PWA_ASSETS_ICONS_VIRTUAL}`;
var DEV_SW_NAME = "dev-sw.js?dev-sw";
var DEV_SW_VIRTUAL = `${VIRTUAL_MODULES_RESOLVE_PREFIX}pwa-entry-point-loaded`;
var RESOLVED_DEV_SW_VIRTUAL = `\0${DEV_SW_VIRTUAL}`;
var DEV_READY_NAME = "vite-pwa-plugin:dev-ready";
var DEV_REGISTER_SW_NAME = "vite-plugin-pwa:register-sw";
var DEV_PWA_ASSETS_NAME = "vite-plugin-pwa:pwa-assets";

// src/plugins/pwa-assets.ts
function AssetsPlugin(ctx) {
  return {
    name: "vite-plugin-pwa:pwa-assets",
    enforce: "post",
    transformIndexHtml: {
      order: "post",
      async handler(html) {
        return await transformIndexHtmlHandler(html, ctx);
      },
      enforce: "post",
      // deprecated since Vite 4
      async transform(html) {
        return await transformIndexHtmlHandler(html, ctx);
      }
    },
    resolveId(id) {
      switch (true) {
        case id === PWA_ASSETS_HEAD_VIRTUAL:
          return RESOLVED_PWA_ASSETS_HEAD_VIRTUAL;
        case id === PWA_ASSETS_ICONS_VIRTUAL:
          return RESOLVED_PWA_ASSETS_ICONS_VIRTUAL;
        default:
          return void 0;
      }
    },
    async load(id) {
      if (id === RESOLVED_PWA_ASSETS_HEAD_VIRTUAL) {
        const pwaAssetsGenerator = await ctx.pwaAssetsGenerator;
        const head = pwaAssetsGenerator?.resolveHtmlAssets() ?? { links: [], themeColor: void 0 };
        return `export const pwaAssetsHead = ${JSON.stringify(head)}`;
      }
      if (id === RESOLVED_PWA_ASSETS_ICONS_VIRTUAL) {
        const pwaAssetsGenerator = await ctx.pwaAssetsGenerator;
        const icons = extractIcons(pwaAssetsGenerator?.instructions());
        return `export const pwaAssetsIcons = ${JSON.stringify(icons)}`;
      }
    },
    async handleHotUpdate({ file, server }) {
      const pwaAssetsGenerator = await ctx.pwaAssetsGenerator;
      if (await pwaAssetsGenerator?.checkHotUpdate(file)) {
        const modules = [];
        const head = server.moduleGraph.getModuleById(RESOLVED_PWA_ASSETS_HEAD_VIRTUAL);
        head && modules.push(head);
        const icons = server.moduleGraph.getModuleById(RESOLVED_PWA_ASSETS_ICONS_VIRTUAL);
        icons && modules.push(icons);
        if (modules)
          return modules;
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
    configureServer(server) {
      server.ws.on(DEV_READY_NAME, createWSResponseHandler(ctx, server));
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;
        if (!url)
          return next();
        if (!/\.(ico|png|svg|webp)$/.test(url))
          return next();
        const pwaAssetsGenerator = await ctx.pwaAssetsGenerator;
        if (!pwaAssetsGenerator)
          return next();
        const icon = await pwaAssetsGenerator.findIconAsset(url);
        if (!icon)
          return next();
        if (icon.age > 0) {
          const ifModifiedSince = req.headers["if-modified-since"] ?? req.headers["If-Modified-Since"];
          const useIfModifiedSince = ifModifiedSince ? Array.isArray(ifModifiedSince) ? ifModifiedSince[0] : ifModifiedSince : void 0;
          if (useIfModifiedSince && new Date(icon.lastModified).getTime() / 1e3 >= new Date(useIfModifiedSince).getTime() / 1e3) {
            res.statusCode = 304;
            res.end();
            return;
          }
        }
        const buffer = await icon.buffer;
        res.setHeader("Age", icon.age / 1e3);
        res.setHeader("Content-Type", icon.mimeType);
        res.setHeader("Content-Length", buffer.length);
        res.setHeader("Last-Modified", new Date(icon.lastModified).toUTCString());
        res.statusCode = 200;
        res.end(buffer);
      });
    }
  };
}
async function transformIndexHtmlHandler(html, ctx) {
  if (ctx.devEnvironment && ctx.options.devOptions.enabled)
    return html;
  const pwaAssetsGenerator = await ctx.pwaAssetsGenerator;
  if (!pwaAssetsGenerator)
    return html;
  return pwaAssetsGenerator.transformIndexHtml(html);
}
function createWSResponseHandler(ctx, server) {
  return async () => {
    const pwaAssetsGenerator = await ctx.pwaAssetsGenerator;
    if (pwaAssetsGenerator) {
      const data = pwaAssetsGenerator.resolveHtmlAssets();
      server.ws.send({
        type: "custom",
        event: DEV_PWA_ASSETS_NAME,
        data
      });
    }
  };
}

// src/html.ts
function generateSimpleSWRegister(options, dev) {
  const path = dev ? `${options.base}${DEV_SW_NAME}` : `${options.buildBase}${options.filename}`;
  if (dev) {
    const swType = options.devOptions.type ?? "classic";
    return `if('serviceWorker' in navigator) navigator.serviceWorker.register('${path}', { scope: '${options.scope}', type: '${swType}' })`;
  }
  return `
if('serviceWorker' in navigator) {
window.addEventListener('load', () => {
navigator.serviceWorker.register('${path}', { scope: '${options.scope}' })
})
}`.replace(/\n/g, "");
}
function injectServiceWorker(html, options, dev) {
  const manifest = generateWebManifest(options, dev);
  if (!dev) {
    const script = generateRegisterSW(options, dev);
    if (script) {
      return html.replace(
        "</head>",
        `${manifest}${script}</head>`
      );
    }
  }
  return html.replace(
    "</head>",
    `${manifest}</head>`
  );
}
function generateWebManifest(options, dev) {
  const crossorigin = options.useCredentials ? ' crossorigin="use-credentials"' : "";
  if (dev) {
    const name = options.devOptions.webManifestUrl ?? `${options.base}${options.manifestFilename}`;
    return options.manifest ? `<link rel="manifest" href="${name}"${crossorigin}>` : "";
  } else {
    return options.manifest ? `<link rel="manifest" href="${options.buildBase}${options.manifestFilename}"${crossorigin}>` : "";
  }
}
function generateRegisterSW(options, dev) {
  if (options.injectRegister === "inline") {
    return `<script id="vite-plugin-pwa:inline-sw">${generateSimpleSWRegister(options, dev)}</script>`;
  } else if (options.injectRegister === "script" || options.injectRegister === "script-defer") {
    const hasDefer = options.injectRegister === "script-defer";
    return `<script id="vite-plugin-pwa:register-sw" src="${dev ? options.base : options.buildBase}${FILE_SW_REGISTER}"${hasDefer ? " defer" : ""}></script>`;
  }
  return void 0;
}
function generateRegisterDevSW(base) {
  const path = `${base.endsWith("/") ? base : `${base}/`}${DEV_SW_VIRTUAL.slice(1)}`;
  return `<script id="vite-plugin-pwa:register-dev-sw" type="module">
import registerDevSW from '${path}';
registerDevSW();
</script>`;
}
function generateSWHMR() {
  return `
import.meta.hot.on('${DEV_REGISTER_SW_NAME}', ({ mode, inlinePath, registerPath, scope, swType = 'classic' }) => {
  if (mode == 'inline') {
    if('serviceWorker' in navigator) {
      navigator.serviceWorker.register(inlinePath, { scope, type: swType });
    }
  }
  else {
    const registerSW = document.createElement('script');
    registerSW.setAttribute('id', 'vite-plugin-pwa:register-sw');
    if (mode === 'script-defer') registerSW.setAttribute('defer', 'defer');
    registerSW.setAttribute('src', registerPath);
    document.head.appendChild(registerSW);
  }
});
import.meta.hot.on('${DEV_PWA_ASSETS_NAME}', ({ themeColor, links }) => {
  if (themeColor) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = themeColor.content;
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      meta.setAttribute('content', themeColor.content);
      document.head.appendChild(meta);
    }
  }
  if (links) {
    links.map((l) => {
      const link = document.querySelector(\`link[href="\${l.href}"]\`) ?? document.createElement('link');
      if (l.id) link.setAttribute('id', l.id);
      else link.removeAttribute('id');
      link.setAttribute('rel', l.rel);
      link.setAttribute('href', l.href);
      if (l.media) link.setAttribute('media', l.media);
      else link.removeAttribute('media');
      if (l.sizes) link.setAttribute('sizes', l.sizes);
      else link.removeAttribute('sizes');
      if (l.type) link.setAttribute('type', l.type);
      else link.removeAttribute('type');
      if (!link.parentNode) document.head.appendChild(link);
    });
  }  
});  
function registerDevSW() {
  try {
    import.meta.hot.send('${DEV_READY_NAME}');
  } catch (e) {
    console.error('unable to send ${DEV_READY_NAME} message to register service worker in dev mode!', e);
  }
}
export default registerDevSW;
`;
}

// src/api.ts
import { resolve as resolve3 } from "node:path";
import { existsSync } from "node:fs";

// src/modules.ts
import { dirname as dirname2, resolve as resolve2 } from "node:path";
import { promises as fs } from "node:fs";
import { fileURLToPath as fileURLToPath2 } from "node:url";
var _dirname = typeof __dirname !== "undefined" ? __dirname : dirname2(fileURLToPath2(import.meta.url));
async function loadWorkboxBuild() {
  try {
    const workbox = await import("workbox-build");
    return workbox.default ?? workbox;
  } catch (_) {
    return __require("workbox-build");
  }
}
async function generateRegisterSW2(options, mode, source = "register") {
  const sw = options.buildBase + options.filename;
  const scope = options.scope;
  const content = await fs.readFile(resolve2(_dirname, `client/${mode}/${source}.js`), "utf-8");
  return content.replace(/__SW__/g, sw).replace("__SCOPE__", scope).replace("__SW_AUTO_UPDATE__", `${options.registerType === "autoUpdate"}`).replace("__SW_SELF_DESTROYING__", `${options.selfDestroying}`).replace("__TYPE__", `${options.devOptions.enabled ? options.devOptions.type : "classic"}`);
}
async function generateServiceWorker(version, options, viteOptions) {
  if (options.selfDestroying) {
    const selfDestroyingSW = `
self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  self.registration.unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => {
      clients.forEach((client) => {
        if (client instanceof WindowClient)
          client.navigate(client.url);
      });
      return Promise.resolve();
    })
    .then(() => {
      self.caches.keys().then((cacheNames) => {
        Promise.all(
          cacheNames.map((cacheName) => {
            return self.caches.delete(cacheName);
          }),
        );
      })
    });
});
    `;
    await fs.writeFile(options.swDest.replace(/\\/g, "/"), selfDestroyingSW, { encoding: "utf8" });
    return {
      count: 1,
      size: selfDestroyingSW.length,
      warnings: [],
      filePaths: [options.filename]
    };
  }
  await options.integration?.beforeBuildServiceWorker?.(options);
  const { generateSW } = await loadWorkboxBuild();
  const buildResult = await generateSW(options.workbox);
  logWorkboxResult(
    version,
    options.throwMaximumFileSizeToCacheInBytes,
    "generateSW",
    buildResult,
    viteOptions
  );
  return buildResult;
}
async function generateInjectManifest(version, options, viteOptions) {
  const { selfDestroying } = options;
  if (selfDestroying) {
    await generateServiceWorker(version, options, viteOptions);
    return;
  }
  await import("./vite-build-SPZPV25C.js").then(({ buildSW }) => buildSW(version, options, viteOptions, loadWorkboxBuild()));
}

// src/assets.ts
import { resolve as resolveFs } from "node:path";
import fs2 from "node:fs";
import crypto from "node:crypto";
import { glob } from "tinyglobby";
function buildManifestEntry(publicDir, url) {
  return new Promise((resolve6, reject) => {
    const cHash = crypto.createHash("MD5");
    const stream = fs2.createReadStream(resolveFs(publicDir, url));
    stream.on("error", (err) => {
      reject(err);
    });
    stream.on("data", (chunk) => {
      cHash.update(chunk);
    });
    stream.on("end", () => {
      return resolve6({
        url,
        revision: `${cHash.digest("hex")}`
      });
    });
  });
}
function lookupAdditionalManifestEntries(useInjectManifest, injectManifest, workbox) {
  return useInjectManifest ? injectManifest.additionalManifestEntries || [] : workbox.additionalManifestEntries || [];
}
function normalizeIconPath(path) {
  return path.startsWith("/") ? path.substring(1) : path;
}
function includeIcons(icons, globs) {
  Object.keys(icons).forEach((key) => {
    const icon = icons[key];
    const src = normalizeIconPath(icon.src);
    if (!globs.includes(src))
      globs.push(src);
  });
}
async function configureStaticAssets(resolvedVitePWAOptions, viteConfig) {
  const {
    manifest,
    strategies,
    injectManifest,
    workbox,
    includeAssets,
    includeManifestIcons,
    manifestFilename
  } = resolvedVitePWAOptions;
  const useInjectManifest = strategies === "injectManifest";
  const { publicDir } = viteConfig;
  const globs = [];
  const manifestEntries = lookupAdditionalManifestEntries(
    useInjectManifest,
    injectManifest,
    workbox
  );
  if (includeAssets) {
    if (Array.isArray(includeAssets))
      globs.push(...includeAssets.map(normalizeIconPath));
    else
      globs.push(normalizeIconPath(includeAssets));
  }
  if (includeManifestIcons && manifest) {
    manifest.icons && includeIcons(manifest.icons, globs);
    manifest.shortcuts && manifest.shortcuts.forEach((s) => {
      s.icons && includeIcons(s.icons, globs);
    });
  }
  if (globs.length > 0) {
    let assets = await glob({
      patterns: globs,
      cwd: publicDir,
      expandDirectories: false,
      onlyFiles: true
    });
    if (manifestEntries.length > 0) {
      const included = manifestEntries.map((me) => {
        if (typeof me === "string")
          return me;
        else
          return me.url;
      });
      assets = assets.filter((a) => !included.includes(a));
    }
    const assetsEntries = await Promise.all(assets.map((a) => {
      return buildManifestEntry(publicDir, a);
    }));
    manifestEntries.push(...assetsEntries);
  }
  if (manifest) {
    const cHash = crypto.createHash("MD5");
    cHash.update(generateWebManifestFile(resolvedVitePWAOptions));
    manifestEntries.push({
      url: manifestFilename,
      revision: `${cHash.digest("hex")}`
    });
  }
  if (manifestEntries.length > 0) {
    if (useInjectManifest)
      injectManifest.additionalManifestEntries = manifestEntries;
    else
      workbox.additionalManifestEntries = manifestEntries;
  }
}
function generateWebManifestFile(options) {
  return `${JSON.stringify(options.manifest, null, options.minify ? 0 : 2)}
`;
}

// src/api.ts
async function _generateSW({ options, version, viteConfig }) {
  if (options.disable)
    return;
  if (options.strategies === "injectManifest")
    await generateInjectManifest(version, options, viteConfig);
  else
    await generateServiceWorker(version, options, viteConfig);
}
function _generateBundle(ctx, bundle) {
  const { options, viteConfig, useImportRegister } = ctx;
  if (options.disable || !bundle)
    return;
  if (options.manifest) {
    if (!options.manifest.theme_color) {
      console.warn([
        "",
        `${cyan(`PWA v${ctx.version}`)}`,
        `${yellow('WARNING: "theme_color" is missing from the web manifest, your application will not be able to be installed')}`
      ].join("\n"));
    }
    bundle[options.manifestFilename] = {
      // @ts-expect-error: for Vite 3 support, Vite 4 has removed `isAsset` property
      isAsset: true,
      type: "asset",
      name: void 0,
      source: generateWebManifestFile(options),
      fileName: options.manifestFilename
    };
  }
  if (options.injectRegister === "auto")
    options.injectRegister = useImportRegister ? false : "script";
  if ((options.injectRegister === "script" || options.injectRegister === "script-defer") && !existsSync(resolve3(viteConfig.publicDir, FILE_SW_REGISTER))) {
    bundle[FILE_SW_REGISTER] = {
      // @ts-expect-error: for Vite 3 support, Vite 4 has removed `isAsset` property
      isAsset: true,
      type: "asset",
      name: void 0,
      source: generateSimpleSWRegister(options, false),
      fileName: FILE_SW_REGISTER
    };
  }
  return bundle;
}
function createAPI(ctx) {
  return {
    get disabled() {
      return ctx?.options?.disable;
    },
    get pwaInDevEnvironment() {
      return ctx?.devEnvironment === true;
    },
    webManifestData() {
      const options = ctx?.options;
      if (!options || options.disable || !options.manifest || ctx.devEnvironment && !ctx.options.devOptions.enabled)
        return void 0;
      let url = options.manifestFilename;
      let manifest;
      if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
        url = ctx.options.devOptions.webManifestUrl ?? options.manifestFilename;
        manifest = generateWebManifest(options, true);
      } else {
        manifest = generateWebManifest(options, false);
      }
      return {
        href: `${ctx.devEnvironment ? options.base : options.buildBase}${url}`,
        useCredentials: ctx.options.useCredentials,
        toLinkTag() {
          return manifest;
        }
      };
    },
    registerSWData() {
      const options = ctx?.options;
      if (!options || options.disable || ctx.devEnvironment && !ctx.options.devOptions.enabled)
        return void 0;
      const mode = options.injectRegister;
      if (!mode || ctx.useImportRegister)
        return void 0;
      let type = "classic";
      let script;
      let shouldRegisterSW = options.injectRegister === "inline" || options.injectRegister === "script" || options.injectRegister === "script-defer";
      if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
        type = ctx.options.devOptions.type ?? "classic";
        script = generateRegisterDevSW(ctx.options.base);
        shouldRegisterSW = true;
      } else if (shouldRegisterSW) {
        script = generateRegisterSW(options, false);
      }
      const base = ctx.devEnvironment ? options.base : options.buildBase;
      return {
        // hint when required
        shouldRegisterSW,
        inline: options.injectRegister === "inline",
        mode: mode === "auto" ? "script" : mode,
        scope: options.scope,
        inlinePath: `${base}${ctx.devEnvironment ? DEV_SW_NAME : options.filename}`,
        registerPath: `${base}${FILE_SW_REGISTER}`,
        type,
        toScriptTag() {
          return script;
        }
      };
    },
    generateBundle(bundle) {
      return _generateBundle(ctx, bundle);
    },
    async generateSW() {
      return await _generateSW(ctx);
    },
    extendManifestEntries(fn) {
      const { options } = ctx;
      if (options.disable)
        return;
      const configField = options.strategies === "generateSW" ? "workbox" : "injectManifest";
      const result = fn(options[configField].additionalManifestEntries || []);
      if (result != null)
        options[configField].additionalManifestEntries = result;
    },
    pwaAssetsGenerator() {
      return ctx.pwaAssetsGenerator;
    }
  };
}

// src/plugins/build.ts
function BuildPlugin(ctx) {
  const transformIndexHtmlHandler2 = (html) => {
    const { options, useImportRegister } = ctx;
    if (options.disable)
      return html;
    if (options.injectRegister === "auto")
      options.injectRegister = useImportRegister ? null : "script";
    return injectServiceWorker(html, options, false);
  };
  return {
    name: "vite-plugin-pwa:build",
    enforce: "post",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        return transformIndexHtmlHandler2(html);
      },
      enforce: "post",
      // deprecated since Vite 4
      transform(html) {
        return transformIndexHtmlHandler2(html);
      }
    },
    async generateBundle(_, bundle) {
      const pwaAssetsGenerator = await ctx.pwaAssetsGenerator;
      if (pwaAssetsGenerator)
        pwaAssetsGenerator.injectManifestIcons();
      return _generateBundle(ctx, bundle);
    },
    closeBundle: {
      sequential: true,
      order: ctx.userOptions?.integration?.closeBundleOrder,
      async handler() {
        if (!ctx.viteConfig.build.ssr) {
          const pwaAssetsGenerator = await ctx.pwaAssetsGenerator;
          if (pwaAssetsGenerator)
            await pwaAssetsGenerator.generate();
          if (!ctx.options.disable)
            await _generateSW(ctx);
        }
      }
    },
    async buildEnd(error) {
      if (error)
        throw error;
    }
  };
}

// src/plugins/dev.ts
import { basename, resolve as resolve4 } from "node:path";
import { existsSync as existsSync2, promises as fs3, mkdirSync } from "node:fs";
var swDevOptions = {
  swUrl: DEV_SW_NAME,
  swDevGenerated: false,
  registerSWGenerated: false,
  workboxPaths: /* @__PURE__ */ new Map()
};
function DevPlugin(ctx) {
  const transformIndexHtmlHandler2 = (html) => {
    const { options } = ctx;
    if (options.disable || !options.devOptions.enabled)
      return html;
    html = injectServiceWorker(html, options, true);
    return html.replace(
      "</body>",
      `${generateRegisterDevSW(options.base)}
</body>`
    );
  };
  return {
    name: "vite-plugin-pwa:dev-sw",
    apply: "serve",
    transformIndexHtml: {
      order: "post",
      async handler(html) {
        return transformIndexHtmlHandler2(html);
      },
      enforce: "post",
      // deprecated since Vite 4
      async transform(html) {
        return transformIndexHtmlHandler2(html);
      }
    },
    configureServer(server) {
      ctx.devEnvironment = true;
      const { options } = ctx;
      if (!options.disable && options.devOptions.enabled) {
        server.ws.on(DEV_READY_NAME, createWSResponseHandler2(server, ctx));
        if (options.manifest) {
          const name = options.devOptions.webManifestUrl ?? `${options.base}${options.manifestFilename}`;
          server.middlewares.use(async (req, res, next) => {
            if (req.url === name) {
              const pwaAssetsGenerator = await ctx.pwaAssetsGenerator;
              pwaAssetsGenerator?.injectManifestIcons();
              if (ctx.options.manifest && !ctx.options.manifest.theme_color) {
                console.warn([
                  "",
                  `${cyan(`PWA v${ctx.version}`)}`,
                  `${yellow('WARNING: "theme_color" is missing from the web manifest, your application will not be able to be installed')}`
                ].join("\n"));
              }
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/manifest+json");
              res.write(generateWebManifestFile(options), "utf-8");
              res.end();
            } else {
              next();
            }
          });
        }
      }
    },
    resolveId(id) {
      if (id === DEV_SW_VIRTUAL)
        return RESOLVED_DEV_SW_VIRTUAL;
      const { options } = ctx;
      if (!options.disable && options.devOptions.enabled && options.strategies === "injectManifest" && !options.selfDestroying) {
        let name = id.startsWith(options.base) ? id.slice(options.base.length) : id;
        if (name.length && name[0] === "/")
          name = name.slice(1);
        return name === swDevOptions.swUrl || name === options.injectManifest.swSrc ? options.injectManifest.swSrc : void 0;
      }
      return void 0;
    },
    async load(id) {
      if (id === RESOLVED_DEV_SW_VIRTUAL)
        return generateSWHMR();
      const { options, viteConfig } = ctx;
      if (!options.disable && options.devOptions.enabled) {
        if (options.strategies === "injectManifest" && !options.selfDestroying) {
          const swSrc = normalizePath(options.injectManifest.swSrc);
          if (id === swSrc) {
            let content = await fs3.readFile(options.injectManifest.swSrc, "utf-8");
            const resolvedIP = options.injectManifest.injectionPoint;
            if (resolvedIP) {
              const ip = new RegExp(resolvedIP, "g");
              const navigateFallback = options.devOptions.navigateFallback;
              if (navigateFallback)
                content = content.replace(ip, `[{ url: '${navigateFallback}' }]`);
              else
                content = content.replace(ip, "[]");
            }
            return content;
          }
          if (swDevOptions.workboxPaths.has(id))
            return await fs3.readFile(swDevOptions.workboxPaths.get(id), "utf-8");
          return void 0;
        }
        if (id.endsWith(swDevOptions.swUrl)) {
          const globDirectory = await resolveDevDistFolder(options, viteConfig);
          if (!existsSync2(globDirectory))
            mkdirSync(globDirectory, { recursive: true });
          const swDest = resolve4(globDirectory, "sw.js");
          if (!swDevOptions.swDevGenerated) {
            let suppressWarnings;
            if (options.devOptions.suppressWarnings === true) {
              suppressWarnings = normalizePath(resolve4(globDirectory, "suppress-warnings.js"));
              await fs3.writeFile(suppressWarnings, "", "utf-8");
            }
            const globPatterns = options.devOptions.suppressWarnings === true ? ["suppress-warnings.js"] : options.workbox.globPatterns;
            const navigateFallback = options.workbox.navigateFallback;
            const { filePaths } = await generateServiceWorker(
              ctx.version,
              Object.assign(
                {},
                options,
                {
                  swDest: options.selfDestroying ? swDest : options.swDest,
                  workbox: {
                    ...options.workbox,
                    navigateFallbackAllowlist: options.devOptions.navigateFallbackAllowlist ?? [/^\/$/],
                    runtimeCaching: options.devOptions.disableRuntimeConfig ? void 0 : options.workbox.runtimeCaching,
                    // we only include navigateFallback: add revision to remove workbox-build warning
                    additionalManifestEntries: navigateFallback ? [{
                      url: navigateFallback,
                      revision: Math.random().toString(32)
                    }] : void 0,
                    cleanupOutdatedCaches: true,
                    globDirectory: normalizePath(globDirectory),
                    globPatterns,
                    swDest: normalizePath(swDest)
                  }
                }
              ),
              viteConfig
            );
            filePaths.forEach((we) => {
              const name = basename(we);
              if (name !== "sw.js")
                swDevOptions.workboxPaths.set(normalizePath(`${options.base}${name}`), we);
            });
            if (suppressWarnings) {
              swDevOptions.workboxPaths.set(
                normalizePath(`${options.base}${basename(suppressWarnings)}`),
                suppressWarnings
              );
            }
            swDevOptions.swDevGenerated = true;
          }
          return await fs3.readFile(swDest, "utf-8");
        }
        if (id.startsWith(options.base)) {
          const key = normalizePath(id);
          if (swDevOptions.workboxPaths.has(key))
            return await fs3.readFile(swDevOptions.workboxPaths.get(key), "utf-8");
        } else if (options.base !== "/") {
          const key = normalizePath(`${options.base}${id.length > 0 && id[0] === "/" ? id.slice(1) : id}`);
          if (swDevOptions.workboxPaths.has(key))
            return await fs3.readFile(swDevOptions.workboxPaths.get(key), "utf-8");
        }
      }
    }
  };
}
async function resolveDevDistFolder(options, viteConfig) {
  return options.devOptions.resolveTempFolder ? await options.devOptions.resolveTempFolder() : resolve4(viteConfig.root, "dev-dist");
}
async function createDevRegisterSW(options, viteConfig) {
  if (options.injectRegister === "script" || options.injectRegister === "script-defer") {
    const devDist = await resolveDevDistFolder(options, viteConfig);
    if (!existsSync2(devDist))
      mkdirSync(devDist, { recursive: true });
    const registerSW = resolve4(devDist, FILE_SW_REGISTER);
    if (!swDevOptions.registerSWGenerated) {
      await fs3.writeFile(registerSW, generateSimpleSWRegister(options, true), { encoding: "utf8" });
      swDevOptions.registerSWGenerated = true;
    }
    swDevOptions.workboxPaths.set(normalizePath(`${options.base}${FILE_SW_REGISTER}`), registerSW);
  }
}
function createWSResponseHandler2(server, ctx) {
  return async () => {
    const { options, useImportRegister } = ctx;
    const { injectRegister, scope, base } = options;
    if (!useImportRegister && injectRegister) {
      if (injectRegister === "auto")
        options.injectRegister = "script";
      await createDevRegisterSW(options, ctx.viteConfig);
      server.ws.send({
        type: "custom",
        event: DEV_REGISTER_SW_NAME,
        data: {
          mode: options.injectRegister,
          scope,
          inlinePath: `${base}${DEV_SW_NAME}`,
          registerPath: `${base}${FILE_SW_REGISTER}`,
          swType: options.devOptions.type
        }
      });
    }
  };
}

// src/options.ts
import fs4 from "node:fs";
import { extname, resolve as resolve5 } from "node:path";
import process from "node:process";

// src/pwa-assets/options.ts
function resolvePWAAssetsOptions(options) {
  if (!options)
    return false;
  const {
    disabled,
    preset = "minimal-2023",
    image = "public/favicon.svg",
    htmlPreset = "2023",
    overrideManifestIcons = false,
    includeHtmlHeadLinks = true,
    injectThemeColor = true,
    integration
  } = options ?? {};
  const resolvedConfiguration = {
    disabled: true,
    config: false,
    preset: false,
    images: [image],
    htmlPreset,
    overrideManifestIcons,
    includeHtmlHeadLinks,
    injectThemeColor,
    integration
  };
  if (disabled === true)
    return resolvedConfiguration;
  if ("config" in options && !!options.config) {
    resolvedConfiguration.disabled = false;
    resolvedConfiguration.config = options.config;
    return resolvedConfiguration;
  }
  if (preset === false)
    return resolvedConfiguration;
  resolvedConfiguration.disabled = false;
  resolvedConfiguration.preset = preset;
  return resolvedConfiguration;
}

// src/options.ts
function resolveSwPaths(injectManifest, root, srcDir, outDir, filename) {
  const swSrc = resolve5(root, srcDir, filename);
  if (injectManifest && extname(filename) === ".ts" && fs4.existsSync(swSrc)) {
    const useFilename = `${filename.substring(0, filename.lastIndexOf("."))}.js`;
    return {
      swSrc,
      swDest: resolve5(root, outDir, useFilename),
      useFilename
    };
  }
  return {
    swSrc,
    swDest: resolve5(root, outDir, filename)
  };
}
async function resolveOptions(ctx) {
  const { userOptions: options, viteConfig } = ctx;
  const root = viteConfig.root;
  const pkg = fs4.existsSync("package.json") ? JSON.parse(fs4.readFileSync("package.json", "utf-8")) : {};
  const {
    // prevent tsup replacing `process.env`
    // eslint-disable-next-line dot-notation
    mode = process["env"]["NODE_ENV"] || "production",
    srcDir = "public",
    outDir = viteConfig.build.outDir || "dist",
    injectRegister = "auto",
    registerType = "prompt",
    filename = "sw.js",
    manifestFilename = "manifest.webmanifest",
    strategies = "generateSW",
    minify = true,
    base = viteConfig.base,
    includeAssets = void 0,
    includeManifestIcons = true,
    useCredentials = false,
    disable = false,
    devOptions = { enabled: false, type: "classic", suppressWarnings: false },
    selfDestroying = false,
    integration = {},
    buildBase,
    pwaAssets,
    showMaximumFileSizeToCacheInBytesWarning = false
  } = options;
  const basePath = resolveBasePath(base);
  const { swSrc, swDest, useFilename } = resolveSwPaths(
    strategies === "injectManifest",
    root,
    srcDir,
    outDir,
    filename
  );
  const outDirRoot = resolve5(root, outDir);
  const scope = options.scope || basePath;
  let assetsDir = slash(viteConfig.build.assetsDir ?? "assets");
  if (assetsDir[assetsDir.length - 1] !== "/")
    assetsDir += "/";
  const dontCacheBustURLsMatching = new RegExp(`^${assetsDir.replace(/^\.*?\//, "")}`);
  const defaultWorkbox = {
    swDest,
    globDirectory: outDirRoot,
    offlineGoogleAnalytics: false,
    cleanupOutdatedCaches: true,
    dontCacheBustURLsMatching,
    mode,
    navigateFallback: "index.html"
  };
  const defaultInjectManifest = {
    swSrc,
    swDest,
    globDirectory: outDirRoot,
    dontCacheBustURLsMatching,
    injectionPoint: "self.__WB_MANIFEST"
  };
  const defaultManifest = {
    name: pkg.name,
    short_name: pkg.name,
    start_url: basePath,
    display: "standalone",
    background_color: "#ffffff",
    lang: "en",
    scope
  };
  const workbox = Object.assign({}, defaultWorkbox, options.workbox || {});
  const manifest = typeof options.manifest === "boolean" && !options.manifest ? false : Object.assign({}, defaultManifest, options.manifest || {});
  const {
    vitePlugins = defaultInjectManifestVitePlugins,
    plugins,
    rollupOptions = {},
    rollupFormat = "es",
    target = viteConfig.build.target,
    minify: minifySW = viteConfig.build.minify,
    sourcemap = viteConfig.build.sourcemap,
    enableWorkboxModulesLogs,
    buildPlugins,
    envOptions = {},
    ...userInjectManifest
  } = options.injectManifest || {};
  const injectManifest = Object.assign({}, defaultInjectManifest, userInjectManifest);
  if ((injectRegister === "auto" || injectRegister == null) && registerType === "autoUpdate") {
    workbox.skipWaiting = true;
    workbox.clientsClaim = true;
  }
  if (strategies === "generateSW" && workbox.sourcemap === void 0) {
    const sourcemap2 = viteConfig.build?.sourcemap;
    workbox.sourcemap = sourcemap2 === true || sourcemap2 === "inline" || sourcemap2 === "hidden";
  }
  if (devOptions.enabled && viteConfig.command === "serve") {
    if (strategies === "generateSW")
      devOptions.type = "classic";
  } else {
    devOptions.enabled = false;
    devOptions.type = "classic";
  }
  if (manifest) {
    if (manifest.icons) {
      manifest.icons = manifest.icons.map((icon) => {
        if (icon.purpose && Array.isArray(icon.purpose))
          icon.purpose = icon.purpose.join(" ");
        return icon;
      });
    }
    if (manifest.shortcuts) {
      manifest.shortcuts.forEach((shortcut) => {
        if (shortcut.icons) {
          shortcut.icons = shortcut.icons.map((icon) => {
            if (icon.purpose && Array.isArray(icon.purpose))
              icon.purpose = icon.purpose.join(" ");
            return icon;
          });
        }
      });
    }
  }
  const {
    envDir = viteConfig.envDir,
    envPrefix = viteConfig.envPrefix
  } = envOptions;
  const resolvedVitePWAOptions = {
    base: basePath,
    mode,
    swSrc,
    swDest,
    srcDir,
    outDir,
    injectRegister,
    registerType,
    filename: useFilename || filename,
    manifestFilename,
    strategies,
    workbox,
    manifest,
    useCredentials,
    injectManifest,
    scope,
    minify,
    includeAssets,
    includeManifestIcons,
    disable,
    integration,
    devOptions,
    rollupFormat,
    vitePlugins,
    buildPlugins,
    selfDestroying,
    buildBase: buildBase ?? basePath,
    injectManifestRollupOptions: {
      plugins,
      rollupOptions,
      format: rollupFormat
    },
    injectManifestBuildOptions: {
      target,
      minify: minifySW,
      sourcemap,
      enableWorkboxModulesLogs
    },
    injectManifestEnvOptions: {
      envDir,
      envPrefix
    },
    pwaAssets: resolvePWAAssetsOptions(pwaAssets),
    throwMaximumFileSizeToCacheInBytes: !showMaximumFileSizeToCacheInBytesWarning
  };
  const calculateHash = !resolvedVitePWAOptions.disable && (resolvedVitePWAOptions.manifest || resolvedVitePWAOptions.includeAssets) && (viteConfig.command === "build" || resolvedVitePWAOptions.devOptions.enabled);
  if (calculateHash)
    await configureStaticAssets(resolvedVitePWAOptions, viteConfig);
  return resolvedVitePWAOptions;
}

// src/plugins/main.ts
function MainPlugin(ctx, api) {
  return {
    name: "vite-plugin-pwa",
    enforce: "pre",
    config() {
      return {
        ssr: {
          // TODO: remove until workbox-window support native ESM
          noExternal: ["workbox-window"]
        }
      };
    },
    async configResolved(config) {
      ctx.useImportRegister = false;
      ctx.viteConfig = config;
      ctx.userOptions?.integration?.configureOptions?.(config, ctx.userOptions);
      ctx.options = await resolveOptions(ctx);
      if (ctx.options.pwaAssets && !ctx.options.pwaAssets.disabled) {
        ctx.pwaAssetsGenerator = import("./generator-EZTYL4FH.js").then(({ loadInstructions }) => loadInstructions(ctx)).catch((e) => {
          console.error([
            "",
            cyan(`PWA v${ctx.version}`),
            yellow("WARNING: you must install the following dev dependencies to use the PWA assets generator:"),
            yellow('- "@vite-pwa/assets-generator"'),
            yellow('- "sharp" (should be installed when installing @vite-pwa/assets-generator)'),
            yellow('- "sharp-ico" (should be installed when installing @vite-pwa/assets-generator)')
          ].join("\n"), e);
          return Promise.resolve(void 0);
        });
      }
    },
    resolveId(id) {
      return VIRTUAL_MODULES.includes(id) ? VIRTUAL_MODULES_RESOLVE_PREFIX + id : void 0;
    },
    load(id) {
      if (id.startsWith(VIRTUAL_MODULES_RESOLVE_PREFIX))
        id = id.slice(VIRTUAL_MODULES_RESOLVE_PREFIX.length);
      else
        return;
      if (VIRTUAL_MODULES.includes(id)) {
        ctx.useImportRegister = true;
        if (ctx.viteConfig.command === "serve" && ctx.options.devOptions.enabled) {
          return generateRegisterSW2(
            { ...ctx.options, filename: swDevOptions.swUrl },
            "build",
            VIRTUAL_MODULES_MAP[id]
          );
        } else {
          return generateRegisterSW2(
            ctx.options,
            !ctx.options.disable && ctx.viteConfig.command === "build" ? "build" : "dev",
            VIRTUAL_MODULES_MAP[id]
          );
        }
      }
    },
    api
  };
}

// src/plugins/info.ts
function InfoPlugin(ctx, api) {
  return {
    name: "vite-plugin-pwa:info",
    enforce: "post",
    resolveId(id) {
      if (id === PWA_INFO_VIRTUAL)
        return RESOLVED_PWA_INFO_VIRTUAL;
      return void 0;
    },
    load(id) {
      if (id === RESOLVED_PWA_INFO_VIRTUAL)
        return generatePwaInfo(ctx, api);
    }
  };
}
function generatePwaInfo(ctx, api) {
  const webManifestData = api.webManifestData();
  if (!webManifestData)
    return "export const pwaInfo = undefined;";
  const { href, useCredentials, toLinkTag } = webManifestData;
  const registerSWData = api.registerSWData();
  const entry = {
    pwaInDevEnvironment: api.pwaInDevEnvironment,
    webManifest: {
      href,
      useCredentials,
      linkTag: toLinkTag()
    }
  };
  if (registerSWData) {
    const scriptTag = registerSWData.toScriptTag();
    if (scriptTag) {
      const { inline, mode, inlinePath, registerPath, type, scope } = registerSWData;
      entry.registerSW = {
        inline,
        mode,
        inlinePath,
        registerPath,
        type,
        scope,
        scriptTag
      };
    }
  }
  return `export const pwaInfo = ${JSON.stringify(entry)};`;
}

// src/cache.ts
var cachePreset = [
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
    handler: "CacheFirst",
    options: {
      cacheName: "google-fonts",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 365 * 24 * 60 * 60
        // 365 days
      }
    }
  },
  {
    urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-font-assets",
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 7 * 24 * 60 * 60
        // 7 days
      }
    }
  },
  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-image-assets",
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 24 * 60 * 60
        // 24 hours
      }
    }
  },
  {
    urlPattern: /\.(?:js)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-js-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60
        // 24 hours
      }
    }
  },
  {
    urlPattern: /\.(?:css|less)$/i,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "static-style-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60
        // 24 hours
      }
    }
  },
  {
    urlPattern: /\.(?:json|xml|csv)$/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "static-data-assets",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60
        // 24 hours
      }
    }
  },
  {
    urlPattern: /\/api\/.*$/i,
    handler: "NetworkFirst",
    method: "GET",
    options: {
      cacheName: "apis",
      expiration: {
        maxEntries: 16,
        maxAgeSeconds: 24 * 60 * 60
        // 24 hours
      },
      networkTimeoutSeconds: 10
      // fall back to cache if api does not response within 10 seconds
    }
  },
  {
    urlPattern: /.*/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "others",
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60
        // 24 hours
      },
      networkTimeoutSeconds: 10
    }
  }
];

// src/index.ts
function VitePWA(userOptions = {}) {
  const ctx = createContext(userOptions);
  const api = createAPI(ctx);
  return [
    MainPlugin(ctx, api),
    InfoPlugin(ctx, api),
    BuildPlugin(ctx),
    DevPlugin(ctx),
    AssetsPlugin(ctx)
  ];
}
export {
  VitePWA,
  cachePreset,
  defaultInjectManifestVitePlugins
};
