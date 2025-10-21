/**
 * @file components/landing-page.jsx
 * @author Anshi
 * @description Landing Page for the RGB Image Rescaler application.
 * @lastUpdated 2025-10-14
 */
"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowRight, Zap, ImageIcon, Download, Sparkles, Users, Clock, Star, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { AuthModal } from "@/components/auth/auth-modal"
import { UserMenu } from "@/components/auth/user-menu"
import { getCurrentUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { ImageResizerApp } from "@/components/image-resizer-app"
import { useRouter } from "next/navigation"

/**
 * @overview The LandingPage component serves as the entry point for the application,
 * presenting an introduction, features, and calls to action. It handles user authentication status,
 * displaying either a sign-in/launch app option or a user menu if logged in.
 * It also incorporates animated background elements and a scroll-based feature display.
 * 
 * @returns {JSX.Element} The main landing page interface.
 */
export function LandingPage() {
  // State to control visibility of elements for initial animations
  const [isVisible, setIsVisible] = useState(false)
  // State to track the currently active feature card for scroll-based effects
  const [activeFeature, setActiveFeature] = useState(0)
  // State to store the authenticated user object
  const [user, setUser] = useState(null)
  // State to control the visibility of the authentication modal
  const [showAuth, setShowAuth] = useState(false)
  // Ref to observe feature cards for scroll-based animations
  const featuresRef = useRef(null)
  // State to manage loading status of user authentication
  const [loading, setLoading] = useState(true)
  // Next.js router hook for navigation
  const router = useRouter()

  // Effect to check user session on component mount and listen for authentication state changes
  useEffect(() => {
    // Check for an existing user session on initial load
    getCurrentUser().then(({ user }) => {
      setUser(user)
      setLoading(false)
    })

    // Subscribe to authentication state changes from Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      // If a user successfully signs in, close the auth modal
      if (event === "SIGNED_IN") {
        setShowAuth(false)
      }
    })

    // Unsubscribe from auth changes on component unmount to prevent memory leaks
    return () => subscription.unsubscribe()
  }, [])

  // Effect for handling initial visibility animation and setting up Intersection Observer for feature cards
  useEffect(() => {
    setIsVisible(true) // Trigger initial fade-in animation
    
    // Initialize Intersection Observer to detect when feature cards enter the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Update active feature based on the data-index attribute of the intersecting card
            const index = parseInt(entry.target.getAttribute('data-index'))
            setActiveFeature(index)
          }
        })
      },
      { threshold: 0.7 } // Trigger when 70% of the element is visible
    )

    // Observe all elements with the 'feature-card' class
    const featureCards = document.querySelectorAll('.feature-card')
    featureCards.forEach(card => observer.observe(card))

    // Clean up observer on component unmount
    return () => observer.disconnect()
  }, [])

  // Array of feature objects to be displayed dynamically
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Process images instantly with our optimized algorithms. No waiting, no delays. Experience real-time processing that keeps up with your creative flow.",
      gradient: "from-rose-400 to-pink-400"
    },
    {
      icon: ImageIcon,
      title: "Multiple Methods",
      desc: "Choose from nearest-neighbor, bilinear, or bicubic interpolation for perfect results. Professional-grade algorithms for every use case.",
      gradient: "from-violet-400 to-purple-400"
    },
    {
      icon: Download,
      title: "Easy Export",
      desc: "Download your resized images instantly in high quality PNG format. Batch processing available for multiple images at once.",
      gradient: "from-orange-400 to-rose-400"
    }
  ]

  /**
   * @overview Handles the logic for launching the image resizer application.
   * If a user is logged in, it redirects them to the '/resizer' page. Otherwise,
   * it opens the authentication modal to prompt for sign-in or sign-up.
   * 
   * @returns {void}
   */
  const handleLaunchApp = () => {
    if (user) {
      router.push('/resizer') // Redirect to resizer if user is authenticated
    } else {
      setShowAuth(true) // Show auth modal if user is not authenticated
    }
  }

  /**
   * @overview Callback function executed upon successful user authentication.
   * It closes the authentication modal and redirects the user to the '/resizer' page.
   * 
   * @returns {void}
   */
  const handleAuthSuccess = () => {
    setShowAuth(false) // Close the authentication modal
    router.push('/resizer') // Redirect to the resizer application
  }

  /**
   * @overview Handles the user sign-out process. It clears the user state
   * and redirects the user to the home page.
   * 
   * @returns {void}
   */
  const handleSignOut = () => {
    setUser(null) // Clear the user state
    router.push('/') // Redirect to home page after sign out
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Animated background elements for visual appeal */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-violet-500 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-r from-orange-500 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Enhanced Background with gradient orbs and geometric patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-rose-500/30 to-pink-500/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-r from-violet-500/30 to-purple-500/30 rounded-full blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-orange-500/20 to-rose-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-rose-300 rounded-full animate-bounce delay-700"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-violet-300 rounded-full animate-bounce delay-1000"></div>
        </div>

        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full opacity-4 z-[-2]" 
            style={{
              backgroundImage: `linear-gradient(to right, white 1px, transparent 1px),
                               linear-gradient(to bottom, white 1px, transparent 1px)`,
              backgroundSize: '100px 100px',
            }}
          ></div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className={`relative z-20 px-6 py-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Application Logo and Name */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg shadow-rose-500/30">
              <ImageIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-white font-bold text-2xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              PixelPerfect
            </span>
          </div>
          
          {/* User authentication status display (loading, logged in, or guest) */}
          {loading ? (
            <div className="w-24 h-10 bg-white/10 rounded-lg animate-pulse" />
          ) : user ? (
            <UserMenu user={user} onSignOut={handleSignOut} />
          ) : (
            <div className="flex items-center space-x-3">
              {/* Sign In button */}
              <Button onClick={() => setShowAuth(true)} variant="ghost" className="text-white hover:bg-white/10">
                Sign In
              </Button>
              {/* Launch App button for guests */}
              <Button
                onClick={handleLaunchApp}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                Launch App
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section: displays project title, authors, and primary call to action */}
      <section className="relative z-10 px-6 py-24 ">
        <div className="max-w-7xl mx-auto text-center">
          {/* College Project Title and Details */}
          <div className="pb-8 text-white/90">
            <p className="text-xl md:text-2xl font-semibold mb-6">
              SOFTWARE ENGINEERING (IT303) COURSE PROJECT
            </p>
            <h1 className="text-8xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Implementation of RGB Image Size Rescaling 
            Technique
            </h1>
            <p className="text-lg md:text-xl mb-2">
              Carried out by
            </p>
            <p className="text-lg md:text-xl">Anshi Sachan (231IT008)</p>
            <p className="text-lg md:text-xl">Harsh Revar (231IT055)</p>
            <p className="text-lg md:text-xl">Sameer Jamkhandi (231IT058)</p>
          </div>

          {/* Call to action buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transform transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            
            <Button
              onClick={handleLaunchApp}
              size="lg"
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-rose-500/40 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              Start Resizing Now
              <Zap className="ml-3 h-5 w-5 transform group-hover:scale-125 transition-transform" />
            </Button>
         
         
        </div>

        {/* Sign-up encouragement for guests */}
        {!user && (
          <p className="text-white/60 text-sm mt-4">No credit card required • Free forever • Sign up in seconds</p>
        )}
        </div>
      </section>

      {/* Features Section: highlights key functionalities with scroll-based animations */}
      <section ref={featuresRef} className="relative z-10 py-20 lg:py-32 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-white/70 text-xl max-w-2xl mx-auto">
              Scroll to discover what makes PixelPerfect exceptional
            </p>
          </div>

          <div className="space-y- lg:space-y-12 max-w-8xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                data-index={index}
                className={`feature-card transition-all duration-1000 ease-out ${
                  activeFeature === index 
                    ? 'opacity-100 transform translate-y-0 scale-100' 
                    : 'opacity-40 transform translate-y-10 scale-95'
                }`}
              >
                <Card className="bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-500 overflow-hidden group cursor-pointer">
                  <CardContent className="p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      <div className={`w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl`}>
                        <feature.icon className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                      </div>
                      <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full mb-4">
                          <span className="text-white/80 text-sm font-semibold">
                            Feature {index + 1}
                          </span>
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                          {feature.title}
                        </h3>
                        <p className="text-white/70 text-lg lg:text-xl leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

  
     
   

      {/* Call to Action Section: encourages users to start using the app */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-rose-500/20 to-violet-500/20 backdrop-blur-lg rounded-3xl p-12 lg:p-16 border border-white/20 relative overflow-hidden">
            {/* Decorative background orbs */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-r from-rose-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-float-medium"></div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 relative z-10">
              Ready to Transform Your Images?
            </h2>
            <p className="text-white/80 text-xl mb-10 relative z-10 max-w-2xl mx-auto">
              Join thousands of creative professionals who trust PixelPerfect for their image resizing needs.
            </p>
            {/* CTA button */}
            <Button
              onClick={handleLaunchApp}
              size="lg"
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 px-12 py-4 text-lg font-semibold shadow-2xl hover:shadow-rose-500/25 transition-all duration-300 transform hover:scale-105"
            >
              {user ? "Launch PixelPerfect" : "Start Free Today"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-10 py-12 border-t border-white/10 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Footer Logo and Name */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-rose-400 to-pink-400 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-2xl">PixelPerfect</span>
          </div>

        </div>
      </footer>
      
      {/* Authentication Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes pan {
          from {
            transform: translateX(0%) translateY(0%);
          }
          to {
            transform: translateX(-10%) translateY(-10%);
          }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(10px) translateY(-15px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}