"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize2, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function ImageModal({
  isOpen,
  onClose,
  image,
  originalImage,
  resizedImage,
  originalDimensions,
  resizeParams,
}) {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [currentView, setCurrentView] = useState("current")

  // Reset zoom and position when modal opens or image changes
  useEffect(() => {
    if (isOpen) {
      setZoom(1)
      setPosition({ x: 0, y: 0 })
      setCurrentView("current")
    }
  }, [isOpen, image])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "=":
        case "+":
          e.preventDefault()
          handleZoomIn()
          break
        case "-":
          e.preventDefault()
          handleZoomOut()
          break
        case "0":
          e.preventDefault()
          handleResetZoom()
          break
        case "f":
          e.preventDefault()
          handleFitToScreen()
          break
        case "ArrowLeft":
          if (originalImage && resizedImage) {
            e.preventDefault()
            switchView("prev")
          }
          break
        case "ArrowRight":
          if (originalImage && resizedImage) {
            e.preventDefault()
            switchView("next")
          }
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, originalImage, resizedImage, currentView])

  const getCurrentImage = () => {
    switch (currentView) {
      case "original":
        return {
          src: originalImage,
          title: "Original Image",
          dimensions: originalDimensions
            ? `${originalDimensions.width} × ${originalDimensions.height} pixels`
            : undefined,
        }
      case "resized":
        return {
          src: resizedImage,
          title: "Resized Image",
          dimensions: `${resizeParams.width} × ${resizeParams.height} pixels`,
        }
      default:
        return image
    }
  }

  const switchView = (direction) => {
    if (!originalImage || !resizedImage) return

    const views = ["original", "resized"]
    const currentIndex = views.indexOf(currentView)

    if (direction === "next") {
      setCurrentView(views[(currentIndex + 1) % views.length])
    } else {
      setCurrentView(views[(currentIndex - 1 + views.length) % views.length])
    }
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.5, 10))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.5, 0.1))
  }

  const handleResetZoom = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleFitToScreen = () => {
    setZoom(0.9)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = useCallback(
    (e) => {
      if (zoom > 1) {
        setIsDragging(true)
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        })
      }
    },
    [zoom, position],
  )

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging && zoom > 1) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [isDragging, dragStart, zoom],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prev) => Math.max(0.1, Math.min(10, prev * delta)))
  }, [])

  if (!isOpen || !image) return null

  const currentImage = getCurrentImage()

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-white text-lg font-medium">{currentImage?.title}</h2>
            {currentImage?.dimensions && <span className="text-white/70 text-sm">{currentImage.dimensions}</span>}
          </div>

          {/* Navigation buttons */}
          {originalImage && resizedImage && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => switchView("prev")}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => switchView("next")}
                className="text-white hover:bg-white/20"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="bg-black/50 backdrop-blur-sm border-white/20">
          <CardContent className="p-2">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="text-white hover:bg-white/20"
                disabled={zoom <= 0.1}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <span className="text-white text-sm min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="text-white hover:bg-white/20"
                disabled={zoom >= 10}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-white/20 mx-1" />

              <Button variant="ghost" size="sm" onClick={handleResetZoom} className="text-white hover:bg-white/20">
                <RotateCcw className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={handleFitToScreen} className="text-white hover:bg-white/20">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Container */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
      >
        {currentImage && (
          <img
            src={currentImage.src || "/placeholder.svg"}
            alt={currentImage.title}
            className="max-w-none transition-transform duration-200 select-none"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              transformOrigin: "center center",
            }}
            draggable={false}
          />
        )}
      </div>

      {/* View Switcher */}
      {originalImage && resizedImage && (
        <div className="absolute top-20 right-4 z-10">
          <Card className="bg-black/50 backdrop-blur-sm border-white/20">
            <CardContent className="p-2">
              <div className="flex flex-col space-y-1">
                <Button
                  variant={currentView === "original" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("original")}
                  className={currentView === "original" ? "bg-blue-600 text-white" : "text-white hover:bg-white/20"}
                >
                  Original
                </Button>
                <Button
                  variant={currentView === "resized" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("resized")}
                  className={currentView === "resized" ? "bg-blue-600 text-white" : "text-white hover:bg-white/20"}
                >
                  Resized
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Help Text */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="bg-black/50 backdrop-blur-sm border-white/20">
          <CardContent className="p-3">
            <div className="text-white/70 text-xs space-y-1">
              <div>{"Scroll: Zoom • Drag: Pan"}</div>
              <div>{"+ / - : Zoom • 0: Reset • F: Fit"}</div>
              <div>{"← / →: Switch views • ESC: Close"}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
