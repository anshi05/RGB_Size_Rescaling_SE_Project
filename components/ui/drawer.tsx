/**
 * @file components/ui/drawer.tsx
 * @description This file contains the Drawer component and its sub-components, built using `vaul`, providing a draggable drawer component.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

import { cn } from '@/lib/utils'

/**
 * @overview The root Drawer component, built on `vaul`'s DrawerPrimitive.Root.
 * It provides a draggable drawer that can be pulled up from the bottom of the screen.
 * 
 * @see https://vaul.emilkowalski.no/
 * 
 * @param {object} props - The properties for the Drawer component.
 * @param {boolean} [props.shouldScaleBackground=true] - Whether the background should scale when the drawer is open.
 * @param {React.ComponentProps<typeof DrawerPrimitive.Root>} props - All other props supported by `vaul`'s DrawerPrimitive.Root.
 * 
 * @returns {JSX.Element} The Drawer root component.
 */
const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = 'Drawer'

/**
 * @overview The DrawerTrigger component, built on `vaul`'s DrawerPrimitive.Trigger.
 * This component should wrap the interactive element that opens the drawer when interacted with.
 * 
 * @returns {JSX.Element} The Drawer trigger component.
 */
const DrawerTrigger = DrawerPrimitive.Trigger

/**
 * @overview The DrawerPortal component, built on `vaul`'s DrawerPrimitive.Portal.
 * This component renders its children into a new DOM subtree outside of the current component hierarchy,
 * typically to ensure the drawer overlays the entire page.
 * 
 * @returns {JSX.Element} The Drawer portal component.
 */
const DrawerPortal = DrawerPrimitive.Portal

/**
 * @overview The DrawerClose component, built on `vaul`'s DrawerPrimitive.Close.
 * This component provides a way to close the drawer.
 * 
 * @returns {JSX.Element} The Drawer close component.
 */
const DrawerClose = DrawerPrimitive.Close

/**
 * @overview The DrawerOverlay component, built on `vaul`'s DrawerPrimitive.Overlay.
 * This component provides a dark, semi-transparent overlay behind the drawer.
 * 
 * @param {object} props - The properties for the DrawerOverlay component.
 * @param {string} [props.className] - Optional CSS class names to apply to the overlay.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Drawer overlay component.
 */
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

/**
 * @overview The DrawerContent component, built on `vaul`'s DrawerPrimitive.Content.
 * This component contains the main content of the drawer, including a visual grab-handle.
 * It is rendered inside a `DrawerPortal`.
 * 
 * @param {object} props - The properties for the DrawerContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content wrapper.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the drawer content.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Drawer content component.
 */
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background',
        className,
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = 'DrawerContent'

/**
 * @overview The DrawerHeader component.
 * Provides a styled header area for the Drawer, typically containing a title and description.
 * 
 * @param {object} props - The properties for the DrawerHeader component.
 * @param {string} [props.className] - Optional CSS class names to apply to the header.
 * 
 * @returns {JSX.Element} The Drawer header component.
 */
const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
    {...props}
  />
)
DrawerHeader.displayName = 'DrawerHeader'

/**
 * @overview The DrawerFooter component.
 * Provides a styled footer area for the Drawer, typically containing action buttons.
 * 
 * @param {object} props - The properties for the DrawerFooter component.
 * @param {string} [props.className] - Optional CSS class names to apply to the footer.
 * 
 * @returns {JSX.Element} The Drawer footer component.
 */
const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
)
DrawerFooter.displayName = 'DrawerFooter'

/**
 * @overview The DrawerTitle component, built on `vaul`'s DrawerPrimitive.Title.
 * Displays the main title within a DrawerHeader.
 * 
 * @param {object} props - The properties for the DrawerTitle component.
 * @param {string} [props.className] - Optional CSS class names to apply to the title.
 * @param {React.Ref<HTMLHeadingElement>} ref - Ref to the underlying HTMLHeadingElement.
 * 
 * @returns {JSX.Element} The Drawer title component.
 */
const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

/**
 * @overview The DrawerDescription component, built on `vaul`'s DrawerPrimitive.Description.
 * Provides supplementary information or a subtitle within a DrawerHeader.
 * 
 * @param {object} props - The properties for the DrawerDescription component.
 * @param {string} [props.className] - Optional CSS class names to apply to the description.
 * @param {React.Ref<HTMLParagraphElement>} ref - Ref to the underlying HTMLParagraphElement.
 * 
 * @returns {JSX.Element} The Drawer description component.
 */
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
