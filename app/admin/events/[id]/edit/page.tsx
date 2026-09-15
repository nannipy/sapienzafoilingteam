'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import EventForm from '@/app/components/EventForm';
import { Event } from '@/app/lib/types';
import { getEventAction, updateEventAction } from '@/app/actions/events';
import { useLanguage } from '@/app/context/LanguageContext';
import { eventTranslations } from '@/app/translations/event';
import { Loader2 } from 'lucide-react';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { language } = useLanguage();

    const [event, setEvent] = useState<Partial<Event> | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getEventAction(id);
                setEvent(data);
            } catch (err) {
                const message = err instanceof Error ? err.message : "An unknown error occurred.";
                console.error("Failed to fetch event:", message);
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id]);

    const handleUpdate = async (eventData: Partial<Event>) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await updateEventAction(id, eventData);
            router.push('/admin/events');
        } catch (err) {
            const message = err instanceof Error ? err.message : eventTranslations[language].admin.error;
            console.error("Error updating event:", message);
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-brand" /></div>;
    }

    if (!event) {
        return <p className="text-center text-red-500 p-8">{error || "Event not found."}</p>;
    }

    return (
        <EventForm
            initialData={event}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            error={error}
            pageTitle={eventTranslations[language].admin.editEvent}
            submitButtonText="Save Changes"
        />
    );
}