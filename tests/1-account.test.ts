import { Account } from "../src/index";
import { expect, test } from "bun:test";

const GOOGLE_COOKIE = process.env.GOOGLE_COOKIE;
if (!GOOGLE_COOKIE) process.exit(1);

test("Refresh authorization token", async () => {
    const account = new Account(GOOGLE_COOKIE);
    await account.refreshSession(); // Complete the test

    expect(account.token).toBeDefined();
    expect(account.user).toBeDefined();
    expect(account.isTokenExpired()).toBe(false);
});