/**
 * @file lib/image-actions/handleFileUpload.js
 * @author Harsh
 * @description Custom hook for handling image file uploads, including drag-and-drop and file input.
 * @lastUpdated 2025-10-14
 */
import { useCallback } from "react";
import { ImageProcessor } from "@/components/image-processor";

/**
 * @overview A custom React hook for managing image file uploads, supporting both file input and drag-and-drop interactions.
 * It handles file validation, extracts image dimensions, sets the original image for preview,
 * and resets the resized image state upon a new upload.
 * 
 * @param {Function} setOriginalImage - State setter function for the original image's data URL.
 * @param {Function} setResizedImage - State setter function for the resized image's data URL.
 * @param {Function} setSelectedFile - State setter function for the currently selected File object.
 * @param {Function} setOriginalDimensions - State setter function for the original image's dimensions ({ width, height }).
 * @param {Function} setAspectRatio - State setter function for the original image's aspect ratio.
 * @param {Function} setIsResized - State setter function to indicate if an image has been resized.
 * 
 * @returns {{handleFile: Function, handleFileInput: Function, handleDrag: Function, handleDrop: Function}} An object containing callback functions for file handling.
 */
export const useImageUploader = (setOriginalImage, setResizedImage, setSelectedFile, setOriginalDimensions, setAspectRatio, setIsResized) => {
  /**
   * @overview Processes a single image file after selection or drop.
   * It validates the file type, updates relevant states (selected file, dimensions, aspect ratio, original image data),
   * and resets the resized image state to ensure a fresh processing cycle.
   * 
   * @param {File} file - The image file to be processed.
   * 
   * @returns {Promise<void>} A promise that resolves after the file is processed and states are updated.
   */
  const handleFile = async (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    // Validate file type to ensure it's a supported image format
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (.jpg, .jpeg, .png)");
      return;
    }

    setSelectedFile(file); // Store the selected file object
    // Reset the resized state, as a new original image means no resized image yet
    if (setIsResized) {
      setIsResized(false);
    }

    try {
      // Get original image dimensions and calculate aspect ratio
      const dimensions = await ImageProcessor.getImageDimensions(file);
      setOriginalDimensions(dimensions);
      setAspectRatio(dimensions.width / dimensions.height)
    } catch (error) {
      console.error("Error getting image dimensions:", error);
    }

    const reader = new FileReader();
    // When the file is loaded, set it as the original image for preview and clear any previous resized image
    reader.onload = (e) => {
      setOriginalImage(e.target?.result);
      setResizedImage(null);
    };
    reader.readAsDataURL(file); // Read the file as a data URL for display
  };

  /**
   * @overview Handles the change event from a file input element.
   * It extracts the selected file and passes it to the `handleFile` function for processing.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event object from the file input.
   * 
   * @returns {void}
   */
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]); // Process the first selected file
    }
  };

  /**
   * @overview Generic handler for drag events (`dragenter`, `dragleave`, `dragover`).
   * It prevents default browser behavior for drag events to allow custom drop handling.
   * The `dragActive` state is typically managed by the component using this hook for UI feedback.
   * 
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event object.
   * 
   * @returns {void}
   */
  const handleDrag = useCallback((e) => {
    e.preventDefault(); // Prevent default drag behavior
    e.stopPropagation(); // Stop event propagation
    // The `dragActive` state is intentionally not set here; it's expected to be managed
    // by the component using this hook to provide visual feedback during drag operations.
  }, []);

  /**
   * @overview Handles the `drop` event when a file is dropped onto the designated area.
   * It prevents default browser behavior, extracts the dropped file, and passes it to the `handleFile` function.
   * 
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event object.
   * 
   * @returns {void}
   */
  const handleDrop = useCallback((e) => {
    e.preventDefault(); // Prevent default drop behavior
    e.stopPropagation(); // Stop event propagation
    // The `dragActive` state is intentionally not reset here; it's expected to be managed
    // by the component using this hook after the drop operation.

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]); // Process the first dropped file
    }
  }, [handleFile]); // `handleFile` is a dependency as it's called within this function

  return { handleFile, handleFileInput, handleDrag, handleDrop };
};
