"use client"

import { useState } from "react"
import { User, LogOut, Settings, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { signOut } from "@/lib/auth"

export function UserMenu({ user, onSignOut }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    onSignOut()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 px-4 py-2 rounded-lg"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <span className="hidden sm:block font-medium">
          {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <Card className="absolute right-0 top-12 z-50 w-64 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-4 space-y-3">
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

              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <ImageIcon className="w-4 h-4 mr-3" />
                  My Images
                </Button>
              </div>

              <div className="pt-3 border-t border-gray-200">
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
