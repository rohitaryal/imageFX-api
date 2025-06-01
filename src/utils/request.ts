import type { Request, Result } from "../global.types";

const request = async function (req: Request): Promise<Result<string>> {
  req.headers.set("Origin", "https://labs.google");
  req.headers.set("Referer", "https://labs.google");

  try {
    const reqs = await fetch(req.url, {
      body: req.body,
      method: req.method,
      headers: req.headers,
    });

    const res = await reqs.text();

    if (!reqs.ok) {
      return {
        Err: new Error(res)
      }
    }

    return {
      Ok: res,
    };

  } catch (err) {
    return {
      Err: (err instanceof Error) ? err : new Error("Failed to fetch.")
    }
  }
}

export { request };
