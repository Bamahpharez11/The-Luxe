'use client'

import Image from 'next/image'

const features = [
  {
    number: '01',
    title: 'Made Fresh to Order',
    body: 'Zero pre-made items. Your box begins the moment you place your order — every element assembled, styled, and packaged with intention.',
  },
  {
    number: '02',
    title: 'Premium Ingredients',
    body: 'Belgian chocolate, seasonal fruits, artisan pastries. We source only the finest because you deserve nothing less.',
  },
  {
    number: '03',
    title: 'Beautiful Presentation',
    body: 'Arrive as a gift. Each box is styled to turn heads and photographed to inspire — your moment, perfected.',
  },
  {
    number: '04',
    title: 'Perfect for Any Occasion',
    body: 'Gifts, brunch dates, self-care rituals, birthdays, anniversaries, or simply treating yourself on a Tuesday.',
  },
]

export default function Features() {
  return (
    <section
      className="relative py-28 lg:py-36 overflow-hidden"
      style={{ background: '#1a1209' }}
    >
      {/* Decorative background image */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/images/girls-night-sweets-box.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, #c9891d)' }} />
            <span
              className="text-[#c9891d] tracking-[0.35em] uppercase text-xs"
              style={{ fontFamily: 'var(--font-jost)' }}
            >
              Why Choose Us
            </span>
            <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, #c9891d)' }} />
          </div>
          <h2
            className="text-white"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 300,
              lineHeight: 1.1,
            }}
          >
            The Luxe{' '}
            <em
              style={{
                background: 'linear-gradient(135deg, #e8bf5e, #c9891d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 600,
              }}
            >
              Difference
            </em>
          </h2>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(201,137,29,0.15)' }}>
          {features.map((f, i) => (
            <div
              key={f.number}
              className="p-8 group hover:bg-[#c9891d]/10 transition-colors duration-500"
              style={{ background: '#1a1209' }}
            >
              <div
                className="mb-6"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '3.5rem',
                  fontWeight: 300,
                  lineHeight: 1,
                  background: 'linear-gradient(135deg, #c9891d20 0%, #e8bf5e30 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {f.number}
              </div>
              <div
                className="w-8 h-px mb-5"
                style={{ background: 'linear-gradient(to right, #c9891d, transparent)' }}
              />
              <h3
                className="text-white mb-3"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '1.35rem',
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              >
                {f.title}
              </h3>
              <p
                className="text-white/45 text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
              >
                {f.body}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div
          className="mt-16 p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6"
          style={{
            background: 'linear-gradient(135deg, rgba(201,137,29,0.1) 0%, rgba(232,191,94,0.05) 100%)',
            border: '1px solid rgba(201,137,29,0.2)',
          }}
        >
          <div>
            <p
              className="text-white/60 text-xs tracking-widest uppercase mb-1"
              style={{ fontFamily: 'var(--font-jost)' }}
            >
              The Luxe Confectionery
            </p>
            <h3
              className="text-white"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                fontWeight: 400,
              }}
            >
              Perfect for: Gifts · Brunch Dates · Self-Care · Celebrations
            </h3>
          </div>
          <a
            href="#order"
            className="flex-shrink-0 px-8 py-4 text-[#1a1209] font-semibold text-xs tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #e8bf5e 0%, #c9891d 100%)',
              fontFamily: 'var(--font-jost)',
              letterSpacing: '0.14em',
              boxShadow: '0 8px 32px rgba(201,137,29,0.3)',
              whiteSpace: 'nowrap',
            }}
          >
            Place an Order
          </a>
        </div>
      </div>
    </section>
  )
}
