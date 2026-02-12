'use client';

import { useRouter } from 'next/navigation';
import EventForm from '@/app/components/EventForm'; // We will create this reusable component
import { Event } from '@/app/lib/types';
import { createEvent } from '@/app/actions/events';
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
            // Server Action call
            await createEvent(eventData as Omit<Event, 'id' | 'created_at'>);

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