import { AspectRatio, Model } from "./Constants";
import { ImageArg } from "./Types";
import { writeFileSync } from "fs";
import { extname } from "path";

export class ImageError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ImageError";
    }
}

export class Image {
    public readonly seed: number;
    public readonly model: Model; // modelNameType
    public readonly prompt: string;
    public readonly aspectRatio: AspectRatio;
    public readonly mediaId: string; // mediaGenerationId

    private readonly encodedImage: string;
    private readonly workflowId: string;
    private readonly fingerprintId: string; // fingerprintLogRecordId

    constructor(args: ImageArg) {
        if (!args.encodedImage?.trim()) {
            throw new ImageError("Encoded image data is required");
        }

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

    public save(filePath?: string) {
        try {
            if (!filePath) {
                filePath = `image-${Date.now()}.png`;
            } else if (!extname(filePath)) {
                filePath += ".png";
            }

            writeFileSync(filePath, this.encodedImage, "base64");

            return filePath;
        } catch (error) {
            throw new ImageError("Failed to save image: " + (error instanceof Error ? error.message : "UNKNOWN ERROR"));
        }
    }
}