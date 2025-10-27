/**
 * @file components/ui/separator.tsx
 * @description This file contains the Separator component, built using Radix UI's Separator primitive, providing a visually and semantically meaningful separator.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

import { cn } from '@/lib/utils'

/**
 * @overview The Separator component, built on Radix UI's SeparatorPrimitive.Root.
 * It provides a visually and semantically meaningful way to separate content, with customizable orientation.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/separator
 * 
 * @param {object} props - The properties for the Separator component.
 * @param {string} [props.className] - Optional CSS class names to apply to the separator.
 * @param {('horizontal' | 'vertical')} [props.orientation='horizontal'] - The orientation of the separator.
 * @param {boolean} [props.decorative=true] - If true, indicates that the separator is purely visual and has no semantic meaning.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Separator component.
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      {...props}
    />
  ),
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
