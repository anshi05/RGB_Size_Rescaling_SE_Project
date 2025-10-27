/**
 * @file components/ui/slider.tsx
 * @description This file contains the Slider component, built using Radix UI's Slider primitive, providing an accessible and customizable slider for selecting a value or range of values.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

/**
 * @overview The Slider component, built on Radix UI's SliderPrimitive.Root.
 * It provides a customizable slider for selecting a single value or a range of values, with accessibility features.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/slider
 * 
 * @param {object} props - The properties for the Slider component.
 * @param {string} [props.className] - Optional CSS class names to apply to the slider root.
 * @param {number[]} [props.value] - The current value(s) of the slider. Must be an array, even for a single value.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The Slider component.
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
