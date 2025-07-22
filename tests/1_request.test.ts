import type { Request } from "../src/global.types";
import { request } from "../src/utils/request";
import { test, expect } from "bun:test";

test("Testing GET request", async () => {
  const req: Request = {
    method: "GET",
    url: "https://postman-echo.com/get?fizz=buzz",
    headers: new Headers({ 'X-Fizz': 'Buzz' })
  };

  const resp = await request(req);

  expect(resp.Err).toBeUndefined()
  expect(resp.Ok).toBeDefined()

  const parsedResp = JSON.parse(resp.Ok!); // Saved by --bail

  expect(parsedResp.args).toBeDefined()
  expect(parsedResp.args.fizz).toBe("buzz")
  expect(parsedResp.headers['x-fizz']).toBe("Buzz")
});

test("Testing POST request", async () => {
  const req: Request = {
    method: "POST",
    url: "https://postman-echo.com/post",
    body: "fizz=buzz",
    headers: new Headers({ 'X-Fizz': 'Buzz' })
  };

  const resp = await request(req);

  expect(resp.Err).toBeUndefined()
  expect(resp.Ok).toBeDefined()

  const parsedResp = JSON.parse(resp.Ok!); // Saved by --bail

  expect(parsedResp.data).toBe("fizz=buzz")
  expect(parsedResp.headers['x-fizz']).toBe("Buzz")

})
