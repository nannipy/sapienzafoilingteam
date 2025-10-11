import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase-admin';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('API GET /events - Query result:', { data, error });

    if (error) {
      console.error('API GET /events - Database error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      console.error('API GET /events - No data returned');
      return NextResponse.json({ error: 'No events found' }, { status: 404 });
    }

    console.log(`API GET /events - Success: Retrieved ${data.length} events`);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = 'An unexpected error occurred';
    console.error('API GET /events - Server error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


// POST /api/events - Create a new Event
export async function POST(request: Request) {
  try {
    // Verify authentication using the token from the request header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }

    // Verify the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token' }, { status: 401 });
    }

    // *** FIX: Added 'date' and 'location' to destructuring ***
    const { title, title_en, date, location, image_url, image_alt } = await request.json();

    // *** FIX: Added 'date' and 'location' to the validation check ***
    if (!title || !title_en || !date || !location) {
      return NextResponse.json({ error: 'Title, description, date, and location are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin!
      .from('events')
      .insert([
        {
          title,
          title_en,
          date,
          location,
          image_url: image_url || null,
          image_alt: image_alt || null,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("API POST /events - Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("API POST /events - Server error:", error); 
    const errorMessage = 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}