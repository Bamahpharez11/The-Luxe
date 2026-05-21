'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = titleRef.current
    if (el) {
      el.style.opacity = '0'
      el.style.transform = 'translateY(30px)'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'opacity 1.2s ease, transform 1.2s ease'
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        })
      })
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/signature-luxe-breakfast-tray.png"
          alt="Luxe Breakfast Tray"
          fill
          className="object-cover object-center scale-105"
          priority
          quality={90}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(26,18,9,0.92) 0%, rgba(26,18,9,0.72) 45%, rgba(26,18,9,0.55) 100%)',
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: 'linear-gradient(to top, #fdfbf7, transparent)' }}
        />
      </div>

      {/* Decorative line left */}
      <div
        className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 w-px h-48 opacity-30"
        style={{ background: 'linear-gradient(to bottom, transparent, #e8bf5e, transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-8" style={{ animationDelay: '0.2s' }}>
            <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, #c9891d)' }} />
            <span
              className="text-[#c9891d] tracking-[0.35em] uppercase text-xs font-medium"
              style={{ fontFamily: 'var(--font-jost)' }}
            >
              Woodbridge, Virginia
            </span>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="mb-6 text-white"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(3.5rem, 8vw, 7rem)',
              fontWeight: 300,
              lineHeight: 1.0,
              letterSpacing: '-0.01em',
            }}
          >
            Every Box is<br />
            <em
              className="font-semibold"
              style={{
                background: 'linear-gradient(135deg, #e8bf5e 0%, #c9891d 60%, #f2d89a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Made with Love
            </em>
          </h1>

          {/* Sub */}
          <p
            className="text-white/65 mb-10 leading-relaxed max-w-xl"
            style={{ fontFamily: 'var(--font-jost)', fontSize: '1.05rem', fontWeight: 300 }}
          >
            Premium breakfast boxes & dessert trays crafted fresh to order.
            Beautiful presentation. Unforgettable experience. 
            Perfect for gifts, brunch dates, self-care & celebrations.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="#menu"
              className="px-8 py-4 text-[#1a1209] font-semibold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #e8bf5e 0%, #c9891d 100%)',
                fontFamily: 'var(--font-jost)',
                letterSpacing: '0.14em',
                boxShadow: '0 8px 32px rgba(201,137,29,0.4)',
              }}
            >
              View Menu
            </Link>
            <Link
              href="#order"
              className="px-8 py-4 border border-white/30 text-white text-sm tracking-widest uppercase hover:bg-white/10 transition-all duration-300"
              style={{ fontFamily: 'var(--font-jost)', letterSpacing: '0.14em' }}
            >
              Order Now
            </Link>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10">
            {[
              { num: 'Fresh', label: 'Made to Order' },
              { num: '10+', label: 'Signature Boxes' },
              { num: '100%', label: 'Premium Quality' },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-2xl font-semibold"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    background: 'linear-gradient(135deg, #e8bf5e, #c9891d)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {s.num}
                </div>
                <div
                  className="text-white/50 text-xs tracking-widest uppercase mt-0.5"
                  style={{ fontFamily: 'var(--font-jost)' }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 lg:right-12 flex flex-col items-center gap-2 opacity-40">
        <span
          className="text-white text-xs tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-jost)', writingMode: 'vertical-lr' }}
        >
          Scroll
        </span>
        <div
          className="w-px h-12"
          style={{
            background: 'linear-gradient(to bottom, #e8bf5e, transparent)',
            animation: 'pulse 2s infinite',
          }}
        />
      </div>
    </section>
  )
}
