#!/usr/bin/env node

import { existsSync, mkdirSync } from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { saveImage } from "./utils/filemanager.js";
import ImageFx from "./index.js";
import type { AspectRatio, ImageModel } from "./global.types.js";

const modelChoices = [
  "IMAGEN_2",
  "IMAGEN_3",
  "IMAGEN_4",
  "IMAGEN_3_1",
  "IMAGEN_3_5",
  "IMAGEN_2_LANDSCAPE",
  "IMAGEN_3_PORTRAIT",
  "IMAGEN_3_LANDSCAPE",
  "IMAGEN_3_PORTRAIT_THREE_FOUR",
  "IMAGEN_3_LANDSCAPE_FOUR_THREE",
  "IMAGE_MODEL_NAME_UNSPECIFIED",
] as const;

const aspectRatioChoices = [
  "IMAGE_ASPECT_RATIO_SQUARE",
  "IMAGE_ASPECT_RATIO_PORTRAIT",
  "IMAGE_ASPECT_RATIO_LANDSCAPE",
  "IMAGE_ASPECT_RATIO_UNSPECIFIED",
  "IMAGE_ASPECT_RATIO_LANDSCAPE_FOUR_THREE",
  "IMAGE_ASPECT_RATIO_PORTRAIT_THREE_FOUR",
] as const;

const argv = await yargs(hideBin(process.argv))
  .usage("Usage: $0 [options]")
  .option("auth", {
    type: "string",
    describe: "Authentication token for generating images",
  })
  .option("cookie", {
    type: "string",
    describe: "Cookie - if you need to generate auth token automatically",
  })
  .option("seed", {
    type: "number",
    default: null,
    describe: "Seed value for a reference image (Default: null)",
  })
  .option("count", {
    type: "number",
    default: 4,
    describe: "Number of images to generate (Default: 4)",
  })
  .option("prompt", {
    type: "string",
    describe: "Prompt for generating image",
  })
  .option("dir", {
    type: "string",
    default: ".",
    describe: "Location to save generated images (Default: .)",
  })
  .option("model", {
    type: "string",
    default: "IMAGEN_4",
    describe: "Model to use for generating images (Default: IMAGEN_4)",
    choices: modelChoices,
  })
  .option("ratio", {
    type: "string",
    default: "IMAGE_ASPECT_RATIO_LANDSCAPE",
    describe: "Aspect ratio for generated images",
    choices: aspectRatioChoices,
  })
  .demandOption(["prompt"], "[!] Prompt is required.")
  .help()
  .parse();

if (!argv.auth && !argv.cookie) {
  console.error(
    "[!] Missing authentication token. Please refer to: github.com/rohitaryal/imageFX-api"
  );
  process.exit(1);
}

// Create destination dir if it doesn't exist
if (argv.dir && !existsSync(argv.dir) && argv.dir !== ".") {
  try {
    mkdirSync(argv.dir, { recursive: true });
  } catch (err) {
    console.error(`[!] Failed to make destination directory: ${argv.dir}`);
    console.error(err);
    process.exit(1);
  }
}

const fx = new ImageFx({
  cookie: argv.cookie,
  authorizationKey: argv.auth,
});

const resp = await fx.generateImage({
  prompt: argv.prompt,
  count: argv.count,
  aspectRatio: argv.ratio as AspectRatio || "IMAGE_ASPECT_RATIO_LANDSCAPE",
  model: argv.model as ImageModel || "IMAGEN_4",
  seed: argv.seed || 0,
});

if (resp.Err || !resp.Ok) {
  console.error("[!] Failed to generate image: " + resp.Err);
  process.exit(1);
}

// Save images
resp.Ok?.forEach((image, index) => {
  const time = new Date().getTime();
  const imageName = `image-${time}-${index + 1}.png`;
  saveImage(imageName, image.encodedImage, argv.dir);
});

