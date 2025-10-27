/**
 * @file components/ui/toggle.tsx
 * @description This file contains the Toggle component, built using Radix UI's Toggle primitive, providing an accessible and customizable two-state button.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * @overview Defines the visual variants for the Toggle component, including different styles and sizes, using `cva` (class-variance-authority).
 * It provides common styling for toggle buttons, such as hover, focus, and active states.
 * 
 * @constant {Function} toggleVariants - A function that generates Tailwind CSS classes for the toggle button.
 * @property {object} variants - Defines the available variants for the toggle.
 * @property {object} variants.variant - Specifies the visual style of the toggle.
 * @property {string} variants.variant.default - Default styling for a toggle button.
 * @property {string} variants.variant.outline - Outline styling for a toggle button.
 * @property {object} variants.size - Specifies the size of the toggle.
 * @property {string} variants.size.default - Default size for the toggle button.
 * @property {string} variants.size.sm - Small size for the toggle button.
 * @property {string} variants.size.lg - Large size for the toggle button.
 * @property {object} defaultVariants - Defines the default variant and size for the toggle.
 * @property {string} defaultVariants.variant - The default visual variant for toggles (e.g., 'default').
 * @property {string} defaultVariants.size - The default size for toggles (e.g., 'default').
 */
const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3 min-w-10',
        sm: 'h-9 px-2.5 min-w-9',
        lg: 'h-11 px-5 min-w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

/**
 * @overview The Toggle component, built on Radix UI's TogglePrimitive.Root.
 * It provides an accessible two-state button that can be toggled on or off.
 * Its appearance is determined by the `variant` and `size` props.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/toggle
 * 
 * @param {object} props - The properties for the Toggle component.
 * @param {string} [props.className] - Optional CSS class names to apply to the toggle button.
 * @param {('default' | 'outline')} [props.variant='default'] - The visual style variant of the toggle.
 * @param {('default' | 'sm' | 'lg')} [props.size='default'] - The size variant of the toggle.
 * @param {boolean} [props.pressed] - The controlled pressed state of the toggle.
 * @param {function} [props.onPressedChange] - Event handler called when the pressed state changes.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The Toggle component.
 */
const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
