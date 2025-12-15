// /app/api/articles/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
// Only import supabaseAdmin if you specifically need to bypass RLS for certain actions
// import { supabaseAdmin } from '@/app/lib/supabase';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Helper function to validate UUID
function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

// GET /api/articles/[id] - Get a single article (Publicly accessible or relies on RLS)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const articleId = id;

    // Validate ID presence and format
    if (!articleId || typeof articleId !== 'string') {
      console.error('GET /api/articles/[id] - Invalid or missing ID parameter:', articleId);
      return NextResponse.json({ error: 'Article ID missing or invalid' }, { status: 400 });
    }

    if (!isValidUUID(articleId)) {
      console.error('GET /api/articles/[id] - Invalid article ID format:', articleId);
      return NextResponse.json({ error: 'Invalid Article ID format' }, { status: 400 });
    }

    // Use the standard supabase client (assumes RLS handles permissions if needed, or it's public)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', articleId)
      .single(); // Use single() as we expect 0 or 1 row

    // Handle Supabase errors
    if (error) {
      console.error('GET /api/articles/[id] - Supabase error:', error);
      // Specifically handle 'Not Found' error
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      // For other database errors
      return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 });
    }

    // Although single() should error if not found (PGRST116), double-check data
    if (!data) {
      console.warn('GET /api/articles/[id] - Article not found (post-query check):', articleId);
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(data); // Default 200 OK

  } catch (err: unknown) {
    console.error("GET /api/articles/[id] - Unexpected server error:", err);
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


// PATCH /api/articles/[id] - Update an article (Requires Authentication & Authorization)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Destructure id from params data
    const articleId = id;

    // Validate ID presence and format
    if (!articleId || typeof articleId !== 'string') {
      console.error('PATCH /api/articles/[id] - Invalid or missing ID parameter:', articleId);
      return NextResponse.json({ error: 'Article ID missing or invalid' }, { status: 400 });
    }
    if (!isValidUUID(articleId)) {
      console.error('PATCH /api/articles/[id] - Invalid article ID format:', articleId);
      return NextResponse.json({ error: 'Invalid Article ID format' }, { status: 400 });
    }

    // 1. Authentication: Verify user token
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token) {
      console.warn('PATCH /api/articles/[id] - Unauthorized: No token provided');
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.warn('PATCH /api/articles/[id] - Unauthorized: Invalid token', authError);
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }
    /* 2. Authorization: Check if the user owns the article
    const { data: existingArticle, error: fetchError } = await supabase
      .from('posts')
      .select('author_id') // Only select what's needed for the check
      .eq('id', articleId)
      .single(); // Expect 0 or 1

    if (fetchError) {
        console.error('PATCH /api/articles/[id] - Error fetching article for auth check:', fetchError);
        if (fetchError.code === 'PGRST116') {
             return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Database error checking article ownership' }, { status: 500 });
    } 

    if (!existingArticle) { // Should be caught by PGRST116, but double-check
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    if (existingArticle.author_id !== user.id) {
      console.warn(`PATCH /api/articles/[id] - Forbidden: User ${user.id} does not own article ${articleId}`);
      return NextResponse.json({ error: 'Forbidden: You do not have permission to edit this article' }, { status: 403 });
    }
    console.log(`PATCH /api/articles/[id] - Authorization successful for user ${user.id} on article ${articleId}`);
    */

    // 3. Request Body Validation
    let updateData: { title: string; content: string; title_en: string; content_en: string; image_url?: string | null; image_alt?: string | null; };
    try {
      const body = await request.json();
      if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
        throw new Error('Title is required and cannot be empty.');
      }
      if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
        throw new Error('Content is required and cannot be empty.');
      }
      if (body.title_en && typeof body.title_en !== 'string') {
        throw new Error('Title EN must be a string.');
      }
      if (body.content_en && typeof body.content_en !== 'string') {
        throw new Error('Content EN must be a string.');
      }
      if (body.image_url && typeof body.image_url !== 'string') {
        throw new Error('Image URL must be a string.');
      }
      if (body.image_alt && typeof body.image_alt !== 'string') {
        throw new Error('Image Alt must be a string.');
      }

      updateData = {
        title: body.title.trim(),
        content: body.content.trim(), // Use trim() here if you want to save trimmed content
        title_en: body.title_en.trim(),
        content_en: body.content_en.trim(),
        image_url: body.image_url || null, // Handle optional fields
        image_alt: body.image_alt || null
      };
    } catch (parseError) {
      console.error('PATCH /api/articles/[id] - Invalid request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body. Ensure JSON is valid and required fields (title, content) are present.' }, { status: 400 });
    }

    // 4. Perform Update
    const { data: updatedArticle, error: updateError } = await supabase
      .from('posts')
      .update({
        ...updateData,
        title: updateData.title,
        content: updateData.content,
        title_en: updateData.title_en,
        content_en: updateData.content_en,
        image_url: updateData.image_url,
        image_alt: updateData.image_alt,
        slug: updateData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''), // Generate slug
        updated_at: new Date().toISOString() // Update timestamp
      })
      .eq('id', articleId) // Ensure RLS is respected by filtering on ID
      .select() // Select the updated record
      .single(); // Expect exactly one record back

    if (updateError) {
      console.error('PATCH /api/articles/[id] - Supabase update error:', updateError);
      if (updateError.code === 'PGRST116') { // Should not happen if auth check passed, but possible race condition
        return NextResponse.json({ error: 'Article not found during update' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Database error during update: ' + updateError.message }, { status: 500 });
    }

    return NextResponse.json(updatedArticle); // 200 OK with updated data

  } catch (err: unknown) {
    console.error("PATCH /api/articles/[id] - Unexpected server error:", err);
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


// DELETE /api/articles/[id] - Delete an article (Requires Authentication & Authorization)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Destructure id from params dat 
    const articleId = await id;

    // Validate ID presence and format
    if (!articleId || typeof articleId !== 'string') {
      console.error('DELETE /api/articles/[id] - Invalid or missing ID parameter:', articleId);
      return NextResponse.json({ error: 'Article ID missing or invalid' }, { status: 400 });
    }
    if (!isValidUUID(articleId)) {
      console.error('DELETE /api/articles/[id] - Invalid article ID format:', articleId);
      return NextResponse.json({ error: 'Invalid Article ID format' }, { status: 400 });
    }

    console.log('DELETE /api/articles/[id] - Request received for ID:', articleId);

    // 1. Authentication: Verify user token (same as PATCH)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token) {
      console.warn('DELETE /api/articles/[id] - Unauthorized: No token provided');
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.warn('DELETE /api/articles/[id] - Unauthorized: Invalid token', authError);
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }
    console.log('DELETE /api/articles/[id] - Authenticated User:', user.id);


    // 2. Authorization: Check if the user owns the article (same as PATCH)
    const { data: existingArticle, error: fetchError } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', articleId)
      .single();

    if (fetchError) {
      console.error('DELETE /api/articles/[id] - Error fetching article for auth check:', fetchError);
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Database error checking article ownership' }, { status: 500 });
    }
    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    if (existingArticle.author_id !== user.id) {
      console.warn(`DELETE /api/articles/[id] - Forbidden: User ${user.id} does not own article ${articleId}`);
      return NextResponse.json({ error: 'Forbidden: You do not have permission to delete this article' }, { status: 403 });
    }
    console.log(`DELETE /api/articles/[id] - Authorization successful for user ${user.id} on article ${articleId}`);

    // 3. Perform Delete
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', articleId); // RLS should enforce the user check again, but filtering here is good practice

    if (deleteError) {
      // Note: Supabase delete might not error if the row doesn't exist due to RLS or prior deletion.
      // The count property in the response (if not using { returning: 'minimal' }) could be checked,
      // but the ownership check above is the primary guard.
      console.error('DELETE /api/articles/[id] - Supabase delete error:', deleteError);
      return NextResponse.json({ error: 'Database error during deletion: ' + deleteError.message }, { status: 500 });
    }

    console.log('DELETE /api/articles/[id] - Success: Deleted article', articleId);
    // Return 204 No Content on successful deletion
    return new NextResponse(null, { status: 204 });

  } catch (err: unknown) {
    console.error("DELETE /api/articles/[id] - Unexpected server error:", err);
    const message = err instanceof Error ? err.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}