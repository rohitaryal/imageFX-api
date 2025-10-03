import { ImageFX } from "../src/index";

const GOOGLE_COOKIE = process.env.GOOGLE_COOKIE;
if (!GOOGLE_COOKIE) {
    console.log("Cookie is missing :(");
    process.exit(1);
}

const fx = new ImageFX(GOOGLE_COOKIE);
const generatedImage = await fx.generateImage("A big black cockroach");

generatedImage.forEach(image => {
    const savedPath = image.save(".cache/");
    console.log("[+] Image saved at: " + savedPath);
});
