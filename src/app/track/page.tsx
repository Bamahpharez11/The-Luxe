'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'

interface TrackedOrder {
  id: string
  status: OrderStatus
  item: string
  itemName: string
  quantity: number
  addOns: string[]
  date: string
  total: number
}

const STATUS_MESSAGES: Record<OrderStatus, { title: string; desc: string; color: string; bg: string }> = {
  pending:   { title: 'Order Received', desc: 'We have received your order and will confirm it shortly.', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  confirmed: { title: 'Order Confirmed', desc: 'Your order has been confirmed and is in our queue.', color: '#60a5fa', bg: 'rgba(59,130,246,0.1)' },
  preparing: { title: 'In the Kitchen', desc: 'We are currently preparing your delicious box!', color: '#c084fc', bg: 'rgba(168,85,247,0.1)' },
  ready:     { title: 'Ready for You', desc: 'Your order is ready for pickup or out for delivery!', color: '#4ade80', bg: 'rgba(34,197,94,0.1)' },
  completed: { title: 'Completed', desc: 'Thank you for choosing The Luxe Confectionery. Enjoy!', color: '#e8bf5e', bg: 'rgba(201,137,29,0.1)' },
  cancelled: { title: 'Cancelled', desc: 'This order has been cancelled.', color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
}

export default function TrackPage() {
  const [orderId, setOrderId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<TrackedOrder | null>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId.trim()) return

    setLoading(true)
    setError('')
    setOrder(null)

    try {
      // The ID should be uppercase to match the standard
      const formattedId = orderId.trim().toUpperCase()
      const res = await fetch(`/api/orders/${formattedId}`)
      
      if (!res.ok) {
        if (res.status === 404) {
          setError('Order not found. Please check the ID and try again.')
        } else {
          setError('An error occurred while fetching your order.')
        }
        return
      }

      const data = await res.json()
      setOrder(data.order)
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fdfbf7] flex flex-col font-body">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center py-32 px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl mb-4 text-[#1a1209]" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Track Your Order
            </h1>
            <p className="text-[#5c4020]/70 text-sm" style={{ fontFamily: 'var(--font-jost)' }}>
              Enter the Order ID you received during checkout to see the live status of your box.
            </p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2 mb-8">
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. TLC-12345" 
              className="flex-1 px-4 py-3 bg-white border border-[#c9891d]/30 focus:outline-none focus:border-[#c9891d] transition-colors uppercase tracking-widest text-sm text-[#1a1209]"
              style={{ fontFamily: 'var(--font-jost)' }}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 bg-[#1a1209] text-[#e8bf5e] uppercase tracking-widest text-xs font-semibold hover:bg-[#2a1d0f] transition-colors disabled:opacity-70"
              style={{ fontFamily: 'var(--font-jost)' }}
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm text-center mb-8" style={{ fontFamily: 'var(--font-jost)' }}>
              {error}
            </div>
          )}

          {order && (
            <div className="bg-white border border-[#c9891d]/20 shadow-xl overflow-hidden animate-fade-in">
              {/* Header */}
              <div className="p-6 border-b border-[#c9891d]/10 text-center" style={{ background: '#faf5eb' }}>
                <div className="text-xs tracking-widest uppercase text-[#a0785a] mb-1" style={{ fontFamily: 'var(--font-jost)' }}>
                  Order ID
                </div>
                <div className="text-xl font-bold text-[#1a1209] font-mono tracking-wider">
                  {order.id}
                </div>
              </div>

              {/* Status */}
              <div className="p-8 text-center" style={{ background: STATUS_MESSAGES[order.status].bg }}>
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                  style={{ background: STATUS_MESSAGES[order.status].color }}
                >
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl mb-2 font-medium" style={{ fontFamily: 'var(--font-cormorant)', color: '#1a1209' }}>
                  {STATUS_MESSAGES[order.status].title}
                </h2>
                <p className="text-sm text-[#5c4020]/80" style={{ fontFamily: 'var(--font-jost)' }}>
                  {STATUS_MESSAGES[order.status].desc}
                </p>

                {order.status === 'pending' && (
                  <div className="mt-6 bg-white/60 p-4 rounded text-sm text-left shadow-sm" style={{ border: '1px solid rgba(201,137,29,0.2)' }}>
                    <p className="mb-2 uppercase tracking-widest text-xs text-[#a0785a]" style={{ fontFamily: 'var(--font-jost)' }}>Awaiting Payment</p>
                    <p className="text-[#1a1209] mb-1 font-medium">Please send <strong className="text-[#c9891d]">${order.total}</strong> via Zelle to:</p>
                    <p className="font-mono text-lg text-[#1a1209] font-bold tracking-wider mb-2">571-580-3998</p>
                    <p className="text-[#5c4020]/70 text-xs">Include Order #{order.id} in the memo.</p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6 space-y-4 text-sm" style={{ fontFamily: 'var(--font-jost)' }}>
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500 uppercase tracking-widest text-xs">Item</span>
                  <span className="font-medium text-[#1a1209] text-right">{order.itemName} {order.quantity > 1 ? `(x${order.quantity})` : ''}</span>
                </div>
                {order.addOns && order.addOns.length > 0 && (
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500 uppercase tracking-widest text-xs">Add-Ons</span>
                    <span className="font-medium text-[#1a1209] text-right">{order.addOns.join(', ')}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-500 uppercase tracking-widest text-xs">Requested Date</span>
                  <span className="font-medium text-[#1a1209]">{order.date}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-500 uppercase tracking-widest text-xs">Total</span>
                  <span className="font-medium text-[#c9891d] text-lg font-mono">${order.total}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
