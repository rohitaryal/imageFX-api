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

export const ImageType = Object.freeze({
    JPEG: "jpeg",
    JPG: "jpg",
    JPE: "jpe",
    PNG: "png",
    GIF: "gif",
    WEBP: "webp",
    SVG: "svg",
    BMP: "bmp",
    TIFF: "tiff",
    APNG: "apng",
    AVIF: "avif",
} as const);

export type Model = typeof Model[keyof typeof Model]
export type AspectRatio = typeof AspectRatio[keyof typeof AspectRatio]
export type ImageType = typeof ImageType[keyof typeof ImageType];