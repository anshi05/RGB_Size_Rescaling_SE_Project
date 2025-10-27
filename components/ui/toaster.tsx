/**
 * @file components/ui/toaster.tsx
 * @description This file contains the Toaster component, which renders a list of active toast notifications using Radix UI's Toast primitives.
 * @lastUpdated 2025-10-25
 */
'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'

/**
 * @overview The Toaster component.
 * This component is responsible for rendering all active toast notifications managed by the `useToast` hook.
 * It utilizes Radix UI's ToastProvider and ToastViewport for accessibility and positioning.
 * 
 * @returns {JSX.Element} The Toaster component, rendering a list of toast notifications.
 */
export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0 shadow-lg" {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle className="text-white">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-white/90">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-white/80 hover:text-white" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
