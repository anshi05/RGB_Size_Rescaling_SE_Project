/**
 * @file lib/image-resizers/BicubicResizer.js
 * @author Sameer
 * @description Provides functions for resizing images using the Bicubic interpolation algorithm.
 * @lastUpdated 2025-10-07
 */

/**
 * @overview Resizes a source image file to desired dimensions using the bicubic interpolation algorithm.
 * This method provides a smoother and higher quality resizing result compared to nearest-neighbor or bilinear
 * interpolation, especially for scaling up images, as it considers a 4x4 neighborhood of pixels.
 * 
 * @param {File} sourceFile - The input image file (Blob or File object) to be resized.
 * @param {number} desiredWidth - The target width for the output image in pixels.
 * @param {number} desiredHeight - The target height for the output image in pixels.
 * 
 * @returns {Promise<Blob>} A Promise that resolves with a Blob containing the resized image in PNG format.
 * @throws {Error} If the canvas rendering context cannot be obtained, or if image loading or blob creation fails.
 */
export function performBicubicResize(sourceFile, desiredWidth, desiredHeight) {
  return new Promise((resolve, reject) => {
    const sourceImage = new Image();
    // Ensure cross-origin images can be loaded without tainting the canvas
    sourceImage.crossOrigin = "anonymous";

    sourceImage.onload = () => {
      try {
        console.log(`Original dimensions: ${sourceImage.width}x${sourceImage.height}`);
        console.log(`Target dimensions: ${desiredWidth}x${desiredHeight}`);

        // Create an offscreen canvas to draw the original image
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

        // Get the pixel data from the original image
        const originalImageData = originalCtx.getImageData(0, 0, originalWidth, originalHeight);
        const originalData = originalImageData.data;

        console.log("Original image data loaded");

        // Create a new offscreen canvas for the resized image
        const resizedCanvas = document.createElement("canvas");
        const resizedCtx = resizedCanvas.getContext("2d");
        
        resizedCanvas.width = desiredWidth;
        resizedCanvas.height = desiredHeight;

        // Create an empty ImageData object for the resized image
        const resizedImageData = resizedCtx.createImageData(desiredWidth, desiredHeight);
        const resizedData = resizedImageData.data;

        // Calculate the scaling factors for X and Y dimensions
        const scaleX = originalWidth / desiredWidth;
        const scaleY = originalHeight / desiredHeight;

        console.log("Starting bicubic interpolation...");

        // Iterate over each pixel in the target (resized) image
        for (let y = 0; y < desiredHeight; y++) {
          for (let x = 0; x < desiredWidth; x++) {
            // Calculate the corresponding floating-point position in the original image
            const srcX = x * scaleX;
            const srcY = y * scaleY;

            // Get the integer part of the source coordinates (top-left pixel of the 4x4 neighborhood)
            const x0 = Math.floor(srcX);
            const y0 = Math.floor(srcY);
            
            // Get the fractional part of the source coordinates (for interpolation weights)
            const fracX = srcX - x0;
            const fracY = srcY - y0;

            // Calculate the index of the current pixel in the resized image's data array
            const resizedIndex = (y * desiredWidth + x) * 4;

            // For each color channel (R, G, B, A), perform bicubic interpolation
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
              
              // Clamp the interpolated value to the valid range [0, 255] and assign to the resized image data
              resizedData[resizedIndex + channel] = Math.max(0, Math.min(255, interpolatedValue));
            }
          }
        }

        console.log("Bicubic interpolation completed");

        // Put the processed pixel data onto the resized canvas
        resizedCtx.putImageData(resizedImageData, 0, 0);

        // Convert the resized canvas content to a PNG Blob
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
          "image/png", // Output format
          0.98 // Quality setting for PNG compression (0.98 for high quality)
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

    // Set the image source to a Blob URL created from the input file
    sourceImage.src = URL.createObjectURL(sourceFile);
  });
}

/**
 * @overview Performs bicubic interpolation for a single color channel at a given fractional coordinate.
 * It samples a 4x4 neighborhood of pixels around the target point and applies bicubic weights
 * to calculate the interpolated pixel value.
 * 
 * @param {Uint8ClampedArray} data - The pixel data array of the source image.
 * @param {number} width - The width of the source image.
 * @param {number} height - The height of the source image.
 * @param {number} x0 - The integer X-coordinate of the top-left pixel in the 4x4 neighborhood.
 * @param {number} y0 - The integer Y-coordinate of the top-left pixel in the 4x4 neighborhood.
 * @param {number} fracX - The fractional part of the X-coordinate, used for weight calculation.
 * @param {number} fracY - The fractional part of the Y-coordinate, used for weight calculation.
 * @param {number} channel - The color channel index (0 for R, 1 for G, 2 for B, 3 for A).
 * 
 * @returns {number} The interpolated pixel value for the specified channel, rounded to the nearest integer.
 */
function bicubicInterpolateChannel(data, width, height, x0, y0, fracX, fracY, channel) {
  let result = 0;
  let totalWeight = 0;

  // Iterate over a 4x4 neighborhood of pixels around the target point
  for (let j = -1; j <= 2; j++) {
    const y = y0 + j;
    
    for (let i = -1; i <= 2; i++) {
      const x = x0 + i;
      
      // Calculate the weight for the current pixel using the bicubic kernel in both X and Y directions
      const weight = bicubicWeight(i - fracX) * bicubicWeight(j - fracY);
      
      if (weight !== 0) {
        // Handle boundary conditions by clamping coordinates to ensure they are within image bounds
        const clampedX = Math.max(0, Math.min(width - 1, x));
        const clampedY = Math.max(0, Math.min(height - 1, y));
        
        // Calculate the index of the pixel in the source data array for the specified channel
        const pixelIndex = (clampedY * width + clampedX) * 4 + channel;
        const pixelValue = data[pixelIndex];
        
        // Accumulate weighted pixel values
        result += pixelValue * weight;
        totalWeight += weight;
      }
    }
  }

  // Normalize the result by the total accumulated weight and round to the nearest integer
  if (totalWeight === 0) return 0; // Avoid division by zero if all weights are zero
  return Math.round(result / totalWeight);
}

/**
 * @overview Implements the cubic convolution interpolation kernel, specifically the Catmull-Rom spline.
 * This function calculates the weighting factor for a given distance `t` from a pixel's center.
 * It is used in bicubic interpolation to determine the influence of surrounding pixels.
 * 
 * @param {number} t - The absolute distance from the center of a pixel (can be positive or negative).
 * 
 * @returns {number} The bicubic weighting factor for the given distance `t`.
 */
function bicubicWeight(t) {
  const absT = Math.abs(t);
  
  // Catmull-Rom spline kernel formula
  if (absT <= 1) {
    return 1 - 2 * absT * absT + absT * absT * absT;
  } else if (absT <= 2) {
    return 4 - 8 * absT + 5 * absT * absT - absT * absT * absT;
  }
  return 0; // Return 0 for distances outside the 2-pixel radius
}

