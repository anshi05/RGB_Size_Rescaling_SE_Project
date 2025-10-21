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

/**
 * @overview ResizerRoute component serves as the protected route for the image resizing application.
 * It checks for user authentication and redirects unauthenticated users to the home page.
 * If authenticated, it renders the `ImageResizerApp`.
 * 
 * @returns {JSX.Element} The ImageResizerApp component if authenticated, or a loading indicator.
 */
export default function ResizerRoute() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Effect to check user authentication status on component mount
  useEffect(() => {
    /**
     * @overview Asynchronously checks if a user session exists with Supabase.
     * If no session is found, the user is redirected to the home page.
     * Otherwise, the loading state is set to false, indicating the content can be displayed.
     * 
     * @returns {Promise<void>} A promise that resolves after checking the user session and performing redirection if necessary.
     */
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/') // Redirect to home page if not authenticated
      } else {
        setLoading(false)
      }
    }
    checkUser()
  }, [router]) // Depend on `router` to ensure the effect re-runs if router object changes (though usually stable)

  // Display a loading indicator while checking authentication status
  if (loading) {
    return <div>Loading...</div> // Or a loading spinner
  }

  // Render the ImageResizerApp if the user is authenticated
  return <ImageResizerApp onBack={() => router.push('/')} />
}
