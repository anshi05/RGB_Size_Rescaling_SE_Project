import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import ClientLayout from "./ClientLayout"

export const metadata = {
  title: "RGB Image Rescaler",
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
