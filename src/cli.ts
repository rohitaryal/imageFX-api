import fs from "fs";
import generateImage from "./index.ts";
import argv from "argparse";
import { saveImage } from "./utils/filemanager.ts";

const parser = new argv.ArgumentParser({
    description: "Generate ImageFX images directly from your terminal",

});

/*
model: "IMAGEN_2" | "IMAGEN_3" | "IMAGEN_3_1" | "IMAGEN_3_5" | "IMAGEN_2_LANDSCAPE" | "IMAGEN_3_PORTRAIT" | "IMAGEN_3_LANDSCAPE" | "IMAGEN_3_PORTRAIT_THREE_FOUR" | "IMAGEN_3_LANDSCAPE_FOUR_THREE" | "IMAGE_MODEL_NAME_UNSPECIFIED";
    aspectRatio: "IMAGE_ASPECT_RATIO_SQUARE" | "IMAGE_ASPECT_RATIO_PORTRAIT" | "IMAGE_ASPECT_RATIO_LANDSCAPE" | "IMAGE_ASPECT_RATIO_UNSPECIFIED" | "IMAGE_ASPECT_RATIO_LANDSCAPE_FOUR_THREE" | "IMAGE_ASPECT_RATIO_PORTRAIT_THREE_FOUR";
 */

const modelChoices = [
    "IMAGEN_2",
    "IMAGEN_3",
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
parser.add_argument("--authf", {
    type: "str",
    help: "Read auth token from plain text '.auth' file from given path",
});
parser.add_argument("--dir", {
    type: "str",
    default: ".",
    help: "Location to save generated images (Default: .)",
});
parser.add_argument("--model", {
    type: "str",
    default: "IMAGEN_3",
    help: "Model to use for generating images (Default: IMAGEN_3)",
});
parser.add_argument("--aspect-ratio", {
    type: "str",
    default: "IMAGE_ASPECT_RATIO_SQUARE",
    help: "Aspect ratio for generated images (Default: IMAGE_ASPECT_RATIO_SQUARE)",
});

const args = parser.parse_args();

// Check if auth file is already present
if (args.authf && fs.existsSync(args.authf)) {
    try {
        args.auth = fs.readFileSync(args.authf, { encoding: "utf-8" });
    } catch (error) {
        console.log(`[!] Failed to read .auth file: ${args.authf}`);
        console.log(error);
        process.exit(1);
    }
}

// Terminate if auth file is not present
if (!args.auth) {
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
        `Available models: ${modelChoices.join(", ")} (Default: IMAGEN_3)`,
    );
    process.exit(1);
}

if (!aspectRatioChoices.includes(args.aspect_ratio)) {
    console.log("[!] Invalid aspect ratio choice.");
    console.log(
        `Available aspect ratios: ${aspectRatioChoices.join(", ")} (Default: IMAGE_ASPECT_RATIO_SQUARE)`,
    );
    process.exit(1);
}

// Generate images
generateImage({
    prompt: args.prompt,
    authorization: args.auth,
    imageCount: args.count,
    seed: args.seed,
    model: args.model,
    aspectRatio: args.aspect_ratio,
})
    .then((data) => {
        let imageNumber = 1;

        try {
            for (const panel of data.imagePanels) {
                for (const image of panel.generatedImages) {
                    const imageName = `image-${imageNumber++}.png`;
                    if (saveImage(imageName, image.encodedImage, args.dir)) {
                        console.log(`[+] Image saved: ${imageName}`);
                    }
                }
            }
        } catch (err) {
            throw data;
        }
    })
    .catch((data) => {
        console.log("[!] Unexpected server response.");
        console.log(data);
    });
