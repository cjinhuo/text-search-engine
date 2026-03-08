"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/pwa-assets/utils.ts
function mapLink(includeId, link) {
  const linkObject = {
    href: link.href,
    rel: link.rel
  };
  if (includeId && link.id)
    linkObject.id = link.id;
  if ("media" in link && link.media)
    linkObject.media = link.media;
  linkObject.href = link.href;
  if ("sizes" in link && link.sizes)
    linkObject.sizes = link.sizes;
  if ("type" in link && link.type)
    linkObject.type = link.type;
  return linkObject;
}
function extractIcons(instructions2) {
  const icons = {
    favicon: {},
    transparent: {},
    maskable: {},
    apple: {},
    appleSplashScreen: {}
  };
  if (instructions2) {
    Array.from(Object.values(instructions2.favicon)).forEach(({ buffer: _buffer, ...rest }) => {
      if (rest.url)
        icons.favicon[rest.url] = { ...rest };
    });
    Array.from(Object.values(instructions2.transparent)).forEach(({ buffer: _buffer, ...rest }) => {
      if (rest.url)
        icons.transparent[rest.url] = { ...rest };
    });
    Array.from(Object.values(instructions2.maskable)).forEach(({ buffer: _buffer, ...rest }) => {
      if (rest.url)
        icons.maskable[rest.url] = { ...rest };
    });
    Array.from(Object.values(instructions2.apple)).forEach(({ buffer: _buffer, ...rest }) => {
      if (rest.url)
        icons.apple[rest.url] = { ...rest };
    });
    Array.from(Object.values(instructions2.appleSplashScreen)).forEach(({ buffer: _buffer, ...rest }) => {
      if (rest.url)
        icons.appleSplashScreen[rest.url] = { ...rest };
    });
  }
  return icons;
}
var init_utils = __esm({
  "src/pwa-assets/utils.ts"() {
    "use strict";
  }
});

// node_modules/.pnpm/kolorist@1.8.0/node_modules/kolorist/dist/esm/index.mjs
function kolorist(start, end, level = 1) {
  const open = `\x1B[${start}m`;
  const close = `\x1B[${end}m`;
  const regex = new RegExp(`\\x1b\\[${end}m`, "g");
  return (str) => {
    return options.enabled && options.supportLevel >= level ? open + ("" + str).replace(regex, open) + close : "" + str;
  };
}
var enabled, globalVar, supportLevel, options, reset, bold, dim, italic, underline, inverse, hidden, strikethrough, black, red, green, yellow, blue, magenta, cyan, white, gray, lightGray, lightRed, lightGreen, lightYellow, lightBlue, lightMagenta, lightCyan, bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite, bgGray, bgLightRed, bgLightGreen, bgLightYellow, bgLightBlue, bgLightMagenta, bgLightCyan, bgLightGray;
var init_esm = __esm({
  "node_modules/.pnpm/kolorist@1.8.0/node_modules/kolorist/dist/esm/index.mjs"() {
    "use strict";
    enabled = true;
    globalVar = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
    supportLevel = 0;
    if (globalVar.process && globalVar.process.env && globalVar.process.stdout) {
      const { FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM, COLORTERM } = globalVar.process.env;
      if (NODE_DISABLE_COLORS || NO_COLOR || FORCE_COLOR === "0") {
        enabled = false;
      } else if (FORCE_COLOR === "1" || FORCE_COLOR === "2" || FORCE_COLOR === "3") {
        enabled = true;
      } else if (TERM === "dumb") {
        enabled = false;
      } else if ("CI" in globalVar.process.env && [
        "TRAVIS",
        "CIRCLECI",
        "APPVEYOR",
        "GITLAB_CI",
        "GITHUB_ACTIONS",
        "BUILDKITE",
        "DRONE"
      ].some((vendor) => vendor in globalVar.process.env)) {
        enabled = true;
      } else {
        enabled = process.stdout.isTTY;
      }
      if (enabled) {
        if (process.platform === "win32") {
          supportLevel = 3;
        } else {
          if (COLORTERM && (COLORTERM === "truecolor" || COLORTERM === "24bit")) {
            supportLevel = 3;
          } else if (TERM && (TERM.endsWith("-256color") || TERM.endsWith("256"))) {
            supportLevel = 2;
          } else {
            supportLevel = 1;
          }
        }
      }
    }
    options = {
      enabled,
      supportLevel
    };
    reset = kolorist(0, 0);
    bold = kolorist(1, 22);
    dim = kolorist(2, 22);
    italic = kolorist(3, 23);
    underline = kolorist(4, 24);
    inverse = kolorist(7, 27);
    hidden = kolorist(8, 28);
    strikethrough = kolorist(9, 29);
    black = kolorist(30, 39);
    red = kolorist(31, 39);
    green = kolorist(32, 39);
    yellow = kolorist(33, 39);
    blue = kolorist(34, 39);
    magenta = kolorist(35, 39);
    cyan = kolorist(36, 39);
    white = kolorist(97, 39);
    gray = kolorist(90, 39);
    lightGray = kolorist(37, 39);
    lightRed = kolorist(91, 39);
    lightGreen = kolorist(92, 39);
    lightYellow = kolorist(93, 39);
    lightBlue = kolorist(94, 39);
    lightMagenta = kolorist(95, 39);
    lightCyan = kolorist(96, 39);
    bgBlack = kolorist(40, 49);
    bgRed = kolorist(41, 49);
    bgGreen = kolorist(42, 49);
    bgYellow = kolorist(43, 49);
    bgBlue = kolorist(44, 49);
    bgMagenta = kolorist(45, 49);
    bgCyan = kolorist(46, 49);
    bgWhite = kolorist(107, 49);
    bgGray = kolorist(100, 49);
    bgLightRed = kolorist(101, 49);
    bgLightGreen = kolorist(102, 49);
    bgLightYellow = kolorist(103, 49);
    bgLightBlue = kolorist(104, 49);
    bgLightMagenta = kolorist(105, 49);
    bgLightCyan = kolorist(106, 49);
    bgLightGray = kolorist(47, 49);
  }
});

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
var init_utils2 = __esm({
  "src/utils.ts"() {
    "use strict";
  }
});

