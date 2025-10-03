import { ImageFX } from "../src/index";

const GOOGLE_COOKIE = process.env.GOOGLE_COOKIE;
if (!GOOGLE_COOKIE) {
    console.log("Cookie is missing :(");
    process.exit(1);
}

const fx = new ImageFX(GOOGLE_COOKIE);

// Keep the mediaId here (available in image.mediaId)
// And make sure the id actually belongs to you or public
const image = await fx.getImageFromId("__PUT__ID__HERE__");

const savedPath = image.save(".cache/");

console.log("[+] Image saved at: " + savedPath);
