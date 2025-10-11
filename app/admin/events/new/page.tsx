'use client';

import { useRouter } from 'next/navigation';
import EventForm from '@/app/components/EventForm'; // We will create this reusable component
import { Event } from '@/app/lib/types';
import { supabase } from '@/app/lib/supabase';
import { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { eventTranslations } from '@/app/translations/event';

export default function NewEventPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async (eventData: Partial<Event>) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const session = (await supabase.auth.getSession()).data.session;
            if (!session) throw new Error("Authentication session not found.");
            
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) throw new Error((await response.json()).error || 'Failed to create event.');
            
            // Optionally, you can use Next.js's router to pass a success message
            // For now, we just redirect.
            router.push('/admin/events');

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : eventTranslations[language].admin.error;
            console.error("Error creating event:", message);
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <EventForm 
            onSubmit={handleCreate} 
            isSubmitting={isSubmitting} 
            error={error} 
            pageTitle={eventTranslations[language].admin.newEvent}
            submitButtonText="Publish Event"
        />
    );
}