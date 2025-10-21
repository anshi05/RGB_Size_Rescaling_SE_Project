/**
 * @file app/resizer/page.jsx
 * @author Anshi
 * @description Resizer page component that enforces authentication and renders the ImageResizerApp.
 * @lastUpdated 2025-10-07
 */
'use client'

import { ImageResizerApp } from '@/components/image-resizer-app'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ResizerRoute() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/') // Redirect to home page if not authenticated
      } else {
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  if (loading) {
    return <div>Loading...</div> // Or a loading spinner
  }

  return <ImageResizerApp onBack={() => router.push('/')} />
}
