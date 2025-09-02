import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fusion Eats - EPOS System',
  description: 'Professional offline point of sale system for restaurants',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500">
        {children}
      </body>
    </html>
  )
}