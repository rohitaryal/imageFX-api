# imageFX-api (imagen)
Unofficial free reverse engineered api for imageFX(imagen) service provided by [labs.google](https://labs.google)

![Banner](https://raw.githubusercontent.com/rohitaryal/imageFX-api/refs/heads/main/assets/banner.png)

## Installation
```bash
npm i -g @rohitaryal/imagefx-api
```

## Usage
`imagefx` can be invoked through both command line and as a module.
<details>
<summary style="font-weight: bold;font-size:15px;">Command Line</summary>

Make sure you have:
1. Installed `imagefx` globally ([How to install?](#installation))
2. Obtained your google account cookies ([How to get cookies?](#help))
3. Set env variable `GOOGLE_COOKIE` containing your cookie
    ```bash
    export GOOGLE_COOKIE="__YOUR__COOKIE__HERE__"
    ```

#### Basic Usages:
- Generating image with prompt

    ```bash
    # saves generated image at current directory
    imagefx generate --prompt "A bad friend" --cookie $GOOGLE_COOKIE
    ```
- Selecting a specific model
    ```bash
    # please refer to --help for listing all models
    imagefx generate --prompt "An evil company" --model "IMAGEN_3_5" --cookie $GOOGLE_COOKIE
    ```
- Selecting a specific aspect ratio
    ```bash
    # please refer to --help for listing all aspect ratio
    imagefx generate --prompt "Reptillian CEO" --size "PORTRAIT" --cookie $GOOGLE_COOKIE
    ```
- Saving to specific destination
    ```bash
    # it will automatically create non-existing directory if possible
    imagefx generate --prompt "Netflix but with less fees" --dir ~/Pictures --cookie $GOOGLE_COOKIE
    ```
- You can also save image using its media id.
    ```bash
    imagefx fetch "__MEDIA__ID__HERE__" --cookie $GOOGLE_COOKIE
    ```
- Generating prompt/caption using an image as reference.
    ```bash
    # supported image types: jpeg, jpg, jpe, png, gif, webp, svg, bmp, tiff, apng, avif (not tested with all)
    imagefx caption --image /path/to/img.webp --type WEBP --cookie $GOOGLE_COOKIE
    ```
Full generation help:
```text
imagefx generate <options>

Options:
      --version     Show version number
  -h, --help        Show help
  -p, --prompt      Textual description of image to be generated
  -m, --model       Model to be used for image generation
  -n, --count       Number of images to generate
      --size, --sz  Aspect ratio of image to be generated
  -s, --seed        Seed value for image to be generated
  -r, --retry       Number of retries if in case fetch fails
  -d, --dir         Directory to save generated images
  -c, --cookie      Google account cookie
```

Full caption generation help:
```text
Generate detailed caption(s) from image

Options:
  --version  Show version number
  -h, --help     Show help
  -i, --image    Path to the image to be captioned
  -t, --type     Type of image (eg: png, jpeg, webp, etc)
  -n, --count    Number of captions to generate
  -c, --cookie   Google account cookie
```

Full fetching help:
```text
imagefx fetch <mediaId>

Positionals:
  mediaId  Unique ID of generated image

Options:
      --version  Show version number
  -h, --help     Show help
  -d, --dir      Directory to save generated images
  -c, --cookie   Google account cookie
```
</details>

<details>
<summary style="font-weight: bold;font-size:15px;">Importing as module</summary>

- Basic image generation

    ```typescript
    import { ImageFX } from "@rohitaryal/imagefx-api";

    const fx = new ImageFX(process.env.GOOGLE_COOKIE);

    // Generate images
    const generatedImage = await fx.generateImage("A big black cockroach");

    // Iterate over multiple images and save
    generatedImage.forEach(image => {
        const savedPath = image.save(".cache/");
            console.log("[+] Image saved at: " + savedPath);
    });
    ```
- More descriptive prompt
    ```typescript
    const fx = new ImageFX(GOOGLE_COOKIE);

    const prompt = new Prompt({
        seed: 0,
        numberOfImages: 4,
        prompt: "A green spongebob",
        generationModel: "IMAGEN_3_5",
        aspectRatio: "IMAGE_ASPECT_RATIO_SQUARE",
    });

    // Generate images
    const generatedImage = await fx.generateImage(prompt);

    // Iterate over generated images and save
    generatedImage.forEach(image => {
        const savedPath = image.save(".cache/");
        console.log("[+] Image saved at: " + savedPath);
    });
    ```

More examples are at: [/examples](https://github.com/rohitaryal/imageFX-api/tree/main/examples)
</details>

## Help
<details>
<summary style="font-weight: bold;font-size:15px;">How to extract cookies?</summary>

#### Easy way:
1. Install [Cookie Editor](https://github.com/Moustachauve/cookie-editor) extension in your browser.
2. Open [labs.google](https://labs.google/fx/tools/image-fx), make sure you are logged in
3. Click on <kbd>Cookie Editor</kbd> icon from Extensions section.
4. Click on <kbd>Export</kbd> -> <kbd>Header String</kbd>

#### Manual way:
1. Open [labs.google](https://labs.google/fx/tools/image-fx), make sure you are logged in
2. Press <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>I</kbd> to open console
3. Click on <kbd>Network</kbd> tab at top of console
4. Press <kbd>CTRL</kbd> + <kbd>L</kbd> to clear network logs
5. Click <kbd>CTRL</kbd> + <kbd>R</kbd> to refresh page
6. Click on `image-fx` which should be at top
7. Goto <kbd>Request Headers</kbd> section and copy all the content of <kbd>Cookie</kbd>

</details>

<details>
<summary style="font-weight: bold;font-size:15px;">ImageFX not available in your country?</summary>

1. Install a free VPN (Windscribe, Proton, etc)
2. Open [labs.google](https://labs.google/fx/tools/image-fx) and login
3. From here follow the "How to extract cookie?" in [HELP](#help) section (above).
4. Once you have obtained this cookie, you don't need VPN anymore.
</details>

<details>
<summary style="font-weight: bold;font-size:15px;">Not able to generate images?</summary>

Create an issue [here](https://github.com/rohitaryal/imageFX-api/issues). Make sure the pasted logs don't contain cookie or tokens.
</details>

## TODO
- Write tests for caption generation
- Maybe add 'features' section in readme

## Contributions
Contribution are welcome but ensure to pass all test cases and follow existing coding standard.

## Desclaimer
This project demonstrates usage of Google's private API but is not affiliated with Google. Use at your own risk.