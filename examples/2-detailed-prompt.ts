import { ImageFX, Prompt } from "../src/index";

const GOOGLE_COOKIE = process.env.GOOGLE_COOKIE;
if (!GOOGLE_COOKIE) {
    console.log("Cookie is missing :(");
    process.exit(1);
}

const fx = new ImageFX(GOOGLE_COOKIE);
const prompt = new Prompt({
    seed: 0,
    numberOfImages: 4,
    prompt: "A guy who likes spongebob", // Don't judge me
    aspectRatio: "IMAGE_ASPECT_RATIO_SQUARE",
    generationModel: "IMAGEN_3_5",
})

const generatedImage = await fx.generateImage(prompt);

generatedImage.forEach(image => {
    const savedPath = image.save(".cache/");
    console.log("[+] Image saved at: " + savedPath);
});
