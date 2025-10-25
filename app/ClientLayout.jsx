/**
 * @file app/ClientLayout.jsx
 * @author Anshi
 * @description Client-side layout component for the RGB Image Rescaler application, handling analytics and suspense.
 * @lastUpdated 2025-10-01
 */
"use client"

import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Toaster } from "@/components/ui/toaster";

/**
 * @overview ClientLayout component is responsible for client-side rendering concerns,
 * such as integrating Vercel Analytics and providing a Suspense boundary for its children.
 * It ensures that client-side specific functionalities are available for the application's layout.
 * 
 * @param {object} props - The properties for the ClientLayout component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * 
 * @returns {JSX.Element} A React fragment containing the Suspense boundary and Analytics component.
 */
export default function ClientLayout({ children }) {
  const searchParams = useSearchParams()

  return (
    <>
      {/* Suspense boundary for client-side components to handle loading states */}
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      {/* Vercel Analytics component for tracking usage */}
      <Analytics />
      <Toaster />
    </>
  )
}