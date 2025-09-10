import { AspectRatio, Model } from "./Constants";
import { PromptArg } from "./Types";

export class PromptError extends Error {
    constructor(message: string) {
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
}