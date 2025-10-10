export const applyNearestNeighborResize = (sourceImageFile, targetWidth, targetHeight) => {
  return new Promise((resolve, reject) => {
    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous";

    imgElement.onload = () => {
      try {
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
        originalCtx.drawImage(imgElement, 0, 0);

        // Get original image data
        const originalImageData = originalCtx.getImageData(0, 0, originalWidth, originalHeight);
        const originalData = originalImageData.data;

        // Create canvas for resized image
        const resizedCanvas = document.createElement("canvas");
        const resizedCtx = resizedCanvas.getContext("2d");
        
        resizedCanvas.width = targetWidth;
        resizedCanvas.height = targetHeight;

        // Create new image data for resized image
        const resizedImageData = resizedCtx.createImageData(targetWidth, targetHeight);
        const resizedData = resizedImageData.data;

        // Calculate scaling factors
        const scaleX = originalWidth / targetWidth;
        const scaleY = originalHeight / targetHeight;

        // Perform nearest-neighbor interpolation
        for (let y = 0; y < targetHeight; y++) {
          for (let x = 0; x < targetWidth; x++) {
            // Find the nearest pixel in the original image
            const srcX = Math.floor(x * scaleX);
            const srcY = Math.floor(y * scaleY);

            // Ensure we stay within bounds
            const clampedX = Math.max(0, Math.min(originalWidth - 1, srcX));
            const clampedY = Math.max(0, Math.min(originalHeight - 1, srcY));

            // Get the source pixel index
            const srcIndex = (clampedY * originalWidth + clampedX) * 4;
            
            // Get the destination pixel index
            const destIndex = (y * targetWidth + x) * 4;

            // Copy pixel data directly (nearest neighbor)
            resizedData[destIndex] = originalData[srcIndex];     // Red
            resizedData[destIndex + 1] = originalData[srcIndex + 1]; // Green
            resizedData[destIndex + 2] = originalData[srcIndex + 2]; // Blue
            resizedData[destIndex + 3] = originalData[srcIndex + 3]; // Alpha
          }
        }

        // Alternative implementation with different rounding
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

        // Put the resized image data onto canvas
        resizedCtx.putImageData(resizedImageData, 0, 0);

        // Convert to blob
        resizedCanvas.toBlob(
          (outputBlob) => {
            if (outputBlob) {
              resolve(outputBlob);
            } else {
              console.error("NearestNeighborResizer: Failed to generate Blob from canvas.");
              reject(new Error("Blob creation failed."));
            }
          },
          "image/png",
          1.0 // Maximum quality for pixel-perfect results
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

    imgElement.src = URL.createObjectURL(sourceImageFile);
  });
};

// Optimized version for better performance
export const applyNearestNeighborResizeOptimized = (sourceImageFile, targetWidth, targetHeight) => {
  return new Promise((resolve, reject) => {
    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous";

    imgElement.onload = () => {
      try {
        const originalCanvas = document.createElement("canvas");
        const originalCtx = originalCanvas.getContext("2d");

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

        // Pre-calculate source coordinates for better performance
        const srcCoordinates = new Array(targetHeight);
        for (let y = 0; y < targetHeight; y++) {
          srcCoordinates[y] = new Array(targetWidth);
          for (let x = 0; x < targetWidth; x++) {
            const srcX = Math.floor(x * scaleX);
            const srcY = Math.floor(y * scaleY);
            srcCoordinates[y][x] = {
              x: Math.max(0, Math.min(originalWidth - 1, srcX)),
              y: Math.max(0, Math.min(originalHeight - 1, srcY))
            };
          }
        }

        // Perform the actual pixel copying
        for (let y = 0; y < targetHeight; y++) {
          for (let x = 0; x < targetWidth; x++) {
            const coord = srcCoordinates[y][x];
            const srcIndex = (coord.y * originalWidth + coord.x) * 4;
            const destIndex = (y * targetWidth + x) * 4;

            // Use Uint32Array view for faster 32-bit copy (RGBA at once)
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