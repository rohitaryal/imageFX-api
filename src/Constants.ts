export const Model = Object.freeze({
    IMAGEN_3: "IMAGEN_3",
    IMAGEN_3_1: "IMAGEN_3_1",
    IMAGEN_3_5: "IMAGEN_3_5",
} as const);

export const AspectRatio = Object.freeze({
    SQUARE: "IMAGE_ASPECT_RATIO_SQUARE",
    PORTRAIT: "IMAGE_ASPECT_RATIO_PORTRAIT",
    LANDSCAPE: "IMAGE_ASPECT_RATIO_LANDSCAPE",
    UNSPECIFIED: "IMAGE_ASPECT_RATIO_UNSPECIFIED",
} as const);

// Can be mutated and shared :)
export const DefaultHeader = new Headers({
    "Origin": "https://labs.google",
    "content-type": "application/json",
    "Referer": "https://labs.google/fx/tools/image-fx"
});

export type Model = typeof Model[keyof typeof Model]
export type AspectRatio = typeof AspectRatio[keyof typeof AspectRatio]