# imageFX-api
Unofficial reverse engineered api for imageFX service provided by labs.google

# How to get authorization token?
1. Visit [imageFX](https://labs.google/fx/tools/image-fx) page
2. Open dev-tools and paste the following code to extract your token

```javascript
let script = document.querySelector("#__NEXT_DATA__");
let obj = JSON.parse(script.textContent);
let authToken = obj['props']['pageProps']['session']['access_token'];

window.prompt("Copy the auth token: ", authToken);
```


Copy the prompted token and save it into `.auth` file somewhere. Now you can run the following,
```bash
node src/cli.ts --prompt "purple cat" --authf "[path_to_your_saved_.auth_file]"
```

`NOTE`: Auth tokens expire in ~3days

# Usage
```bash
usage: cli.ts [-h] [--auth AUTH] [--seed SEED] [--count COUNT]
              [--prompt PROMPT] [--authf AUTHF] [--dir DIR]

Generate ImageFX images directly from your terminal

optional arguments:
  -h, --help       show this help message and exit
  --auth AUTH      Authentication token for generating images
  --seed SEED      Seed value for a reference image (Default: null)
  --count COUNT    Number of images to generate (Default: 4)
  --prompt PROMPT  Prompt for generating image
  --authf AUTHF    Read auth token from plain text '.auth' file from given
                   path
  --dir DIR        Location to save generated images (Default: .)

```