// src/log.ts
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
      ...filePaths.map((p) => `  ${dim(normalizePath((0, import_node_path2.relative)(root, p)))}`)
    );
    console.info(entries.join("\n"));
  }
  warnings && warnings.length > 0 && console.warn(yellow([
    "warnings",
    ...warnings.map((w) => `  ${w}`),
    ""
  ].join("\n")));
}
var import_node_path2;
var init_log = __esm({
  "src/log.ts"() {
    "use strict";
    import_node_path2 = require("path");
    init_esm();
    init_utils2();
  }
});

// src/vite-build.ts
var vite_build_exports = {};
__export(vite_build_exports, {
  buildSW: () => buildSW
});
async function buildSW(version, options2, viteOptions, workboxPromise) {
  await options2.integration?.beforeBuildServiceWorker?.(options2);
  const { build } = await import("vite");
  const {
    inlineConfig,
    format,
    swName,
    swMjsName
  } = prepareViteBuild(options2, viteOptions);
  logSWViteBuild(version, normalizePath((0, import_node_path3.relative)(viteOptions.root, options2.swSrc)), viteOptions, format);
  await options2.integration?.configureCustomSWViteBuild?.(inlineConfig);
  await build(inlineConfig);
  if (format !== "iife") {
    const swDestDir = (0, import_node_path3.dirname)(options2.swDest);
    const mjsPath = (0, import_node_path3.resolve)(swDestDir, swMjsName);
    const jsPath = (0, import_node_path3.resolve)(swDestDir, swName);
    await import_node_fs2.promises.rename(mjsPath, jsPath);
    const mjsMapPath = `${mjsPath}.map`;
    const sourceMap = await import_node_fs2.promises.lstat(mjsMapPath).then((s) => s.isFile()).catch(() => false);
    if (sourceMap) {
      await Promise.all([
        import_node_fs2.promises.readFile(jsPath, "utf-8").then((content) => import_node_fs2.promises.writeFile(
          jsPath,
          content.replace(`${swMjsName}.map`, `${swName}.map`),
          "utf-8"
        )),
        import_node_fs2.promises.rename(mjsMapPath, `${jsPath}.map`)
      ]);
    }
  }
  if (!options2.injectManifest.injectionPoint)
    return;
  const injectManifestOptions = {
    ...options2.injectManifest,
    // this will not fail since there is an injectionPoint
    swSrc: options2.injectManifest.swDest
  };
  const { injectManifest } = await workboxPromise;
  const buildResult = await injectManifest(injectManifestOptions);
  logWorkboxResult(
    version,
    options2.throwMaximumFileSizeToCacheInBytes,
    "injectManifest",
    buildResult,
    viteOptions,
    format
  );
}
function prepareViteBuild(options2, viteOptions) {
  const define = { ...viteOptions.define ?? {} };
  const nodeEnv = options2.injectManifestBuildOptions.enableWorkboxModulesLogs ? "development" : process["env"]["NODE_ENV"] || "production";
  define["process.env.NODE_ENV"] = JSON.stringify(nodeEnv);
  const buildPlugins = options2.buildPlugins;
  const {
    format,
    plugins,
    rollupOptions
  } = options2.injectManifestRollupOptions;
  const inlineConfig = {
    root: viteOptions.root,
    base: viteOptions.base,
    resolve: viteOptions.resolve,
    mode: viteOptions.mode,
    envDir: options2.injectManifestEnvOptions.envDir,
    envPrefix: options2.injectManifestEnvOptions.envPrefix,
    // don't copy anything from public folder
    publicDir: false,
    build: {
      target: options2.injectManifestBuildOptions.target,
      minify: options2.injectManifestBuildOptions.minify,
      sourcemap: options2.injectManifestBuildOptions.sourcemap,
      outDir: options2.outDir,
      emptyOutDir: false
    },
    configFile: false,
    define,
    plugins: buildPlugins?.vite
  };
  const swName = (0, import_node_path3.basename)(options2.swDest);
  const swMjsName = swName.replace(/\.js$/, ".mjs");
  if (format !== "iife") {
    if (viteOptions.build.sourcemap) {
      Object.assign(inlineConfig, {
        ...inlineConfig,
        esbuild: {
          sourcemap: viteOptions.build.sourcemap === "hidden" ? true : viteOptions.build.sourcemap
        }
      });
    }
    Object.assign(inlineConfig.build, {
      ...inlineConfig.build,
      modulePreload: false,
      rollupOptions: {
        ...rollupOptions,
        plugins: buildPlugins?.rollup ?? plugins,
        input: options2.swSrc,
        output: {
          entryFileNames: swMjsName,
          inlineDynamicImports: true
        }
      }
    });
  } else {
    Object.assign(inlineConfig.build, {
      ...inlineConfig.build,
      lib: {
        entry: options2.swSrc,
        name: "app",
        formats: [format]
      },
      rollupOptions: {
        ...rollupOptions,
        plugins: buildPlugins?.rollup ?? plugins,
        output: {
          entryFileNames: swName
        }
      }
    });
  }
  return {
    inlineConfig,
    swName,
    swMjsName,
    format
  };
}
var import_node_path3, import_node_fs2;
var init_vite_build = __esm({
  "src/vite-build.ts"() {
    "use strict";
    import_node_path3 = require("path");
    import_node_fs2 = require("fs");
    init_log();
    init_utils2();
  }
});

