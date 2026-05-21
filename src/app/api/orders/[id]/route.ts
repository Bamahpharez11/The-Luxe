import { NextRequest, NextResponse } from 'next/server'
import { getOrderById, updateOrderStatus, deleteOrder } from '@/lib/order-store'
import { updateStatusSchema } from '@/lib/validations'

type Params = { params: { id: string } }

// ── GET /api/orders/[id] ──────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const order = getOrderById(params.id)
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  return NextResponse.json({ order })
}

// ── PATCH /api/orders/[id] — update status ────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json()
    const parsed = updateStatusSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid status', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const updated = updateOrderStatus(params.id, parsed.data.status)
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, order: updated })
  } catch (err) {
    console.error('[PATCH /api/orders/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ── DELETE /api/orders/[id] ───────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const deleted = deleteOrder(params.id)
  if (!deleted) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, message: 'Order deleted' })
}
