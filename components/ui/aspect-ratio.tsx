/**
 * @file components/ui/aspect-ratio.tsx
 * @description This file contains the AspectRatio component, built using Radix UI's AspectRatio primitive.
 * @lastUpdated 2025-10-25
 */
'use client'

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio'

/**
 * @overview The AspectRatio component, built on Radix UI's AspectRatioPrimitive.Root.
 * It renders a container that maintains a specified aspect ratio, useful for embedding media or responsive layouts.
 * 
 * @see https://www.radix-ui.com/docs/primitives/components/aspect-ratio
 * 
 * @returns {JSX.Element} The AspectRatio root component.
 */
const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }
