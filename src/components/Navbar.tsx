'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Menu', href: '/#menu' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Order', href: '/#order' },
  { label: 'Track Order', href: '/track' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#1a1209]/95 backdrop-blur-md shadow-2xl border-b border-[#c9891d]/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image 
              src="/images/logo.jpg" 
              alt="The Luxe Confectionery Logo" 
              width={160} 
              height={50} 
              className="object-cover h-[50px] w-auto rounded shadow-sm transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/80 hover:text-[#e8bf5e] transition-colors duration-300 text-sm tracking-widest uppercase font-body"
                  style={{ fontFamily: 'var(--font-jost)', fontSize: '0.7rem', letterSpacing: '0.15em' }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="tel:5715803998"
              className="hidden md:flex items-center gap-2 text-[#e8bf5e] text-sm font-medium hover:text-white transition-colors duration-300"
              style={{ fontFamily: 'var(--font-jost)' }}
            >
              <Phone size={14} strokeWidth={1.5} />
              571.580.3998
            </a>
            <Link
              href="#order"
              className="hidden md:block px-5 py-2.5 text-xs tracking-widest uppercase font-semibold text-[#1a1209] transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #e8bf5e 0%, #c9891d 100%)',
                fontFamily: 'var(--font-jost)',
                letterSpacing: '0.12em',
              }}
            >
              Order Now
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(26,18,9,0.98)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-10">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-white/90 hover:text-[#e8bf5e] transition-colors"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '2.5rem',
                fontWeight: 300,
                letterSpacing: '0.05em',
                animationDelay: `${i * 80}ms`,
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="tel:5715803998"
            className="mt-4 text-[#c9891d] text-sm tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-jost)' }}
          >
            571.580.3998
          </a>
        </div>
      </div>
    </>
  )
}
