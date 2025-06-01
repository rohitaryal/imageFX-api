import { request } from "./utils/request.js";
import type { Credentials, Request, Result, Prompt, GeneratedImage } from "./global.types";

class ImageFx {
  credentials: Credentials
  constructor(credentials: Credentials) {
    // If both of them are missing
    if (!credentials.authorizationKey && !credentials.cookie) {
      throw new Error("Authorization token and Cookie both are missing.")
    }

    if (credentials.cookie && credentials.cookie.length < 70) {
      throw new Error("Invalid cookie was provided.")
    }


    this.credentials = structuredClone(credentials)

    // Add the missing header
    if (this.credentials.cookie && !this.credentials.cookie.startsWith("__Secure-next-auth.session-token=")) {
      this.credentials.cookie = "__Secure-next-auth.session-token=" + this.credentials.cookie;
    }
  }

  async #checkToken(): Promise<Result<boolean>> {
    if (!this.credentials.authorizationKey && !this.credentials.cookie) {
      return { Err: Error("Authorization token and Cookie both are missing.") }
    }

    if (this.credentials.cookie && !this.credentials.authorizationKey) {
      // Mutate internally
      await this.getAuthToken(true);
    }


    return { Ok: true }
  }

  async getAuthToken(mutate: boolean = false): Promise<Result<string>> {
    if (!this.credentials.cookie) {
      return { Err: new Error("Cookie is required for generating auth token.") }
    }

    const req: Request = {
      url: "https://labs.google/fx/api/auth/session",
      method: "GET",
      headers: new Headers({ "Cookie": this.credentials.cookie })
    }
    const resp = await request(req);
    if (resp.Err || !resp.Ok) {
      return { Err: resp.Err }
    }

    try {
      const parsedResp = JSON.parse(resp.Ok);
      if (!parsedResp.access_token) {
        return { Err: Error("Access token is missing from response: " + resp.Ok) }
      }

      if (mutate) {
        this.credentials.authorizationKey = parsedResp.access_token;
      }

      return { Ok: parsedResp.access_token };
    } catch (err) {
      return { Err: Error("Failed to parse response: " + resp.Ok) }
    }
  }

  /**
  * Generate image from provided prompt
  */
  async generateImage(prompt: Prompt): Promise<Result<GeneratedImage[]>> {
    const tokenRes = await this.#checkToken();
    if (tokenRes.Err) {
      return { Err: tokenRes.Err }
    }

    // IMAGEN_3_5 is behind the scene IMAGEN_4
    if (prompt.model == "IMAGEN_4") {
      prompt.model = "IMAGEN_3_5"
    }

    // Looks really messy
    const req: Request = {
      method: "POST",
      body: JSON.stringify({
        userInput: {
          candidatesCount: prompt.count || 4,
          prompts: [prompt.prompt],
          seed: prompt.seed || 0,
        },
        aspectRatio: prompt.aspectRatio || "IMAGE_ASPECT_RATIO_LANDSCAPE",
        modelInput: { modelNameType: prompt.model || "IMAGEN_3_5" },
        clientContext: { sessionId: ";1740658431200", tool: "IMAGE_FX" },
      }),
      url: "https://aisandbox-pa.googleapis.com/v1:runImageFx",
      headers: new Headers({ "Authorization": "Bearer " + this.credentials.authorizationKey }),
    };
    const res = await request(req);
    if (res.Err || !res.Ok) {
      return { Err: res.Err }
    }

    try {
      const parsedRes = JSON.parse(res.Ok);
      const images = parsedRes.imagePanels[0].generatedImages;

      if (!Array.isArray(images)) {
        return {
          Err: Error("Invalid response recieved: " + res.Ok)
        }
      }

      return { Ok: images };
    } catch (err) {
      return { Err: Error("Failed to parse JSON: " + res.Ok) }
    }
  }
}

export default ImageFx;
