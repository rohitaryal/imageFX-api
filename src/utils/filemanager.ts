import {existsSync,mkdirSync, writeFileSync } from "fs";
import {join, parse} from "path";

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
  const fullPath = join(filePath, fileName);
  const parsedPath = parse(fullPath);

  if (
    parsedPath.dir &&
    !existsSync(parsedPath.dir) &&
    parsedPath.dir != "."
  ) {
    try {
      mkdirSync(parsedPath.dir, { recursive: true });

    } catch (error) {

      console.log(`[!] Failed to create directory: ${parsedPath.dir}`);
      console.log(error);
    }
  }

  try {
    writeFileSync(fullPath, fileContent, { encoding });
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
