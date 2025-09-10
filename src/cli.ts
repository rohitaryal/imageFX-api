import yargs from "yargs";
import { hideBin } from 'yargs/helpers';
import { AspectRatio, Model } from "./Constants";
import ImageFx from "./4-index";
import { Prompt } from "./Prompt";

const y = yargs();

await y
    .scriptName("imagefx")
    .usage("$0 [options]", "Generate images for free using Google's ImageFX")
    .command(
        "generate [options]",
        "Generate new images",
        (yargs) => {
            return yargs
                .option("prompt", {
                    alias: "p",
                    describe: "Textual description of image to be generated",
                    type: "string",
                    default: "A vibe image designer who forgot to give prompt to AI"
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
            const fx = new ImageFx(argv.cookie);
            const prompt = new Prompt({
                seed: argv.seed,
                prompt: argv.prompt,
                numberOfImages: argv.count,
                generationModel: argv.model as Model,
                aspectRatio: ("IMAGE_ASPECT_RATIO_" + argv.size) as AspectRatio,
            });

            const generatedImages = await fx.generateImage(prompt, argv.retry);
            generatedImages.forEach(image => {
                try {
                    const savedPath = image.save(argv.dir)
                    console.log("[+] Image saved at:", savedPath);
                } catch (error) {
                    console.log("[!] Failed to save an image:", error);
                }
            })
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
            if (!argv.cookie) {
                console.log("Cookie value is missing :(")
                return;
            }

            if (!argv.mediaId) {
                console.log("Media ID is missing :(");
                return;
            }

            const fx = new ImageFx(argv.cookie);
            const fetchedImage = await fx.getImageFromId(argv.mediaId);

            try {
                const savedPath = fetchedImage.save(argv.dir);
                console.log("[+] Image saved at:", savedPath)
            } catch (error) {
                console.log("[!] Failed to save an image:", error)
            }
        }
    )
    .demandCommand(1, "You need to use at least one command")
    .wrap(Math.min(y.terminalWidth(), 150))
    .help()
    .alias("help", "h")
    .parse(hideBin(process.argv));