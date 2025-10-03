import { ImageFX } from "../src/index";

const GOOGLE_COOKIE = process.env.GOOGLE_COOKIE;
if (!GOOGLE_COOKIE) {
    console.log("Cookie is missing :(");
    process.exit(1);
}

const fx = new ImageFX(GOOGLE_COOKIE);

// I want to generate 3 captions using this image
const captions = await fx.generateCaptionsFromImage("/home/erucix/Downloads/1.webp", "webp", 3);

// Lets print all generated captions
captions.map(caption => console.log("==> " + caption + "\n\n"));
