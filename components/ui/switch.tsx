/**
 * @file components/ui/switch.tsx
 * @description This file contains the Switch component, built using Radix UI's Switch primitive, providing an accessible and customizable toggle switch.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

/**
 * @overview The Switch component, built on Radix UI's SwitchPrimitives.Root.
 * It provides an accessible and customizable toggle switch for enabling or disabling a feature.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/switch
 * 
 * @param {object} props - The properties for the Switch component.
 * @param {string} [props.className] - Optional CSS class names to apply to the switch root.
 * @param {boolean} [props.checked] - The controlled checked state of the switch.
 * @param {function} [props.onCheckedChange] - Event handler called when the checked state changes.
 * @param {React.Ref<HTMLButtonElement>} ref - Ref to the underlying HTMLButtonElement.
 * 
 * @returns {JSX.Element} The Switch component.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={
        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      }
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
