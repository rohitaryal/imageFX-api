import { Account } from "./Account";
import { Prompt } from "./Prompt";
import { Image } from "./Image";
import { ImageArg } from "./Types";

export class ImageFXError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ImageFXError";
    }
}

export class ImageFX {
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
     */
    public async generateImage(prompt: string | Prompt, retries = 0) {
        if (typeof prompt === "string") {
            prompt = new Prompt({ prompt });
        }

        await this.account.refreshSession()

        const generatedImages = await this.fetchImages(prompt, retries);
        return generatedImages.map((data: ImageArg) => new Image(data));
    }

    /**
     * Gets generated image from its unique media ID
     * @param id Unique media id for a generated image
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
     * Fetches generated images from Google ImageFX API
     *
     * @param retry Number of retries
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