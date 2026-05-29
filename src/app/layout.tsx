import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Luxe Confectionery — Woodbridge, Virginia',
  description: 'Premium breakfast boxes & dessert trays made fresh to order. Beautiful presentation. Unforgettable experience in Woodbridge, VA.',
  keywords: ['bakery', 'confectionery', 'breakfast boxes', 'dessert trays', 'Woodbridge', 'Virginia', 'custom cakes', 'pastries', 'gifts', 'The Luxe Confectionery'],
  openGraph: {
    title: 'The Luxe Confectionery',
    description: 'Premium breakfast boxes & dessert trays made fresh to order in Woodbridge, VA.',
    type: 'website',
    locale: 'en_US',
    siteName: 'The Luxe Confectionery',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'googled5811edafd888ffc.html', // We add both formats just in case
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="grain">
        {/* Local Business JSON-LD Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Bakery",
              "name": "The Luxe Confectionery",
              "image": "https://luxeconfectionery.com/images/signature-luxe-breakfast-tray.png",
              "@id": "https://luxeconfectionery.com",
              "url": "https://luxeconfectionery.com",
              "telephone": "571-580-3998",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Woodbridge",
                "addressRegion": "VA",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 38.6582,
                "longitude": -77.2497
              },
              "priceRange": "$$",
              "servesCuisine": "Desserts, Breakfast, Pastries"
            })
          }}
        />
        {children}
      </body>
    </html>
  )
}
