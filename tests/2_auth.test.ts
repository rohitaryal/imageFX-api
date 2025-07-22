import ImageFx from "../src";
import { test, expect } from "bun:test";

const cookie = process.env.GOOGLE_COOKIE;

const fx = new ImageFx({
  cookie,
});

test.if(!!cookie)("Generating auth token", async () => {
  const resp = await fx.getAuthToken()

  expect(resp.Err).toBeUndefined()
  expect(resp.Ok).toBeDefined()
});
