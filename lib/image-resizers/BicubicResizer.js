/**
 * @file lib/image-resizers/BicubicResizer.js
 * @author Sameer
 * @description Provides functions for resizing images using the Bicubic interpolation algorithm.
 * @lastUpdated 2025-10-07
 */
export function performBicubicResize(sourceFile, desiredWidth, desiredHeight) {
  return new Promise((resolve, reject) => {
    const sourceImage = new Image();
    sourceImage.crossOrigin = "anonymous";

    sourceImage.onload = () => {
      try {
        console.log(`Original dimensions: ${sourceImage.width}x${sourceImage.height}`);
        console.log(`Target dimensions: ${desiredWidth}x${desiredHeight}`);

        // Create canvas for original image
        const originalCanvas = document.createElement("canvas");
        const originalCtx = originalCanvas.getContext("2d");
        
        if (!originalCtx) {
          throw new Error("Rendering context initialization failed.");
        }

        const originalWidth = sourceImage.width;
        const originalHeight = sourceImage.height;
        
        originalCanvas.width = originalWidth;
        originalCanvas.height = originalHeight;
        originalCtx.drawImage(sourceImage, 0, 0);

        // Get original image data
        const originalImageData = originalCtx.getImageData(0, 0, originalWidth, originalHeight);
        const originalData = originalImageData.data;

        console.log("Original image data loaded");

        // Create canvas for resized image
        const resizedCanvas = document.createElement("canvas");
        const resizedCtx = resizedCanvas.getContext("2d");
        
        resizedCanvas.width = desiredWidth;
        resizedCanvas.height = desiredHeight;

        // Create new image data for resized image
        const resizedImageData = resizedCtx.createImageData(desiredWidth, desiredHeight);
        const resizedData = resizedImageData.data;

        // Calculate scaling factors
        const scaleX = originalWidth / desiredWidth;
        const scaleY = originalHeight / desiredHeight;

        console.log("Starting bicubic interpolation...");

        // Use the simpler, more reliable bicubic implementation
        for (let y = 0; y < desiredHeight; y++) {
          for (let x = 0; x < desiredWidth; x++) {
            // Calculate position in original image
            const srcX = x * scaleX;
            const srcY = y * scaleY;

            const x0 = Math.floor(srcX);
            const y0 = Math.floor(srcY);
            
            const fracX = srcX - x0;
            const fracY = srcY - y0;

            const resizedIndex = (y * desiredWidth + x) * 4;

            // For each color channel (R, G, B, A)
            for (let channel = 0; channel < 4; channel++) {
              const interpolatedValue = bicubicInterpolateChannel(
                originalData, 
                originalWidth, 
                originalHeight, 
                x0, 
                y0, 
                fracX, 
                fracY, 
                channel
              );
              
              resizedData[resizedIndex + channel] = Math.max(0, Math.min(255, interpolatedValue));
            }
          }
        }

        console.log("Bicubic interpolation completed");

        // Put the resized image data onto canvas
        resizedCtx.putImageData(resizedImageData, 0, 0);

        // Convert to blob
        resizedCanvas.toBlob(
          (resultBlob) => {
            if (resultBlob) {
              console.log("Successfully created resized image blob");
              resolve(resultBlob);
            } else {
              console.error("BicubicResizer: Failed to create output Blob.");
              reject(new Error("Output Blob creation error."));
            }
          },
          "image/png",
          0.98
        );

      } catch (error) {
        console.error("BicubicResizer: Error during bicubic resizing:", error);
        reject(error);
      }
    };

    sourceImage.onerror = (evt) => {
      console.error("BicubicResizer: Image loading error:", evt);
      reject(new Error("Source image failed to load."));
    };

    sourceImage.src = URL.createObjectURL(sourceFile);
  });
}

// Main bicubic interpolation function for a single channel
function bicubicInterpolateChannel(data, width, height, x0, y0, fracX, fracY, channel) {
  let result = 0;
  let totalWeight = 0;

  // Sample 4x4 neighborhood around the point
  for (let j = -1; j <= 2; j++) {
    const y = y0 + j;
    
    for (let i = -1; i <= 2; i++) {
      const x = x0 + i;
      
      // Calculate weight using bicubic kernel
      const weight = bicubicWeight(i - fracX) * bicubicWeight(j - fracY);
      
      if (weight !== 0) {
        // Handle boundary conditions by clamping coordinates
        const clampedX = Math.max(0, Math.min(width - 1, x));
        const clampedY = Math.max(0, Math.min(height - 1, y));
        
        const pixelIndex = (clampedY * width + clampedX) * 4 + channel;
        const pixelValue = data[pixelIndex];
        
        result += pixelValue * weight;
        totalWeight += weight;
      }
    }
  }

  // Normalize by total weight and round to integer
  if (totalWeight === 0) return 0;
  return Math.round(result / totalWeight);
}

// Bicubic weight function (Catmull-Rom)
function bicubicWeight(t) {
  const absT = Math.abs(t);
  
  if (absT <= 1) {
    return 1 - 2 * absT * absT + absT * absT * absT;
  } else if (absT <= 2) {
    return 4 - 8 * absT + 5 * absT * absT - absT * absT * absT;
  }
  return 0;
}

