import { AspectRatio, Model } from "./Constants.js";

export interface PromptArg {
    seed?: number;
    prompt: string;
    numberOfImages?: number;
    aspectRatio?: AspectRatio;
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

