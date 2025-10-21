/**
 * @file lib/image-actions/handleImageDownload.js
 * @author Sameer
 * @description Provides functionality for downloading resized images.
 * @lastUpdated 2025-10-14
 */
export const handleImageDownload = (resizedImage, resizeParams) => {
  if (!resizedImage) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `resized-${resizeParams.width}x${resizeParams.height}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        }
      },
      "image/png",
      0.95,
    );
  };

  img.src = resizedImage;
};
