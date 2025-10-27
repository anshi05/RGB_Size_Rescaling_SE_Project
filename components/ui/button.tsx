/**
 * @file components/ui/button.tsx
 * @description This file contains the Button component, providing various styles and sizes.
 * @lastUpdated 2025-10-25
 */
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * @overview Defines the visual variants and sizes for the Button component using `cva` (class-variance-authority).
 * It sets up the base styles and how different `variant` (e.g., 'default', 'destructive') and `size` (e.g., 'default', 'sm') props affect the appearance.
 * 
 * @constant {Function} buttonVariants - A function that generates Tailwind CSS classes based on the provided variant and size.
 * @property {object} variants - Defines the available visual variants and sizes.
 * @property {object} variants.variant - Available button styles.
 * @property {string} variants.variant.default - Default primary button style.
 * @property {string} variants.variant.destructive - Style for destructive actions.
 * @property {string} variants.variant.outline - Outlined button style.
 * @property {string} variants.variant.secondary - Secondary button style.
 * @property {string} variants.variant.ghost - Ghost button style (minimal).
 * @property {string} variants.variant.link - Link-like button style.
 * @property {object} variants.size - Available button sizes.
 * @property {string} variants.size.default - Default button size.
 * @property {string} variants.size.sm - Small button size.
 * @property {string} variants.size.lg - Large button size.
 * @property {string} variants.size.icon - Square icon button size.
 * @property {object} defaultVariants - Specifies the default variant and size to use if none is provided.
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * @overview The Button component.
 * A customizable button component supporting various visual variants and sizes.
 * It can render as a slot for composition with other components.
 * 
 * @param {object} props - The properties for the Button component.
 * @param {string} [props.className] - Optional CSS class names to apply to the button.
 * @param {('default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link')} [props.variant='default'] - The visual variant of the button.
 * @param {('default' | 'sm' | 'lg' | 'icon')} [props.size='default'] - The size of the button.
 * @param {boolean} [props.asChild=false] - If true, the component will render its child as a button without enforcing a DOM element.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The Button component.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
