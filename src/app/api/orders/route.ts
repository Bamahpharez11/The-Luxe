import { NextRequest, NextResponse } from 'next/server'
import { createOrder, getAllOrders, getOrderStats } from '@/lib/order-store'
import { createOrderSchema } from '@/lib/validations'
import { menuItems } from '@/lib/menu-data'
import { sendOrderConfirmationEmail } from '@/lib/email'

// ── GET /api/orders — list all orders + stats (admin) ─────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const statsOnly = searchParams.get('stats') === 'true'

  if (statsOnly) {
    return NextResponse.json({ stats: await getOrderStats() })
  }

  const status = searchParams.get('status')
  let orders = await getAllOrders()
  if (status) orders = orders.filter((o) => o.status === status)

  return NextResponse.json({ orders, stats: await getOrderStats() })
}

// ── POST /api/orders — submit a new order ─────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate
    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Verify item exists in menu
    const menuItem = menuItems.find((m) => m.id === data.item)
    if (!menuItem) {
      return NextResponse.json({ error: 'Invalid menu item' }, { status: 400 })
    }

    // Recalculate total server-side (security: never trust client total blindly)
    const ADD_ON_PRICES: Record<string, number> = {
      'Extra Fruit Cup': 4,
      'Extra Sausage':   4,
      'Extra Pancakes':  3,
      'Extra Croissant': 3,
      'Extra Juice':     3,
      'Yogurt Parfait':  4,
    }
    const addOnTotal = data.addOns.reduce((sum, a) => sum + (ADD_ON_PRICES[a] ?? 0), 0)
    const serverTotal = (menuItem.price + addOnTotal) * data.quantity

    // Create order
    const order = await createOrder({
      name:      data.name,
      phone:     data.phone,
      email:     data.email,
      deliveryAddress: data.deliveryAddress,
      item:      data.item,
      itemName:  menuItem.name,
      itemPrice: menuItem.price,
      addOns:    data.addOns,
      quantity:  data.quantity,
      orderType: data.orderType,
      date:      data.date,
      notes:     data.notes,
      total:     serverTotal,
    })

    // Send email notification to owner
    await sendOrderConfirmationEmail(order)

    return NextResponse.json(
      { success: true, order, message: 'Order received! We\'ll confirm within 24 hours.' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/orders]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
