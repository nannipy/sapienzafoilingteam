import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Descrizione Errore:", error); 
    const errorMessage = 'Si è verificato un errore imprevisto';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}