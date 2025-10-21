/**
 * @file components/image-processor.jsx
 * @author Anshi
 * @description Provides static methods for image processing, including various resizing algorithms.
 * @lastUpdated 2025-10-07
 */
"use client"

import React from "react";
import { applyNearestNeighborResize } from "../lib/image-resizers/NearestNeighborResizer";
import { resizeImageBilinear } from "../lib/image-resizers/BilinearResizer";
import { performBicubicResize } from "../lib/image-resizers/BicubicResizer";

/**
 * @overview ImageProcessor is a utility class that provides static methods for image manipulation,
 * primarily focusing on resizing images using different interpolation algorithms.
 * It abstracts the details of various resizing techniques, offering a unified interface.
 */
export class ImageProcessor {
  /**
   * @overview Resizes a given image file to the target dimensions using the specified interpolation method.
   * It delegates the actual resizing operation to specific resizer functions based on the chosen method.
   * 
   * @param {File} imageFile - The image file to be resized (e.g., from an input element).
   * @param {number} width - The target width for the resized image.
   * @param {number} height - The target height for the resized image.
   * @param {('nearest' | 'bilinear' | 'bicubic')} method - The interpolation method to use for resizing.
   * Valid options are 'nearest', 'bilinear', and 'bicubic'.
   * 
   * @returns {Promise<Blob>} A promise that resolves with a Blob containing the resized image in PNG format.
   * @throws {Error} If an unknown resize method is provided.
   */
  static async resizeImage(
    imageFile,
    width,
    height,
    method,
  ) {
    // Select the appropriate resizing function based on the provided method
    switch (method) {
      case "nearest":
        return applyNearestNeighborResize(imageFile, width, height);
      case "bilinear":
        return resizeImageBilinear(imageFile, width, height);
      case "bicubic":
        return performBicubicResize(imageFile, width, height);
      default:
        // Throw an error if an unsupported method is specified
        throw new Error("Unknown resize method: " + method);
    }
  }

  /**
   * @overview Retrieves the intrinsic dimensions (width and height) of an image file.
   * This is done by loading the image into an `Image` object and reading its `width` and `height` properties.
   * 
   * @param {File} file - The image file from which to extract dimensions.
   * 
   * @returns {Promise<{width: number, height: number}>} A promise that resolves with an object
   * containing the width and height of the image. Rejects if the image fails to load.
   */
  static getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      // Set crossOrigin to anonymous to prevent CORS issues when drawing images to canvas
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Resolve with the image dimensions once loaded
        resolve({ width: img.width, height: img.height })
        // Revoke the object URL to free up memory
        URL.revokeObjectURL(img.src)
      }
      // Reject the promise if the image fails to load
      img.onerror = reject
      // Set the image source to a Blob URL created from the file
      img.src = URL.createObjectURL(file)
    })
  }
}
