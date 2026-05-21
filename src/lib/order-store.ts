// ─────────────────────────────────────────────────────────────────
//  ORDER STORE  — in-memory database (replace with a real DB in prod)
//  Works across Next.js hot-reloads via a module-level singleton.
// ─────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
export type OrderType   = 'pickup' | 'delivery'

export interface Order {
  id:          string
  createdAt:   string          // ISO timestamp
  updatedAt:   string
  status:      OrderStatus
  // customer
  name:        string
  phone:        string
  email?:      string
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

export function getAllOrders(): Order[] {
  return [...getStore()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getOrderById(id: string): Order | undefined {
  return getStore().find((o) => o.id === id)
}

export function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Order {
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

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  const store = getStore()
  const idx = store.findIndex((o) => o.id === id)
  if (idx === -1) return null
  store[idx] = { ...store[idx], status, updatedAt: new Date().toISOString() }
  return store[idx]
}

export function deleteOrder(id: string): boolean {
  const store = getStore()
  const idx = store.findIndex((o) => o.id === id)
  if (idx === -1) return false
  store.splice(idx, 1)
  return true
}

export function getOrderStats() {
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
    {
      id: 'TLC-SEED003', createdAt: daysAgo(1), updatedAt: daysAgo(1),
      status: 'completed', name: 'Priya Nair', phone: '703-555-0371',
      item: 'girls-night-sweets-box', itemName: "Girls' Night Sweets Box",
      itemPrice: 70, addOns: ['Extra Juice', 'Yogurt Parfait'], quantity: 2, orderType: 'delivery',
      date: daysAgo(1).split('T')[0], notes: 'Bachelorette party, 6 guests.',
      total: 154,
    },
    {
      id: 'TLC-SEED004', createdAt: daysAgo(1), updatedAt: daysAgo(1),
      status: 'completed', name: 'Jordan Williams', phone: '571-555-0448',
      item: 'executive-brunch-box', itemName: 'Executive Brunch Box',
      itemPrice: 28, addOns: [], quantity: 3, orderType: 'pickup',
      date: daysAgo(1).split('T')[0], notes: 'Team meeting.',
      total: 84,
    },
    {
      id: 'TLC-SEED005', createdAt: daysAgo(2), updatedAt: daysAgo(2),
      status: 'completed', name: 'Fatima Hassan', phone: '703-555-0519',
      item: 'sweet-tooth-luxe-box', itemName: 'Sweet Tooth Luxe Box',
      itemPrice: 32, addOns: ['Extra Fruit Cup'], quantity: 1, orderType: 'delivery',
      date: daysAgo(2).split('T')[0], notes: '',
      total: 36,
    },
    {
      id: 'TLC-SEED006', createdAt: daysAgo(3), updatedAt: daysAgo(3),
      status: 'cancelled', name: 'Devon Carter', phone: '571-555-0663',
      item: 'luxe-duo-brunch', itemName: 'Luxe Duo Brunch',
      itemPrice: 45, addOns: [], quantity: 1, orderType: 'pickup',
      date: daysAgo(3).split('T')[0], notes: 'Had to cancel, family emergency.',
      total: 45,
    },
  ]
}
