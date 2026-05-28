import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: '#0e0b05', borderTop: '1px solid rgba(201,137,29,0.15)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16 mb-12 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Brand */}
          <div>
            <div className="mb-4 leading-none">
              <span
                className="block text-[#c9891d] text-xs tracking-[0.35em] uppercase font-light mb-0.5"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                The
              </span>
              <span
                className="block text-white text-3xl font-light tracking-wider"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                Luxe{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #e8bf5e, #c9891d)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Confectionery
                </span>
              </span>
            </div>
            <p
              className="text-white/40 text-sm leading-relaxed mb-5 max-w-xs"
              style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
            >
              Premium breakfast boxes & dessert trays made fresh to order in Woodbridge, Virginia.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { label: 'Instagram', href: 'https://instagram.com/theluxeconfectionery', icon: '📸' },
                { label: 'Phone', href: 'tel:5715803998', icon: '📞' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-10 h-10 flex items-center justify-center text-sm border border-white/10 text-white/50 hover:border-[#c9891d]/60 hover:text-[#e8bf5e] transition-all duration-300"
                  title={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Menu Links */}
          <div>
            <h5
              className="text-white/60 text-xs tracking-[0.25em] uppercase mb-5"
              style={{ fontFamily: 'var(--font-jost)' }}
            >
              Navigate
            </h5>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '#about' },
                { label: 'Breakfast Collection', href: '#menu' },
                { label: 'Dessert Collection', href: '#menu' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Order Now', href: '#order' },
                { label: 'Admin Dashboard', href: '/admin' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-white/40 hover:text-[#e8bf5e] transition-colors duration-300 text-sm"
                    style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5
              className="text-white/60 text-xs tracking-[0.25em] uppercase mb-5"
              style={{ fontFamily: 'var(--font-jost)' }}
            >
              Contact
            </h5>
            <div className="space-y-4 text-sm" style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}>
              <div>
                <div className="text-white/25 text-xs mb-1 tracking-widest uppercase">Location</div>
                <div className="text-white/60">Woodbridge, Virginia</div>
              </div>
              <div>
                <div className="text-white/25 text-xs mb-1 tracking-widest uppercase">Phone</div>
                <a href="tel:5715803998" className="text-white/60 hover:text-[#e8bf5e] transition-colors">571.580.3998</a>
              </div>
              <div>
                <div className="text-white/25 text-xs mb-1 tracking-widest uppercase">Instagram</div>
                <a href="https://instagram.com/theluxeconfectionery" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#e8bf5e] transition-colors">
                  @theluxeconfectionery
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-white/25 text-xs"
            style={{ fontFamily: 'var(--font-jost)', letterSpacing: '0.05em' }}
          >
            © {year} The Luxe Confectionery. All rights reserved.
          </p>
          <p
            className="text-white/20 text-xs flex items-center gap-1"
            style={{ fontFamily: 'var(--font-jost)' }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #e8bf5e, #c9891d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ♡
            </span>
            Every Box is Made with Love
          </p>
        </div>
      </div>
    </footer>
  )
}
