import { supabase } from '@/app/lib/supabase';
import { revalidatePath } from 'next/cache';
import { NextResponse, NextRequest } from 'next/server';
import { updateEvents, deleteEvent } from '@/app/lib/supabase-admin';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const { data, error } = await supabase.from('events').select('*').eq('id', id).single();

        if (error) {
            console.error(`Error fetching event with ID ${id}:`, error);
            return NextResponse.json({ error: 'Errore durante il recupero dell\'evento' }, { status: 500 });
        }

        if (!data) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error(`Unexpected error fetching event with ID ${id}:`, error);
        return NextResponse.json({ error: 'Si è verificato un errore imprevisto' }, { status: 500 });
    }
}


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    // 1. Controlla se la richiesta ha un corpo prima di fare qualsiasi altra cosa
    const contentLength = req.headers.get('content-length');
    if (contentLength === '0' || !contentLength) {
        // Questo gestisce sia le richieste con corpo vuoto sia le richieste di preflight OPTIONS
        return NextResponse.json({ error: 'Request body cannot be empty.' }, { status: 400 });
    }

    try {
        // 2. Autenticazione (come prima)
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

        if (!token) {
            return new NextResponse('Unauthorized: No token provided', { status: 401 });
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return new NextResponse('Unauthorized: Invalid token', { status: 401 });
        }

        // 3. Ora puoi analizzare il JSON in sicurezza
        let eventData;
        try {
            eventData = await req.json();
        } catch {
            return NextResponse.json({ error: 'Invalid JSON in request body.' }, { status: 400 });
        }

        const { id } = await params;

        // Controlla se l'ID è valido
        if (!id) {
            return NextResponse.json({ error: 'Event ID is missing.' }, { status: 400 });
        }

        // 4. Chiama la funzione di aggiornamento
        const updatedEvent = await updateEvents(id, eventData);

        // 5. Riconvalida il percorso
        revalidatePath('/');

        // 6. Restituisci l'evento aggiornato
        return NextResponse.json(updatedEvent);

    } catch (error: unknown) {
        console.error("API PUT /events/[id] - Server error:", error);
        return NextResponse.json({ error: 'Si è verificato un errore imprevisto' }, { status: 500 });
    }
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

    const { id } = await params;
    await deleteEvent(id);
    revalidatePath('/career');
    return new NextResponse(null, { status: 204 });
}