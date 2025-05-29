# imageFX-api
Unofficial reverse engineered api for imageFX service provided by labs.google

Golang version can be found [here](https://github.com/rohitaryal/imageGO)  
Whisk API client can be found [here](https://github.com/rohitaryal/whisk-api)

# How to get authorization token?
1. Visit [imageFX](https://labs.google/fx/tools/image-fx) page
2. Open dev-tools and paste the following code to extract your token

```javascript
let script = document.querySelector("#__NEXT_DATA__");
let obj = JSON.parse(script.textContent);
let authToken = obj["props"]["pageProps"]["session"]["access_token"];

window.prompt("Copy the auth token: ", authToken);
```

# Usage
Clone the repo:

```bash
git clone https://github.com/rohitaryal/imageFX-api.git
cd imageFX-api
```

For Bun:
```bash
bun src/cli.ts --prompt "purple cat" --auth "[your authentication token here]"
```

For NodeJS:
```bash
npx ts-node src/cli.ts --prompt "purple cat" --auth "[your authentication token here]"
```

`NOTE`: Auth tokens expire in ~3days


> [!WARNING]
> Don't run this program on an untrusted environment or clear your auth cookies
> from `.auth` file

> [!TIP]
> You can provide auth token from file using `--authf` flag

# Importing as a module
Please check [./example](./example).

```javascript
import generateImage from "imageFX-api";
import { saveImage } from "../src/utils/filemanager";

let i = 0;

await generateImage({
    prompt: "door is lava",
    auth: process.env.AUTH,
    imageCount: 5,
}).then((image) => {
    image.imagePanels[0].generatedImages.forEach((image, index) => {
        saveImage(`image-${++i}.png`, image.encodedImage);
    });
});
```

# More Usage
```bash
usage: cli.ts [-h] [--auth AUTH] [--seed SEED] [--count COUNT] [--prompt PROMPT] [--authf AUTHF] [--dir DIR] [--model MODEL]
              [--aspect-ratio ASPECT_RATIO]

Generate ImageFX images directly from your terminal

optional arguments:
  -h, --help            show this help message and exit
  --auth AUTH           Authentication token for generating images
  --seed SEED           Seed value for a reference image (Default: null)
  --count COUNT         Number of images to generate (Default: 4)
  --prompt PROMPT       Prompt for generating image
  --authf AUTHF         Read auth token from plain text '.auth' file from given path
  --dir DIR             Location to save generated images (Default: .)
  --model MODEL         Model to use for generating images (Default: IMAGEN_3)
  --aspect-ratio ASPECT_RATIO
                        Aspect ratio for generated images (Default: IMAGE_ASPECT_RATIO_SQUARE)
```
