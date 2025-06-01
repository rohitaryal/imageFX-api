// Imagen model variant
export type ImageModel =
  | "IMAGEN_2"
  | "IMAGEN_3"
  | "IMAGEN_4"
  | "IMAGEN_3_1"
  | "IMAGEN_3_5"
  | "IMAGEN_3_PORTRAIT"
  | "IMAGEN_3_LANDSCAPE"
  | "IMAGEN_3_PORTRAIT_THREE_FOUR"
  | "IMAGEN_3_LANDSCAPE_FOUR_THREE";

// Dimension of output image
export type AspectRatio =
  | "IMAGE_ASPECT_RATIO_SQUARE"
  | "IMAGE_ASPECT_RATIO_PORTRAIT"
  | "IMAGE_ASPECT_RATIO_LANDSCAPE"
  | "IMAGE_ASPECT_RATIO_UNSPECIFIED"
  | "IMAGE_ASPECT_RATIO_LANDSCAPE_FOUR_THREE"
  | "IMAGE_ASPECT_RATIO_PORTRAIT_THREE_FOUR";

// Credentials for generation
export interface Credentials {
  cookie?: string;
  authorizationKey?: string;
}

// Result type represents output of function call
export interface Result<T> {
  Ok?: T;
  Err?: Error;
}

// Request 
export interface Request {
  url: string;
  headers: Headers;
  body?: string;
  method:
  | "GET"
  | "POST"
  | "HEAD"
  | "OPTIONS"
  | "PUT"
  | "PATCH"
  | "DELETE";
}

// Prompt information
export interface Prompt {
  // Image description
  prompt: string;
  // Number of images to generate
  count?: number;
  // Same seed value generates similar image
  seed?: number;
  // Model to use for generating image
  model?: ImageModel;
  // Dimension of generated image
  aspectRatio?: AspectRatio;
}

// Represents generated image
export interface GeneratedImage {
  // Generated image in base64 format
  encodedImage: string;
  seed: number;
  // Dunno what this is
  mediaGenerationId: string;
  // Dunno what this is
  isMaskEditedImage: boolean;
  // Prompt used to generate this image
  prompt: string;
  // Model used to generate this image
  modelNameType: ImageModel;
  // Some project ID, but no use here
  workflowId: string;
  // Thing that google uses to track your generated images (maybe)
  fingerprintLogRecordId: string;
}
