// app/api/positions/[id]/route.ts
import { getOpenPosition, updateOpenPosition, deleteOpenPosition } from '@/app/lib/supabase-admin';
import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const awaitedParams = await params;
  const position = await getOpenPosition(awaitedParams.id);
  if (!position) {
    return new NextResponse('Not Found', { status: 404 });
  }
  return NextResponse.json(position);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
  const awaitedParams = await params;
  const position = await updateOpenPosition(awaitedParams.id, data);
  return NextResponse.json(position);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

  const awaitedParams = await params;
  await deleteOpenPosition(awaitedParams.id);
  return new NextResponse(null, { status: 204 });
}
