/**
 * @file components/ui/label.tsx
 * @description This file contains the Label component, built using Radix UI's Label primitive, providing an accessible label for form elements.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * @overview Defines the visual variants for the Label component using `cva` (class-variance-authority).
 * It sets up the base styles for a label, including considerations for disabled peer elements.
 * 
 * @constant {Function} labelVariants - A function that generates Tailwind CSS classes for the label.
 */
const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

/**
 * @overview The Label component, built on Radix UI's LabelPrimitive.Root.
 * It provides an accessible and styled label for form controls, linking with an input element via its `htmlFor` prop.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/label
 * 
 * @param {object} props - The properties for the Label component.
 * @param {string} [props.className] - Optional CSS class names to apply to the label.
 * @param {React.Ref<HTMLLabelElement>} ref - Ref to the underlying HTMLLabelElement.
 * 
 * @returns {JSX.Element} The Label component.
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
