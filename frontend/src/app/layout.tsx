import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ToasterClient from "@/components/ToasterClient"
import { GoogleOAuthProvider } from '@react-oauth/google'
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Syne:wght@400..800&family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-primary/30">
        <GoogleOAuthProvider clientId={googleClientId}>
          <ToasterClient />
          <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay bg-noise"></div>
          <Navbar />
          {children}
          <Footer />
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}