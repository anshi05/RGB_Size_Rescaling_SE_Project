/**
 * @file lib/image-resizers/NearestNeighborResizer.js
 * @author Anshi
 * @description Provides functions for resizing images using the Nearest Neighbor interpolation algorithm.
 * @lastUpdated 2025-10-07
 */

/**
 * @overview Resizes an image using the Nearest Neighbor interpolation algorithm.
 * This method is the fastest but can result in a blocky or pixelated appearance,
 * especially when scaling up, as it simply picks the color of the closest pixel
 * from the original image for each new pixel in the resized image.
 * 
 * @param {File} sourceImageFile - The input image file (Blob or File object) to be resized.
 * @param {number} targetWidth - The desired width of the output image in pixels.
 * @param {number} targetHeight - The desired height of the output image in pixels.
 * 
 * @returns {Promise<Blob>} A Promise that resolves with a Blob containing the resized image in PNG format.
 * @throws {Error} If the canvas rendering context is unavailable or if blob creation fails.
 */
export const applyNearestNeighborResize = (sourceImageFile, targetWidth, targetHeight) => {
  return new Promise((resolve, reject) => {
    const imgElement = new Image();
    // Ensure cross-origin images can be loaded without tainting the canvas
    imgElement.crossOrigin = "anonymous";

    imgElement.onload = () => {
      try {
        // Create an offscreen canvas to draw the original image
        const originalCanvas = document.createElement("canvas");
        const originalCtx = originalCanvas.getContext("2d");

        if (!originalCtx) {
          console.error("NearestNeighborResizer: Failed to obtain 2D rendering context for canvas.");
          return reject(new Error("Canvas context unavailable."));
        }

        const originalWidth = imgElement.width;
        const originalHeight = imgElement.height;
        
        originalCanvas.width = originalWidth;
        originalCanvas.height = originalHeight;
        originalCtx.drawImage(imgElement, 0, 0); // Draw the original image onto the canvas

        // Get the pixel data from the original image
        const originalImageData = originalCtx.getImageData(0, 0, originalWidth, originalHeight);
        const originalData = originalImageData.data;

        // Create a new offscreen canvas for the resized image
        const resizedCanvas = document.createElement("canvas");
        const resizedCtx = resizedCanvas.getContext("2d");
        
        resizedCanvas.width = targetWidth;
        resizedCanvas.height = targetHeight;

        // Create an empty ImageData object for the resized image
        const resizedImageData = resizedCtx.createImageData(targetWidth, targetHeight);
        const resizedData = resizedImageData.data;

        // Calculate the scaling factors for X and Y dimensions
        const scaleX = originalWidth / targetWidth;
        const scaleY = originalHeight / targetHeight;

        // Iterate over each pixel in the target (resized) image
        for (let y = 0; y < targetHeight; y++) {
          for (let x = 0; x < targetWidth; x++) {
            // Map the current target pixel back to the nearest corresponding pixel in the original image
            const srcX = Math.floor(x * scaleX);
            const srcY = Math.floor(y * scaleY);

            // Ensure source coordinates are within the bounds of the original image
            const clampedX = Math.max(0, Math.min(originalWidth - 1, srcX));
            const clampedY = Math.max(0, Math.min(originalHeight - 1, srcY));

            // Calculate the index of the source pixel in the original image's data array
            const srcIndex = (clampedY * originalWidth + clampedX) * 4;
            
            // Calculate the index of the destination pixel in the resized image's data array
            const destIndex = (y * targetWidth + x) * 4;

            // Copy all four channels (RGBA) from the source pixel to the destination pixel
            resizedData[destIndex] = originalData[srcIndex];     // Red channel
            resizedData[destIndex + 1] = originalData[srcIndex + 1]; // Green channel
            resizedData[destIndex + 2] = originalData[srcIndex + 2]; // Blue channel
            resizedData[destIndex + 3] = originalData[srcIndex + 3]; // Alpha channel
          }
        }

        // NOTE: The `applyNearestNeighborAlternative` function below is commented out as it's an alternative
        // implementation and not currently used in the main resize flow. It demonstrates different rounding logic.
        /*
        const applyNearestNeighborAlternative = () => {
          for (let y = 0; y < targetHeight; y++) {
            for (let x = 0; x < targetWidth; x++) {
              // Alternative: use rounding instead of flooring
              const srcX = Math.round(x * scaleX);
              const srcY = Math.round(y * scaleY);

              const clampedX = Math.max(0, Math.min(originalWidth - 1, srcX));
              const clampedY = Math.max(0, Math.min(originalHeight - 1, srcY));

              const srcIndex = (clampedY * originalWidth + clampedX) * 4;
              const destIndex = (y * targetWidth + x) * 4;

              resizedData[destIndex] = originalData[srcIndex];
              resizedData[destIndex + 1] = originalData[srcIndex + 1];
              resizedData[destIndex + 2] = originalData[srcIndex + 2];
              resizedData[destIndex + 3] = originalData[srcIndex + 3];
            }
          }
        };
        */

        // Put the processed pixel data onto the resized canvas
        resizedCtx.putImageData(resizedImageData, 0, 0);

        // Convert the resized canvas content to a PNG Blob
        resizedCanvas.toBlob(
          (outputBlob) => {
            if (outputBlob) {
              resolve(outputBlob);
            } else {
              console.error("NearestNeighborResizer: Failed to generate Blob from canvas.");
              reject(new Error("Blob creation failed."));
            }
          },
          "image/png", // Output format
          1.0 // Maximum quality for the output PNG image
        );

      } catch (error) {
        console.error("NearestNeighborResizer: Error during nearest-neighbor resizing.", error);
        reject(error);
      }
    };

    imgElement.onerror = (e) => {
      console.error("NearestNeighborResizer: Error loading image.", e);
      reject(new Error("Image loading failed."));
    };

    // Set the image source to a Blob URL created from the input file
    imgElement.src = URL.createObjectURL(sourceImageFile);
  });
};

