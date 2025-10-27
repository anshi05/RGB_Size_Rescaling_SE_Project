/**
 * @file components/ui/input.tsx
 * @description This file contains the Input component, providing a styled and accessible input field.
 * @lastUpdated 2025-10-25
 */
import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * @overview The Input component.
 * A customizable input field for collecting user text input, supporting various HTML input types.
 * 
 * @param {object} props - The properties for the Input component.
 * @param {string} [props.className] - Optional CSS class names to apply to the input element.
 * @param {string} [props.type='text'] - The type of the input (e.g., 'text', 'email', 'password').
 * @param {React.Ref<HTMLInputElement>} ref - Ref to the underlying HTMLInputElement.
 * 
 * @returns {JSX.Element} The Input component.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
