// app/api/positions/route.ts
import { getOpenPositions, createOpenPosition } from '@/app/lib/supabase-admin';
import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  const positions = await getOpenPositions();
  return NextResponse.json(positions);
}

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

  const data = await req.json();
  const position = await createOpenPosition(data);
  return NextResponse.json(position);
}
