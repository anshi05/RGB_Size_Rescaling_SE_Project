/**
 * @file components/ui/sonner.tsx
 * @description This file contains the Toaster component, which wraps the `sonner` library's Toaster to display elegant and accessible toast notifications.
 * @lastUpdated 2025-10-25
 */
'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

/**
 * @overview The Toaster component.
 * This component is a wrapper around the `sonner` library's Toaster, providing a customizable and themable toast notification system.
 * It integrates with `next-themes` to support light/dark mode themes for toasts.
 * 
 * @see https://sonner.emilkowal.ski/
 * 
 * @param {object} props - The properties for the Toaster component.
 * @param {React.ComponentProps<typeof Sonner>} props - All other props supported by the `sonner` Toaster component.
 * 
 * @returns {JSX.Element} The Toaster component.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
