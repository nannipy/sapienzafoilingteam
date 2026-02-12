'use server';

import { supabaseAdmin } from '@/app/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { Article } from '@/app/lib/types';
import { requireAuth } from '@/app/lib/supabase-server';

export async function getArticles() {
    await requireAuth();

    if (!supabaseAdmin) throw new Error('Server configuration error');

    const { data, error } = await supabaseAdmin
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }
    return data as Article[];
}

export async function createArticle(articleData: Partial<Article>) {
    const user = await requireAuth();

    if (!supabaseAdmin) throw new Error('Server configuration error');

    if (!articleData.title || !articleData.content || !articleData.title_en || !articleData.content_en) {
        throw new Error('Missing required fields');
    }

    const { data, error } = await supabaseAdmin
        .from('posts')
        .insert([
            {
                title: articleData.title,
                slug: articleData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                content: articleData.content,
                title_en: articleData.title_en,
                content_en: articleData.content_en,
                image_url: articleData.image_url || null,
                image_alt: articleData.image_alt || null,
                author_id: user.id
            }
        ])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/blog');
    revalidatePath('/admin'); // Admin list
    return data;
}

export async function updateArticleAction(id: string, articleData: Partial<Article>) {
    await requireAuth();

    if (!supabaseAdmin) throw new Error('Server configuration error');

    const { data, error } = await supabaseAdmin
        .from('posts')
        .update({
            title: articleData.title,
            content: articleData.content,
            title_en: articleData.title_en,
            content_en: articleData.content_en,
            image_url: articleData.image_url || null,
            image_alt: articleData.image_alt || null,
            // Don't update slug usually, or update if title changes? better keep it stable for SEO or optional
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/blog');
    revalidatePath(`/blog/${id}`);
    revalidatePath('/admin');
    return data;
}

export async function deleteArticleAction(id: string) {
    await requireAuth();

    if (!supabaseAdmin) throw new Error('Server configuration error');

    const { error } = await supabaseAdmin
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/blog');
    revalidatePath('/admin');
    return { success: true };
}
