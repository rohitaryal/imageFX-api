import { AspectRatio, Model } from "./Constants";
import { ImageArg, PromptArg } from "./Types";

export class PromptError extends Error {
    constructor(message: string, code?: string) {
        super(message);
        this.name = 'PromptError';
    }
}

export class Prompt {
    private seed: number;
    private prompt: string;
    private numberOfImages: number;
    private aspectRatio: AspectRatio;
    private generationModel: Model;

    constructor(args: PromptArg) {
        this.seed = args.seed ?? 0;
        this.prompt = args.prompt;
        this.numberOfImages = args.numberOfImages ?? 1;
        this.aspectRatio = args.aspectRatio ?? AspectRatio.LANDSCAPE;
        this.generationModel = args.generationModel ?? Model.IMAGEN_3;
    }

    public generate(retry = 0) {
        if (retry < 0) {
            throw new PromptError("Number of retries must be positive");
        }

        return this.fetchImage(retry);
    }

    public toString() {
        return JSON.stringify({
            "userInput": {
                "candidatesCount": this.numberOfImages,
                "prompts": [this.prompt],
                "seed": this.seed
            },
            "clientContext": {
                "sessionId": ";1757113025397",
                "tool": "IMAGE_FX"
            },
            "modelInput": {
                "modelNameType": this.generationModel
            },
            "aspectRatio": this.aspectRatio
        });
    }

    // TODO: Add cookie/auth header to fetch
    private async fetchImage(retry = 0): Promise<ImageArg[]> {
        let response: Response | undefined;
        let jsonResponse: any | undefined;

        try {
            response = await fetch(
                "https://aisandbox-pa.googleapis.com/v1:runImageFx",
                {
                    method: "POST",
                    body: this.toString(),
                }
            );

            if (!response.ok) {
                if (retry > 0) {
                    console.log("[!] Failed to generate image. Retrying...")
                    return this.fetchImage(retry - 1);
                }

                throw new PromptError("Server responded with invalid response: " + await response.text())
            }

        } catch (err) {
            if (retry > 0) {
                console.log("[!] Failed to generate image. Retrying...")
                return this.fetchImage(retry - 1);
            }

            if (err instanceof PromptError) {
                throw err;
            }

            throw new PromptError(
                `Failed to generate image` +
                ((err instanceof Error) ? err.message : "NETWORK ERROR")
            )
        }

        if (!response) {
            throw new PromptError("Server didn't send any response")
        }

        try {
            jsonResponse = await response.json();
        } catch (err) {
            throw new PromptError("Failed to parse non-JSON response: " + (await response.text()))
        }

        const generatedImages: ImageArg[] | undefined = jsonResponse?.imagePanels?.[0]?.generatedImages;

        if (!generatedImages) {
            throw new PromptError("Server responded with empty images");
        }

        return generatedImages;
    }
}