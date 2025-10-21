/**
 * @file lib/image-actions/handleImageDownload.js
 * @author Sameer
 * @description Provides functionality for downloading resized images.
 * @lastUpdated 2025-10-14
 */

/**
 * @overview Handles the download of a resized image. It takes the data URL of the resized image
 * and its dimensions to create a downloadable PNG file with a descriptive filename.
 * 
 * @param {string | null} resizedImage - The data URL or Blob URL of the resized image to be downloaded.
 * @param {object} resizeParams - An object containing the parameters used for resizing.
 * @param {number} resizeParams.width - The width of the resized image.
 * @param {number} resizeParams.height - The height of the resized image.
 * 
 * @returns {void}
 */
export const handleImageDownload = (resizedImage, resizeParams) => {
  // If no resized image is provided, exit the function.
  if (!resizedImage) return;

  // Create a temporary canvas element to draw the image.
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  // Set the onload event handler for the image.
  img.onload = () => {
    // Set canvas dimensions to match the image.
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image onto the canvas.
    ctx?.drawImage(img, 0, 0);

    // Convert the canvas content to a PNG Blob.
    canvas.toBlob(
      (blob) => {
        if (blob) {
          // Create a temporary anchor element to trigger the download.
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob); // Set the URL for the blob
          // Set the download filename using the resized image dimensions.
          link.download = `resized-${resizeParams.width}x${resizeParams.height}.png`;
          document.body.appendChild(link); // Append link to body to make it clickable
          link.click(); // Programmatically click the link to start download
          document.body.removeChild(link); // Clean up the temporary link
          URL.revokeObjectURL(link.href); // Release the object URL
        }
      },
      "image/png", // Specify the output format as PNG
      0.95, // Set the image quality for PNG compression
    );
  };

  // Set the image source to trigger loading.
  img.src = resizedImage;
};
