import { AspectRatio, Model } from "./Constants.js";

export interface PromptArg {
    /**
     * A specific number that serves as the starting point
     * for the random process used to create the image.
     * 
     * Default value: `0`
     */
    seed?: number;

    /**
    * Textual Description of image to be generated
    */
    prompt: string;

    /**
     * Number of image to generate in one fetch request.
     * Max may be `8` but changes with different account.
     * 
     * Default value: `1`
     */
    numberOfImages?: number;

    /**
     * The ratio of the width to the height of the image 
     * to be generated.
     * 
     * Available aspect ratios:
     * - `"IMAGE_ASPECT_RATIO_SQUARE"`
     * - `"IMAGE_ASPECT_RATIO_PORTRAIT"`
     * - `"IMAGE_ASPECT_RATIO_LANDSCAPE"`
     * - `"IMAGE_ASPECT_RATIO_UNSPECIFIED"`
     */
    aspectRatio?: AspectRatio;

    /**
     * Model to use for image generation.
     * 
     * Note: `"IMAGEN_3_5"` is probably `IMAGEN_4`
     * 
     * Available models:
     * - `"IMAGEN_3"`
     * - `"IMAGEN_3_1"`
     * - `"IMAGEN_3_5"`
     */
    generationModel?: Model;
}

export interface ImageArg {
    seed: number;
    modelNameType: Model;
    prompt: string;
    aspectRatio: AspectRatio;
    encodedImage: string;
    mediaGenerationId: string;
    workflowId: string;
    fingerprintLogRecordId: string;
}

export interface User {
    name: string;
    email: string;
    image: string;
}

export interface SessionData {
    user: User;
    expires: string;
    access_token: string;
}

