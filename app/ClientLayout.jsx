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

export default function ClientLayout({ children }) {
  const searchParams = useSearchParams()

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <Analytics />
    </>
  )
}