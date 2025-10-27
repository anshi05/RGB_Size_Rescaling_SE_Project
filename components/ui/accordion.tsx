/**
 * @file components/ui/accordion.tsx
 * @description This file contains the Accordion component and its sub-components, built using Radix UI's Accordion primitive.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * @overview The root Accordion component, built on Radix UI's AccordionPrimitive.Root.
 * It manages the state and behavior of a collection of collapsible content sections.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/accordion
 * 
 * @returns {JSX.Element} The Accordion root component.
 */
const Accordion = AccordionPrimitive.Root

/**
 * @overview An individual item within the Accordion component, built on Radix UI's AccordionPrimitive.Item.
 * It represents a collapsible section that can contain a trigger and content.
 * 
 * @param {object} props - The properties for the AccordionItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the item.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Accordion item component.
 */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

/**
 * @overview The trigger button for an AccordionItem, built on Radix UI's AccordionPrimitive.Trigger.
 * Clicking this button toggles the visibility of the associated AccordionContent.
 * It includes an animated chevron icon to indicate the open/closed state.
 * 
 * @param {object} props - The properties for the AccordionTrigger component.
 * @param {string} [props.className] - Optional CSS class names to apply to the trigger.
 * @param {React.ReactNode} props.children - The content to display inside the trigger button.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The Accordion trigger component.
 */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

/**
 * @overview The collapsible content area for an AccordionItem, built on Radix UI's AccordionPrimitive.Content.
 * Its visibility is toggled by the associated AccordionTrigger and it includes entry/exit animations.
 * 
 * @param {object} props - The properties for the AccordionContent component.
 * @param {string} [props.className] - Optional CSS class names to apply to the content wrapper div.
 * @param {React.ReactNode} props.children - The content to display within the collapsible section.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Accordion content component.
 */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
