/**
 * @file app/page.jsx
 * @author Anshi
 * @description Home page component that renders the LandingPage.
 * @lastUpdated 2025-10-03
 */
"use client"
import { LandingPage } from "@/components/landing-page"

/**
 * @overview HomePage component serves as the root page for the application.
 * It primarily renders the `LandingPage` component, acting as a container for the application's entry point.
 * 
 * @returns {JSX.Element} The LandingPage component.
 */
export default function HomePage() {
  return <LandingPage />
}
