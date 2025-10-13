import { useCallback } from "react";
import { ImageProcessor } from "@/components/image-processor";

export const useImageUploader = (setOriginalImage, setResizedImage, setSelectedFile, setOriginalDimensions, setAspectRatio) => {
  const handleFile = async (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (.jpg, .jpeg, .png)");
      return;
    }

    setSelectedFile(file);

    try {
      const dimensions = await ImageProcessor.getImageDimensions(file);
      setOriginalDimensions(dimensions);
      setAspectRatio(dimensions.width / dimensions.height)
    } catch (error) {
      console.error("Error getting image dimensions:", error);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result);
      setResizedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      // setDragActive(true); // Drag active state will be managed by the component using this hook
    } else if (e.type === "dragleave") {
      // setDragActive(false); // Drag active state will be managed by the component using this hook
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // setDragActive(false); // Drag active state will be managed by the component using this hook

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  return { handleFile, handleFileInput, handleDrag, handleDrop };
};
