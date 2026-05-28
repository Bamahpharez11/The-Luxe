// ─────────────────────────────────────────────────────────────────
//  ORDER STORE  — Mock database for Vercel Serverless Environment
//  Works across Next.js hot-reloads via a module-level singleton.
// ─────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
export type OrderType   = 'pickup' | 'delivery'

export interface Order {
  id:          string
  createdAt:   string          // ISO timestamp
  updatedAt:   string
  status:      OrderStatus
  name:        string
  phone:        string
  email?:      string
  deliveryAddress?: string
  // order details
  item:        string          // menu item id
  itemName:    string          // human-readable name
  itemPrice:   number
  addOns:      string[]
  quantity:    number
  orderType:   OrderType
  date:        string          // requested date
  notes:       string
  // totals
  total:       number
}

// Singleton store — survives Next.js hot-module replacement
declare global {
  // eslint-disable-next-line no-var
  var __orderStore: Order[] | undefined
}

function getStore(): Order[] {
  if (!global.__orderStore) {
    global.__orderStore = seedOrders()
  }
  return global.__orderStore
}

// ── CRUD helpers ──────────────────────────────────────────────────

export async function getAllOrders(): Promise<Order[]> {
  return [...getStore()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  return getStore().find((o) => o.id === id)
}

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Order> {
  const now = new Date().toISOString()
  const order: Order = {
    ...data,
    id:        generateId(),
    createdAt: now,
    updatedAt: now,
    status:    'pending',
  }
  getStore().push(order)
  return order
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const store = getStore()
  const idx = store.findIndex((o) => o.id === id)
  if (idx === -1) return null
  store[idx] = { ...store[idx], status, updatedAt: new Date().toISOString() }
  return store[idx]
}

export async function deleteOrder(id: string): Promise<boolean> {
  const store = getStore()
  const idx = store.findIndex((o) => o.id === id)
  if (idx === -1) return false
  store.splice(idx, 1)
  return true
}

export async function getOrderStats() {
  const orders = getStore()
  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0)

  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  const today = new Date().toDateString()
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  )

  return {
    total:         orders.length,
    totalRevenue:  revenue,
    pending:       byStatus['pending']   ?? 0,
    confirmed:     byStatus['confirmed'] ?? 0,
    preparing:     byStatus['preparing'] ?? 0,
    ready:         byStatus['ready']     ?? 0,
    completed:     byStatus['completed'] ?? 0,
    cancelled:     byStatus['cancelled'] ?? 0,
    todayCount:    todayOrders.length,
    todayRevenue:  todayOrders.reduce((s, o) => s + o.total, 0),
  }
}

// ── Helpers ───────────────────────────────────────────────────────

function generateId(): string {
  return 'TLC-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

// ── Seed data — realistic sample orders ──────────────────────────
function seedOrders(): Order[] {
  return [
    {
      id: 'TLC-SEED001', createdAt: daysAgo(0), updatedAt: daysAgo(0),
      status: 'pending', name: 'Aisha Thompson', phone: '703-555-0192',
      item: 'signature-luxe-breakfast-tray', itemName: 'Signature Luxe Breakfast Tray',
      itemPrice: 65, addOns: ['Extra Fruit Cup'], quantity: 1, orderType: 'delivery',
      date: new Date().toISOString().split('T')[0], notes: 'Birthday surprise — please include a note!',
      total: 69,
    },
    {
      id: 'TLC-SEED002', createdAt: daysAgo(0), updatedAt: daysAgo(0),
      status: 'confirmed', name: 'Marcus Reed', phone: '571-555-0284',
      item: 'date-night-dessert-box', itemName: 'Date Night Dessert Box',
      itemPrice: 60, addOns: [], quantity: 1, orderType: 'pickup',
      date: new Date().toISOString().split('T')[0], notes: 'Anniversary dinner.',
      total: 60,
    },
  ]
}
