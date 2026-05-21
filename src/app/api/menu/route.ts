import { NextResponse } from 'next/server'
import { menuItems, addOns } from '@/lib/menu-data'

// ── GET /api/menu — public menu endpoint ─────────────────────────
export async function GET() {
  return NextResponse.json(
    {
      items:  menuItems,
      addOns: addOns,
      meta: {
        breakfast: menuItems.filter((m) => m.category === 'breakfast').length,
        dessert:   menuItems.filter((m) => m.category === 'dessert').length,
        total:     menuItems.length,
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  )
}
