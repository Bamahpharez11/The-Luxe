'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { Order, OrderStatus } from '@/lib/order-store'

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  pending:   { bg: 'rgba(251,191,36,0.12)',  text: '#fbbf24', dot: '#fbbf24' },
  confirmed: { bg: 'rgba(59,130,246,0.12)',  text: '#60a5fa', dot: '#60a5fa' },
  preparing: { bg: 'rgba(168,85,247,0.12)',  text: '#c084fc', dot: '#c084fc' },
  ready:     { bg: 'rgba(34,197,94,0.12)',   text: '#4ade80', dot: '#4ade80' },
  completed: { bg: 'rgba(201,137,29,0.12)',  text: '#e8bf5e', dot: '#e8bf5e' },
  cancelled: { bg: 'rgba(239,68,68,0.12)',   text: '#f87171', dot: '#f87171' },
}

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'completed']

interface Stats {
  total: number; totalRevenue: number; pending: number; confirmed: number
  preparing: number; ready: number; completed: number; cancelled: number
  todayCount: number; todayRevenue: number
}

export default function AdminPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [selected, setSelected] = useState<Order | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data.orders)
      setStats(data.stats)
      setLastRefresh(new Date())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000) // auto-refresh every 30s
    return () => clearInterval(interval)
  }, [fetchOrders])

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id)
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        const data = await res.json()
        setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)))
        if (selected?.id === id) setSelected(data.order)
        if (stats) setStats({ ...stats }) // trigger re-render
        await fetchOrders() // re-sync stats
      }
    } finally {
      setUpdating(null)
    }
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('Delete this order? This cannot be undone.')) return
    await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    setOrders((prev) => prev.filter((o) => o.id !== id))
    if (selected?.id === id) setSelected(null)
    await fetchOrders()
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  const nextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = STATUS_FLOW.indexOf(current)
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null
  }

  return (
    <div style={{ background: '#0e0b05', minHeight: '100vh', fontFamily: 'var(--font-jost)' }}>
      {/* Top bar */}
      <header style={{ background: '#1a1209', borderBottom: '1px solid rgba(201,137,29,0.2)', padding: '0 2rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.4rem', color: 'white', fontWeight: 400 }}>
            The Luxe <span style={{ background: 'linear-gradient(135deg, #e8bf5e, #c9891d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Admin</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', letterSpacing: '0.1em' }}>
            Last sync: {lastRefresh.toLocaleTimeString()}
          </span>
          <button onClick={fetchOrders} style={{ padding: '0.4rem 1rem', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(201,137,29,0.15)', border: '1px solid rgba(201,137,29,0.3)', color: '#e8bf5e', cursor: 'pointer' }}>
            ↻ Refresh
          </button>
          <a href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
            ← Back to Site
          </a>
          <button onClick={handleLogout} style={{ color: '#f87171', background: 'none', border: 'none', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Stats row */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: "Today's Orders", value: stats.todayCount, sub: `$${stats.todayRevenue} revenue` },
              { label: 'Total Orders',   value: stats.total,      sub: `$${stats.totalRevenue} total` },
              { label: 'Pending',        value: stats.pending,    sub: 'needs attention', color: '#fbbf24' },
              { label: 'Confirmed',      value: stats.confirmed,  sub: 'acknowledged',    color: '#60a5fa' },
              { label: 'Preparing',      value: stats.preparing,  sub: 'in kitchen',      color: '#c084fc' },
              { label: 'Ready',          value: stats.ready,      sub: 'for pickup',      color: '#4ade80' },
              { label: 'Completed',      value: stats.completed,  sub: 'fulfilled',       color: '#e8bf5e' },
              { label: 'Cancelled',      value: stats.cancelled,  sub: 'not fulfilled',   color: '#f87171' },
            ].map((s) => (
              <div key={s.label} style={{ background: '#1a1209', border: '1px solid rgba(201,137,29,0.15)', padding: '1.25rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 600, color: s.color ?? 'white', fontFamily: 'var(--font-cormorant)', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.4rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.15rem' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Orders table */}
          <div style={{ background: '#1a1209', border: '1px solid rgba(201,137,29,0.15)' }}>
            {/* Filter tabs */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginRight: '0.5rem' }}>Filter:</span>
              {(['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'] as const).map((s) => (
                <button key={s} onClick={() => setFilter(s)}
                  style={{
                    padding: '0.3rem 0.85rem', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    background: filter === s ? 'linear-gradient(135deg, #e8bf5e, #c9891d)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid ' + (filter === s ? 'transparent' : 'rgba(255,255,255,0.08)'),
                    color: filter === s ? '#1a1209' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer', fontWeight: filter === s ? 600 : 400,
                  }}>
                  {s}
                </button>
              ))}
              <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>
                {filtered.length} order{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Table */}
            {loading ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>Loading orders…</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>No orders found.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Order ID', 'Customer', 'Item', 'Total', 'Type', 'Date', 'Status', 'Actions'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((order) => {
                      const sc = STATUS_COLORS[order.status]
                      const next = nextStatus(order.status)
                      const isUpdating = updating === order.id
                      return (
                        <tr key={order.id}
                          onClick={() => setSelected(selected?.id === order.id ? null : order)}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                            background: selected?.id === order.id ? 'rgba(201,137,29,0.08)' : 'transparent',
                            cursor: 'pointer', transition: 'background 0.2s',
                          }}
                          onMouseEnter={e => { if (selected?.id !== order.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
                          onMouseLeave={e => { if (selected?.id !== order.id) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                        >
                          <td style={{ padding: '0.85rem 1rem', color: '#e8bf5e', fontFamily: 'monospace', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{order.id}</td>
                          <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                            <div style={{ color: 'white', fontWeight: 500 }}>{order.name}</div>
                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>{order.phone}</div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.8)', maxWidth: '180px' }}>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.itemName}</div>
                            {order.quantity > 1 && <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>×{order.quantity}</div>}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: 'white', fontWeight: 600, fontFamily: 'var(--font-cormorant)', fontSize: '1rem', whiteSpace: 'nowrap' }}>${order.total}</td>
                          <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                            <span style={{ padding: '0.2rem 0.6rem', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', background: order.orderType === 'delivery' ? 'rgba(168,85,247,0.15)' : 'rgba(201,137,29,0.15)', color: order.orderType === 'delivery' ? '#c084fc' : '#e8bf5e', border: '1px solid ' + (order.orderType === 'delivery' ? 'rgba(168,85,247,0.3)' : 'rgba(201,137,29,0.3)') }}>
                              {order.orderType}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{fmtDate(order.createdAt)}</td>
                          <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                            <span style={{ padding: '0.25rem 0.7rem', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', background: sc.bg, color: sc.text, border: '1px solid ' + sc.text + '40', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              {next && order.status !== 'cancelled' && (
                                <button onClick={() => updateStatus(order.id, next)} disabled={isUpdating}
                                  style={{ padding: '0.3rem 0.7rem', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'linear-gradient(135deg, #e8bf5e, #c9891d)', color: '#1a1209', border: 'none', cursor: isUpdating ? 'wait' : 'pointer', fontWeight: 600, opacity: isUpdating ? 0.6 : 1 }}>
                                  → {next}
                                </button>
                              )}
                              {order.status !== 'cancelled' && order.status !== 'completed' && (
                                <button onClick={() => updateStatus(order.id, 'cancelled')} disabled={isUpdating}
                                  style={{ padding: '0.3rem 0.7rem', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer' }}>
                                  Cancel
                                </button>
                              )}
                              <button onClick={() => deleteOrder(order.id)}
                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
                                title="Delete">
                                ✕
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ background: '#1a1209', border: '1px solid rgba(201,137,29,0.2)', position: 'sticky', top: '80px' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', color: 'white' }}>Order Detail</span>
                <button onClick={() => setSelected(null)} style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
              </div>

              <div style={{ padding: '1.5rem' }}>
                {/* Status badge */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ ...STATUS_COLORS[selected.status], padding: '0.3rem 1rem', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: STATUS_COLORS[selected.status].bg, color: STATUS_COLORS[selected.status].text, border: '1px solid ' + STATUS_COLORS[selected.status].text + '40' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS_COLORS[selected.status].dot, display: 'inline-block' }} />
                    {selected.status}
                  </span>
                </div>

                {/* Fields */}
                {[
                  { label: 'Order ID',   value: selected.id },
                  { label: 'Customer',   value: selected.name },
                  { label: 'Phone',      value: selected.phone },
                  { label: 'Email',      value: selected.email || '—' },
                  { label: 'Item',       value: selected.itemName },
                  { label: 'Quantity',   value: String(selected.quantity) },
                  { label: 'Add-Ons',    value: selected.addOns.length ? selected.addOns.join(', ') : 'None' },
                  { label: 'Order Type', value: selected.orderType },
                  ...(selected.orderType === 'delivery' ? [{ label: 'Address', value: selected.deliveryAddress || '—' }] : []),
                  { label: 'Date',       value: selected.date },
                  { label: 'Notes',      value: selected.notes || '—' },
                  { label: 'Created',    value: fmtDate(selected.createdAt) },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', gap: '1rem', padding: '0.55rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', minWidth: '90px', flexShrink: 0 }}>{f.label}</span>
                    <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', wordBreak: 'break-all' }}>{f.value}</span>
                  </div>
                ))}

                {/* Total */}
                <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', background: 'rgba(201,137,29,0.08)', border: '1px solid rgba(201,137,29,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.6rem', fontWeight: 600, background: 'linear-gradient(135deg, #e8bf5e, #c9891d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>${selected.total}</span>
                </div>

                {/* Status actions */}
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {STATUS_FLOW.map(s => (
                    <button key={s} onClick={() => updateStatus(selected.id, s)} disabled={selected.status === s || updating === selected.id}
                      style={{
                        padding: '0.6rem 1rem', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', width: '100%', cursor: selected.status === s ? 'default' : 'pointer',
                        background: selected.status === s ? 'linear-gradient(135deg, #e8bf5e, #c9891d)' : 'rgba(255,255,255,0.04)',
                        border: '1px solid ' + (selected.status === s ? 'transparent' : 'rgba(255,255,255,0.08)'),
                        color: selected.status === s ? '#1a1209' : 'rgba(255,255,255,0.5)',
                        fontWeight: selected.status === s ? 700 : 400,
                        opacity: updating === selected.id ? 0.6 : 1,
                      }}>
                      {selected.status === s ? '● ' : ''}{s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                  <button onClick={() => updateStatus(selected.id, 'cancelled')} disabled={selected.status === 'cancelled' || updating === selected.id}
                    style={{ padding: '0.6rem 1rem', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: selected.status === 'cancelled' ? 'rgba(239,68,68,0.2)' : 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', cursor: 'pointer', marginTop: '0.25rem', opacity: updating === selected.id ? 0.6 : 1 }}>
                    Cancel Order
                  </button>
                  <button onClick={() => deleteOrder(selected.id)}
                    style={{ padding: '0.6rem 1rem', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
