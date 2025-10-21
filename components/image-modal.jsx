/**
 * @file components/image-modal.jsx
 * @author Sameer
 * @description Modal component for displaying and interacting with images (zoom, pan, switch views).
 * @lastUpdated 2025-10-07
 */
"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize2, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

/**
 * @overview ImageModal component provides a full-screen, interactive modal for viewing images.
 * It includes functionalities like zooming, panning, resetting zoom, fitting to screen,
 * and switching between original and resized images if both are provided.
 * Keyboard shortcuts are also supported for various actions.
 * 
 * @param {object} props - The properties for the ImageModal component.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {object} props.image - The primary image object to display.
 * @param {string} props.image.src - The source URL of the image.
 * @param {string} props.image.title - The title of the image.
 * @param {string} [props.image.dimensions] - Optional dimensions string for the image.
 * @param {string} [props.originalImage] - Optional source URL for the original image, if different from `image.src`.
 * @param {string} [props.resizedImage] - Optional source URL for the resized image.
 * @param {object} [props.originalDimensions] - Optional object containing original image width and height.
 * @param {number} props.originalDimensions.width - Original image width.
 * @param {number} props.originalDimensions.height - Original image height.
 * @param {object} [props.resizeParams] - Optional object containing resize parameters.
 * @param {number} props.resizeParams.width - Resized image width.
 * @param {number} props.resizeParams.height - Resized image height.
 * 
 * @returns {JSX.Element | null} A div element representing the modal if `isOpen` and `image` are true, otherwise null.
 */
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
  const [currentView, setCurrentView] = useState("current") // Can be "current", "original", or "resized"

  // Effect to reset zoom and position when the modal opens or the primary image changes.
  useEffect(() => {
    if (isOpen) {
      setZoom(1)
      setPosition({ x: 0, y: 0 })
      setCurrentView("current") // Reset view to current image on open
    }
  }, [isOpen, image])

  // Effect for handling keyboard shortcuts for modal interactions.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          onClose() // Close modal on Escape key
          break
        case "=":
        case "+":
          e.preventDefault()
          handleZoomIn() // Zoom in on + or = key
          break
        case "-":
          e.preventDefault()
          handleZoomOut() // Zoom out on - key
          break
        case "0":
          e.preventDefault()
          handleResetZoom() // Reset zoom on 0 key
          break
        case "f":
          e.preventDefault()
          handleFitToScreen() // Fit to screen on F key
          break
        case "ArrowLeft":
          // Switch to previous view if both original and resized images exist
          if (originalImage && resizedImage) {
            e.preventDefault()
            switchView("prev")
          }
          break
        case "ArrowRight":
          // Switch to next view if both original and resized images exist
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

  /**
   * @overview Determines which image to display in the modal based on the `currentView` state.
   * If `currentView` is "original" or "resized", it returns the corresponding image data.
   * Otherwise, it returns the `image` prop (the initially selected image).
   * 
   * @returns {object} An object containing the `src`, `title`, and `dimensions` of the image to display.
   */
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
        return image // Fallback to the initial image prop
    }
  }

  /**
   * @overview Switches the currently displayed image between "original" and "resized" views.
   * This function is only active if both `originalImage` and `resizedImage` are available.
   * 
   * @param {('prev' | 'next')} direction - The direction to switch the view ('prev' for previous, 'next' for next).
   * @returns {void}
   */
  const switchView = useCallback((direction) => {
    if (!originalImage || !resizedImage) return // Only switch if both images are present

    const views = ["original", "resized"]
    const currentIndex = views.indexOf(currentView)

    if (direction === "next") {
      setCurrentView(views[(currentIndex + 1) % views.length])
    } else {
      setCurrentView(views[(currentIndex - 1 + views.length) % views.length])
    }
  }, [currentView, originalImage, resizedImage])

  /**
   * @overview Increases the zoom level of the image by a factor of 1.5, up to a maximum of 10x.
   * 
   * @returns {void}
   */
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev * 1.5, 10))
  }, [])

  /**
   * @overview Decreases the zoom level of the image by a factor of 1.5, down to a minimum of 0.1x.
   * 
   * @returns {void}
   */
  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev / 1.5, 0.1))
  }, [])

  /**
   * @overview Resets the image zoom level to 1x (100%) and its position to the center.
   * 
   * @returns {void}
   */
  const handleResetZoom = useCallback(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  /**
   * @overview Adjusts the image zoom level to fit it within the modal container with a slight padding (0.9x).
   * Also resets the image position to the center.
   * 
   * @returns {void}
   */
  const handleFitToScreen = useCallback(() => {
    setZoom(0.9) // Slightly less than 1 to give some padding
    setPosition({ x: 0, y: 0 })
  }, [])

  /**
   * @overview Handles the `mousedown` event for image panning. If the image is zoomed in (zoom > 1),
   * it enables dragging and records the starting position for calculating movement.
   * 
   * @param {React.MouseEvent<HTMLDivElement>} e - The mouse event object.
   * @returns {void}
   */
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

  /**
   * @overview Handles the `mousemove` event for image panning. If dragging is active and the image is zoomed in,
   * it updates the image's position based on mouse movement.
   * 
   * @param {React.MouseEvent<HTMLDivElement>} e - The mouse event object.
   * @returns {void}
   */
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

  /**
   * @overview Handles the `mouseup` event, ending the image dragging state.
   * 
   * @returns {void}
   */
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  /**
   * @overview Handles the `wheel` (mouse scroll) event for zooming in and out. It prevents default scroll behavior
   * and adjusts the zoom level based on the scroll direction.
   * 
   * @param {React.WheelEvent<HTMLDivElement>} e - The wheel event object.
   * @returns {void}
   */
  const handleWheel = useCallback((e) => {
    e.preventDefault()
    // Determine zoom direction based on scroll delta
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prev) => Math.max(0.1, Math.min(10, prev * delta))) // Clamp zoom between 0.1 and 10
  }, [])

  // Do not render the modal if it's not open or no image is provided
  if (!isOpen || !image) return null

  const currentImage = getCurrentImage()

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Modal Header containing image title, dimensions, and close button */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            {/* Display current image title */}
            <h2 className="text-white text-lg font-medium">{currentImage?.title}</h2>
            {/* Display current image dimensions if available */}
            {currentImage?.dimensions && <span className="text-white/70 text-sm">{currentImage.dimensions}</span>}
          </div>

          {/* Navigation buttons to switch between original/resized images (if both exist) */}
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

          {/* Close button for the modal */}
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Zoom and Control Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="bg-black/50 backdrop-blur-sm border-white/20">
          <CardContent className="p-2">
            <div className="flex items-center space-x-2">
              {/* Zoom Out button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="text-white hover:bg-white/20"
                disabled={zoom <= 0.1}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              {/* Current zoom level display */}
              <span className="text-white text-sm min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>

              {/* Zoom In button */}
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

              {/* Reset Zoom button */}
              <Button variant="ghost" size="sm" onClick={handleResetZoom} className="text-white hover:bg-white/20">
                <RotateCcw className="h-4 w-4" />
              </Button>

              {/* Fit to Screen button */}
              <Button variant="ghost" size="sm" onClick={handleFitToScreen} className="text-white hover:bg-white/20">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Image Display Area with Panning and Zooming */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Stop dragging if mouse leaves the container
        onWheel={handleWheel}
        style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
      >
        {currentImage && (
          <img
            src={currentImage.src || "/placeholder.svg"}
            alt={currentImage.title}
            className="max-w-none transition-transform duration-200 select-none"
            style={{
              // Apply zoom and pan transformations
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              transformOrigin: "center center", // Ensure zoom and pan are relative to the center
            }}
            draggable={false} // Prevent default image drag behavior
          />
        )}
      </div>

      {/* View Switcher (Original/Resized) - visible only if both images are available */}
      {originalImage && resizedImage && (
        <div className="absolute top-20 right-4 z-10">
          <Card className="bg-black/50 backdrop-blur-sm border-white/20">
            <CardContent className="p-2">
              <div className="flex flex-col space-y-1">
                {/* Button to switch to Original view */}
                <Button
                  variant={currentView === "original" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("original")}
                  className={currentView === "original" ? "bg-blue-600 text-white" : "text-white hover:bg-white/20"}
                >
                  Original
                </Button>
                {/* Button to switch to Resized view */}
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

      {/* Help Text for interaction cues */}
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
