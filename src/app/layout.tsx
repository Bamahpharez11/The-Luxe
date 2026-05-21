import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Luxe Confectionery — Woodbridge, Virginia',
  description: 'Premium breakfast boxes & dessert trays made fresh to order. Beautiful presentation. Unforgettable experience.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="grain">{children}</body>
    </html>
  )
}
