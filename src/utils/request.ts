interface Options {
  reqURL: string;
  authorization: string;
  method: "GET" | "POST";
  body?: string;
}

const defaultHeaders = new Headers({
  'accept': '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'content-type': 'text/plain;charset=UTF-8',
  'dnt': '1',
  'origin': 'https://labs.google',
  'priority': 'u=1, i',
  'referer': 'https://labs.google/',
  'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
})

const request = (options: Options, headers: Headers = defaultHeaders) => {
  if (!options.authorization.startsWith("Bearer")) {
    options.authorization = "Bearer " + options.authorization;
  }

  headers.append("authorization", options.authorization);

  return fetch(options.reqURL, {
    headers,
    method: options.method,
    body: options.body,
  });
}

export default request;
