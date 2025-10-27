/**
 * @file components/ui/alert-dialog.tsx
 * @description This file contains the AlertDialog component and its sub-components, built using Radix UI's AlertDialog primitive.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

/**
 * @overview The root AlertDialog component, built on Radix UI's AlertDialogPrimitive.Root.
 * It manages the state and behavior of a modal dialog that interrupts the user with important content.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/alert-dialog
 * 
 * @returns {JSX.Element} The AlertDialog root component.
 */
const AlertDialog = AlertDialogPrimitive.Root

/**
 * @overview The AlertDialogTrigger component, built on Radix UI's AlertDialogPrimitive.Trigger.
 * This component should wrap the element that opens the alert dialog when interacted with.
 * 
 * @returns {JSX.Element} The AlertDialog trigger component.
 */
const AlertDialogTrigger = AlertDialogPrimitive.Trigger

/**
 * @overview The AlertDialogPortal component, built on Radix UI's AlertDialogPrimitive.Portal.
 * This component renders its children into a new DOM subtree outside of the current component hierarchy,
 * typically to ensure the modal overlays the entire page.
 * 
 * @returns {JSX.Element} The AlertDialog portal component.
 */
const AlertDialogPortal = AlertDialogPrimitive.Portal

/**
 * @overview The AlertDialogOverlay component, built on Radix UI's AlertDialogPrimitive.Overlay.
 * This component provides a dark, semi-transparent overlay behind the alert dialog.
 * 
 * @param {object} props - The properties for the AlertDialogOverlay component.
 * @param {string} [props.className] - Optional CSS class names to apply to the overlay.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The AlertDialog overlay component.
 */
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

/**
 * @overview The AlertDialogContent component, built on Radix UI's AlertDialogPrimitive.Content.
 * This component contains the main content of the alert dialog.
 * 
 * @param {object} props - The properties for the AlertDialogContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content wrapper.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The AlertDialog content component.
 */
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
    <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

/**
 * @overview The AlertDialogHeader component.
 * This component provides a styled header for the alert dialog, containing the title and description.
 * 
 * @param {object} props - The properties for the AlertDialogHeader component.
 * @param {string} [props.className] - Optional CSS class names to apply to the header.
 * 
 * @returns {JSX.Element} The AlertDialog header component.
 */
const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
      className,
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

/**
 * @overview The AlertDialogFooter component.
 * This component provides a styled footer for the alert dialog, typically containing action buttons.
 * 
 * @param {object} props - The properties for the AlertDialogFooter component.
 * @param {string} [props.className] - Optional CSS class names to apply to the footer.
 * 
 * @returns {JSX.Element} The AlertDialog footer component.
 */
const AlertDialogFooter = ({
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
AlertDialogFooter.displayName = 'AlertDialogFooter'

/**
 * @overview The AlertDialogTitle component, built on Radix UI's AlertDialogPrimitive.Title.
 * This component provides the title for the alert dialog.
 * 
 * @param {object} props - The properties for the AlertDialogTitle component.
 * @param {string} [props.className] - Optional CSS class names to apply to the title.
 * @param {React.Ref<HTMLHeadingElement>} ref - Ref to the underlying HTMLHeadingElement.
 * 
 * @returns {JSX.Element} The AlertDialog title component.
 */
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

/**
 * @overview The AlertDialogDescription component, built on Radix UI's AlertDialogPrimitive.Description.
 * This component provides the descriptive text for the alert dialog.
 * 
 * @param {object} props - The properties for the AlertDialogDescription component.
 * @param {string} [props.className] - Optional CSS class names to apply to the description.
 * @param {React.Ref<HTMLParagraphElement>} ref - Ref to the underlying HTMLParagraphElement.
 * 
 * @returns {JSX.Element} The AlertDialog description component.
 */
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

/**
 * @overview The AlertDialogAction component, built on Radix UI's AlertDialogPrimitive.Action.
 * This component provides the primary action button for the alert dialog.
 * 
 * @param {object} props - The properties for the AlertDialogAction component.
 * @param {string} [props.className] - Optional CSS class names to apply to the action button.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The AlertDialog action button component.
 */
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

/**
 * @overview The AlertDialogCancel component, built on Radix UI's AlertDialogPrimitive.Cancel.
 * This component provides the cancel button for the alert dialog.
 * 
 * @param {object} props - The properties for the AlertDialogCancel component.
 * @param {string} [props.className] - Optional CSS class names to apply to the cancel button.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The AlertDialog cancel button component.
 */
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: 'outline' }),
      'mt-2 sm:mt-0',
      className,
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
