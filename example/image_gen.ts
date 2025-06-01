import generateImage from "../src/index-old";
import { saveImage } from "../src/utils/filemanager";

if (!process.env.AUTH) {
  throw Error("AUTH environment variable is not set.");
}

const req = await generateImage({
  prompt: "An eagle is flying and a person is standing over it",
  authorization: process.env.AUTH,
  imageCount: 5,
  seed: null, // I dont need any reference
});

req.imagePanels[0].generatedImages.forEach((image, index) => {
  const imageName = `image-${index + 1}.png`;

  if (saveImage(imageName, image.encodedImage)) {
    console.log("Saved image: ", imageName);
  } else {
    console.log("Failed to save an image");
  }
});
