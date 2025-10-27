/**
 * @file components/ui/sheet.tsx
 * @description This file contains the Sheet component and its sub-components, built using Radix UI's Dialog primitive, providing accessible and customizable side sheets.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * @overview The root Sheet component, built on Radix UI's DialogPrimitive.Root.
 * It manages the open/closed state and interaction behavior of a side sheet.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/dialog
 * 
 * @returns {JSX.Element} The Sheet root component.
 */
const Sheet = SheetPrimitive.Root

/**
 * @overview The SheetTrigger component, built on Radix UI's DialogPrimitive.Trigger.
 * This component should wrap the interactive element that opens the sheet when interacted with.
 * 
 * @returns {JSX.Element} The Sheet trigger component.
 */
const SheetTrigger = SheetPrimitive.Trigger

/**
 * @overview The SheetClose component, built on Radix UI's DialogPrimitive.Close.
 * This component provides a way to close the sheet, typically an 'X' button or a custom close button.
 * 
 * @returns {JSX.Element} The Sheet close component.
 */
const SheetClose = SheetPrimitive.Close

/**
 * @overview The SheetPortal component, built on Radix UI's DialogPrimitive.Portal.
 * This component renders its children into a new DOM subtree outside of the current component hierarchy,
 * typically to ensure the sheet overlays the entire page.
 * 
 * @returns {JSX.Element} The Sheet portal component.
 */
const SheetPortal = SheetPrimitive.Portal

/**
 * @overview The SheetOverlay component, built on Radix UI's DialogPrimitive.Overlay.
 * This component provides a dark, semi-transparent overlay behind the sheet, indicating that the content behind is not interactive.
 * 
 * @param {object} props - The properties for the SheetOverlay component.
 * @param {string} [props.className] - Optional CSS class names to apply to the overlay.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Sheet overlay component.
 */
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

/**
 * @overview Defines the visual variants for the Sheet content, including different side positions and animations, using `cva` (class-variance-authority).
 * 
 * @constant {Function} sheetVariants - A function that generates Tailwind CSS classes for the sheet content.
 * @property {object} variants - Defines the available variants for the sheet.
 * @property {object} variants.side - Specifies the side from which the sheet will appear.
 * @property {string} variants.side.top - Styles for a sheet appearing from the top.
 * @property {string} variants.side.bottom - Styles for a sheet appearing from the bottom.
 * @property {string} variants.side.left - Styles for a sheet appearing from the left.
 * @property {string} variants.side.right - Styles for a sheet appearing from the right.
 * @property {object} defaultVariants - Defines the default variant for the sheet.
 * @property {string} defaultVariants.side - The default side for the sheet (e.g., 'right').
 */
const sheetVariants = cva(
  'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
)

/**
 * @typedef {object} SheetContentProps
 * @property {string} [side='right'] - The side from which the sheet will appear (top, bottom, left, or right).
 * @augments React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>
 * @augments VariantProps<typeof sheetVariants>
 */
interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

/**
 * @overview The SheetContent component, built on Radix UI's DialogPrimitive.Content.
 * This component contains the main content of the sheet, including an optional close button.
 * It is rendered inside a `SheetPortal` and animated for entrance/exit based on the `side` prop.
 * 
 * @param {object} props - The properties for the SheetContent component.
 * @param {string} [props.side='right'] - The side from which the sheet will appear.
 * @param {string} [props.className] - Optional CSS class names to apply to the content wrapper.
 * @param {React.ReactNode} props.children - The child elements to be rendered within the sheet content.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Sheet content component.
 */
const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

/**
 * @overview The SheetHeader component.
 * Provides a styled header area for the Sheet, typically containing a title and description.
 * 
 * @param {object} props - The properties for the SheetHeader component.
 * @param {string} [props.className] - Optional CSS class names to apply to the header.
 * 
 * @returns {JSX.Element} The Sheet header component.
 */
const SheetHeader = ({
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
SheetHeader.displayName = 'SheetHeader'

/**
 * @overview The SheetFooter component.
 * Provides a styled footer area for the Sheet, typically containing action buttons.
 * 
 * @param {object} props - The properties for the SheetFooter component.
 * @param {string} [props.className] - Optional CSS class names to apply to the footer.
 * 
 * @returns {JSX.Element} The Sheet footer component.
 */
const SheetFooter = ({
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
SheetFooter.displayName = 'SheetFooter'

/**
 * @overview The SheetTitle component, built on Radix UI's DialogPrimitive.Title.
 * Displays the main title within a SheetHeader.
 * 
 * @param {object} props - The properties for the SheetTitle component.
 * @param {string} [props.className] - Optional CSS class names to apply to the title.
 * @param {React.Ref<HTMLHeadingElement>} ref - Ref to the underlying HTMLHeadingElement.
 * 
 * @returns {JSX.Element} The Sheet title component.
 */
const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

/**
 * @overview The SheetDescription component, built on Radix UI's DialogPrimitive.Description.
 * Provides supplementary information or a subtitle within a SheetHeader.
 * 
 * @param {object} props - The properties for the SheetDescription component.
 * @param {string} [props.className] - Optional CSS class names to apply to the description.
 * @param {React.Ref<HTMLParagraphElement>} ref - Ref to the underlying HTMLParagraphElement.
 * 
 * @returns {JSX.Element} The Sheet description component.
 */
const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
