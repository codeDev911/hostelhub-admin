import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  weight: ["400", "700"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["400"],
})

const fontVariables = `${geist.variable} ${geistMono.variable}`

export { fontVariables }
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes"

 
export const metadata: Metadata = {
  title: "Admin panel for hostels",
  description:"Manage Rooms, Students, Payments and bookings all in one place",
   
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
        <ThemeProvider  attribute={"class"} defaultTheme="dark">
       <body className={`font-sans antialiased`}>
        {children}
        <Toaster position="top-center" theme="system"  richColors closeButton/>
        <Analytics />
      </body>
     </ThemeProvider>
    </html>
  )
}
