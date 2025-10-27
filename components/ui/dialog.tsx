/**
 * @file components/ui/dialog.tsx
 * @description This file contains the Dialog component and its sub-components, built using Radix UI's Dialog primitive, providing accessible and customizable modal dialogs.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * @overview The root Dialog component, built on Radix UI's DialogPrimitive.Root.
 * It manages the open/closed state and interaction behavior of a modal dialog.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/dialog
 * 
 * @returns {JSX.Element} The Dialog root component.
 */
const Dialog = DialogPrimitive.Root

/**
 * @overview The DialogTrigger component, built on Radix UI's DialogPrimitive.Trigger.
 * This component should wrap the interactive element that opens the dialog when interacted with.
 * 
 * @returns {JSX.Element} The Dialog trigger component.
 */
const DialogTrigger = DialogPrimitive.Trigger

/**
 * @overview The DialogPortal component, built on Radix UI's DialogPrimitive.Portal.
 * This component renders its children into a new DOM subtree outside of the current component hierarchy,
 * typically to ensure the modal overlays the entire page.
 * 
 * @returns {JSX.Element} The Dialog portal component.
 */
const DialogPortal = DialogPrimitive.Portal

/**
 * @overview The DialogClose component, built on Radix UI's DialogPrimitive.Close.
 * This component provides a way to close the dialog, typically an 'X' button or a custom close button.
 * 
 * @returns {JSX.Element} The Dialog close component.
 */
const DialogClose = DialogPrimitive.Close

/**
 * @overview The DialogOverlay component, built on Radix UI's DialogPrimitive.Overlay.
 * This component provides a dark, semi-transparent overlay behind the dialog, indicating that the content behind is not interactive.
 * 
 * @param {object} props - The properties for the DialogOverlay component.
 * @param {string} [props.className] - Optional CSS class names to apply to the overlay.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Dialog overlay component.
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * @overview The DialogContent component, built on Radix UI's DialogPrimitive.Content.
 * This component contains the main content of the dialog, including an optional close button.
 * It is rendered inside a `DialogPortal` and animated for entrance/exit.
 * 
 * @param {object} props - The properties for the DialogContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content wrapper.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the dialog content.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Dialog content component.
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/**
 * @overview The DialogHeader component.
 * Provides a styled header area for the Dialog, typically containing a title and description.
 * 
 * @param {object} props - The properties for the DialogHeader component.
 * @param {string} [props.className] - Optional CSS class names to apply to the header.
 * 
 * @returns {JSX.Element} The Dialog header component.
 */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className,
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

/**
 * @overview The DialogFooter component.
 * Provides a styled footer area for the Dialog, typically containing action buttons.
 * 
 * @param {object} props - The properties for the DialogFooter component.
 * @param {string} [props.className] - Optional CSS class names to apply to the footer.
 * 
 * @returns {JSX.Element} The Dialog footer component.
 */
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className,
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

/**
 * @overview The DialogTitle component, built on Radix UI's DialogPrimitive.Title.
 * Displays the main title within a DialogHeader.
 * 
 * @param {object} props - The properties for the DialogTitle component.
 * @param {string} [props.className] - Optional CSS class names to apply to the title.
 * @param {React.Ref<HTMLHeadingElement>} ref - Ref to the underlying HTMLHeadingElement.
 * 
 * @returns {JSX.Element} The Dialog title component.
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/**
 * @overview The DialogDescription component, built on Radix UI's DialogPrimitive.Description.
 * Provides supplementary information or a subtitle within a DialogHeader.
 * 
 * @param {object} props - The properties for the DialogDescription component.
 * @param {string} [props.className] - Optional CSS class names to apply to the description.
 * @param {React.Ref<HTMLParagraphElement>} ref - Ref to the underlying HTMLParagraphElement.
 * 
 * @returns {JSX.Element} The Dialog description component.
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