// src/pwa-assets/config.ts
async function loadAssetsGeneratorContext(ctx, assetsGeneratorContext) {
  const root = ctx.viteConfig.root ?? process.cwd();
  const { config, sources } = await loadConfiguration(root, ctx);
  if (!config.preset) {
    console.error([
      "",
      cyan(`PWA v${ctx.version}`),
      red("ERROR: No preset for assets generator found")
    ].join("\n"));
    return;
  }
  const {
    preset,
    images,
    headLinkOptions: userHeadLinkOptions
  } = config;
  if (!images) {
    console.error([
      "",
      cyan(`PWA v${ctx.version}`),
      red("ERROR: No image provided for assets generator")
    ].join("\n"));
    return;
  }
  if (Array.isArray(images)) {
    if (!images.length) {
      console.error([
        "",
        cyan(`PWA v${ctx.version}`),
        red("ERROR: No image provided for assets generator")
      ].join("\n"));
      return;
    }
    if (images.length > 1) {
      console.error([
        "",
        cyan(`PWA v${ctx.version}`),
        red("ERROR: Only one image is supported for assets generator")
      ].join("\n"));
      return;
    }
  }
  const pwaAssets = ctx.options.pwaAssets;
  const useImage = Array.isArray(images) ? images[0] : images;
  const imageFile = (0, import_node_path9.resolve)(root, useImage);
  const publicDir = pwaAssets.integration?.publicDir ?? (0, import_node_path9.resolve)(root, ctx.viteConfig.publicDir || "public");
  const outDir = pwaAssets.integration?.outDir ?? (0, import_node_path9.resolve)(root, ctx.viteConfig.build?.outDir || "dist");
  const imageName = (0, import_node_path9.relative)(publicDir, imageFile);
  const imageOutDir = (0, import_node_path9.dirname)((0, import_node_path9.resolve)(outDir, imageName));
  const xhtml = userHeadLinkOptions?.xhtml === true;
  const includeId = userHeadLinkOptions?.includeId === true;
  const assetsInstructions = await (0, import_instructions.instructions)({
    imageResolver: () => (0, import_promises.readFile)(imageFile),
    imageName,
    preset,
    faviconPreset: userHeadLinkOptions?.preset ?? pwaAssets.htmlPreset,
    htmlLinks: { xhtml, includeId },
    basePath: pwaAssets.integration?.baseUrl || ctx.viteConfig.base || "/",
    resolveSvgName: userHeadLinkOptions?.resolveSvgName ?? ((name) => (0, import_node_path9.basename)(name))
  });
  const {
    includeHtmlHeadLinks = true,
    overrideManifestIcons: useOverrideManifestIcons,
    injectThemeColor = false
  } = pwaAssets;
  const overrideManifestIcons = ctx.options.manifest === false || !ctx.options.manifest ? false : "icons" in ctx.options.manifest ? useOverrideManifestIcons : true;
  if (assetsGeneratorContext === void 0) {
    return {
      lastModified: Date.now(),
      assetsInstructions,
      cache: /* @__PURE__ */ new Map(),
      useImage,
      imageFile,
      publicDir,
      outDir,
      imageName,
      imageOutDir,
      xhtml,
      includeId,
      // normalize sources
      sources: sources.map((source) => source.replace(/\\/g, "/")),
      injectThemeColor,
      includeHtmlHeadLinks,
      overrideManifestIcons
    };
  }
  assetsGeneratorContext.lastModified = Date.now();
  assetsGeneratorContext.assetsInstructions = assetsInstructions;
  assetsGeneratorContext.useImage = useImage;
  assetsGeneratorContext.imageFile = imageFile;
  assetsGeneratorContext.outDir = outDir;
  assetsGeneratorContext.imageName = imageName;
  assetsGeneratorContext.imageOutDir = imageOutDir;
  assetsGeneratorContext.xhtml = xhtml;
  assetsGeneratorContext.includeId = includeId;
  assetsGeneratorContext.injectThemeColor = injectThemeColor;
  assetsGeneratorContext.includeHtmlHeadLinks = includeHtmlHeadLinks;
  assetsGeneratorContext.overrideManifestIcons = overrideManifestIcons;
  assetsGeneratorContext.cache.clear();
}
async function loadConfiguration(root, ctx) {
  const pwaAssets = ctx.options.pwaAssets;
  if (pwaAssets.config === false) {
    return await (0, import_config.loadConfig)(root, {
      config: false,
      preset: pwaAssets.preset,
      images: pwaAssets.images,
      logLevel: "silent"
    });
  }
  return await (0, import_config.loadConfig)(
    root,
    typeof pwaAssets.config === "boolean" ? root : { config: pwaAssets.config }
  );
}
var import_node_path9, import_promises, import_config, import_instructions;
var init_config = __esm({
  "src/pwa-assets/config.ts"() {
    "use strict";
    import_node_path9 = require("path");
    import_promises = require("fs/promises");
    import_config = require("@vite-pwa/assets-generator/config");
    init_esm();
    import_instructions = require("@vite-pwa/assets-generator/api/instructions");
  }
});

