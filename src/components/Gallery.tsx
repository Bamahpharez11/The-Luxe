'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

const galleryItems = [
  { src: '/images/signature-luxe-breakfast-tray.png', label: 'Signature Luxe Breakfast Tray' },
  { src: '/images/date-night-dessert-box.png', label: 'Date Night Dessert Box' },
  { src: '/images/girls-night-sweets-box.png', label: "Girls' Night Sweets Box" },
  { src: '/images/luxe-duo-brunch.png', label: 'Luxe Duo Brunch' },
  { src: '/images/sweet-tooth-luxe-box.png', label: 'Sweet Tooth Luxe Box' },
  { src: '/images/executive-brunch-box.png', label: 'Executive Brunch Box' },
  { src: '/images/signature-dessert-tray.png', label: 'Signature Dessert Tray' },
  { src: '/images/indulgence-box.png', label: 'Pink Indulgence Box' },
  { src: '/images/mini-luxe-breakfast.png', label: 'Mini Luxe Breakfast' },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState<null | typeof galleryItems[0]>(null)

  return (
    <section id="gallery" className="py-28 lg:py-36" style={{ background: '#fdfbf7' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="h-px w-10" style={{ background: '#c9891d' }} />
              <span
                className="text-[#c9891d] tracking-[0.3em] uppercase text-xs"
                style={{ fontFamily: 'var(--font-jost)' }}
              >
                The Gallery
              </span>
            </div>
            <h2
              className="text-[#1a1209]"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              Crafted to{' '}
              <em
                className="font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #c9891d, #e8bf5e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Impress
              </em>
            </h2>
          </div>
          <a
            href="https://instagram.com/theluxeconfectionery"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs tracking-widest uppercase transition-colors duration-300 hover:text-[#c9891d]"
            style={{ fontFamily: 'var(--font-jost)', color: '#a0785a', letterSpacing: '0.14em' }}
          >
            📸 @theluxeconfectionery
          </a>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 lg:gap-4">
          {galleryItems.map((item, i) => (
            <div
              key={item.src}
              className={`relative overflow-hidden cursor-pointer group ${
                i === 0 || i === 6 ? 'row-span-2' : ''
              }`}
              style={{
                aspectRatio: i === 0 || i === 6 ? '4/5' : '4/3',
                border: '1px solid rgba(201,137,29,0.1)',
              }}
              onClick={() => setLightbox(item)}
            >
              <Image
                src={item.src}
                alt={item.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: 'linear-gradient(to top, rgba(26,18,9,0.85) 0%, transparent 60%)' }}
              >
                <span
                  className="text-white text-sm font-light"
                  style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem' }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(26,18,9,0.95)', backdropFilter: 'blur(12px)' }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={28} strokeWidth={1.5} />
          </button>
          <div
            className="relative max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.label}
              width={1200}
              height={900}
              className="w-full h-auto object-contain"
            />
            <div
              className="absolute bottom-0 left-0 right-0 p-6"
              style={{ background: 'linear-gradient(to top, rgba(26,18,9,0.9), transparent)' }}
            >
              <p
                className="text-white text-xl font-light"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {lightbox.label}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
