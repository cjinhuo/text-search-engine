import {
  extractIcons,
  mapLink
} from "./chunk-SF7B43FO.js";
import {
  cyan,
  red
} from "./chunk-UB6OAFZF.js";

// src/pwa-assets/config.ts
import { basename, dirname, relative, resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { loadConfig } from "@vite-pwa/assets-generator/config";
import { instructions } from "@vite-pwa/assets-generator/api/instructions";
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
  const imageFile = resolve(root, useImage);
  const publicDir = pwaAssets.integration?.publicDir ?? resolve(root, ctx.viteConfig.publicDir || "public");
  const outDir = pwaAssets.integration?.outDir ?? resolve(root, ctx.viteConfig.build?.outDir || "dist");
  const imageName = relative(publicDir, imageFile);
  const imageOutDir = dirname(resolve(outDir, imageName));
  const xhtml = userHeadLinkOptions?.xhtml === true;
  const includeId = userHeadLinkOptions?.includeId === true;
  const assetsInstructions = await instructions({
    imageResolver: () => readFile(imageFile),
    imageName,
    preset,
    faviconPreset: userHeadLinkOptions?.preset ?? pwaAssets.htmlPreset,
    htmlLinks: { xhtml, includeId },
    basePath: pwaAssets.integration?.baseUrl || ctx.viteConfig.base || "/",
    resolveSvgName: userHeadLinkOptions?.resolveSvgName ?? ((name) => basename(name))
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
    return await loadConfig(root, {
      config: false,
      preset: pwaAssets.preset,
      images: pwaAssets.images,
      logLevel: "silent"
    });
  }
  return await loadConfig(
    root,
    typeof pwaAssets.config === "boolean" ? root : { config: pwaAssets.config }
  );
}

// src/pwa-assets/build.ts
import { mkdir } from "node:fs/promises";
import { generateAssets } from "@vite-pwa/assets-generator/api/generate-assets";
async function generate(assetsGeneratorContext) {
  await mkdir(assetsGeneratorContext.imageOutDir, { recursive: true });
  await generateAssets(assetsGeneratorContext.assetsInstructions, true, assetsGeneratorContext.imageOutDir);
}

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

// src/pwa-assets/html.ts
import { generateHtmlMarkup } from "@vite-pwa/assets-generator/api/generate-html-markup";
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
    const link = generateHtmlMarkup(assetsGeneratorContext.assetsInstructions);
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

// src/pwa-assets/manifest.ts
import { generateManifestIconsEntry } from "@vite-pwa/assets-generator/api/generate-manifest-icons-entry";
function injectManifestIcons(ctx, assetsGeneratorContext) {
  if (!assetsGeneratorContext.overrideManifestIcons)
    return;
  const manifest = ctx.options.manifest;
  if (manifest) {
    manifest.icons = generateManifestIconsEntry(
      "object",
      assetsGeneratorContext.assetsInstructions
    ).icons;
  }
}

// src/pwa-assets/generator.ts
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
export {
  loadInstructions
};
