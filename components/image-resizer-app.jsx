/**
 * @file components/image-resizer-app.jsx
 * @author Anshi, Sameer, Harsh
 * @description Main application component for the RGB Image Rescaler, handling image upload, resizing, and display.
 * @lastUpdated 2025-10-01
 */
'use client'

import React from "react";

import { useState, useCallback, useRef } from "react"
import { Upload, Download, Loader2, ZoomIn, ArrowLeft, Sparkles, ImageIcon, Settings, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ImageProcessor } from "@/components/image-processor"
import { ImageModal } from "@/components/image-modal"
import { useImageUploader } from "../lib/image-actions/handleFileUpload";
import { handleImageDownload } from "../lib/image-actions/handleImageDownload";

export function ImageResizerApp({ onBack }) {
  const [originalImage, setOriginalImage] = useState(null)
  const [resizedImage, setResizedImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [resizeParams, setResizeParams] = useState({
    method: "bilinear",
    width: 256,
    height: 256,
  })
  const [originalDimensions, setOriginalDimensions] = useState(null)
  const [aspectRatio, setAspectRatio] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState(null)
  const [lockAspectRatio, setLockAspectRatio] = useState(false)
  const [widthError, setWidthError] = useState("")
  const [heightError, setHeightError] = useState("")
  const resizedImageRef = useRef(null)
  const [isResized, setIsResized] = useState(false)

  const { handleFile, handleFileInput, handleDrag, handleDrop } = useImageUploader(
    setOriginalImage,
    setResizedImage,
    setSelectedFile,
    setOriginalDimensions,
    setAspectRatio,
    // Reset isResized when a new file is uploaded
    setIsResized,
  );

  const handleResize = async () => {
    if (!selectedFile) return;

    setIsProcessing(true)
    // Reset isResized when starting a new resize operation
    setIsResized(false)

    try {
      const resizedBlob = await ImageProcessor.resizeImage(
        selectedFile,
        resizeParams.width,
        resizeParams.height,
        resizeParams.method,
      )

      const resizedImageUrl = URL.createObjectURL(resizedBlob)
      setResizedImage(resizedImageUrl)
    } catch (error) {
      console.error("Error resizing image:", error)
      alert("Failed to resize image. Please try again.")
    } finally {
      setTimeout(() => {
        setIsProcessing(false)
        setIsResized(true)
        // Scroll to resized image section
        if (resizedImageRef.current) {
          resizedImageRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 500) // Keep processing for at least 5 seconds
    }
    
  }

  const downloadResizedImage = () => {
    handleImageDownload(resizedImage, resizeParams);
  };

  const openImageModal = (src, title, dimensions) => {
    setModalImage({ src, title, dimensions })
    setModalOpen(true)
  }

  const closeImageModal = () => {
    setModalOpen(false)
    setModalImage(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={onBack} 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-gradient-to-b from-gray-300 to-transparent" />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  PixelPerfect
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full border border-rose-200/80 text-rose-700 text-sm mb-8 shadow-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Professional Image Resizing
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-rose-900 to-pink-900 bg-clip-text text-transparent mb-6 leading-tight">
            RGB Image Rescaler
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Resize your images with precision using advanced interpolation methods. Choose the perfect algorithm for your needs.
          </p>
        </header>

        {/* Upload Section */}
        <Card className="mb-12 overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? "border-rose-400 bg-gradient-to-br from-rose-50 to-pink-50 scale-105"
                  : "border-gray-300 hover:border-rose-300 hover:bg-gradient-to-br hover:from-rose-50/50 hover:to-pink-50/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-rose-500/30 transform transition-all duration-500 group-hover:scale-110">
                <Upload className="h-12 w-12 text-white transform group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-3xl font-semibold text-gray-900 mb-4">Drop your image here</p>
              <p className="text-gray-500 mb-8 text-lg max-w-md mx-auto">Supports JPG, JPEG, and PNG files up to 10MB</p>
              {selectedFile && (
                <p className="text-lg text-gray-700 mb-4">Selected File: <span className="font-semibold">{selectedFile.name}</span></p>
              )}
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <Button
                onClick={() => document.getElementById("file-input")?.click()}
                size="lg"
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl hover:shadow-rose-500/30 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Controls Section */}
        {originalImage && (
          <Card className="mb-12 overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm transition-all duration-500">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex items-center mb-8 pb-6 border-b border-gray-200/60">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Resize Settings</h3>
                  <p className="text-gray-600">Adjust parameters for optimal results</p>
                </div>
              </div>

              {/* Controls Grid */}
              <div className="space-y-8">
                {/* First Row - Method and Lock */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Method Selection */}
                  <div className="space-y-4">
                    <Label htmlFor="method" className="text-base font-semibold text-gray-800 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-violet-500" />
                      Resize Method
                    </Label>
                    <Select
                      value={resizeParams.method}
                      onValueChange={(value) => setResizeParams((prev) => ({ ...prev, method: value }))}
                    >
                      <SelectTrigger className="h-14 border-2 border-gray-200/80 focus:border-violet-400 rounded-xl bg-white/50 backdrop-blur-sm text-base transition-all duration-300 hover:border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-0 shadow-2xl backdrop-blur-sm">
                        <SelectItem value="nearest" className="text-base py-3 hover:bg-violet-50 rounded-lg transition-colors">
                          Nearest Neighbor
                        </SelectItem>
                        <SelectItem value="bilinear" className="text-base py-3 hover:bg-violet-50 rounded-lg transition-colors">
                          Bilinear
                        </SelectItem>
                        <SelectItem value="bicubic" className="text-base py-3 hover:bg-violet-50 rounded-lg transition-colors">
                          Bicubic
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      {resizeParams.method === "nearest" && "Fastest, good for pixel art"}
                      {resizeParams.method === "bilinear" && "Balanced quality and speed"}
                      {resizeParams.method === "bicubic" && "Highest quality, smoother edges"}
                    </p>
                  </div>

                  {/* Aspect Ratio Toggle */}
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200/50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        lockAspectRatio 
                          ? "bg-green-500/10 border border-green-500/20" 
                          : "bg-gray-200/50 border border-gray-300/50"
                      }`}>
                        {lockAspectRatio ? (
                          <Lock className="w-5 h-5 text-green-600" />
                        ) : (
                          <Unlock className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lock-aspect-ratio" className="text-base font-semibold text-gray-800 block">
                          Lock Aspect Ratio
                        </Label>
                        <p className="text-sm text-gray-500">
                          {lockAspectRatio ? "Width and height are linked" : "Set dimensions independently"}
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="lock-aspect-ratio"
                      checked={lockAspectRatio}
                      onCheckedChange={(checked) => {
                        setLockAspectRatio(checked)
                        if (originalDimensions) {
                          setResizeParams((prev) => ({
                            ...prev,
                            width: originalDimensions.width,
                            height: originalDimensions.height,
                          }))
                        }
                      }}
                      className="data-[state=checked]:bg-green-500 h-6 w-11"
                    />
                  </div>
                </div>

                {/* Second Row - Dimensions */}
                <div className={`grid gap-8 ${lockAspectRatio ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-3"}`}>
                  {/* Width Input */}
                  <div className="space-y-4">
                    <Label htmlFor="width" className="text-base font-semibold text-gray-800 flex items-center">
                      <div className="w-2 h-2 bg-rose-500 rounded-full mr-2"></div>
                      Target Width
                    </Label>
                    <div className="relative">
                      <Input
                        id="width"
                        type="number"
                        min="1"
                        max="4096"
                        value={resizeParams.width}
                        onChange={(e) => {
                          const value = e.target.value;
                          const newWidth = Number.parseInt(value);
                          if (value === "") {
                            setWidthError("Width cannot be empty.");
                            setResizeParams((prev) => ({ ...prev, width: "" }));
                          } else if (isNaN(newWidth) || newWidth < 1) {
                            setWidthError("Please enter a valid width (min 1).");
                            setResizeParams((prev) => ({ ...prev, width: value }));
                          } else {
                            setWidthError("");
                            setResizeParams((prev) => ({
                              ...prev,
                              width: newWidth,
                              height: lockAspectRatio ? Math.round(newWidth / aspectRatio) : prev.height,
                            }))
                          }
                        }}
                        className={`h-14 border-2 rounded-xl text-base pl-12 transition-all duration-300 ${
                          widthError 
                            ? "border-red-400 bg-red-50/50 focus:border-red-500" 
                            : "border-gray-200/80 bg-white/50 focus:border-rose-400 hover:border-gray-300"
                        }`}
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                        W:
                      </div>
                    </div>
                    {widthError && (
                      <p className="text-red-500 text-sm flex items-center">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                        {widthError}
                      </p>
                    )}
                  </div>

                  {/* Height Input - Only show when not locked */}
                  {!lockAspectRatio && (
                    <div className="space-y-4">
                      <Label htmlFor="height" className="text-base font-semibold text-gray-800 flex items-center">
                        <div className="w-2 h-2 bg-violet-500 rounded-full mr-2"></div>
                        Target Height
                    </Label>
                      <div className="relative">
                        <Input
                          id="height"
                          type="number"
                          min="1"
                          max="4096"
                          value={resizeParams.height}
                          onChange={(e) => {
                            const value = e.target.value;
                            const newHeight = Number.parseInt(value);
                            if (value === "") {
                              setHeightError("Height cannot be empty.");
                              setResizeParams((prev) => ({ ...prev, height: "" }));
                            } else if (isNaN(newHeight) || newHeight < 1) {
                              setHeightError("Please enter a valid height (min 1).");
                              setResizeParams((prev) => ({ ...prev, height: value }));
                            } else {
                              setHeightError("");
                              setResizeParams((prev) => ({
                                ...prev,
                                height: newHeight,
                                width: lockAspectRatio ? Math.round(newHeight * aspectRatio) : prev.width,
                              }))
                            }
                          }}
                          className={`h-14 border-2 rounded-xl text-base pl-12 transition-all duration-300 ${
                            heightError 
                              ? "border-red-400 bg-red-50/50 focus:border-red-500" 
                              : "border-gray-200/80 bg-white/50 focus:border-violet-400 hover:border-gray-300"
                        }`}
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                        H:
                      </div>
                    </div>
                    {heightError && (
                      <p className="text-red-500 text-sm flex items-center">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                        {heightError}
                      </p>
                    )}
                  </div>
                  )}

                  {/* Resize Button */}
                  <div className={`flex items-end ${lockAspectRatio ? "lg:col-span-1" : "lg:col-span-1"}`}>
                    <Button
                      onClick={handleResize}
                      disabled={isProcessing || widthError !== "" || heightError !== "" || resizeParams.width === "" || resizeParams.height === ""}
                      size="lg"
                      className="w-full h-14 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-rose-500/30 transition-all duration-300 transform hover:scale-105 rounded-xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-xl group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          Processing...
                          
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-3 h-5 w-5" />
                          {isResized ? "Resize Image" : "Resize Image"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Original Dimensions Display */}
                {originalDimensions && (
                  <div className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50/50 rounded-2xl border border-blue-200/50">
                    <div className="text-center">
                      <p className="text-sm text-blue-600 font-medium mb-1">Original Dimensions</p>
                      <p className="text-lg font-bold text-blue-800">
                        {originalDimensions.width} × {originalDimensions.height} pixels
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Section */}
        {originalImage && (
          <div ref={resizedImageRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Original Image */}
            <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg">Original Image</h3>
                      {originalDimensions && (
                        <p className="text-violet-100 text-sm">
                          {originalDimensions.width} × {originalDimensions.height} pixels
                        </p>
                      )}
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <ImageIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden group transition-all duration-500">
                    <img
                      src={originalImage || "/placeholder.svg"}
                      alt="Original"
                      className="w-full h-auto max-h-96 object-contain mx-auto transition-transform duration-500 group-hover:scale-105"
                    />
                    <button
                      onClick={() =>
                        openImageModal(
                          originalImage,
                          "Original Image",
                          originalDimensions
                            ? `${originalDimensions.width} × ${originalDimensions.height} pixels`
                            : undefined,
                        )
                      }
                      className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                      title="View fullscreen"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resized Image */}
            <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-lg">
                        Resized Image {resizedImage && `(${resizeParams.width}×${resizeParams.height})`}
                      </h3>
                      <p className="text-rose-100 text-sm">
                        {resizeParams.method} interpolation
                      </p>
                    </div>
                    {resizedImage && (
                      <Button
                        onClick={downloadResizedImage}
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {resizedImage ? (
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden animate-in fade-in duration-500 group transition-all duration-500">
                      <img
                        src={resizedImage || "/placeholder.svg"}
                        alt="Resized"
                        className="w-full h-auto max-h-96 object-contain mx-auto transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        onClick={() =>
                          openImageModal(
                            resizedImage,
                            "Resized Image",
                            `${resizeParams.width} × ${resizeParams.height} pixels`,
                          )
                        }
                        className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
                        title="View fullscreen"
                      >
                        <ZoomIn className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl h-96 flex items-center justify-center transition-all duration-500">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                          <ImageIcon className="h-10 w-10 text-purple-500" />
                        </div>
                        <p className="text-gray-500 font-medium text-lg">Resized image will appear here</p>
                        <p className="text-gray-400 text-sm mt-2">Click "Resize Image" to process</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <ImageModal
          isOpen={modalOpen}
          onClose={closeImageModal}
          image={modalImage}
          originalImage={originalImage}
          resizedImage={resizedImage}
          originalDimensions={originalDimensions}
          resizeParams={resizeParams}
        />
      </div>
    </div>
  )
}
