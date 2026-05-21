import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import path from 'path'

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
export type OrderType   = 'pickup' | 'delivery'

export interface Order {
  id:          string
  createdAt:   string          // ISO timestamp
  updatedAt:   string
  status:      OrderStatus
  name:        string
  phone:       string
  email?:      string
  item:        string          // menu item id
  itemName:    string          // human-readable name
  itemPrice:   number
  addOns:      string[]
  quantity:    number
  orderType:   OrderType
  date:        string          // requested date
  notes:       string
  total:       number
}

let dbInstance: Database | null = null

async function getDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: path.join(process.cwd(), 'orders.db'),
      driver: sqlite3.Database
    })
    
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        createdAt TEXT,
        updatedAt TEXT,
        status TEXT,
        name TEXT,
        phone TEXT,
        email TEXT,
        item TEXT,
        itemName TEXT,
        itemPrice REAL,
        addOns TEXT,
        quantity INTEGER,
        orderType TEXT,
        date TEXT,
        notes TEXT,
        total REAL
      )
    `)
  }
  return dbInstance
}

function mapRowToOrder(row: any): Order {
  return {
    ...row,
    addOns: JSON.parse(row.addOns || '[]')
  }
}

// ── CRUD helpers ──────────────────────────────────────────────────

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb()
  const rows = await db.all('SELECT * FROM orders ORDER BY createdAt DESC')
  return rows.map(mapRowToOrder)
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const db = await getDb()
  const row = await db.get('SELECT * FROM orders WHERE id = ?', id)
  if (!row) return undefined
  return mapRowToOrder(row)
}

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Order> {
  const db = await getDb()
  const now = new Date().toISOString()
  const order: Order = {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    status: 'pending'
  }
  
  await db.run(`
    INSERT INTO orders (id, createdAt, updatedAt, status, name, phone, email, item, itemName, itemPrice, addOns, quantity, orderType, date, notes, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    order.id, order.createdAt, order.updatedAt, order.status, order.name, order.phone, order.email || '',
    order.item, order.itemName, order.itemPrice, JSON.stringify(order.addOns), order.quantity, order.orderType,
    order.date, order.notes || '', order.total
  ])
  
  return order
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const db = await getDb()
  const now = new Date().toISOString()
  
  const result = await db.run('UPDATE orders SET status = ?, updatedAt = ? WHERE id = ?', [status, now, id])
  if (result.changes === 0) return null
  
  return await getOrderById(id) as Order
}

export async function deleteOrder(id: string): Promise<boolean> {
  const db = await getDb()
  const result = await db.run('DELETE FROM orders WHERE id = ?', id)
  return (result.changes ?? 0) > 0
}

export async function getOrderStats() {
  const orders = await getAllOrders()
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
