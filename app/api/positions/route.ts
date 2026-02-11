// app/api/positions/route.ts
import { getOpenPositions, createOpenPosition } from '@/app/lib/supabase-admin';
import { NextResponse, NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    const positions = await getOpenPositions();
    return NextResponse.json(positions);
  } catch (error: unknown) {
    console.error('API GET /positions - Server error:', error);
    return NextResponse.json({ error: 'Si è verificato un errore imprevisto' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
    revalidatePath('/career');
    return NextResponse.json(position);
  } catch (error: unknown) {
    console.error('API POST /positions - Server error:', error);
    return NextResponse.json({ error: 'Si è verificato un errore imprevisto' }, { status: 500 });
  }
}
