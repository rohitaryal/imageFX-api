import request from "./utils/request.ts";

interface GenerateImageProps {
    seed: number | null;
    prompt: string;
    imageCount: number;
    authorization: string;
    model: "IMAGEN_2" | "IMAGEN_3" | "IMAGEN_3_1" | "IMAGEN_3_5" | "IMAGEN_2_LANDSCAPE" | "IMAGEN_3_PORTRAIT" | "IMAGEN_3_LANDSCAPE" | "IMAGEN_3_PORTRAIT_THREE_FOUR" | "IMAGEN_3_LANDSCAPE_FOUR_THREE" | "IMAGE_MODEL_NAME_UNSPECIFIED";
    aspectRatio: "IMAGE_ASPECT_RATIO_SQUARE" | "IMAGE_ASPECT_RATIO_PORTRAIT" | "IMAGE_ASPECT_RATIO_LANDSCAPE" | "IMAGE_ASPECT_RATIO_UNSPECIFIED" | "IMAGE_ASPECT_RATIO_LANDSCAPE_FOUR_THREE" | "IMAGE_ASPECT_RATIO_PORTRAIT_THREE_FOUR";
}

interface ModelResponse {
    imagePanels: {
        prompt: string;
        generatedImages: {
            encodedImage: string;
            seed: number;
            mediaGenerationId: string;
            isMaskEditedImage: boolean;
            modelNameType: string;
            workflowId: string;
            fingerprintLogRecordId: string;
        }[];
    }[];
}

interface ErrorResponse {
    error: {
        code: number;
        message: string;
        status: string;
    };
}

const generateImage = ({
    prompt,
    imageCount,
    authorization,
    seed,
    model,
    aspectRatio,
}: GenerateImageProps) => {
    return new Promise(
        (
            resolve: (value: ModelResponse) => void,
            reject: (value: ErrorResponse) => void,
        ) => {
            request({
                authorization,
                method: "POST",
                reqURL: "https://aisandbox-pa.googleapis.com/v1:runImageFx",
                body: JSON.stringify({
                    userInput: {
                        candidatesCount: imageCount,
                        prompts: [prompt],
                        seed: seed,
                    },
                    clientContext: {
                        sessionId: ";1740658431200",
                        tool: "IMAGE_FX",
                    },
                    modelInput: {
                        modelNameType: model,
                    },
                    aspectRatio: aspectRatio,
                }),
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.error) {
                        reject(response as ErrorResponse);
                    } else {
                        resolve(response as ModelResponse);
                    }
                })
                .catch((error) => reject(error));
        },
    );
};

export default generateImage;
