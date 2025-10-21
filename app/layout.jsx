/**
 * @file app/layout.jsx
 * @author Anshi 
 * @description Root layout component for the RGB Image Rescaler application.
 * @lastUpdated 2025-10-21
 */

import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import ClientLayout from "./ClientLayout"
import { Icon } from "lucide-react"

export const metadata = {
  title: "RGB Image Rescaler",
  description: "Resize and optimize RGB images with ease.",
  icons: {
    icon: "/logo.png", 
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.className} ${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
