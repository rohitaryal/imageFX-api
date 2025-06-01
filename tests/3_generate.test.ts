import ImageFx from "../src";
import type { Prompt, Request } from "../src/global.types";
import { test, expect } from "bun:test";

const cookie = process.env.GOOGLE_COOKIE;
const defaultPrompt = "A funny green cartoonish crocodile";

const fx = new ImageFx({
  cookie,
});

const prompt: Prompt = {
  prompt: defaultPrompt
}

test("Providing invalid cookie", async () => {
  // Unset cookie first
  const tempCookie = fx.credentials.cookie;
  fx.credentials.cookie = "";

  const resp = await fx.generateImage(prompt)
  expect(resp.Err).toBeDefined()
  expect(resp.Ok).toBeUndefined()

  // Set cookie back
  fx.credentials.cookie = tempCookie;
});

test.if(!!cookie)("Providing only cookie", async () => {
  const resp = await fx.generateImage(prompt)
  expect(resp.Err).toBeUndefined()
  expect(resp.Ok).toBeDefined()

  expect(resp.Ok).toBeInstanceOf(Array)
  expect(resp.Ok!.length).toBeGreaterThan(0)
}, 30000); // Timeout of 30s

test.if(!!cookie)("Providing authorization token only", async () => {
  // Generate token first
  const token = await fx.getAuthToken()
  expect(token.Err).toBeUndefined()
  expect(token.Ok).toBeDefined()

  // Now unset the cookie
  const tempCookie = fx.credentials.cookie;
  fx.credentials.cookie = "";

  // Set the token
  fx.credentials.authorizationKey = token.Ok;

  const resp = await fx.generateImage(prompt)
  expect(resp.Err).toBeUndefined()
  expect(resp.Ok).toBeDefined()

  expect(resp.Ok).toBeInstanceOf(Array)
  expect(resp.Ok!.length).toBeGreaterThan(0)


  // Set cookie back
  fx.credentials.cookie = tempCookie;
}, 30000); // Timeout of 30s
