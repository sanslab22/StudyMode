import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request) {
  const { supabase, supabaseResponse } = createClient(request)

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isProtected = pathname.startsWith('/home') || pathname.startsWith('/notes')
  const isAuthPage = pathname === '/' || pathname === '/create-account'

  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
