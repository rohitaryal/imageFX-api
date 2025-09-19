import { ImageFX } from "../src/index";
import { test, expect } from "bun:test";

const GOOGLE_COOKIE = process.env.GOOGLE_COOKIE;
if (!GOOGLE_COOKIE) process.exit(1);

const fx = new ImageFX(GOOGLE_COOKIE);

test("Generating 1 caption", async () => {
    const captions = await fx.generateCaptionsFromImage("assets/banner.png", "png");

    expect(captions).toBeDefined()
    expect(captions).toBeArray()
    expect(captions.length).toBeGreaterThan(0)
    expect(captions[0]).toBeString()
}, 30000);