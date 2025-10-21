/**
 * @file lib/utils.ts
 * @author Anshi
 * @description Utility functions for className manipulation with Tailwind CSS.
 * @lastUpdated 2025-10-14
 */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
