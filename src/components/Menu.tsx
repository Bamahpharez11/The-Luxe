'use client'

import { useState } from 'react'
import Image from 'next/image'
import { menuItems, addOns, type Category } from '@/lib/menu-data'

type Filter = 'all' | Category

export default function Menu() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = filter === 'all' ? menuItems : menuItems.filter((m) => m.category === filter)

  return (
    <section id="menu" style={{ background: '#1a1209', paddingTop: '7rem', paddingBottom: '7rem' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, #c9891d)' }} />
            <span
              className="text-[#c9891d] tracking-[0.35em] uppercase text-xs"
              style={{ fontFamily: 'var(--font-jost)' }}
            >
              Our Menu
            </span>
            <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, #c9891d)' }} />
          </div>
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 300,
              lineHeight: 1.1,
            }}
          >
            Handcrafted{' '}
            <em
              style={{
                background: 'linear-gradient(135deg, #e8bf5e 0%, #c9891d 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 600,
              }}
            >
              Collections
            </em>
          </h2>
          <p
            className="text-white/50 max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: '0.95rem' }}
          >
            Every box is made fresh to order with premium ingredients and beautiful presentation.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {(['all', 'breakfast', 'dessert'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-6 py-2.5 text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                fontFamily: 'var(--font-jost)',
                letterSpacing: '0.14em',
                background:
                  filter === f
                    ? 'linear-gradient(135deg, #e8bf5e 0%, #c9891d 100%)'
                    : 'transparent',
                color: filter === f ? '#1a1209' : 'rgba(255,255,255,0.5)',
                border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.15)',
                fontWeight: filter === f ? 600 : 400,
              }}
            >
              {f === 'all' ? 'All Boxes' : f === 'breakfast' ? 'Breakfast' : 'Desserts'}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden cursor-pointer transition-all duration-500"
              style={{
                background: '#231808',
                border: '1px solid rgba(201,137,29,0.15)',
              }}
            >
              {/* Tag */}
              {item.tag && (
                <div
                  className="absolute top-3 left-3 z-10 px-3 py-1 text-xs font-semibold tracking-widest uppercase"
                  style={{
                    background: 'linear-gradient(135deg, #c9891d, #e8bf5e)',
                    color: '#1a1209',
                    fontFamily: 'var(--font-jost)',
                    letterSpacing: '0.1em',
                    fontSize: '0.6rem',
                  }}
                >
                  {item.tag}
                </div>
              )}

              {/* Image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                  style={{ transform: 'scale(1)', transition: 'transform 0.7s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                {/* Dark overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'rgba(26,18,9,0.7)' }}
                />
                {/* Hover content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <p
                    className="text-white/90 text-xs leading-relaxed"
                    style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
                  >
                    <span className="text-[#e8bf5e] font-medium block mb-1">Includes:</span>
                    {item.includes.slice(0, 5).join(' · ')}
                    {item.includes.length > 5 && ` + ${item.includes.length - 5} more`}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <h3
                  className="text-white mb-1"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.15rem',
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                  }}
                >
                  {item.name}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <span
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #e8bf5e, #c9891d)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {item.priceNote ?? `$${item.price}`}
                  </span>
                  {item.category === 'dessert' ? (
                    <span
                      className="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.5)',
                        fontFamily: 'var(--font-jost)',
                        letterSpacing: '0.1em',
                        fontSize: '0.62rem',
                        cursor: 'not-allowed',
                      }}
                    >
                      Coming Soon
                    </span>
                  ) : (
                    <a
                      href="#order"
                      className="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #e8bf5e 0%, #c9891d 100%)',
                        color: '#1a1209',
                        fontFamily: 'var(--font-jost)',
                        letterSpacing: '0.1em',
                        fontSize: '0.62rem',
                      }}
                    >
                      Order
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="text-center mb-8">
            <h3
              className="text-white mb-1"
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontWeight: 400 }}
            >
              Add-<em style={{ color: '#e8bf5e' }}>Ons</em>
            </h3>
            <p className="text-white/40 text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-jost)' }}>
              Customise your box
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {addOns.map((a) => (
              <div
                key={a.name}
                className="px-5 py-3 text-center transition-all duration-300 hover:border-[#c9891d]/60"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  minWidth: '130px',
                }}
              >
                <span
                  className="block text-white text-sm font-medium"
                  style={{ fontFamily: 'var(--font-jost)' }}
                >
                  {a.name}
                </span>
                {a.description && (
                  <span
                    className="block text-white/40 text-xs mt-0.5"
                    style={{ fontFamily: 'var(--font-jost)' }}
                  >
                    {a.description}
                  </span>
                )}
                <span
                  className="block mt-1 font-semibold"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.1rem',
                    background: 'linear-gradient(135deg, #e8bf5e, #c9891d)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  +${a.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
