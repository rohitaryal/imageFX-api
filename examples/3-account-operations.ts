import { Account } from "../src/index";

const GOOGLE_COOKIE = process.env.GOOGLE_COOKIE;
if (!GOOGLE_COOKIE) {
    console.log("Cookie is missing :(");
    process.exit(1);
}

// You might not need this at all

const account = new Account(GOOGLE_COOKIE);

await account.refreshSession(); // Generates auth token from cookie

console.log("Username: " + account.user?.name)
console.log("Token: " + account.token);
