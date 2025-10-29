/**
 * @file components/auth/user-menu.jsx
 * @author Anshi
 * @description User menu component for displaying user information and actions.
 * @lastUpdated 2025-10-14
 */
"use client"

import { useState } from "react"
import { User, LogOut, Settings, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation";

/**
 * @overview UserMenu component displays a dropdown menu with user information and actions like Settings, My Images, and Sign Out.
 * It manages its open/closed state and integrates with authentication for signing out.
 * 
 * @param {object} props - The properties for the UserMenu component.
 * @param {object | null} props.user - The user object, or null if no user is logged in.
 * @param {string} props.user.email - The user's email address.
 * @param {object} props.user.user_metadata - Metadata associated with the user.
 * @param {string} props.user.user_metadata.full_name - The user's full name.
 * @param {function} props.onSignOut - Callback function to be called after a successful sign-out.
 * 
 * @returns {JSX.Element} A div element containing the user menu button and dropdown content.
 */
export function UserMenu({ user, onSignOut }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter();

  /**
   * @overview Handles the user sign-out process. It calls the `signOut` function from `@/lib/auth`,
   * then invokes the `onSignOut` callback provided by the parent component, and finally closes the menu.
   * 
   * @returns {Promise<void>} A promise that resolves once the sign-out process is complete.
   */
  const handleSignOut = async () => {
    // Call the signOut function from the authentication library
    await signOut()
    // Invoke the parent's onSignOut callback
    onSignOut()
    // Close the user menu after signing out
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Button to toggle the visibility of the user menu dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 px-4 py-2 rounded-lg"
      >
        {/* User avatar/icon */}
        <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        {/* Display user's full name or part of their email */}
        <span className="hidden sm:block font-medium">
          {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
        </span>
      </button>

      {/* Dropdown menu content, visible when isOpen is true */}
      {isOpen && (
        <>
          {/* Overlay to close the menu when clicking outside */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          {/* Card containing menu items */}
          <Card className="absolute right-0 top-12 z-50 w-64 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-4 space-y-3">
              {/* User info display within the menu */}
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user?.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              {/* Navigation items */}
              <div className="space-y-1">

                {/* My Images button */}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/my_images');
                  }}
                >
                  <ImageIcon className="w-4 h-4 mr-3" />
                  My Images
                </Button>
              </div>

              {/* Sign out section */}
              <div className="pt-3 border-t border-gray-200">
                {/* Sign Out button */}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
