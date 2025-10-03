import { DefaultHeader } from "./Constants.js";
import { SessionData, User } from "./Types.js";

export class AccountError extends Error {
    constructor(message: string, public readonly code?: string) {
        super(message);
        this.name = 'AccountError';
    }
}

/**
 * Represents user account
 */
export class Account {
    /**
     * Basic user account detail
     */
    public user?: User;
    /**
     * Authentication token used for image generation
     */
    public token?: string;
    /**
     * Expiry date for token (authentication token)
     */
    private tokenExpiry?: Date;
    /**
     * User account cookie
     */
    private readonly cookie: string;

    constructor(cookie: string) {
        if (!cookie?.trim()) {
            throw new AccountError("Cookie is required and cannot be empty");
        }

        this.cookie = cookie;
    }

    /**
     * Re-generates and updates authorization token internally
     */
    public async refreshSession() {
        let sessionResult = await this.fetchSession();

        if (!sessionResult || !sessionResult.access_token || !sessionResult.expires || !sessionResult.user) {
            throw new AccountError("Session response is missing some fields: \n" + JSON.stringify(sessionResult))
        }

        this.user = sessionResult.user;
        this.token = sessionResult.access_token;
        this.tokenExpiry = new Date(sessionResult.expires);
    }

    /**
     * Check if current authorization token is expired (buffer: 30s)
     * 
     * @returns Boolean representing if the token is expired
     */
    public isTokenExpired() {
        if (!this.token || !this.tokenExpiry) {
            return true;
        }

        return this.tokenExpiry <= new Date(Date.now() - 30 * 1000);
    }

    /**
     * Returns headers object for authenticated requests.
     * You might not need this ever.
     * 
     * @returns Headers of course
     */
    public getAuthHeaders() {
        if (!this.token) {
            throw new AccountError("Cookie or Token is still missing after refresh");
        }

        return new Headers({
            ...DefaultHeader,
            "Cookie": this.cookie,
            "Authorization": "Bearer " + this.token,
        })
    }

    /**
     * Fetches session update request's json from labs.google
     * 
     * @returns Promise containing `SessionData` object which contains account session info.
     */
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