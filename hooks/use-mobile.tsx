/**
 * @file hooks/use-mobile.tsx
 * @author Anshi
 * @description Custom hook to determine if the current viewport is mobile-sized.
 * @lastUpdated 2025-10-21
 */
import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * @overview A custom React hook that determines if the current viewport width is considered mobile.
 * It listens to window resize events and updates its state accordingly, providing a responsive utility.
 * 
 * @returns {boolean} `true` if the viewport width is less than the `MOBILE_BREAKPOINT`, `false` otherwise.
 */
export function useIsMobile() {
  // State to store whether the current device is mobile or not. Initialized to undefined.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // Effect hook to set up and tear down event listeners for window resize.
  React.useEffect(() => {
    // Create a media query list to match screens smaller than the mobile breakpoint.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    /**
     * @overview Event handler for media query changes or window resize.
     * It updates the `isMobile` state based on the current window width relative to the `MOBILE_BREAKPOINT`.
     * 
     * @returns {void}
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add event listener for changes to the media query list.
    mql.addEventListener('change', onChange)
    // Set initial state based on current window width.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Cleanup function to remove the event listener when the component unmounts.
    return () => mql.removeEventListener('change', onChange)
  }, []) // Empty dependency array ensures this effect runs only once on mount

  // Return a boolean value indicating mobile status. `!!` converts undefined to false.
  return !!isMobile
}