// src/pwa-assets/build.ts
async function generate(assetsGeneratorContext) {
  await (0, import_promises2.mkdir)(assetsGeneratorContext.imageOutDir, { recursive: true });
  await (0, import_generate_assets.generateAssets)(assetsGeneratorContext.assetsInstructions, true, assetsGeneratorContext.imageOutDir);
}
var import_promises2, import_generate_assets;
var init_build = __esm({
  "src/pwa-assets/build.ts"() {
    "use strict";
    import_promises2 = require("fs/promises");
    import_generate_assets = require("@vite-pwa/assets-generator/api/generate-assets");
  }
});

// src/pwa-assets/dev.ts
async function findIconAsset(path, { assetsInstructions, cache, lastModified }) {
  let resolved = cache.get(path);
  if (resolved) {
    resolved.age = Date.now() - lastModified;
    return resolved;
  }
  const iconAsset = assetsInstructions.transparent[path] ?? assetsInstructions.maskable[path] ?? assetsInstructions.apple[path] ?? assetsInstructions.favicon[path] ?? assetsInstructions.appleSplashScreen[path];
  if (!iconAsset)
    return;
  if (iconAsset) {
    resolved = {
      path,
      mimeType: iconAsset.mimeType,
      buffer: iconAsset.buffer(),
      lastModified: Date.now(),
      age: 0
    };
    cache.set(path, resolved);
    return resolved;
  }
}
async function checkHotUpdate(file, ctx, assetsGeneratorContext) {
  const result = assetsGeneratorContext.sources.includes(file);
  if (result)
    await loadAssetsGeneratorContext(ctx, assetsGeneratorContext);
  return result;
}
var init_dev = __esm({
  "src/pwa-assets/dev.ts"() {
    "use strict";
    init_config();
  }
});

// src/pwa-assets/html.ts
function transformIndexHtml(html, ctx, assetsGeneratorContext) {
  if (assetsGeneratorContext.injectThemeColor) {
    const manifest = ctx.options.manifest;
    if (manifest && "theme_color" in manifest && manifest.theme_color) {
      html = html.replace(
        "</head>",
        `
<meta name="theme-color" content="${manifest.theme_color}"></head>`
      );
    }
  }
  if (assetsGeneratorContext.includeHtmlHeadLinks) {
    const link = (0, import_generate_html_markup.generateHtmlMarkup)(assetsGeneratorContext.assetsInstructions);
    if (link.length)
      html = html.replace("</head>", `
${link.join("\n")}</head>`);
  }
  return html;
}
function resolveHtmlAssets(ctx, assetsGeneratorContext) {
  const header = {
    links: [],
    themeColor: void 0
  };
  if (assetsGeneratorContext.injectThemeColor) {
    const manifest = ctx.options.manifest;
    if (manifest && "theme_color" in manifest && manifest.theme_color)
      header.themeColor = { name: "theme-color", content: manifest.theme_color };
  }
  if (assetsGeneratorContext.includeHtmlHeadLinks) {
    const includeId = assetsGeneratorContext.includeId;
    const instruction = assetsGeneratorContext.assetsInstructions;
    const favicon = Array.from(Object.values(instruction.favicon));
    const apple = Array.from(Object.values(instruction.apple));
    const appleSplashScreen = Array.from(Object.values(instruction.appleSplashScreen));
    favicon.forEach((icon) => icon.linkObject && header.links.push(mapLink(includeId, icon.linkObject)));
    apple.forEach((icon) => icon.linkObject && header.links.push(mapLink(includeId, icon.linkObject)));
    appleSplashScreen.forEach((icon) => icon.linkObject && header.links.push(mapLink(includeId, icon.linkObject)));
  }
  return header;
}
var import_generate_html_markup;
var init_html = __esm({
  "src/pwa-assets/html.ts"() {
    "use strict";
    import_generate_html_markup = require("@vite-pwa/assets-generator/api/generate-html-markup");
    init_utils();
  }
});

// src/pwa-assets/manifest.ts
function injectManifestIcons(ctx, assetsGeneratorContext) {
  if (!assetsGeneratorContext.overrideManifestIcons)
    return;
  const manifest = ctx.options.manifest;
  if (manifest) {
    manifest.icons = (0, import_generate_manifest_icons_entry.generateManifestIconsEntry)(
      "object",
      assetsGeneratorContext.assetsInstructions
    ).icons;
  }
}
var import_generate_manifest_icons_entry;
var init_manifest = __esm({
  "src/pwa-assets/manifest.ts"() {
    "use strict";
    import_generate_manifest_icons_entry = require("@vite-pwa/assets-generator/api/generate-manifest-icons-entry");
  }
});

