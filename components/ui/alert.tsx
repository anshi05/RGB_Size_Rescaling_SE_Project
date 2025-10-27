/**
 * @file components/ui/alert.tsx
 * @description This file contains the Alert component and its sub-components, used for displaying important messages.
 * @lastUpdated 2025-10-25
 */
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * @overview Defines the visual variants for the Alert component using `cva` (class-variance-authority).
 * It sets up the base styles and how different `variant` props (e.g., 'default', 'destructive') affect the appearance.
 * 
 * @constant {Function} alertVariants - A function that generates Tailwind CSS classes based on the provided variant.
 * @property {object} variants - Defines the available visual variants.
 * @property {string} variants.default - Default styling for the alert.
 * @property {string} variants.destructive - Styling for destructive alerts (e.g., error messages).
 * @property {object} defaultVariants - Specifies the default variant to use if none is provided.
 */
const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

/**
 * @overview The Alert component.
 * A flexible component for displaying important messages to users, with support for different visual variants.
 * 
 * @param {object} props - The properties for the Alert component.
 * @param {string} [props.className] - Optional CSS class names to apply to the alert container.
 * @param {('default' | 'destructive')} [props.variant='default'] - The visual variant of the alert.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Alert component.
 */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
    <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = 'Alert'

/**
 * @overview The AlertTitle component.
 * Used to provide a concise heading for the Alert component.
 * 
 * @param {object} props - The properties for the AlertTitle component.
 * @param {string} [props.className] - Optional CSS class names to apply to the title.
 * @param {React.Ref<HTMLParagraphElement>} ref - Ref to the underlying HTMLParagraphElement.
 * 
 * @returns {JSX.Element} The Alert title component.
 */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

/**
 * @overview The AlertDescription component.
 * Used to provide more detailed information or context within the Alert component.
 * 
 * @param {object} props - The properties for the AlertDescription component.
 * @param {string} [props.className] - Optional CSS class names to apply to the description.
 * @param {React.Ref<HTMLParagraphElement>} ref - Ref to the underlying HTMLParagraphElement.
 * 
 * @returns {JSX.Element} The Alert description component.
 */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
