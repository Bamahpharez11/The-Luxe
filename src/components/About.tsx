'use client'

import Image from 'next/image'

const values = [
  {
    icon: '✦',
    title: 'Made Fresh to Order',
    desc: 'Every box is handcrafted upon ordering. Nothing pre-made, nothing rushed — only the freshest ingredients prepared with care.',
  },
  {
    icon: '✦',
    title: 'Premium Ingredients',
    desc: 'From Belgian chocolate-dipped strawberries to artisan pastries and hand-selected seasonal fruits — quality is never compromised.',
  },
  {
    icon: '✦',
    title: 'Beautiful Presentation',
    desc: 'Arrive ready to impress. Each box is styled and packaged with the kind of detail that turns a meal into a moment.',
  },
]

export default function About() {
  return (
    <section id="about" className="py-28 lg:py-36 overflow-hidden" style={{ background: '#fdfbf7' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Images */}
          <div className="relative">
            {/* Main image */}
            <div className="relative w-full aspect-[4/5] overflow-hidden shadow-2xl" style={{ borderRadius: '2px' }}>
              <Image
                src="/images/date-night-dessert-box.png"
                alt="Date Night Dessert Box"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              {/* Gold corner accents */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#c9891d]/60" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#c9891d]/60" />
            </div>
            {/* Floating smaller image */}
            <div
              className="absolute -bottom-8 -right-4 lg:-right-10 w-2/5 aspect-square overflow-hidden shadow-2xl border-4 border-[#fdfbf7]"
              style={{ borderRadius: '2px' }}
            >
              <Image
                src="/images/sweet-tooth-luxe-box.png"
                alt="Sweet Tooth Luxe Box"
                fill
                className="object-cover"
              />
            </div>
            {/* Gold badge */}
            <div
              className="absolute -top-4 -left-4 lg:-left-8 w-24 h-24 flex flex-col items-center justify-center text-center shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #c9891d, #e8bf5e)',
                borderRadius: '50%',
              }}
            >
              <span className="text-[#1a1209] text-xs font-bold tracking-wide leading-tight" style={{ fontFamily: 'var(--font-jost)' }}>
                MADE<br />FRESH<br />DAILY
              </span>
            </div>
          </div>

          {/* Right — Text */}
          <div className="lg:pl-8">
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-10" style={{ background: 'linear-gradient(to right, #c9891d, transparent)' }} />
              <span
                className="text-[#c9891d] tracking-[0.3em] uppercase text-xs"
                style={{ fontFamily: 'var(--font-jost)' }}
              >
                Our Story
              </span>
            </div>

            <h2
              className="mb-6 text-[#1a1209]"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(2.4rem, 4vw, 3.5rem)',
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              Crafted for Every<br />
              <em
                className="font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #c9891d, #e8bf5e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Unforgettable Moment
              </em>
            </h2>

            <p
              className="text-[#5c4020]/70 mb-4 leading-relaxed"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: '1.02rem' }}
            >
              The Luxe Confectionery was born from a simple belief: that beautiful, 
              delicious food should feel personal. Based in Woodbridge, Virginia, we 
              create handcrafted breakfast boxes and dessert trays that go beyond a meal — 
              they&apos;re gifts, gestures, and memories.
            </p>
            <p
              className="text-[#5c4020]/70 mb-10 leading-relaxed"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: '1.02rem' }}
            >
              Whether you&apos;re celebrating a birthday, planning a brunch date, or simply 
              treating yourself — every box is assembled with intention, care, and a lot of love.
            </p>

            {/* Values */}
            <div className="space-y-5">
              {values.map((v) => (
                <div key={v.title} className="flex gap-4 group">
                  <span
                    className="text-[#c9891d] mt-1 text-xs flex-shrink-0"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    {v.icon}
                  </span>
                  <div>
                    <h4
                      className="text-[#1a1209] font-medium mb-0.5"
                      style={{ fontFamily: 'var(--font-jost)', fontSize: '0.9rem', letterSpacing: '0.03em' }}
                    >
                      {v.title}
                    </h4>
                    <p
                      className="text-[#5c4020]/60 text-sm leading-relaxed"
                      style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
                    >
                      {v.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="mt-10 pt-8 border-t border-[#c9891d]/15 flex flex-wrap gap-8 text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-jost)', color: '#a0785a' }}>
              <span>📍 Woodbridge, Virginia</span>
              <span>📞 571.580.3998</span>
              <span>📸 @theluxeconfectionery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
