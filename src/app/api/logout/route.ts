
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSession();
  session.destroy();
  // Reindirizza alla pagina di login dopo il logout
  const url = request.nextUrl.clone()
  url.pathname = '/login'
  return NextResponse.redirect(url, {
    headers: {
        'Set-Cookie': 'aurora-cafe-session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  });
}
