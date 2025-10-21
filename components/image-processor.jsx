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

export class ImageProcessor {
  static async resizeImage(
    imageFile,
    width,
    height,
    method,
  ) {
    switch (method) {
      case "nearest":
        return applyNearestNeighborResize(imageFile, width, height);
      case "bilinear":
        return resizeImageBilinear(imageFile, width, height);
      case "bicubic":
        return performBicubicResize(imageFile, width, height);
      default:
        throw new Error("Unknown resize method: " + method);
    }
  }

  static getImageDimensions(file) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
        URL.revokeObjectURL(img.src)
      }
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }
}
