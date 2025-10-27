/**
 * @file components/ui/input-otp.tsx
 * @description This file contains the InputOTP component and its sub-components, built using `input-otp` for creating one-time password (OTP) input fields.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { Dot } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * @overview The root InputOTP component, built on `input-otp`'s OTPInput.
 * It provides a customizable and accessible input field for entering one-time passwords (OTP).
 * 
 * @see https://github.com/GuillaumeLeclerc/input-otp
 * 
 * @param {object} props - The properties for the InputOTP component.
 * @param {string} [props.className] - Optional CSS class names to apply to the input field.
 * @param {string} [props.containerClassName] - Optional CSS class names to apply to the container of the input slots.
 * @param {React.Ref<HTMLInputElement>} ref - Ref to the underlying HTMLInputElement.
 * 
 * @returns {JSX.Element} The InputOTP root component.
 */
const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      'flex items-center gap-2 has-[:disabled]:opacity-50',
      containerClassName,
    )}
    className={cn('disabled:cursor-not-allowed', className)}
    {...props}
  />
))
InputOTP.displayName = 'InputOTP'

/**
 * @overview The InputOTPGroup component.
 * A container for grouping `InputOTPSlot` components.
 * 
 * @param {object} props - The properties for the InputOTPGroup component.
 * @param {string} [props.className] - Optional CSS class names to apply to the group container.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The InputOTP group component.
 */
const InputOTPGroup = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
))
InputOTPGroup.displayName = 'InputOTPGroup'

/**
 * @overview The InputOTPSlot component.
 * Represents an individual input slot within the OTP input field, displaying a character and an optional caret.
 * 
 * @param {object} props - The properties for the InputOTPSlot component.
 * @param {number} props.index - The index of the slot.
 * @param {string} [props.className] - Optional CSS class names to apply to the slot.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The InputOTP slot component.
 */
const InputOTPSlot = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
        isActive && 'z-10 ring-2 ring-ring ring-offset-background',
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = 'InputOTPSlot'

/**
 * @overview The InputOTPSeparator component.
 * A visual separator, typically a dot, used between `InputOTPSlot` components.
 * 
 * @param {object} props - The properties for the InputOTPSeparator component.
 * @param {string} [props.className] - Optional CSS class names to apply to the separator.
 * @param {React.Ref<HTMLDivElement>} ref - Ref to the underlying HTMLDivElement.
 * 
 * @returns {JSX.Element} The InputOTP separator component.
 */
const InputOTPSeparator = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = 'InputOTPSeparator'

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
