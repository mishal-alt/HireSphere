import ToasterClient from "@/components/ToasterClient"
import { GoogleOAuthProvider } from '@react-oauth/google'
import QueryProvider from "@/providers/QueryProvider"
import NotificationListener from "@/components/NotificationListener"
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakarta.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased selection:bg-primary/30">
        <GoogleOAuthProvider clientId={googleClientId}>
          <QueryProvider>
            <ToasterClient />
            <NotificationListener />
            <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay bg-noise"></div>
            {children}
          </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
