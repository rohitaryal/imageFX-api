import { ImageFX, Prompt, AspectRatio, Model } from "../src/index"
import { describe, expect, test } from "bun:test";

const GOOGLE_COOKIE = process.env.GOOGLE_COOKIE;
if (!GOOGLE_COOKIE) process.exit(1);

const fx = new ImageFX(GOOGLE_COOKIE);

describe("Different Models", () => {
    Object.values(Model).forEach(model => {
        const prompt = new Prompt({
            prompt: "A superhuman flying over mars",
            generationModel: model,
        });

        test("Selected Model: " + model, async () => {
            prompt.generationModel = model;

            const generatedImages = await fx.generateImage(prompt);

            expect(generatedImages).toBeDefined();
            expect(generatedImages.length).toBeGreaterThan(0);
            expect(generatedImages[0].model).toBe(model);
        }, 30000);
    })
});

describe("Aspect Ratios", () => {
    Object.values(AspectRatio).forEach(size => {
        test("Selected size: " + size, async () => {
            const prompt = new Prompt({
                aspectRatio: size,
                prompt: "A friend forcing me to write code all the time",
            });

            const generatedImages = await fx.generateImage(prompt);

            expect(generatedImages).toBeDefined();
            expect(generatedImages.length).toBeGreaterThan(0);
            expect(generatedImages[0].aspectRatio).toBe(size);
        }, 30000);
    })
});

test("Image Seed", async () => {
    const seed = 1233;

    const prompt = new Prompt({
        seed,
        prompt: "A crocodile eating an ice",
    });

    const generatedImages = await fx.generateImage(prompt);

    expect(generatedImages).toBeDefined();
    expect(generatedImages.length).toBeGreaterThan(0);
    expect(generatedImages[0].seed).toBe(seed);
}, 30000);

test("Multiple Parameters", async () => {
    const prompt = new Prompt({
        prompt: "A green scary crocodile",
        aspectRatio: "IMAGE_ASPECT_RATIO_LANDSCAPE",
        generationModel: "IMAGEN_3_1",
        numberOfImages: 2,
        seed: 200
    });

    const generatedImages = await fx.generateImage(prompt);

    expect(generatedImages).toBeDefined()

    expect(generatedImages).toBeDefined();
    expect(generatedImages.length).toBeGreaterThan(0); /* Not 4, because sometime they dont always
                                                          provide the specified number of images. */
    expect(generatedImages[0].prompt).toBe(prompt.prompt);
    expect(generatedImages[0].aspectRatio).toBe(prompt.aspectRatio)
    expect(generatedImages[0].model).toBe(prompt.generationModel)
    expect(generatedImages[0].seed).toBe(prompt.seed);
}, 30000);