/**
 * @file app/auth/callback/route.js
 * @author Anshi
 * @description Route handler for Supabase authentication callback.
 * @lastUpdated 2025-10-14
 */
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * @overview Handles the authentication callback from Supabase. It exchanges the authorization code for a session
 * and redirects the user to the origin URL after the sign-in process is complete.
 * 
 * @param {import("next/server").NextRequest} request - The incoming Next.js request object, containing the authorization code in search parameters.
 * @returns {NextResponse} A Next.js redirect response to the origin URL.
 */
export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}
