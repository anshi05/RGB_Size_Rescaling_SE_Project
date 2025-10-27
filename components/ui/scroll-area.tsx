/**
 * @file components/ui/scroll-area.tsx
 * @description This file contains the ScrollArea component and its sub-components, built using Radix UI's ScrollArea primitive, providing a customizable scrollable container.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

import { cn } from '@/lib/utils'

/**
 * @overview The root ScrollArea component, built on Radix UI's ScrollAreaPrimitive.Root.
 * It provides a customizable scrollable container with a native-like scrolling experience.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/scroll-area
 * 
 * @param {object} props - The properties for the ScrollArea component.
 * @param {string} [props.className] - Optional CSS class names to apply to the scroll area root.
 * @param {React.ReactNode} props.children - The content to be rendered inside the scrollable viewport.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The ScrollArea root component.
 */
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

/**
 * @overview The ScrollBar component, built on Radix UI's ScrollAreaPrimitive.ScrollAreaScrollbar.
 * This component provides a customizable scrollbar for the `ScrollArea`.
 * 
 * @param {object} props - The properties for the ScrollBar component.
 * @param {string} [props.className] - Optional CSS class names to apply to the scrollbar.
 * @param {('vertical' | 'horizontal')} [props.orientation='vertical'] - The orientation of the scrollbar.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The ScrollBar component.
 */
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
