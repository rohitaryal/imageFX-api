import { DefaultHeader } from "./Constants";
import { SessionData, User } from "./Types";

export class AccountError extends Error {
    constructor(message: string, public readonly code?: string) {
        super(message);
        this.name = 'AccountError';
    }
}

export class Account {
    private user?: User;
    private token?: string;
    private tokenExpiry?: Date;
    private cookie: string;

    constructor(cookie: string) {
        if (!cookie || !cookie.trim()) {
            throw new AccountError("Cookie is required and cannot be empty");
        }

        this.cookie = cookie;
    }

    // Re-Generate authorization token
    public async refreshSession() {
        if (!this.cookie)
            throw new AccountError("Cookie field is missing");

        let sessionResult: SessionData | undefined;

        try {
            sessionResult = await this.fetchSession();

            if (!sessionResult.access_token || !sessionResult.expires || !sessionResult.user)
                throw new AccountError("Session response is missing some fields")

            this.token = sessionResult.access_token;
            this.tokenExpiry = new Date(sessionResult.expires);
            this.user = sessionResult.user;
        } catch (err) {
            if (err instanceof AccountError) {
                throw err;
            }

            throw new AccountError(
                "Failed to refresh session info: " +
                ((err instanceof Error) ? err.message : "NETWORK_ERROR")
            )
        }
    }

    // Compare current date with token expiry date
    public isTokenExpired() {
        if (!this.token || !this.tokenExpiry)
            return true;

        return this.tokenExpiry <= new Date(Date.now() - 30 * 1000);
    }

    // Get authorization token
    public async getToken() {
        if (this.isTokenExpired()) {
            await this.refreshSession()
        }

        if (!this.token) {
            throw new AccountError("No valid token available");
        }

        return this.token;
    }

    // Returns this.user
    public async getUserInfo() {
        if (!this.user) {
            await this.refreshSession()
        }

        // Preety much redundant
        if (!this.user) {
            throw new AccountError("Failed to get user details")
        }

        return this.user;
    }

    // Overwrite account fields thus clearing session
    public clear() {
        this.cookie = "";
        this.user = undefined;
        this.token = undefined;
        this.tokenExpiry = undefined;
    }

    // Returns object that can be used as header for auth
    public header() {
        if (!this.cookie || !this.token) {
            throw new AccountError("Cookie or Token is still missing after refresh");
        }

        return {
            ...DefaultHeader,
            "Cookie": this.cookie,
            "Authorization": "Bearer " + this.token
        }
    }

    private async fetchSession() {
        if (!this.cookie)
            throw new AccountError("Cookie field is missing");

        let response: Response | undefined;
        let parsedResponse: any | undefined;

        try {
            response = await fetch("https://labs.google/fx/api/auth/session", {
                headers: this.header(),
            });

            if (!response.ok) {
                throw new AccountError(`[Status: ${response.status} ${response.statusText}]` + "Server didn't send any session details: " + (await response.text()))
            }
        } catch (err) {
            if (err instanceof AccountError) {
                throw err;
            }

            throw new AccountError(
                "Failed to fetch session details: " +
                (err instanceof Error ? err.message : "NETWORK ERROR")
            );
        }

        try {
            parsedResponse = await response.json();
        } catch (err) {
            throw new AccountError("Failed to parse non-JSON session response: " + (await response.text()))
        }

        return parsedResponse as SessionData;
    }
}