// src/pwa-assets/generator.ts
var generator_exports = {};
__export(generator_exports, {
  loadInstructions: () => loadInstructions
});
async function loadInstructions(ctx) {
  const assetsGeneratorContext = await loadAssetsGeneratorContext(ctx);
  if (!assetsGeneratorContext)
    return;
  return {
    generate: () => generate(assetsGeneratorContext),
    findIconAsset: (path) => findIconAsset(path, assetsGeneratorContext),
    resolveHtmlAssets: () => resolveHtmlAssets(ctx, assetsGeneratorContext),
    transformIndexHtml: (html) => transformIndexHtml(html, ctx, assetsGeneratorContext),
    injectManifestIcons: () => injectManifestIcons(ctx, assetsGeneratorContext),
    instructions: () => assetsGeneratorContext.assetsInstructions,
    icons: () => extractIcons(assetsGeneratorContext.assetsInstructions),
    checkHotUpdate: (file) => checkHotUpdate(file, ctx, assetsGeneratorContext)
  };
}
var init_generator = __esm({
  "src/pwa-assets/generator.ts"() {
    "use strict";
    init_config();
    init_build();
    init_dev();
    init_html();
    init_manifest();
    init_utils();
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  VitePWA: () => VitePWA,
  cachePreset: () => cachePreset,
  defaultInjectManifestVitePlugins: () => defaultInjectManifestVitePlugins
});
module.exports = __toCommonJS(src_exports);

// src/context.ts
var import_node_fs = require("fs");
var import_node_path = require("path");
var import_node_url = require("url");
var import_meta = {};
function createContext(userOptions) {
  const _dirname2 = typeof __dirname !== "undefined" ? __dirname : (0, import_node_path.dirname)((0, import_node_url.fileURLToPath)(import_meta.url));
  const { version } = JSON.parse(
    (0, import_node_fs.readFileSync)((0, import_node_path.resolve)(_dirname2, "../package.json"), "utf-8")
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
init_utils();
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
function generateSimpleSWRegister(options2, dev) {
  const path = dev ? `${options2.base}${DEV_SW_NAME}` : `${options2.buildBase}${options2.filename}`;
  if (dev) {
    const swType = options2.devOptions.type ?? "classic";
    return `if('serviceWorker' in navigator) navigator.serviceWorker.register('${path}', { scope: '${options2.scope}', type: '${swType}' })`;
  }
  return `
if('serviceWorker' in navigator) {
window.addEventListener('load', () => {
navigator.serviceWorker.register('${path}', { scope: '${options2.scope}' })
})
}`.replace(/\n/g, "");
}
function injectServiceWorker(html, options2, dev) {
  const manifest = generateWebManifest(options2, dev);
  if (!dev) {
    const script = generateRegisterSW(options2, dev);
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
function generateWebManifest(options2, dev) {
  const crossorigin = options2.useCredentials ? ' crossorigin="use-credentials"' : "";
  if (dev) {
    const name = options2.devOptions.webManifestUrl ?? `${options2.base}${options2.manifestFilename}`;
    return options2.manifest ? `<link rel="manifest" href="${name}"${crossorigin}>` : "";
  } else {
    return options2.manifest ? `<link rel="manifest" href="${options2.buildBase}${options2.manifestFilename}"${crossorigin}>` : "";
  }
}
function generateRegisterSW(options2, dev) {
  if (options2.injectRegister === "inline") {
    return `<script id="vite-plugin-pwa:inline-sw">${generateSimpleSWRegister(options2, dev)}</script>`;
  } else if (options2.injectRegister === "script" || options2.injectRegister === "script-defer") {
    const hasDefer = options2.injectRegister === "script-defer";
    return `<script id="vite-plugin-pwa:register-sw" src="${dev ? options2.base : options2.buildBase}${FILE_SW_REGISTER}"${hasDefer ? " defer" : ""}></script>`;
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
var import_node_path6 = require("path");
var import_node_fs5 = require("fs");
init_esm();

// src/modules.ts
var import_node_path4 = require("path");
var import_node_fs3 = require("fs");
var import_node_url2 = require("url");
init_log();
var import_meta2 = {};
var _dirname = typeof __dirname !== "undefined" ? __dirname : (0, import_node_path4.dirname)((0, import_node_url2.fileURLToPath)(import_meta2.url));
async function loadWorkboxBuild() {
  try {
    const workbox = await import("workbox-build");
    return workbox.default ?? workbox;
  } catch (_) {
    return require("workbox-build");
  }
}
async function generateRegisterSW2(options2, mode, source = "register") {
  const sw = options2.buildBase + options2.filename;
  const scope = options2.scope;
  const content = await import_node_fs3.promises.readFile((0, import_node_path4.resolve)(_dirname, `client/${mode}/${source}.js`), "utf-8");
  return content.replace(/__SW__/g, sw).replace("__SCOPE__", scope).replace("__SW_AUTO_UPDATE__", `${options2.registerType === "autoUpdate"}`).replace("__SW_SELF_DESTROYING__", `${options2.selfDestroying}`).replace("__TYPE__", `${options2.devOptions.enabled ? options2.devOptions.type : "classic"}`);
}
async function generateServiceWorker(version, options2, viteOptions) {
  if (options2.selfDestroying) {
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
    await import_node_fs3.promises.writeFile(options2.swDest.replace(/\\/g, "/"), selfDestroyingSW, { encoding: "utf8" });
    return {
      count: 1,
      size: selfDestroyingSW.length,
      warnings: [],
      filePaths: [options2.filename]
    };
  }
  await options2.integration?.beforeBuildServiceWorker?.(options2);
  const { generateSW } = await loadWorkboxBuild();
  const buildResult = await generateSW(options2.workbox);
  logWorkboxResult(
    version,
    options2.throwMaximumFileSizeToCacheInBytes,
    "generateSW",
    buildResult,
    viteOptions
  );
  return buildResult;
}
async function generateInjectManifest(version, options2, viteOptions) {
  const { selfDestroying } = options2;
  if (selfDestroying) {
    await generateServiceWorker(version, options2, viteOptions);
    return;
  }
  await Promise.resolve().then(() => (init_vite_build(), vite_build_exports)).then(({ buildSW: buildSW2 }) => buildSW2(version, options2, viteOptions, loadWorkboxBuild()));
}

// src/assets.ts
var import_node_path5 = require("path");
var import_node_fs4 = __toESM(require("fs"), 1);
var import_node_crypto = __toESM(require("crypto"), 1);
var import_tinyglobby = require("tinyglobby");
function buildManifestEntry(publicDir, url) {
  return new Promise((resolve8, reject) => {
    const cHash = import_node_crypto.default.createHash("MD5");
    const stream = import_node_fs4.default.createReadStream((0, import_node_path5.resolve)(publicDir, url));
    stream.on("error", (err) => {
      reject(err);
    });
    stream.on("data", (chunk) => {
      cHash.update(chunk);
    });
    stream.on("end", () => {
      return resolve8({
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
    let assets = await (0, import_tinyglobby.glob)({
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
    const cHash = import_node_crypto.default.createHash("MD5");
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
function generateWebManifestFile(options2) {
  return `${JSON.stringify(options2.manifest, null, options2.minify ? 0 : 2)}
`;
}

// src/api.ts
async function _generateSW({ options: options2, version, viteConfig }) {
  if (options2.disable)
    return;
  if (options2.strategies === "injectManifest")
    await generateInjectManifest(version, options2, viteConfig);
  else
    await generateServiceWorker(version, options2, viteConfig);
}
function _generateBundle(ctx, bundle) {
  const { options: options2, viteConfig, useImportRegister } = ctx;
  if (options2.disable || !bundle)
    return;
  if (options2.manifest) {
    if (!options2.manifest.theme_color) {
      console.warn([
        "",
        `${cyan(`PWA v${ctx.version}`)}`,
        `${yellow('WARNING: "theme_color" is missing from the web manifest, your application will not be able to be installed')}`
      ].join("\n"));
    }
    bundle[options2.manifestFilename] = {
      // @ts-expect-error: for Vite 3 support, Vite 4 has removed `isAsset` property
      isAsset: true,
      type: "asset",
      name: void 0,
      source: generateWebManifestFile(options2),
      fileName: options2.manifestFilename
    };
  }
  if (options2.injectRegister === "auto")
    options2.injectRegister = useImportRegister ? false : "script";
  if ((options2.injectRegister === "script" || options2.injectRegister === "script-defer") && !(0, import_node_fs5.existsSync)((0, import_node_path6.resolve)(viteConfig.publicDir, FILE_SW_REGISTER))) {
    bundle[FILE_SW_REGISTER] = {
      // @ts-expect-error: for Vite 3 support, Vite 4 has removed `isAsset` property
      isAsset: true,
      type: "asset",
      name: void 0,
      source: generateSimpleSWRegister(options2, false),
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
      const options2 = ctx?.options;
      if (!options2 || options2.disable || !options2.manifest || ctx.devEnvironment && !ctx.options.devOptions.enabled)
        return void 0;
      let url = options2.manifestFilename;
      let manifest;
      if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
        url = ctx.options.devOptions.webManifestUrl ?? options2.manifestFilename;
        manifest = generateWebManifest(options2, true);
      } else {
        manifest = generateWebManifest(options2, false);
      }
      return {
        href: `${ctx.devEnvironment ? options2.base : options2.buildBase}${url}`,
        useCredentials: ctx.options.useCredentials,
        toLinkTag() {
          return manifest;
        }
      };
    },
    registerSWData() {
      const options2 = ctx?.options;
      if (!options2 || options2.disable || ctx.devEnvironment && !ctx.options.devOptions.enabled)
        return void 0;
      const mode = options2.injectRegister;
      if (!mode || ctx.useImportRegister)
        return void 0;
      let type = "classic";
      let script;
      let shouldRegisterSW = options2.injectRegister === "inline" || options2.injectRegister === "script" || options2.injectRegister === "script-defer";
      if (ctx.devEnvironment && ctx.options.devOptions.enabled === true) {
        type = ctx.options.devOptions.type ?? "classic";
        script = generateRegisterDevSW(ctx.options.base);
        shouldRegisterSW = true;
      } else if (shouldRegisterSW) {
        script = generateRegisterSW(options2, false);
      }
      const base = ctx.devEnvironment ? options2.base : options2.buildBase;
      return {
        // hint when required
        shouldRegisterSW,
        inline: options2.injectRegister === "inline",
        mode: mode === "auto" ? "script" : mode,
        scope: options2.scope,
        inlinePath: `${base}${ctx.devEnvironment ? DEV_SW_NAME : options2.filename}`,
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
      const { options: options2 } = ctx;
      if (options2.disable)
        return;
      const configField = options2.strategies === "generateSW" ? "workbox" : "injectManifest";
      const result = fn(options2[configField].additionalManifestEntries || []);
      if (result != null)
        options2[configField].additionalManifestEntries = result;
    },
    pwaAssetsGenerator() {
      return ctx.pwaAssetsGenerator;
    }
  };
}

// src/plugins/build.ts
function BuildPlugin(ctx) {
  const transformIndexHtmlHandler2 = (html) => {
    const { options: options2, useImportRegister } = ctx;
    if (options2.disable)
      return html;
    if (options2.injectRegister === "auto")
      options2.injectRegister = useImportRegister ? null : "script";
    return injectServiceWorker(html, options2, false);
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
var import_node_path7 = require("path");
var import_node_fs6 = require("fs");
init_esm();
init_utils2();
var swDevOptions = {
  swUrl: DEV_SW_NAME,
  swDevGenerated: false,
  registerSWGenerated: false,
  workboxPaths: /* @__PURE__ */ new Map()
};
function DevPlugin(ctx) {
  const transformIndexHtmlHandler2 = (html) => {
    const { options: options2 } = ctx;
    if (options2.disable || !options2.devOptions.enabled)
      return html;
    html = injectServiceWorker(html, options2, true);
    return html.replace(
      "</body>",
      `${generateRegisterDevSW(options2.base)}
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
      const { options: options2 } = ctx;
      if (!options2.disable && options2.devOptions.enabled) {
        server.ws.on(DEV_READY_NAME, createWSResponseHandler2(server, ctx));
        if (options2.manifest) {
          const name = options2.devOptions.webManifestUrl ?? `${options2.base}${options2.manifestFilename}`;
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
              res.write(generateWebManifestFile(options2), "utf-8");
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
      const { options: options2 } = ctx;
      if (!options2.disable && options2.devOptions.enabled && options2.strategies === "injectManifest" && !options2.selfDestroying) {
        let name = id.startsWith(options2.base) ? id.slice(options2.base.length) : id;
        if (name.length && name[0] === "/")
          name = name.slice(1);
        return name === swDevOptions.swUrl || name === options2.injectManifest.swSrc ? options2.injectManifest.swSrc : void 0;
      }
      return void 0;
    },
    async load(id) {
      if (id === RESOLVED_DEV_SW_VIRTUAL)
        return generateSWHMR();
      const { options: options2, viteConfig } = ctx;
      if (!options2.disable && options2.devOptions.enabled) {
        if (options2.strategies === "injectManifest" && !options2.selfDestroying) {
          const swSrc = normalizePath(options2.injectManifest.swSrc);
          if (id === swSrc) {
            let content = await import_node_fs6.promises.readFile(options2.injectManifest.swSrc, "utf-8");
            const resolvedIP = options2.injectManifest.injectionPoint;
            if (resolvedIP) {
              const ip = new RegExp(resolvedIP, "g");
              const navigateFallback = options2.devOptions.navigateFallback;
              if (navigateFallback)
                content = content.replace(ip, `[{ url: '${navigateFallback}' }]`);
              else
                content = content.replace(ip, "[]");
            }
            return content;
          }
          if (swDevOptions.workboxPaths.has(id))
            return await import_node_fs6.promises.readFile(swDevOptions.workboxPaths.get(id), "utf-8");
          return void 0;
        }
        if (id.endsWith(swDevOptions.swUrl)) {
          const globDirectory = await resolveDevDistFolder(options2, viteConfig);
          if (!(0, import_node_fs6.existsSync)(globDirectory))
            (0, import_node_fs6.mkdirSync)(globDirectory, { recursive: true });
          const swDest = (0, import_node_path7.resolve)(globDirectory, "sw.js");
          if (!swDevOptions.swDevGenerated) {
            let suppressWarnings;
            if (options2.devOptions.suppressWarnings === true) {
              suppressWarnings = normalizePath((0, import_node_path7.resolve)(globDirectory, "suppress-warnings.js"));
              await import_node_fs6.promises.writeFile(suppressWarnings, "", "utf-8");
            }
            const globPatterns = options2.devOptions.suppressWarnings === true ? ["suppress-warnings.js"] : options2.workbox.globPatterns;
            const navigateFallback = options2.workbox.navigateFallback;
            const { filePaths } = await generateServiceWorker(
              ctx.version,
              Object.assign(
                {},
                options2,
                {
                  swDest: options2.selfDestroying ? swDest : options2.swDest,
                  workbox: {
                    ...options2.workbox,
                    navigateFallbackAllowlist: options2.devOptions.navigateFallbackAllowlist ?? [/^\/$/],
                    runtimeCaching: options2.devOptions.disableRuntimeConfig ? void 0 : options2.workbox.runtimeCaching,
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
              const name = (0, import_node_path7.basename)(we);
              if (name !== "sw.js")
                swDevOptions.workboxPaths.set(normalizePath(`${options2.base}${name}`), we);
            });
            if (suppressWarnings) {
              swDevOptions.workboxPaths.set(
                normalizePath(`${options2.base}${(0, import_node_path7.basename)(suppressWarnings)}`),
                suppressWarnings
              );
            }
            swDevOptions.swDevGenerated = true;
          }
          return await import_node_fs6.promises.readFile(swDest, "utf-8");
        }
        if (id.startsWith(options2.base)) {
          const key = normalizePath(id);
          if (swDevOptions.workboxPaths.has(key))
            return await import_node_fs6.promises.readFile(swDevOptions.workboxPaths.get(key), "utf-8");
        } else if (options2.base !== "/") {
          const key = normalizePath(`${options2.base}${id.length > 0 && id[0] === "/" ? id.slice(1) : id}`);
          if (swDevOptions.workboxPaths.has(key))
            return await import_node_fs6.promises.readFile(swDevOptions.workboxPaths.get(key), "utf-8");
        }
      }
    }
  };
}
async function resolveDevDistFolder(options2, viteConfig) {
  return options2.devOptions.resolveTempFolder ? await options2.devOptions.resolveTempFolder() : (0, import_node_path7.resolve)(viteConfig.root, "dev-dist");
}
async function createDevRegisterSW(options2, viteConfig) {
  if (options2.injectRegister === "script" || options2.injectRegister === "script-defer") {
    const devDist = await resolveDevDistFolder(options2, viteConfig);
    if (!(0, import_node_fs6.existsSync)(devDist))
      (0, import_node_fs6.mkdirSync)(devDist, { recursive: true });
    const registerSW = (0, import_node_path7.resolve)(devDist, FILE_SW_REGISTER);
    if (!swDevOptions.registerSWGenerated) {
      await import_node_fs6.promises.writeFile(registerSW, generateSimpleSWRegister(options2, true), { encoding: "utf8" });
      swDevOptions.registerSWGenerated = true;
    }
    swDevOptions.workboxPaths.set(normalizePath(`${options2.base}${FILE_SW_REGISTER}`), registerSW);
  }
}
function createWSResponseHandler2(server, ctx) {
  return async () => {
    const { options: options2, useImportRegister } = ctx;
    const { injectRegister, scope, base } = options2;
    if (!useImportRegister && injectRegister) {
      if (injectRegister === "auto")
        options2.injectRegister = "script";
      await createDevRegisterSW(options2, ctx.viteConfig);
      server.ws.send({
        type: "custom",
        event: DEV_REGISTER_SW_NAME,
        data: {
          mode: options2.injectRegister,
          scope,
          inlinePath: `${base}${DEV_SW_NAME}`,
          registerPath: `${base}${FILE_SW_REGISTER}`,
          swType: options2.devOptions.type
        }
      });
    }
  };
}

// src/plugins/main.ts
init_esm();

// src/options.ts
var import_node_fs7 = __toESM(require("fs"), 1);
var import_node_path8 = require("path");
var import_node_process = __toESM(require("process"), 1);
init_utils2();

// src/pwa-assets/options.ts
function resolvePWAAssetsOptions(options2) {
  if (!options2)
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
  } = options2 ?? {};
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
  if ("config" in options2 && !!options2.config) {
    resolvedConfiguration.disabled = false;
    resolvedConfiguration.config = options2.config;
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
  const swSrc = (0, import_node_path8.resolve)(root, srcDir, filename);
  if (injectManifest && (0, import_node_path8.extname)(filename) === ".ts" && import_node_fs7.default.existsSync(swSrc)) {
    const useFilename = `${filename.substring(0, filename.lastIndexOf("."))}.js`;
    return {
      swSrc,
      swDest: (0, import_node_path8.resolve)(root, outDir, useFilename),
      useFilename
    };
  }
  return {
    swSrc,
    swDest: (0, import_node_path8.resolve)(root, outDir, filename)
  };
}
async function resolveOptions(ctx) {
  const { userOptions: options2, viteConfig } = ctx;
  const root = viteConfig.root;
  const pkg = import_node_fs7.default.existsSync("package.json") ? JSON.parse(import_node_fs7.default.readFileSync("package.json", "utf-8")) : {};
  const {
    // prevent tsup replacing `process.env`
    // eslint-disable-next-line dot-notation
    mode = import_node_process.default["env"]["NODE_ENV"] || "production",
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
  } = options2;
  const basePath = resolveBasePath(base);
  const { swSrc, swDest, useFilename } = resolveSwPaths(
    strategies === "injectManifest",
    root,
    srcDir,
    outDir,
    filename
  );
  const outDirRoot = (0, import_node_path8.resolve)(root, outDir);
  const scope = options2.scope || basePath;
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
  const workbox = Object.assign({}, defaultWorkbox, options2.workbox || {});
  const manifest = typeof options2.manifest === "boolean" && !options2.manifest ? false : Object.assign({}, defaultManifest, options2.manifest || {});
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
  } = options2.injectManifest || {};
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
        ctx.pwaAssetsGenerator = Promise.resolve().then(() => (init_generator(), generator_exports)).then(({ loadInstructions: loadInstructions2 }) => loadInstructions2(ctx)).catch((e) => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VitePWA,
  cachePreset,
  defaultInjectManifestVitePlugins
});
