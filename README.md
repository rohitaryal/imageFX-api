# imageFX-api
Unofficial reverse engineered api for imageFX service provided by labs.google

<center>
    <img src="./misc/banner.png" style="border-radius:10px" height="300px">
</center>
<br>

Golang version can be found [here](https://github.com/rohitaryal/imageGO)  
Whisk API client can be found [here](https://github.com/rohitaryal/whisk-api)

## Installation
```bash
npm i -g @rohitaryal/imagefx-api
```
## Usage

<details>
<summary>Command Line</summary>


```bash
imagefx --prompt "purple cat" --cookie "$COOKIE"
```

You can also use authentication token instead.

```bash
imagefx --prompt "purple cat" --auth "$TOKEN"
```

If one is present the other one is optional, but generating new authentication token will require cookies. So, its better to use the first one since it generates authentication token internally.

#### Full Usage Options:
```text
Usage: imagefx [options]

Options:
  --version        Show version number                      [boolean]
  --auth           Authentication token for generating images [string]
  --cookie         Cookie (for auto auth token generation)   [string]
  --seed           Seed for reference image                  [number] [default: null]
  --count          Number of images to generate              [number] [default: 4]
  --prompt         Prompt for image generation               [string] [required]
  --dir            Directory to save images                  [string] [default: "."]
  --model          Model to use for generation                [string] [default: IMAGEN_4]
                   Choices: IMAGEN_2, IMAGEN_3, IMAGEN_4,
                            IMAGEN_3_1, IMAGEN_3_5,
                            IMAGEN_2_LANDSCAPE, IMAGEN_3_PORTRAIT,
                            IMAGEN_3_LANDSCAPE, IMAGEN_3_PORTRAIT_THREE_FOUR,
                            IMAGEN_3_LANDSCAPE_FOUR_THREE,
                            IMAGE_MODEL_NAME_UNSPECIFIED
  --ratio          Aspect ratio                               [string] [default: IMAGE_ASPECT_RATIO_LANDSCAPE]
                   Choices: IMAGE_ASPECT_RATIO_SQUARE,
                            IMAGE_ASPECT_RATIO_PORTRAIT,
                            IMAGE_ASPECT_RATIO_LANDSCAPE,
                            IMAGE_ASPECT_RATIO_UNSPECIFIED,
                            IMAGE_ASPECT_RATIO_LANDSCAPE_FOUR_THREE,
                            IMAGE_ASPECT_RATIO_PORTRAIT_THREE_FOUR
  --help           Show help                                [boolean]
```
</details>

<details>
<summary>Importing as module</summary>

```javascript
import * as fs from "fs";
import ImageFx from "@rohitaryal/imagefx-api";


const fx = new ImageFx({
  authorizationKey: process.env.TOKEN
});

const resp = await fx.generateImage({
  prompt: "A sigma crocodile, showing off his rizz"
});

if(resp.Err || !resp.Ok) { // Failed
    console.log(resp.Err)
    process.exit(1);
}


resp.Ok.forEach((image, index) => {
  fs.writeFileSync(`image-${index + 1}.png`, image.encodedImage, "base64")
})
```

**Note**: All function return `Result<T>` and it consists of:
- `Ok: T` - If it was success, result will be here
- `Err: Error` - In case of failure, error message will be here

</details>

## Contributions
Contribution are welcome but ensure to pass all test cases and follow existing coding standard. 

## Desclaimer
This project demonstrates usage of Google's private API but is not affiliated with Google. Use at your own risk.