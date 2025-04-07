import request from "./utils/request.ts";

interface GenerateImageProps {
    seed: number | null;
    prompt: string;
    imageCount: number;
    authorization: string;
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

const generateImage = ({
    prompt,
    imageCount,
    authorization,
    seed,
}: GenerateImageProps) => {
    return new Promise((resolve: (value: ModelResponse) => void, reject) => {
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
                    sessionId: ";1740656431200",
                    tool: "IMAGE_FX",
                },
                modelInput: {
                    modelNameType: "IMAGEN_3_1",
                },
                aspectRatio: "IMAGE_ASPECT_RATIO_LANDSCAPE",
            }),
        })
            .then((response) => response.json())
            .then((response) => resolve(response))
            .catch((error) => reject(error));
    });
};

export default generateImage;
