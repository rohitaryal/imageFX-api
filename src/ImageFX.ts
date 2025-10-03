import { Account } from "./Account.js";
import { Prompt } from "./Prompt.js";
import { Image } from "./Image.js";
import { ImageArg } from "./Types.js";
import { existsSync, readFileSync } from "fs";
import { ImageType } from "./Constants.js";

export class ImageFXError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ImageFXError";
    }
}

/**
 * Consider this the entry/main class
 */
export class ImageFX {
    /**
     * Represents user account and contains session info, cookies, etc
     */
    private readonly account: Account;

    constructor(cookie: string) {
        if (!cookie?.trim()) {
            throw new ImageFXError("Cookie is required and cannot be empty");
        }

        this.account = new Account(cookie);
    }

    /**
     * Generates image from a given prompt
     * 
     * @param prompt Description of image
     * @param retries Number of retries
     * @returns List containing generated image(s)
     */
    public async generateImage(prompt: string | Prompt, retries = 0) {
        if (typeof prompt === "string") {
            if (!prompt.trim()) {
                throw new ImageFXError("Prompt cannot be empty")
            }
            prompt = new Prompt({ prompt });
        }

        if (!(prompt instanceof Prompt)) {
            throw new ImageFXError("Provided prompt is not an instance of Prompt")
        }

        await this.account.refreshSession()

        const generatedImages = await this.fetchImages(prompt, retries);
        return generatedImages.map((data: ImageArg) => new Image(data));
    }

    /**
     * Gets generated image from its unique media ID (`image.mediaID`)
     * @param id Unique media id for a generated image
     * @returns Returns image identified by its `id`
     */
    public async getImageFromId(id: string) {
        if (!id?.trim()) {
            throw new ImageFXError("Image ID is required and cannot be empty");
        }

        await this.account.refreshSession();

        const url = "https://labs.google/fx/api/trpc/media.fetchMedia";
        const params = encodeURIComponent(
            JSON.stringify({ json: { mediaKey: id } })
        );

        try {
            const response = await fetch(`${url}?input=${params}`, {
                headers: this.account.getAuthHeaders(),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new ImageFXError(`Server responded with unexpected response (${response.status}): ${errorText}`);
            }

            const parsedResponse = await response.json();
            const requestedImage = parsedResponse?.result?.data?.json?.result?.image;

            if (!requestedImage) {
                throw new ImageFXError("Server responded with empty image");
            }

            delete requestedImage.mediaVisibility;
            delete requestedImage.previousMediaGenerationId;

            return new Image(requestedImage);
        } catch (error) {
            if (error instanceof ImageFXError) {
                throw error;
            }

            throw new ImageFXError(`Failed to fetch image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Generate a detailed caption from an image.
     * 
     * @param imagePath Path to the image to be used
     * @param count Number of captions to generate
     * @param imageType Type of image (png, jpeg, yada yada)
     * @returns Array with `count` number of captions (if you are lucky)
     */
    public async generateCaptionsFromImage(imagePath: string, imageType: ImageType, count: number = 1) {
        if (!existsSync(imagePath)) {
            throw new ImageFXError("Image doesn't exist at path: " + imagePath);
        }

        let base64EncodedImage: string = "";

        try {
            base64EncodedImage = readFileSync(imagePath, "base64");
            base64EncodedImage = `data:image/${imageType};base64,${base64EncodedImage}`;
        } catch (error) {
            throw new ImageFXError(`Failed to fetch image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        await this.account.refreshSession();

        const url = "https://labs.google/fx/api/trpc/backbone.captionImage";
        const body = JSON.stringify({
            "json": {
                "clientContext": { "sessionId": ";1758297717089", "workflowId": "" },
                "captionInput": {
                    "candidatesCount": count,
                    "mediaInput": {
                        "mediaCategory": "MEDIA_CATEGORY_SUBJECT",
                        "rawBytes": base64EncodedImage,
                    }
                }
            }
        });

        let response: Response;

        try {
            response = await fetch(url, {
                body,
                method: "POST",
                headers: this.account.getAuthHeaders()
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new ImageFXError(`Server responded with unexpected response (${response.status}): ${errorText}`);
            }

            const parsedResponse = await response.json();

            const imageCaption: { output: string, mediaGenerationId: string }[] = parsedResponse?.result?.data?.json?.result?.candidates;

            if (!imageCaption || imageCaption.length == 0) {
                throw new ImageFXError("Image caption was not in the response: " + await response.text());
            }

            return imageCaption.map(caption => caption.output);
        } catch (error) {
            if (error instanceof ImageFXError) {
                throw error;
            }

            throw new ImageFXError(`Failed to fetch image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }


    /**
     * Fetches generated images from Google ImageFX API
     *
     * @param retry Number of retries
     * @returns Promise containing list of generated images.
     */
    private async fetchImages(prompt: Prompt, retry = 0): Promise<ImageArg[]> {
        try {
            const response = await fetch("https://aisandbox-pa.googleapis.com/v1:runImageFx", {
                method: "POST",
                body: prompt.toString(),
                headers: this.account.getAuthHeaders(),
            });

            if (!response.ok) {
                if (retry > 0) {
                    console.log("[!] Failed to generate image. Retrying...");
                    return this.fetchImages(prompt, retry - 1);
                }

                const errorText = await response.text();
                throw new ImageFXError(`Server responded with invalid response (${response.status}): ${errorText}`);
            }

            const jsonResponse = await response.json();
            const generatedImages: ImageArg[] | undefined = jsonResponse?.imagePanels?.[0]?.generatedImages;

            if (!generatedImages) {
                throw new ImageFXError("Server responded with empty images");
            }

            return generatedImages;

        } catch (error) {
            if (retry > 0) {
                console.log("[!] Failed to generate image. Retrying...");
                return this.fetchImages(prompt, retry - 1);
            }

            if (error instanceof ImageFXError) {
                throw error;
            }

            throw new ImageFXError(`Failed to generate image: ${error instanceof Error ? error.message : 'Network error'}`);
        }
    }
}