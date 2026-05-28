import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const method = request.method
  const token = request.cookies.get('admin_session')?.value || ''
  const isPublicPath = path === '/admin/login'

  // 1. Protect GET /api/orders (the bulk order list used by admin)
  if (path === '/api/orders' && method === 'GET' && token !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Protect /admin pages
  if (path.startsWith('/admin')) {
    if (!isPublicPath && token !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (isPublicPath && token === 'true') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/orders', // Exact match for the bulk API endpoint
  ],
}
