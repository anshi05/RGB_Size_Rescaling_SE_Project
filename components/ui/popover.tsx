/**
 * @file components/ui/popover.tsx
 * @description This file contains the Popover component and its sub-components, built using Radix UI's Popover primitive, providing a small overlay that opens on trigger interaction.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '@/lib/utils'

/**
 * @overview The root Popover component, built on Radix UI's PopoverPrimitive.Root.
 * It manages the open/closed state of its content, which appears as a small overlay.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/popover
 * 
 * @returns {JSX.Element} The Popover root component.
 */
const Popover = PopoverPrimitive.Root

/**
 * @overview The PopoverTrigger component, built on Radix UI's PopoverPrimitive.Trigger.
 * This component should wrap the interactive element that opens or closes the popover when interacted with.
 * 
 * @returns {JSX.Element} The Popover trigger component.
 */
const PopoverTrigger = PopoverPrimitive.Trigger

/**
 * @overview The PopoverContent component, built on Radix UI's PopoverPrimitive.Content.
 * This component contains the content that is displayed within the popover.
 * It is rendered inside a `PopoverPrimitive.Portal` and animated for entrance/exit.
 * 
 * @param {object} props - The properties for the PopoverContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content wrapper.
 * @param {('start' | 'center' | 'end')} [props.align='center'] - The alignment of the content relative to the trigger.
 * @param {number} [props.sideOffset=4] - The distance in pixels between the content and the trigger.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Popover content component.
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
