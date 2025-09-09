import { AspectRatio, Model } from "./Constants";
import { Prompt } from "./2-Prompt";
import { ImageArg } from "./Types";
import { writeFileSync } from "fs";

export default class Image {
    public readonly seed: number;
    public readonly model: Model; // modelNameType
    public readonly prompt: string;
    public readonly aspectRatio: AspectRatio;
    public readonly mediaId: string; // mediaGenerationId

    private readonly encodedImage: string;
    private readonly workflowId: string;
    private readonly fingerprintId: string; // fingerprintLogRecordId

    constructor(args: ImageArg) {
        this.seed = args.seed;
        this.prompt = args.prompt;
        this.model = args.modelNameType;
        this.aspectRatio = args.aspectRatio;

        // Unrequired stuffs below :|
        this.workflowId = args.workflowId;
        this.encodedImage = args.encodedImage;
        this.mediaId = args.mediaGenerationId;
        this.fingerprintId = args.fingerprintLogRecordId;
    }

    public regenerate(retry = 0) {
        const prompt = new Prompt({
            prompt: this.prompt,
            aspectRatio: this.aspectRatio,
            generationModel: this.model,
            numberOfImages: 1,
            seed: this.seed,
        });

        return prompt.generate(retry);
    }

    // TODO: Add proper error handelling
    public save(imageName?: string) {
        imageName = imageName ?? `image-${Date.now()}`;
        writeFileSync(imageName, this.encodedImage, "base64");
    }
}