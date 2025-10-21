/**
 * @file lib/image-resizers/BilinearResizer.js
 * @author Harsh
 * @description Provides functions for resizing images using the Bilinear interpolation algorithm.
 * @lastUpdated 2025-10-07
 */

/**
 * @overview Resizes an image using the Bilinear interpolation algorithm.
 * This method calculates the color of each new pixel based on the weighted average of the four nearest pixels
 * in the original image. It produces smoother results than Nearest Neighbor but can be slower.
 * 
 * @param {File} inputFile - The input image file (Blob or File object) to be resized.
 * @param {number} newWidth - The desired width of the output image in pixels.
 * @param {number} newHeight - The desired height of the output image in pixels.
 * 
 * @returns {Promise<Blob>} A Promise that resolves with a Blob containing the resized image in PNG format.
 * @throws {Error} If the canvas rendering context is unavailable, or if image loading or blob creation fails.
 */
export const resizeImageBilinear = (inputFile, newWidth, newHeight) => {
  return new Promise((resolve, reject) => {
    const imageObject = new Image();
    // Ensure cross-origin images can be loaded without tainting the canvas
    imageObject.crossOrigin = "anonymous";

    imageObject.onload = () => {
      try {
        // Create an offscreen canvas for the original image
        const originalCanvas = document.createElement("canvas");
        const originalCtx = originalCanvas.getContext("2d");
        
        if (!originalCtx) {
          throw new Error("Canvas context initiation failed.");
        }

        const originalWidth = imageObject.width;
        const originalHeight = imageObject.height;
        
        originalCanvas.width = originalWidth;
        originalCanvas.height = originalHeight;
        originalCtx.drawImage(imageObject, 0, 0); // Draw the original image onto the canvas

        // Get the pixel data from the original image
        const originalImageData = originalCtx.getImageData(0, 0, originalWidth, originalHeight);
        const originalData = originalImageData.data;

        // Create a new offscreen canvas for the resized image
        const resizedCanvas = document.createElement("canvas");
        const resizedCtx = resizedCanvas.getContext("2d");
        
        resizedCanvas.width = newWidth;
        resizedCanvas.height = newHeight;

        // Create an empty ImageData object for the resized image
        const resizedImageData = resizedCtx.createImageData(newWidth, newHeight);
        const resizedData = resizedImageData.data;

        // Calculate the scaling factors for X and Y dimensions
        const scaleX = originalWidth / newWidth;
        const scaleY = originalHeight / newHeight;

        // Iterate over each pixel in the target (resized) image
        for (let y = 0; y < newHeight; y++) {
          for (let x = 0; x < newWidth; x++) {
            // Calculate the corresponding floating-point position in the original image.
            // Adding 0.5 to x and y before scaling centers the sample point in the middle of the target pixel.
            const srcX = (x + 0.5) * scaleX - 0.5;
            const srcY = (y + 0.5) * scaleY - 0.5;

            // Determine the coordinates of the 4 surrounding pixels in the original image
            const x1 = Math.floor(srcX);
            const y1 = Math.floor(srcY);
            const x2 = Math.min(x1 + 1, originalWidth - 1); // Clamp to prevent exceeding image bounds
            const y2 = Math.min(y1 + 1, originalHeight - 1); // Clamp to prevent exceeding image bounds

            // Calculate the fractional distances for interpolation weights
            const wx = srcX - x1;
            const wy = srcY - y1;
            // Calculate the 4 weights based on fractional distances
            const w1 = (1 - wx) * (1 - wy); // Top-left pixel weight
            const w2 = wx * (1 - wy);     // Top-right pixel weight
            const w3 = (1 - wx) * wy;     // Bottom-left pixel weight
            const w4 = wx * wy;         // Bottom-right pixel weight

            // Get the RGBA values of the 4 surrounding pixels
            const pixel1 = getPixel(originalData, originalWidth, x1, y1);
            const pixel2 = getPixel(originalData, originalWidth, x2, y1);
            const pixel3 = getPixel(originalData, originalWidth, x1, y2);
            const pixel4 = getPixel(originalData, originalWidth, x2, y2);

            // Calculate the destination pixel index in the resized image's data array
            const resizedIndex = (y * newWidth + x) * 4;
            
            // Interpolate each color channel (R, G, B, A) using the calculated weights
            resizedData[resizedIndex] = Math.round(
              pixel1[0] * w1 + pixel2[0] * w2 + pixel3[0] * w3 + pixel4[0] * w4
            ); // Red
            resizedData[resizedIndex + 1] = Math.round(
              pixel1[1] * w1 + pixel2[1] * w2 + pixel3[1] * w3 + pixel4[1] * w4
            ); // Green
            resizedData[resizedIndex + 2] = Math.round(
              pixel1[2] * w1 + pixel2[2] * w2 + pixel3[2] * w3 + pixel4[2] * w4
            ); // Blue
            resizedData[resizedIndex + 3] = Math.round(
              pixel1[3] * w1 + pixel2[3] * w2 + pixel3[3] * w3 + pixel4[3] * w4
            ); // Alpha
          }
        }

        // Put the processed pixel data onto the resized canvas
        resizedCtx.putImageData(resizedImageData, 0, 0);

        // Convert the resized canvas content to a PNG Blob
        resizedCanvas.toBlob(
          (resultBlob) => {
            if (resultBlob) {
              resolve(resultBlob);
            } else {
              reject(new Error("Blob generation failed."));
            }
          },
          "image/png", // Output format
          0.9 // Quality setting for PNG compression (0.9 for good quality)
        );

      } catch (error) {
        console.error("BilinearResizer: Error during resizing.", error);
        reject(error);
      }
    };

    imageObject.onerror = (errorEvent) => {
      console.error("BilinearResizer: Image loading error.", errorEvent);
      reject(new Error("Failed to load image for bilinear resizing."));
    };

    // Set the image source to a Blob URL created from the input file
    imageObject.src = URL.createObjectURL(inputFile);
  });
};

/**
 * @overview Helper function to extract the RGBA pixel values from an ImageData array
 * at a specified (x, y) coordinate.
 * 
 * @param {Uint8ClampedArray} data - The 1D array containing the pixel data of an image (RGBA).
 * @param {number} width - The width of the image from which the pixel data was extracted.
 * @param {number} x - The X-coordinate (column) of the pixel.
 * @param {number} y - The Y-coordinate (row) of the pixel.
 * 
 * @returns {[number, number, number, number]} An array containing the R, G, B, and A values
 * (0-255) of the pixel at the given coordinates.
 */
function getPixel(data, width, x, y) {
  // Calculate the starting index of the pixel's RGBA data in the 1D array
  const index = (y * width + x) * 4;
  return [
    data[index],     // Red channel value
    data[index + 1], // Green channel value
    data[index + 2], // Blue channel value
    data[index + 3]  // Alpha channel value
  ];
}