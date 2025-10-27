/**
 * @file components/ui/radio-group.tsx
 * @description This file contains the RadioGroup component and its sub-components, built using Radix UI's RadioGroup primitive, providing accessible and customizable radio buttons.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * @overview The root RadioGroup component, built on Radix UI's RadioGroupPrimitive.Root.
 * It manages the checked state of its `RadioGroupItem` children, ensuring only one radio button can be selected at a time within the group.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/radio-group
 * 
 * @param {object} props - The properties for the RadioGroup component.
 * @param {string} [props.className] - Optional CSS class names to apply to the radio group container.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The RadioGroup root component.
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

/**
 * @overview The RadioGroupItem component, built on Radix UI's RadioGroupPrimitive.Item.
 * An individual radio button within a `RadioGroup`. It displays a circle indicator when selected.
 * 
 * @param {object} props - The properties for the RadioGroupItem component.
 * @param {string} [props.className] - Optional CSS class names to apply to the radio item.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The RadioGroup item component.
 */
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
