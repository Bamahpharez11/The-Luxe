'use client'

import { useState } from 'react'
import { menuItems, addOns } from '@/lib/menu-data'

type OrderType = 'pickup' | 'delivery'
type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function Order() {
  const [orderType, setOrderType] = useState<OrderType>('pickup')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [confirmedOrder, setConfirmedOrder] = useState<{ id: string; total: number } | null>(null)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [form, setForm] = useState({
    name: '', phone: '', email: '', deliveryAddress: '', item: '', date: '', notes: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const toggleAddOn = (name: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    )
  }

  // Calculate live total
  const selectedItem = menuItems.find((m) => m.id === form.item)
  const addOnTotal = selectedAddOns.reduce((sum, a) => {
    const found = addOns.find((ao) => ao.name === a)
    return sum + (found?.price ?? 0)
  }, 0)
  const itemPrice = selectedItem?.price ?? 0
  const total = (itemPrice + addOnTotal) * quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.item || !form.name || !form.phone || !form.date) return

    setFormState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          itemName:  selectedItem?.name ?? '',
          itemPrice: selectedItem?.price ?? 0,
          addOns:    selectedAddOns,
          quantity,
          orderType,
          total,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const msg = data.details
          ? Object.values(data.details).flat().join(', ')
          : data.error ?? 'Something went wrong'
        setErrorMsg(msg)
        setFormState('error')
        return
      }

      setConfirmedOrder({ id: data.order.id, total: data.order.total })
      setFormState('success')
    } catch {
      setErrorMsg('Network error — please try again or call us directly.')
      setFormState('error')
    }
  }

  return (
    <section id="order" style={{ background: '#fdfbf7', paddingTop: '7rem', paddingBottom: '7rem' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, #c9891d)' }} />
            <span className="text-[#c9891d] tracking-[0.35em] uppercase text-xs" style={{ fontFamily: 'var(--font-jost)' }}>
              Order
            </span>
            <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, #c9891d)' }} />
          </div>
          <h2 className="text-[#1a1209]" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 400, lineHeight: 1.1 }}>
            Ready to{' '}
            <em className="font-semibold" style={{ background: 'linear-gradient(135deg, #c9891d, #e8bf5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Indulge?
            </em>
          </h2>
          <p className="text-[#5c4020]/60 mt-3 max-w-md mx-auto" style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: '0.95rem' }}>
            Fill out the form and we&apos;ll confirm your order within 24 hours. Every box made fresh.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
          {/* ── FORM ── */}
          <div className="lg:col-span-3">
            <div className="p-8 lg:p-10" style={{ background: '#1a1209', border: '1px solid rgba(201,137,29,0.2)' }}>
              <h3 className="text-white mb-6" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', fontWeight: 400 }}>
                Place Your Order
              </h3>

              {/* ── SUCCESS ── */}
              {formState === 'success' && confirmedOrder ? (
                <div className="py-10 text-center" style={{ border: '1px solid rgba(232,191,94,0.3)' }}>
                  <div className="text-4xl mb-3" style={{ fontFamily: 'var(--font-cormorant)', background: 'linear-gradient(135deg, #e8bf5e, #c9891d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    ✦ Order Received ✦
                  </div>
                  <p className="text-white font-semibold mb-1" style={{ fontFamily: 'var(--font-jost)' }}>
                    Order #{confirmedOrder.id}
                  </p>
                  <p className="text-[#e8bf5e] mb-3" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem' }}>
                    Total: ${confirmedOrder.total}
                  </p>
                  <p className="text-white/50 text-sm mb-6" style={{ fontFamily: 'var(--font-jost)' }}>
                    We&apos;ll call you within 24 hours to confirm. Thank you for supporting our small business! ♡
                  </p>
                  <button
                    onClick={() => { setFormState('idle'); setConfirmedOrder(null); setForm({ name:'', phone:'', email:'', item:'', date:'', notes:'' }); setSelectedAddOns([]); setQuantity(1) }}
                    className="px-6 py-2.5 text-xs tracking-widest uppercase"
                    style={{ background: 'linear-gradient(135deg, #e8bf5e, #c9891d)', color: '#1a1209', fontFamily: 'var(--font-jost)', fontWeight: 600, letterSpacing: '0.14em' }}
                  >
                    Place Another Order
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name + Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-jost)' }}>Your Name *</label>
                      <input type="text" name="name" required value={form.name} onChange={handleChange}
                        placeholder="e.g. Sarah Johnson"
                        className="w-full px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-jost)' }}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(201,137,29,0.6)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-jost)' }}>Phone *</label>
                      <input type="tel" name="phone" required value={form.phone} onChange={handleChange}
                        placeholder="571-XXX-XXXX"
                        className="w-full px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-jost)' }}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(201,137,29,0.6)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-jost)' }}>Email (optional)</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="for order confirmation"
                      className="w-full px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none transition-colors"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-jost)' }}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(201,137,29,0.6)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>

                  {/* Box Select */}
                  <div>
                    <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-jost)' }}>Select Your Box *</label>
                    <select name="item" required value={form.item} onChange={handleChange}
                      className="w-full px-4 py-3 text-white text-sm focus:outline-none transition-colors"
                      style={{ background: '#231808', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-jost)' }}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(201,137,29,0.6)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                    >
                      <option value="" style={{ background: '#231808' }}>— Choose your box —</option>
                      <optgroup label="── Breakfast Collection ──" style={{ background: '#231808' }}>
                        {menuItems.filter(m => m.category === 'breakfast').map(m => (
                          <option key={m.id} value={m.id} style={{ background: '#231808' }}>
                            {m.name} — {m.priceNote ?? `$${m.price}`}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="── Dessert Collection ──" style={{ background: '#231808' }}>
                        {menuItems.filter(m => m.category === 'dessert').map(m => (
                          <option key={m.id} value={m.id} style={{ background: '#231808' }}>
                            {m.name} — {m.priceNote ?? `$${m.price}`}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Add-Ons */}
                  <div>
                    <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-jost)' }}>Add-Ons</label>
                    <div className="flex flex-wrap gap-2">
                      {addOns.map(ao => (
                        <button key={ao.name} type="button" onClick={() => toggleAddOn(ao.name)}
                          className="px-3 py-1.5 text-xs transition-all duration-200"
                          style={{
                            fontFamily: 'var(--font-jost)',
                            background: selectedAddOns.includes(ao.name) ? 'linear-gradient(135deg, #e8bf5e, #c9891d)' : 'rgba(255,255,255,0.05)',
                            border: selectedAddOns.includes(ao.name) ? 'none' : '1px solid rgba(255,255,255,0.1)',
                            color: selectedAddOns.includes(ao.name) ? '#1a1209' : 'rgba(255,255,255,0.5)',
                            fontWeight: selectedAddOns.includes(ao.name) ? 600 : 400,
                          }}
                        >
                          {ao.name} +${ao.price}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity + Date */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-jost)' }}>Quantity</label>
                      <div className="flex items-center gap-0" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>
                        <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="w-10 h-11 text-white/60 hover:text-white hover:bg-white/10 text-xl transition-colors flex items-center justify-center">−</button>
                        <span className="flex-1 text-center text-white text-sm font-medium" style={{ fontFamily: 'var(--font-jost)' }}>{quantity}</span>
                        <button type="button" onClick={() => setQuantity(q => Math.min(20, q + 1))}
                          className="w-10 h-11 text-white/60 hover:text-white hover:bg-white/10 text-xl transition-colors flex items-center justify-center">+</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-jost)' }}>Requested Date *</label>
                      <input type="date" name="date" required value={form.date} onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 text-white text-sm focus:outline-none transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-jost)', colorScheme: 'dark' }}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(201,137,29,0.6)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  </div>

                  {/* Order type toggle */}
                  <div>
                    <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-jost)' }}>Order Type</label>
                    <div className="flex gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {(['pickup', 'delivery'] as const).map(t => (
                        <button key={t} type="button" onClick={() => setOrderType(t)}
                          className="flex-1 py-3 text-xs tracking-widest uppercase font-medium transition-all duration-300"
                          style={{ fontFamily: 'var(--font-jost)', letterSpacing: '0.12em', background: orderType === t ? 'linear-gradient(135deg, #e8bf5e, #c9891d)' : 'transparent', color: orderType === t ? '#1a1209' : 'rgba(255,255,255,0.4)' }}>
                          {t === 'pickup' ? '🏃 Pickup' : '🛵 Delivery'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {orderType === 'delivery' && (
                    <div className="animate-fade-in">
                      <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-jost)' }}>Delivery Address *</label>
                      <input type="text" name="deliveryAddress" required value={form.deliveryAddress} onChange={handleChange}
                        placeholder="Street address, city, zip code"
                        className="w-full px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-jost)' }}
                        onFocus={e => e.currentTarget.style.borderColor = 'rgba(201,137,29,0.6)'}
                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-white/50 text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-jost)' }}>Special Notes</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                      placeholder="Allergies, customisations, occasion details..."
                      className="w-full px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none transition-colors resize-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-jost)' }}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(201,137,29,0.6)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>

                  {/* Live Total */}
                  {selectedItem && (
                    <div className="flex items-center justify-between py-3 px-4" style={{ background: 'rgba(201,137,29,0.08)', border: '1px solid rgba(201,137,29,0.2)' }}>
                      <span className="text-white/60 text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-jost)' }}>
                        {quantity > 1 ? `${quantity}× ${selectedItem.name}` : selectedItem.name}
                        {selectedAddOns.length > 0 && ` + ${selectedAddOns.length} add-on${selectedAddOns.length > 1 ? 's' : ''}`}
                      </span>
                      <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', fontWeight: 600, background: 'linear-gradient(135deg, #e8bf5e, #c9891d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        ${total}
                      </span>
                    </div>
                  )}

                  {/* Error */}
                  {formState === 'error' && (
                    <div className="px-4 py-3 text-sm text-red-300" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', fontFamily: 'var(--font-jost)' }}>
                      ⚠ {errorMsg}
                    </div>
                  )}

                  <button type="submit" disabled={formState === 'loading'}
                    className="w-full py-4 text-[#1a1209] font-semibold text-xs tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #e8bf5e 0%, #c9891d 100%)', fontFamily: 'var(--font-jost)', letterSpacing: '0.16em', boxShadow: '0 8px 32px rgba(201,137,29,0.3)' }}>
                    {formState === 'loading' ? 'Submitting…' : 'Place Order →'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Contact */}
            <div className="p-7" style={{ background: '#faf5eb', border: '1px solid rgba(201,137,29,0.2)' }}>
              <h4 className="mb-5 text-[#1a1209]" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.3rem', fontWeight: 500 }}>Get in Touch</h4>
              <div className="space-y-4 text-sm" style={{ fontFamily: 'var(--font-jost)' }}>
                {[
                  { icon: '📍', label: 'Location', value: 'Woodbridge, Virginia' },
                  { icon: '📞', label: 'Phone', value: '571.580.3998', href: 'tel:5715803998' },
                  { icon: '📸', label: 'Instagram', value: '@theluxeconfectionery', href: 'https://instagram.com/theluxeconfectionery' },
                ].map(c => (
                  <div key={c.label} className="flex items-start gap-3">
                    <span className="mt-0.5">{c.icon}</span>
                    <div>
                      <span className="text-[#a0785a] text-xs tracking-widest uppercase block mb-0.5">{c.label}</span>
                      {c.href
                        ? <a href={c.href} className="text-[#1a1209] font-medium hover:text-[#c9891d] transition-colors">{c.value}</a>
                        : <span className="text-[#1a1209] font-medium">{c.value}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Love note */}
            <div className="p-7" style={{ background: 'linear-gradient(135deg, #1a1209, #2e2010)', border: '1px solid rgba(201,137,29,0.2)' }}>
              <div className="text-3xl mb-3" style={{ fontFamily: 'var(--font-cormorant)', background: 'linear-gradient(135deg, #e8bf5e, #c9891d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>♡</div>
              <h4 className="text-white mb-2" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.2rem', fontWeight: 400 }}>Every Box is Made with Love</h4>
              <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}>
                Thank you for supporting our small business. Your order means everything — we&apos;ll make sure it&apos;s absolutely worth it.
              </p>
            </div>

            {/* Perfect for */}
            <div className="p-7" style={{ background: '#faf5eb', border: '1px solid rgba(201,137,29,0.2)' }}>
              <h4 className="text-[#a0785a] text-xs tracking-widest uppercase mb-3" style={{ fontFamily: 'var(--font-jost)', letterSpacing: '0.2em' }}>Perfect for</h4>
              <div className="flex flex-wrap gap-2">
                {['Gifts', 'Brunch Dates', 'Self-Care', 'Birthdays', 'Anniversaries', 'Celebrations', "Girls' Night"].map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs" style={{ background: 'rgba(201,137,29,0.1)', border: '1px solid rgba(201,137,29,0.25)', color: '#a96b14', fontFamily: 'var(--font-jost)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
