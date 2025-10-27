/**
 * @file components/ui/resizable.tsx
 * @description This file contains the Resizable components, built using `react-resizable-panels`, providing a flexible and accessible way to create resizable panel layouts.
 * @lastUpdated 2025-10-25
 */
'use client'

import { GripVertical } from 'lucide-react'
import * as ResizablePrimitive from 'react-resizable-panels'

import { cn } from '@/lib/utils'

/**
 * @overview The ResizablePanelGroup component, built on `react-resizable-panels`'s PanelGroup.
 * It serves as a container for resizable panels and handles the overall layout and resizing logic.
 * 
 * @see https://github.com/bvaughn/react-resizable-panels
 * 
 * @param {object} props - The properties for the ResizablePanelGroup component.
 * @param {string} [props.className] - Optional CSS class names to apply to the panel group container.
 * @param {React.ComponentProps<typeof ResizablePrimitive.PanelGroup>} props - All other props supported by `react-resizable-panels`'s PanelGroup.
 * 
 * @returns {JSX.Element} The ResizablePanelGroup component.
 */
const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
      className,
    )}
    {...props}
  />
)

/**
 * @overview The ResizablePanel component, built on `react-resizable-panels`'s Panel.
 * Represents an individual panel within a `ResizablePanelGroup`, whose size can be adjusted.
 * 
 * @returns {JSX.Element} The ResizablePanel component.
 */
const ResizablePanel = ResizablePrimitive.Panel

/**
 * @overview The ResizableHandle component.
 * This component provides a draggable handle that allows users to resize adjacent `ResizablePanel` components.
 * It can optionally display a visual grip icon.
 * 
 * @param {object} props - The properties for the ResizableHandle component.
 * @param {boolean} [props.withHandle] - If true, a visual grip icon will be displayed in the handle.
 * @param {string} [props.className] - Optional CSS class names to apply to the handle.
 * @param {React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle>} props - All other props supported by `react-resizable-panels`'s PanelResizeHandle.
 * 
 * @returns {JSX.Element} The ResizableHandle component.
 */
const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90',
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
