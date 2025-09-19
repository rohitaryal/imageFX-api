#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from 'yargs/helpers';
import { AspectRatio, ImageType, Model } from "./Constants.js";
import { ImageFX } from "./ImageFX.js";
import { Prompt } from "./Prompt.js";

const y = yargs();

await y
    .scriptName("ImageFX")
    .command(
        "generate",
        "Generate new images",
        (yargs) => {
            return yargs
                .option("prompt", {
                    alias: "p",
                    describe: "Textual description of image to be generated",
                    type: "string",
                })
                .option("model", {
                    alias: "m",
                    describe: "Model to be used for image generation",
                    type: "string",
                    default: "IMAGEN_3_5",
                    choices: Object.values(Model)
                })
                .option("count", {
                    alias: "n",
                    describe: "Number of images to generate [Max: 8]",
                    type: "number",
                    default: 4,
                })
                .option("size", {
                    alias: "sz",
                    describe: "Aspect ratio of image to be generated",
                    type: "string",
                    default: "LANDSCAPE",
                    choices: Object.values(AspectRatio).map((value) => value.replace("IMAGE_ASPECT_RATIO_", "")),
                })
                .option("seed", {
                    alias: "s",
                    describe: "Seed value for image to be generated",
                    type: "number",
                    default: 0,
                })
                .option("retry", {
                    alias: "r",
                    describe: "Number of retries if in case fetch fails",
                    type: "number",
                    default: 1
                })
                .option("dir", {
                    alias: "d",
                    describe: "Directory to save generated images",
                    type: "string",
                    default: ".",
                })
                .option("cookie", {
                    alias: "c",
                    describe: "Google account cookie",
                    type: "string",
                    demandOption: true,
                })
        },
        async (argv) => {
            if (!argv.cookie) {
                console.log("Cookie value is missing :(")
                return;
            }

            if (!argv.prompt) {
                argv.prompt = "A prompt engineer who forgets to give prompt to AI";
            }

            const fx = new ImageFX(argv.cookie);
            const prompt = new Prompt({
                seed: argv.seed,
                prompt: argv.prompt,
                numberOfImages: argv.count,
                generationModel: argv.model as Model,
                aspectRatio: ("IMAGE_ASPECT_RATIO_" + argv.size) as AspectRatio,
            });

            console.log("[*] Generating. Please wait...");

            const generatedImages = await fx.generateImage(prompt, argv.retry);
            generatedImages.forEach((image, index) => {
                try {
                    const savedPath = image.save(argv.dir);
                    console.log("[+] Image saved at:", savedPath);
                } catch (error) {
                    console.log("[!] Failed to save an image:", error);
                }
            });

            return;
        }
    )
    .command(
        "caption",
        "Generate detailed caption(s) from image",
        (yargs) => {
            return yargs
                .option("image", {
                    alias: "i",
                    describe: "Path to the image to be captioned",
                    type: "string",
                    demandOption: true,
                })
                .option("type", {
                    alias: "t",
                    describe: "Type of image (eg: png, jpeg, webp, etc)",
                    type: "string",
                    demandOption: true,
                })
                .option("count", {
                    alias: "n",
                    describe: "Number of captions to generate",
                    type: "number",
                    default: 1,
                })
                .option("cookie", {
                    alias: "c",
                    describe: "Google account cookie",
                    type: "string",
                    demandOption: true,
                })
        },
        async (argv) => {
            if (!argv.cookie) {
                console.log("Cookie value is missing :(")
                return;
            }

            if (!argv.image) {
                console.log("Image is not provided");
                return;
            }

            if (!(argv.type in ImageType)) {
                console.log("Invalid image type provided, valid types are: \n" +
                    Object.keys(ImageType).join(", "));
                return;
            }

            const fx = new ImageFX(argv.cookie);

            console.log("[*] Generating captions ...");

            const generatedCaptions = await fx.generateCaptionsFromImage(argv.image,
                ImageType[argv.type as keyof typeof ImageType], // Safe typecast ;)
                argv.count,
            );

            generatedCaptions.forEach((caption, index) => {
                console.log(`[${index + 1}] ${caption}`)
            });

            return;
        }
    )
    .command(
        "fetch <mediaId>",
        "Download a generated image with its mediaId",
        (yargs) => {
            return yargs
                .positional("mediaId", {
                    describe: "Unique ID of generated image",
                    type: "string",
                    demandOption: true,
                })
                .option("dir", {
                    alias: "d",
                    describe: "Directory to save generated images",
                    default: ".",
                    type: "string",
                })
                .option("cookie", {
                    alias: "c",
                    describe: "Google account cookie",
                    type: "string",
                    demandOption: true,
                })
        },
        async (argv) => {
            const fx = new ImageFX(argv.cookie);
            const fetchedImage = await fx.getImageFromId(argv.mediaId);

            try {
                const savedPath = fetchedImage.save(argv.dir);
                console.log("[+] Image saved at:", savedPath)
            } catch (error) {
                console.log("[!] Failed to save an image:", error)
            }

            return;
        }
    )
    .demandCommand(1, "You need to use at least one command")
    .wrap(Math.min(y.terminalWidth(), 150))
    .help()
    .alias("help", "h")
    .showHelpOnFail(true)
    .parse(hideBin(process.argv));