/**
 * @file app/update-password/page.jsx
 * @author Anshi
 * @description This page allows authenticated users to update their password after a reset flow.
 * @lastUpdated 2025-10-25
 */
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react'

/**
 * @overview The UpdatePasswordPage component.
 * This client-side page provides a form for users to set a new password after initiating a password reset.
 * It interacts with Supabase to update the user's password and provides visual feedback via toasts.
 * 
 * @returns {JSX.Element} The UpdatePasswordPage component.
 */
export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    const { hash } = window.location;
    const params = new URLSearchParams(hash.substring(1)); // Remove # and parse
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');

    if (accessToken && refreshToken && type === 'recovery') {
      // Set the session explicitly for recovery
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(() => {
          // Optionally clear the URL hash after setting the session
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        })
        .catch((err) => {
          console.error("Error setting recovery session:", err);
          toast({
            title: "Error",
            description: "Failed to initialize password reset. Please try again.",
            variant: "destructive",
          });
          router.push('/'); // Redirect on error
        });
    } else {
      // If no valid recovery tokens are found, redirect
      router.push('/')
      toast({
        title: "Unauthorized Access",
        description: "Please use the password reset link from your email.",
        variant: "destructive",
      });
    }
  }, [router, supabase, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      toast({
        title: "Password Mismatch",
        description: "The entered passwords do not match.",
        variant: "destructive",
      });
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      setLoading(false)
      toast({
        title: "Password Too Short",
        description: "Your password must be at least 6 characters long.",
        variant: "destructive",
      });
      return
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setError(error.message)
        toast({
          title: "Password Update Failed",
          description: `Failed to update password: ${error.message}`,
          variant: "destructive",
        });
      } else {
        setMessage('Your password has been updated successfully!')
        toast({
          title: "Password Updated",
          description: "Your password has been successfully updated. You can now sign in with your new password.",
        });
        // Redirect to sign-in page after successful password update
        router.push('/')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating your password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Set New Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-rose-400 rounded-xl"
                  placeholder="Enter your new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-rose-400 rounded-xl"
                  placeholder="Confirm your new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-600 text-sm">{message}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 font-semibold shadow-lg hover:shadow-rose-500/25 transition-all duration-300 rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
