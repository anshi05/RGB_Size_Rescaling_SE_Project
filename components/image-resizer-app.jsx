"use client"

import React from "react";

import { useState, useCallback } from "react"
import { Upload, Download, Loader2, ZoomIn, ArrowLeft, Sparkles, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const [modalOpen, setModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState(null)

  const { handleFile, handleFileInput, handleDrag, handleDrop } = useImageUploader(
    setOriginalImage,
    setResizedImage,
    setSelectedFile,
    setOriginalDimensions,
  );

  const handleResize = async () => {
    if (!selectedFile) return;

    setIsProcessing(true)

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
      setIsProcessing(false)
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
      <nav className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={onBack} variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
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
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full border border-rose-200 text-rose-700 text-sm mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Professional Image Resizing
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-rose-900 to-pink-900 bg-clip-text text-transparent mb-4">
            RGB Image Rescaler
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Resize your images with precision using advanced interpolation methods. Choose the perfect algorithm for
            your needs.
          </p>
        </header>

        {/* Upload Section */}
        <Card className="mb-12 overflow-hidden shadow-2xl border-0 bg-white/70 backdrop-blur-sm">
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
              <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Upload className="h-10 w-10 text-white" />
              </div>
              <p className="text-2xl font-semibold text-gray-900 mb-3">Drop your image here, or click to browse</p>
              <p className="text-gray-500 mb-6 text-lg">Supports JPG, JPEG, and PNG files up to 10MB</p>
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
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-rose-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controls Section */}
        {originalImage && (
          <Card className="mb-12 overflow-hidden shadow-xl border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                Resize Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <Label htmlFor="method" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Resize Method
                  </Label>
                  <Select
                    value={resizeParams.method}
                    onValueChange={(value) => setResizeParams((prev) => ({ ...prev, method: value }))}
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-rose-400 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nearest">Nearest Neighbor</SelectItem>
                      <SelectItem value="bilinear">Bilinear</SelectItem>
                      <SelectItem value="bicubic">Bicubic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="width" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Target Width
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    min="1"
                    max="4096"
                    value={resizeParams.width}
                    onChange={(e) =>
                      setResizeParams((prev) => ({
                        ...prev,
                        width: Number.parseInt(e.target.value) || 256,
                      }))
                    }
                    className="h-12 border-2 border-gray-200 focus:border-rose-400 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="height" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Target Height
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    min="1"
                    max="4096"
                    value={resizeParams.height}
                    onChange={(e) =>
                      setResizeParams((prev) => ({
                        ...prev,
                        height: Number.parseInt(e.target.value) || 256,
                      }))
                    }
                    className="h-12 border-2 border-gray-200 focus:border-rose-400 rounded-xl"
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handleResize}
                    disabled={isProcessing}
                    size="lg"
                    className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 font-semibold shadow-lg hover:shadow-rose-500/25 transition-all duration-300 transform hover:scale-105 rounded-xl"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Resize Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Section */}
        {originalImage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Original Image */}
            <Card className="overflow-hidden shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4">
                  <h3 className="font-semibold text-white text-lg">Original Image</h3>
                  {originalDimensions && (
                    <p className="text-violet-100 text-sm">
                      {originalDimensions.width} × {originalDimensions.height} pixels
                    </p>
                  )}
                </div>
                <div className="p-6">
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden group">
                    <img
                      src={originalImage || "/placeholder.svg"}
                      alt="Original"
                      className="w-full h-auto max-h-96 object-contain mx-auto"
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
                      className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                      title="View fullscreen"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resized Image */}
            <Card className="overflow-hidden shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      Resized Image {resizedImage && `(${resizeParams.width}×${resizeParams.height})`}
                    </h3>
                  </div>
                  {resizedImage && (
                    <Button
                      onClick={downloadResizedImage}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
                <div className="p-6">
                  {resizedImage ? (
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden animate-in fade-in duration-500 group">
                      <img
                        src={resizedImage || "/placeholder.svg"}
                        alt="Resized"
                        className="w-full h-auto max-h-96 object-contain mx-auto"
                      />
                      <button
                        onClick={() =>
                          openImageModal(
                            resizedImage,
                            "Resized Image",
                            `${resizeParams.width} × ${resizeParams.height} pixels`,
                          )
                        }
                        className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                        title="View fullscreen"
                      >
                        <ZoomIn className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-96 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-200 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <ImageIcon className="h-8 w-8 text-purple-500" />
                        </div>
                        <p className="text-gray-500 font-medium">Resized image will appear here</p>
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
