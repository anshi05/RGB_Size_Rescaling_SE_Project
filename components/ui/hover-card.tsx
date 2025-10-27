/**
 * @file components/ui/hover-card.tsx
 * @description This file contains the HoverCard component and its sub-components, built using Radix UI's HoverCard primitive, providing a popover that appears when hovering over an element.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'

import { cn } from '@/lib/utils'

/**
 * @overview The root HoverCard component, built on Radix UI's HoverCardPrimitive.Root.
 * It manages the open/closed state of its content, which appears on hover.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/hover-card
 * 
 * @returns {JSX.Element} The HoverCard root component.
 */
const HoverCard = HoverCardPrimitive.Root

/**
 * @overview The HoverCardTrigger component, built on Radix UI's HoverCardPrimitive.Trigger.
 * This component should wrap the element that, when hovered over, triggers the display of the `HoverCardContent`.
 * 
 * @returns {JSX.Element} The HoverCard trigger component.
 */
const HoverCardTrigger = HoverCardPrimitive.Trigger

/**
 * @overview The HoverCardContent component, built on Radix UI's HoverCardPrimitive.Content.
 * This component contains the content that is displayed when the `HoverCardTrigger` is hovered.
 * It is animated for entrance/exit.
 * 
 * @param {object} props - The properties for the HoverCardContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content wrapper.
 * @param {('start' | 'center' | 'end')} [props.align='center'] - The alignment of the content relative to the trigger.
 * @param {number} [props.sideOffset=4] - The distance in pixels between the content and the trigger.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The HoverCard content component.
 */
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
