import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/app/lib/supabase';

// // Helper function to validate date format
// function isValidDate(dateString: string): boolean {
//   const date = new Date(dateString);
//   return date instanceof Date && !isNaN(date.getTime());
// }

// GET /api/articles - Get all articles
export async function GET(request: Request) {
  try {
    // Log the incoming request headers
    console.log('API GET /articles - Request headers:', {
      authorization: request.headers.get('Authorization'),
      hasAuthHeader: !!request.headers.get('Authorization')
    });
    
    // Try to extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    console.log('API GET /articles - Extracted token:', token ? `${token.substring(0, 10)}...` : 'No token');
    
    // Use supabaseAdmin for unrestricted access
    console.log('API GET /articles - Executing query to posts table with admin client');
    const { data, error } = await supabaseAdmin!
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('API GET /articles - Query result:', { data, error });

    if (error) {
      console.error('API GET /articles - Database error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      console.error('API GET /articles - No data returned');
      return NextResponse.json({ error: 'No articles found' }, { status: 404 });
    }

    console.log(`API GET /articles - Success: Retrieved ${data.length} articles`);
    return NextResponse.json(data);
  }catch (error: unknown) {
    const errorMessage = 'Si è verificato un errore imprevisto';
    console.error('API GET /articles - Server error:', error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/articles - Create a new article
export async function POST(request: Request) {
  try {
    // Verify authentication using the token from request header
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

    const { title, content, image_url, image_alt, title_en, content_en } = await request.json();

    if (!title || !content || !title_en || !content_en) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin!
      .from('posts')
      .insert([
        {
          title,
          slug: title.toLowerCase().replace(/ /g, '-'),
          content,
          title_en,
          content_en,
          image_url: image_url || null,
          image_alt: image_alt || null,
          author_id: user.id
        }
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Descrizione Errore:", error); 
    const errorMessage = 'Si è verificato un errore imprevisto';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

