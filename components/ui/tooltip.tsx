/**
 * @file components/ui/tooltip.tsx
 * @description This file contains the Tooltip component and its sub-components, built using Radix UI's Tooltip primitive, providing accessible and customizable tooltips.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'

/**
 * @overview The root TooltipProvider component, built on Radix UI's TooltipPrimitive.Provider.
 * It manages the state for all tooltips, ensuring proper accessibility and handling delays.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/tooltip
 * 
 * @returns {JSX.Element} The TooltipProvider component.
 */
const TooltipProvider = TooltipPrimitive.Provider

/**
 * @overview The root Tooltip component, built on Radix UI's TooltipPrimitive.Root.
 * It manages the open/closed state of an individual tooltip.
 * 
 * @returns {JSX.Element} The Tooltip root component.
 */
const Tooltip = TooltipPrimitive.Root

/**
 * @overview The TooltipTrigger component, built on Radix UI's TooltipPrimitive.Trigger.
 * This component should wrap the interactive element that, when hovered or focused, displays the tooltip content.
 * 
 * @returns {JSX.Element} The Tooltip trigger component.
 */
const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * @overview The TooltipContent component, built on Radix UI's TooltipPrimitive.Content.
 * This component contains the content that is displayed within the tooltip.
 * It is animated for entrance/exit and positioned relative to its trigger.
 * 
 * @param {object} props - The properties for the TooltipContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content wrapper.
 * @param {number} [props.sideOffset=4] - The distance in pixels between the content and the trigger.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Tooltip content component.
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
