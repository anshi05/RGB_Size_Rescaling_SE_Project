/**
 * @file lib/utils.ts
 * @author Anshi
 * @description Utility functions for className manipulation with Tailwind CSS.
 * @lastUpdated 2025-10-14
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * @overview Utility function to conditionally join Tailwind CSS class names.
 * It combines `clsx` for conditional class application and `tailwind-merge` for resolving conflicts
 * and optimizing generated class strings. This ensures that utility classes are applied correctly
 * and efficiently, preventing unintended style overrides.
 * 
 * @param {ClassValue[]} inputs - An array of class values, which can be strings, objects, or arrays.
 * These values are processed by `clsx` to generate a base class string.
 * 
 * @returns {string} A merged and optimized string of Tailwind CSS class names.
 */
export function cn(...inputs: ClassValue[]) {
  // Use clsx to conditionally join class names, then twMerge to resolve conflicts
  return twMerge(clsx(inputs))
}
