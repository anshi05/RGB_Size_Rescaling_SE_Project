/**
 * @file components/ui/toast.tsx
 * @description This file contains the Toast component and its sub-components, built using Radix UI's Toast primitive, providing accessible and customizable toast notifications.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * @overview The root ToastProvider component, built on Radix UI's ToastPrimitives.Provider.
 * It manages the state for all toast notifications, allowing them to be displayed globally.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/toast
 * 
 * @returns {JSX.Element} The ToastProvider component.
 */
const ToastProvider = ToastPrimitives.Provider

/**
 * @overview The ToastViewport component, built on Radix UI's ToastPrimitives.Viewport.
 * This component serves as the container where all toast notifications are rendered.
 * It handles positioning toasts on the screen and managing their visibility.
 * 
 * @param {object} props - The properties for the ToastViewport component.
 * @param {string} [props.className] - Optional CSS class names to apply to the viewport.
 * @param {React.Ref<HTMLOListElement>} ref - Ref to the underlying HTMLOListElement.
 * 
 * @returns {JSX.Element} The ToastViewport component.
 */
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

/**
 * @overview Defines the visual variants for the Toast component, including default and destructive styles, using `cva` (class-variance-authority).
 * It also specifies animations for toast entrance, exit, and swipe gestures.
 * 
 * @constant {Function} toastVariants - A function that generates Tailwind CSS classes for toast notifications.
 * @property {object} variants - Defines the available variants for the toast.
 * @property {object} variants.variant - Specifies the visual style of the toast.
 * @property {string} variants.variant.default - Default styling for a standard toast notification.
 * @property {string} variants.variant.destructive - Styling for a destructive (e.g., error) toast notification.
 * @property {object} defaultVariants - Defines the default variant for the toast.
 * @property {string} defaultVariants.variant - The default visual variant for toasts (e.g., 'default').
 */
const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

/**
 * @overview The Toast component, built on Radix UI's ToastPrimitives.Root.
 * It represents an individual toast notification, displaying a message to the user.
 * Its appearance is determined by the `variant` prop and custom class names.
 * 
 * @param {object} props - The properties for the Toast component.
 * @param {string} [props.className] - Optional CSS class names to apply to the toast root.
 * @param {('default' | 'destructive')} [props.variant='default'] - The visual style variant of the toast.
 * @param {React.Ref<HTMLLIElement>} ref - Ref to the underlying HTMLLIElement.
 * 
 * @returns {JSX.Element} The Toast component.
 */
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

/**
 * @overview The ToastAction component, built on Radix UI's ToastPrimitives.Action.
 * A button that can be added to a toast notification, allowing users to perform an action related to the toast message.
 * 
 * @param {object} props - The properties for the ToastAction component.
 * @param {string} [props.className] - Optional CSS class names to apply to the action button.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The ToastAction component.
 */
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

/**
 * @overview The ToastClose component, built on Radix UI's ToastPrimitives.Close.
 * A button typically displayed within a toast notification that allows users to dismiss the toast.
 * It includes an 'X' icon and accessibility features.
 * 
 * @param {object} props - The properties for the ToastClose component.
 * @param {string} [props.className] - Optional CSS class names to apply to the close button.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The ToastClose component.
 */
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

/**
 * @overview The ToastTitle component, built on Radix UI's ToastPrimitives.Title.
 * Displays the main title or heading of a toast notification.
 * 
 * @param {object} props - The properties for the ToastTitle component.
 * @param {string} [props.className] - Optional CSS class names to apply to the title.
 * @param {React.Ref<HTMLHeadingElement>} ref - Ref to the underlying HTMLHeadingElement.
 * 
 * @returns {JSX.Element} The ToastTitle component.
 */
const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

/**
 * @overview The ToastDescription component, built on Radix UI's ToastPrimitives.Description.
 * Provides supplementary text or a detailed message within a toast notification.
 * 
 * @param {object} props - The properties for the ToastDescription component.
 * @param {string} [props.className] - Optional CSS class names to apply to the description.
 * @param {React.Ref<HTMLParagraphElement>} ref - Ref to the underlying HTMLParagraphElement.
 * 
 * @returns {JSX.Element} The ToastDescription component.
 */
const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

/**
 * @typedef {React.ComponentPropsWithoutRef<typeof Toast>} ToastProps
 * @description Props for the {@link Toast} component.
 */
type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

/**
 * @typedef {React.ReactElement<typeof ToastAction>} ToastActionElement
 * @description A React element specifically for the {@link ToastAction} component.
 */
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
