import { Account } from "./1-Account";
import { Prompt } from "./2-Prompt";

// TODO: Complete this
export default class ImageFx {
    private readonly account: Account;

    constructor(cookie: string) {
        this.account = new Account(cookie);
    }

    public generateImage(prompt: string | Prompt, retries = 0) {
        if (typeof prompt === "string") {
            prompt = new Prompt({ prompt });
        }

        return prompt.generate(retries);
    }

    // TODO: Add cookie/auth headers in fetch
    public async getImageFromId(id: string) {
        let response: Response | undefined;
        let parsedResponse: any | undefined;
        const url = "https://labs.google/fx/api/trpc/media.fetchMedia?input=" + JSON.stringify({ "json": { "mediaKey": id } });

        try {
            response = await fetch(url);
            if (!response.ok) {
                throw new Error("Server responded with unexpected response: " + (await response.text()))
            }
        } catch (err) {
            throw err; // Maybe do smth here
        }

        try {
            parsedResponse = await response.json();
        } catch (err) {
            throw err; // Here too
        }

        const requestedImage = parsedResponse?.result?.data?.json?.result?.image;

        if (!requestedImage) {
            throw new Error("Server responded with empty image");
        }

        delete requestedImage.mediaVisibility;
        delete requestedImage.previousMediaGenerationId;

        return new Image(requestedImage);
    }
}