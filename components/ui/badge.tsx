/**
 * @file components/ui/badge.tsx
 * @description This file contains the Badge component, used for displaying small, informative labels.
 * @lastUpdated 2025-10-25
 */
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * @overview Defines the visual variants for the Badge component using `cva` (class-variance-authority).
 * It sets up the base styles and how different `variant` props (e.g., 'default', 'secondary') affect the appearance.
 * 
 * @constant {Function} badgeVariants - A function that generates Tailwind CSS classes based on the provided variant.
 * @property {object} variants - Defines the available visual variants.
 * @property {string} variants.default - Default styling for the badge.
 * @property {string} variants.secondary - Styling for secondary badges.
 * @property {string} variants.destructive - Styling for destructive badges.
 * @property {string} variants.outline - Styling for outline badges.
 * @property {object} defaultVariants - Specifies the default variant to use if none is provided.
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * @overview The Badge component.
 * A small, interactive component used for displaying a short amount of information.
 * 
 * @param {object} props - The properties for the Badge component.
 * @param {string} [props.className] - Optional CSS class names to apply to the badge container.
 * @param {('default' | 'secondary' | 'destructive' | 'outline')} [props.variant='default'] - The visual variant of the badge.
 * 
 * @returns {JSX.Element} The Badge component.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