/**
 * @overview Resizes an image using the Nearest Neighbor interpolation algorithm with an optimized approach.
 * This version aims for better performance by pre-calculating source coordinates and using `Uint32Array`
 * for faster pixel data copying, treating RGBA as a single 32-bit integer.
 * 
 * @param {File} sourceImageFile - The input image file (Blob or File object) to be resized.
 * @param {number} targetWidth - The desired width of the output image in pixels.
 * @param {number} targetHeight - The desired height of the output image in pixels.
 * 
 * @returns {Promise<Blob>} A Promise that resolves with a Blob containing the resized image in PNG format.
 * @throws {Error} If the canvas rendering context is unavailable or if blob creation fails.
 */
export const applyNearestNeighborResizeOptimized = (sourceImageFile, targetWidth, targetHeight) => {
  return new Promise((resolve, reject) => {
    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous";

    imgElement.onload = () => {
      try {
        const originalCanvas = document.createElement("canvas");
        const originalCtx = originalCanvas.getContext("2d");

        // Ensure canvas context is available
        if (!originalCtx) {
          throw new Error("Optimized NearestNeighborResizer: Failed to obtain 2D rendering context for canvas.");
        }

        const originalWidth = imgElement.width;
        const originalHeight = imgElement.height;
        
        originalCanvas.width = originalWidth;
        originalCanvas.height = originalHeight;
        originalCtx.drawImage(imgElement, 0, 0);

        const originalImageData = originalCtx.getImageData(0, 0, originalWidth, originalHeight);
        const originalData = originalImageData.data;

        const resizedCanvas = document.createElement("canvas");
        const resizedCtx = resizedCanvas.getContext("2d");
        
        resizedCanvas.width = targetWidth;
        resizedCanvas.height = targetHeight;

        const resizedImageData = resizedCtx.createImageData(targetWidth, targetHeight);
        const resizedData = resizedImageData.data;

        const scaleX = originalWidth / targetWidth;
        const scaleY = originalHeight / targetHeight;

        // Pre-calculate source coordinates for better performance, reducing calculations inside the main loop
        const srcCoordinates = new Array(targetHeight);
        for (let y = 0; y < targetHeight; y++) {
          srcCoordinates[y] = new Array(targetWidth);
          for (let x = 0; x < targetWidth; x++) {
            const srcX = Math.floor(x * scaleX);
            const srcY = Math.floor(y * scaleY);
            srcCoordinates[y][x] = {
              x: Math.max(0, Math.min(originalWidth - 1, srcX)), // Clamp X coordinate
              y: Math.max(0, Math.min(originalHeight - 1, srcY)) // Clamp Y coordinate
            };
          }
        }

        // Perform the actual pixel copying using pre-calculated coordinates
        for (let y = 0; y < targetHeight; y++) {
          for (let x = 0; x < targetWidth; x++) {
            const coord = srcCoordinates[y][x];
            const srcIndex = (coord.y * originalWidth + coord.x) * 4;
            const destIndex = (y * targetWidth + x) * 4;

            // Use Uint32Array view for faster 32-bit copy (RGBA values copied at once)
            const srcU32 = new Uint32Array(originalData.buffer, srcIndex, 1);
            const destU32 = new Uint32Array(resizedData.buffer, destIndex, 1);
            destU32[0] = srcU32[0];
          }
        }

        resizedCtx.putImageData(resizedImageData, 0, 0);

        resizedCanvas.toBlob(
          (outputBlob) => {
            if (outputBlob) {
              resolve(outputBlob);
            } else {
              reject(new Error("Blob creation failed."));
            }
          },
          "image/png",
          1.0
        );

      } catch (error) {
        console.error("NearestNeighborResizer: Error during optimized resizing.", error);
        reject(error);
      }
    };

    imgElement.onerror = (e) => {
      reject(new Error("Image loading failed."));
    };

    imgElement.src = URL.createObjectURL(sourceImageFile);
  });
};