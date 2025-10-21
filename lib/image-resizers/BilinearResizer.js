/**
 * @file lib/image-resizers/BilinearResizer.js
 * @author Harsh
 * @description Provides functions for resizing images using the Bilinear interpolation algorithm.
 * @lastUpdated 2025-10-07
 */
export const resizeImageBilinear = (inputFile, newWidth, newHeight) => {
  return new Promise((resolve, reject) => {
    const imageObject = new Image();
    imageObject.crossOrigin = "anonymous";

    imageObject.onload = () => {
      try {
        // Create temporary canvas for original image
        const originalCanvas = document.createElement("canvas");
        const originalCtx = originalCanvas.getContext("2d");
        
        if (!originalCtx) {
          throw new Error("Canvas context initiation failed.");
        }

        const originalWidth = imageObject.width;
        const originalHeight = imageObject.height;
        
        originalCanvas.width = originalWidth;
        originalCanvas.height = originalHeight;
        originalCtx.drawImage(imageObject, 0, 0);

        // Get original image data
        const originalImageData = originalCtx.getImageData(0, 0, originalWidth, originalHeight);
        const originalData = originalImageData.data;

        // Create new canvas for resized image
        const resizedCanvas = document.createElement("canvas");
        const resizedCtx = resizedCanvas.getContext("2d");
        
        resizedCanvas.width = newWidth;
        resizedCanvas.height = newHeight;

        // Create new image data for resized image
        const resizedImageData = resizedCtx.createImageData(newWidth, newHeight);
        const resizedData = resizedImageData.data;

        // Calculate scaling factors
        const scaleX = originalWidth / newWidth;
        const scaleY = originalHeight / newHeight;

        // Perform bilinear interpolation
        for (let y = 0; y < newHeight; y++) {
          for (let x = 0; x < newWidth; x++) {
            // Calculate position in original image
            const srcX = (x + 0.5) * scaleX - 0.5;
            const srcY = (y + 0.5) * scaleY - 0.5;

            // Get the 4 surrounding pixels for interpolation
            const x1 = Math.floor(srcX);
            const y1 = Math.floor(srcY);
            const x2 = Math.min(x1 + 1, originalWidth - 1);
            const y2 = Math.min(y1 + 1, originalHeight - 1);

            // Calculate interpolation weights
            const wx = srcX - x1;
            const wy = srcY - y1;
            const w1 = (1 - wx) * (1 - wy);
            const w2 = wx * (1 - wy);
            const w3 = (1 - wx) * wy;
            const w4 = wx * wy;

            // Get the 4 pixel values (RGBA)
            const pixel1 = getPixel(originalData, originalWidth, x1, y1);
            const pixel2 = getPixel(originalData, originalWidth, x2, y1);
            const pixel3 = getPixel(originalData, originalWidth, x1, y2);
            const pixel4 = getPixel(originalData, originalWidth, x2, y2);

            // Interpolate each channel (R, G, B, A)
            const resizedIndex = (y * newWidth + x) * 4;
            
            resizedData[resizedIndex] = Math.round(
              pixel1[0] * w1 + pixel2[0] * w2 + pixel3[0] * w3 + pixel4[0] * w4
            );
            resizedData[resizedIndex + 1] = Math.round(
              pixel1[1] * w1 + pixel2[1] * w2 + pixel3[1] * w3 + pixel4[1] * w4
            );
            resizedData[resizedIndex + 2] = Math.round(
              pixel1[2] * w1 + pixel2[2] * w2 + pixel3[2] * w3 + pixel4[2] * w4
            );
            resizedData[resizedIndex + 3] = Math.round(
              pixel1[3] * w1 + pixel2[3] * w2 + pixel3[3] * w3 + pixel4[3] * w4
            );
          }
        }

        // Put the resized image data onto canvas
        resizedCtx.putImageData(resizedImageData, 0, 0);

        // Convert to blob
        resizedCanvas.toBlob(
          (resultBlob) => {
            if (resultBlob) {
              resolve(resultBlob);
            } else {
              reject(new Error("Blob generation failed."));
            }
          },
          "image/png",
          0.9
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

    imageObject.src = URL.createObjectURL(inputFile);
  });
};

// Helper function to get pixel data from ImageData
function getPixel(data, width, x, y) {
  const index = (y * width + x) * 4;
  return [
    data[index],     // Red
    data[index + 1], // Green
    data[index + 2], // Blue
    data[index + 3]  // Alpha
  ];
}