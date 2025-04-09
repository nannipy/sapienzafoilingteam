import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user, session: data.session });
  } catch (error: unknown) {
    console.error("Descrizione Errore:", error); 
    const errorMessage = 'Si è verificato un errore imprevisto';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}