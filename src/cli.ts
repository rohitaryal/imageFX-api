import fs from "fs";
import generateImage from "./index.ts";
import argv from "argparse";
import { saveImage } from "./utils/filemanager.ts";

const parser = new argv.ArgumentParser({
    description: "Generate ImageFX images directly from your terminal",
});

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

const args = parser.parse_args();

if (args.authf && fs.existsSync(args.authf)) {
    try {
        args.auth = fs.readFileSync(args.authf, { encoding: "utf-8" });
    } catch (error) {
        console.log(`[!] Failed to read .auth file: ${args.authf}`);
        console.log(error);
        process.exit(1);
    }
}

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

if (args.dir && !fs.existsSync(args.dir) && args.dir != ".") {
    try {
        fs.mkdirSync(args.dir, { recursive: true });
    } catch (error) {
        console.log(`[!] Failed to make destination directory: ${args.dir}`);
        console.log(error);
    }
}

generateImage({
    prompt: args.prompt,
    authorization: args.auth,
    imageCount: args.count,
    seed: args.seed,
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
