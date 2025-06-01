import fs from "fs";
import path from "path";

/**
* Saves content to a file
* @param fileName Name of file to save contents to.
* @param fileContent Content to save to `fileName`
* @param encoding Encoding to use (base64, yada yada)
* @param filePath Path to save to.
*/
const saveFile = (
  fileName: string,
  fileContent: string,
  encoding: BufferEncoding = "utf-8",
  filePath: string = ".",
): void => {
  const fullPath = path.join(filePath, fileName);
  const parsedPath = path.parse(fullPath);

  if (
    parsedPath.dir &&
    !fs.existsSync(parsedPath.dir) &&
    parsedPath.dir != "."
  ) {
    try {
      fs.mkdirSync(parsedPath.dir, { recursive: true });

    } catch (error) {

      console.log(`[!] Failed to create directory: ${parsedPath.dir}`);
      console.log(error);
    }
  }

  try {
    fs.writeFileSync(fullPath, fileContent, { encoding });
    console.log(`[+] ${fileName} saved successfully at: ${filePath}`)

  } catch (error) {

    console.log(`[!] Failed to write into file.`);
    console.log(error);
  }
};

const saveImage = (
  fileName: string,
  imageContent: string,
  filePath: string = ".",
): void => {
  saveFile(fileName, imageContent, "base64", filePath);
};

export { saveFile, saveImage };
