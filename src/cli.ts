import fs from "fs";
import argv from "argparse";
import { saveImage } from "./utils/filemanager.ts";
import ImageFx from "./index.ts";

const parser = new argv.ArgumentParser({
  description: "Generate ImageFX images directly from your terminal",

});

const modelChoices = [
  "IMAGEN_2",
  "IMAGEN_3",
  "IMAGEN_4", // Actually IMAGEN_3_5
  "IMAGEN_3_1",
  "IMAGEN_3_5",
  "IMAGEN_2_LANDSCAPE",
  "IMAGEN_3_PORTRAIT",
  "IMAGEN_3_LANDSCAPE",
  "IMAGEN_3_PORTRAIT_THREE_FOUR",
  "IMAGEN_3_LANDSCAPE_FOUR_THREE",
  "IMAGE_MODEL_NAME_UNSPECIFIED",
];
const aspectRatioChoices = [
  "IMAGE_ASPECT_RATIO_SQUARE",
  "IMAGE_ASPECT_RATIO_PORTRAIT",
  "IMAGE_ASPECT_RATIO_LANDSCAPE",
  "IMAGE_ASPECT_RATIO_UNSPECIFIED",
  "IMAGE_ASPECT_RATIO_LANDSCAPE_FOUR_THREE",
  "IMAGE_ASPECT_RATIO_PORTRAIT_THREE_FOUR",
];

// Register some flags
parser.add_argument("--auth", {
  type: "str",
  help: "Authentication token for generating images",
});
parser.add_argument("--cookie", {
  type: "str",
  help: "Cookie - if you need to generate auth token automatically"
})
parser.add_argument("--seed", {
  type: "int",
  default: null,
  help: "Seed value for a reference image (Default: null)",
});
parser.add_argument("--count", {
  type: "int",
  default: 4,
  help: "Number of images to generate (Default: 4)",
});
parser.add_argument("--prompt", {
  type: "str",
  help: "Prompt for generating image",
});
parser.add_argument("--dir", {
  type: "str",
  default: ".",
  help: "Location to save generated images (Default: .)",
});
parser.add_argument("--model", {
  type: "str",
  default: "IMAGEN_4",
  help: "Model to use for generating images (Default: IMAGEN_4)",
});
parser.add_argument("--ratio", {
  type: "str",
  default: "IMAGE_ASPECT_RATIO_LANDSCAPE",
  help: "Aspect ratio for generated images (Default: IMAGE_ASPECT_RATIO_LANDSCAPE)",
});

const args = parser.parse_args();

// Terminate if auth file is not present
if (!args.auth && !args.cookie) {
  console.log(
    "[!] Missing authentication token. Please refer to: github.com/rohitaryal/imageFX-api",
  );
  parser.print_help();
  process.exit(1);
}

if (!args.prompt) {
  console.log("[!] Prompt missing.");
  parser.print_help();
  process.exit(1);
}

// If directory pointed by `--dir` exists
if (args.dir && !fs.existsSync(args.dir) && args.dir != ".") {
  try {
    fs.mkdirSync(args.dir, { recursive: true });
  } catch (error) {
    console.log(`[!] Failed to make destination directory: ${args.dir}`);
    console.log(error);
  }
}

if (!modelChoices.includes(args.model)) {
  console.log("[!] Invalid model choice.");
  console.log(
    `Available models: ${modelChoices.join(", ")} (Default: IMAGEN_4)`,
  );
  process.exit(1);
}

if (!aspectRatioChoices.includes(args.ratio)) {
  console.log("[!] Invalid aspect ratio choice.");
  console.log(
    `Available aspect ratios: ${aspectRatioChoices.join(", ")} (Default: IMAGE_ASPECT_RATIO_LANDSCAPE)`,
  );
  process.exit(1);
}

// Generate images
const fx = new ImageFx({
  cookie: args.cookie,
  authorizationKey: args.auth,
});

const resp = await fx.generateImage({
  prompt: args.prompt,
  count: args.count,
  aspectRatio: args.ratio,
  model: args.model,
  seed: args.seed,
});
if (resp.Err || !resp.Ok) {
  console.log("[!] Failed to generate image: " + resp.Err)
}

// Save all generated images
resp.Ok?.forEach((image, index) => {
  const imageName = `image-${index + 1}.png`

  saveImage(imageName, image.encodedImage, args.dir)
})
