
import React from 'react';
import { render, screen } from '@testing-library/react';
import EventsSection from '@/app/components/EventsSection';
import { LanguageProvider } from '@/app/context/LanguageContext';

describe('EventsSection', () => {

  const mockEvents = [
    { id: '1', title: 'Upcoming Event', title_en: 'Upcoming Event', date: new Date(Date.now() + 86400000).toISOString(), location: 'Test Location', image_url: '/test.jpg', image_alt: 'Test Image', created_at: 'now' },
    { id: '2', title: 'Past Event', title_en: 'Past Event', date: new Date(Date.now() - 86400000).toISOString(), location: 'Test Location', image_url: '/test.jpg', image_alt: 'Test Image', created_at: 'now' },
  ];

  it('renders without crashing', () => {
    render(
      <LanguageProvider>
        <EventsSection events={[]} />
      </LanguageProvider>
    );
    // Removed wait for fetch
  });

  it('displays upcoming and past events passed via props', () => {
    render(
      <LanguageProvider>
        <EventsSection events={mockEvents} />
      </LanguageProvider>
    );

    expect(screen.getByText('Upcoming Event')).toBeInTheDocument();
    expect(screen.getByText('Past Event')).toBeInTheDocument();
  });
});
