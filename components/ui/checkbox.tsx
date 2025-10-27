/**
 * @file components/ui/checkbox.tsx
 * @description This file contains the Checkbox component, built using Radix UI's Checkbox primitive.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * @overview The Checkbox component, built on Radix UI's CheckboxPrimitive.Root.
 * It provides a visually customizable and accessible checkbox input with a checkmark indicator.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/checkbox
 * 
 * @param {object} props - The properties for the Checkbox component.
 * @param {string} [props.className] - Optional CSS class names to apply to the checkbox root.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The Checkbox component.
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
