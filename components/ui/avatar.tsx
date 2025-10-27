/**
 * @file components/ui/avatar.tsx
 * @description This file contains the Avatar component and its sub-components, built using Radix UI's Avatar primitive.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'

/**
 * @overview The Avatar component, built on Radix UI's AvatarPrimitive.Root.
 * It displays a user's profile picture or a fallback initial/icon if no image is available.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/avatar
 * 
 * @param {object} props - The properties for the Avatar component.
 * @param {string} [props.className] - Optional CSS class names to apply to the avatar container.
 * @param {React.Ref<HTMLSpanElement>} ref - Ref to the underlying HTMLSpanElement.
 * 
 * @returns {JSX.Element} The Avatar root component.
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className,
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

/**
 * @overview The AvatarImage component, built on Radix UI's AvatarPrimitive.Image.
 * It displays the actual image within the Avatar component.
 * 
 * @param {object} props - The properties for the AvatarImage component.
 * @param {string} [props.className] - Optional CSS class names to apply to the image.
 * @param {React.Ref<HTMLImageElement>} ref - Ref to the underlying HTMLImageElement.
 * 
 * @returns {JSX.Element} The Avatar image component.
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

/**
 * @overview The AvatarFallback component, built on Radix UI's AvatarPrimitive.Fallback.
 * It displays a fallback UI (e.g., initials or an icon) when the AvatarImage fails to load or is not provided.
 * 
 * @param {object} props - The properties for the AvatarFallback component.
 * @param {string} [props.className] - Optional CSS class names to apply to the fallback element.
 * @param {React.Ref<HTMLSpanElement>} ref - Ref to the underlying HTMLSpanElement.
 * 
 * @returns {JSX.Element} The Avatar fallback component.
 */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
