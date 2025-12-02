import { ImageFX } from "../src/index";
import { test, expect } from "bun:test";

const GOOGLE_COOKIE = process.env.GOOGLE_COOKIE;
// Please provide mediaGenerationId of any of your generated images
const MEDIA_ID = process.env.MEDIA_ID || "CAMaJGZkNDAzMDgyLWE1YTMtNDc2Yy1iOTVmLTVhNzc4NWE1NDM2ZSIDQ0FFKiRhZWE5M2FmNC1jY2Y3LTQyZjQtYTZjNy1iMzE1ZDgxMWNhZmM";
if (!GOOGLE_COOKIE || !MEDIA_ID) process.exit(1);

const fx = new ImageFX(GOOGLE_COOKIE);

test("Get image from ID", async () => {
    const image = await fx.getImageFromId(MEDIA_ID);

    expect(image).toBeDefined()
    expect(image.mediaId).toBe(MEDIA_ID!);
}, 30000);