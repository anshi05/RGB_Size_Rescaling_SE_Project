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