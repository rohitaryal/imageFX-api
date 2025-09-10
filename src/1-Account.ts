import { DefaultHeader } from "./Constants";
import { SessionData, User } from "./Types";

export class AccountError extends Error {
    constructor(message: string, public readonly code?: string) {
        super(message);
        this.name = 'AccountError';
    }
}

export class Account {
    public user?: User;
    public token?: string;
    private tokenExpiry?: Date;
    private readonly cookie: string;

    constructor(cookie: string) {
        if (!cookie?.trim()) {
            throw new AccountError("Cookie is required and cannot be empty");
        }

        this.cookie = cookie;
    }

    // Re-Generate authorization token
    public async refreshSession() {
        let sessionResult = await this.fetchSession();

        if (!sessionResult.access_token || !sessionResult.expires || !sessionResult.user)
            throw new AccountError("Session response is missing some fields" + sessionResult)

        this.user = sessionResult.user;
        this.token = sessionResult.access_token;
        this.tokenExpiry = new Date(sessionResult.expires);
    }

    // Compare current date with token expiry date
    public isTokenExpired() {
        if (!this.token || !this.tokenExpiry)
            return true;

        return this.tokenExpiry <= new Date(Date.now() - 30 * 1000);
    }

    // Returns object that can be used as header for auth
    public getAuthHeaders() {
        if (!this.token) {
            throw new AccountError("Cookie or Token is still missing after refresh");
        }

        return {
            ...DefaultHeader,
            "Cookie": this.cookie,
            "Authorization": "Bearer " + this.token
        }
    }

    // Internal fetch
    private async fetchSession() {
        const response = await fetch("https://labs.google/fx/api/auth/session", {
            headers: { ...DefaultHeader, "Cookie": this.cookie }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new AccountError(
                `Authentication failed (${response.status}): ${errorText}`
            );
        }

        const sessionData = await response.json() as SessionData;

        if (!sessionData.access_token || !sessionData.expires || !sessionData.user) {
            throw new AccountError("Invalid session response: missing required fields");
        }

        return sessionData;
    }
}