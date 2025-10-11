
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EventsSection from '@/app/components/EventsSection';
import { LanguageProvider } from '@/app/context/LanguageContext';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  } as Response)
);

describe('EventsSection', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders without crashing', async () => {
    render(
      <LanguageProvider>
        <EventsSection />
      </LanguageProvider>
    );
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  it('fetches and displays upcoming and past events', async () => {
    const mockEvents = [
      { id: 1, title: 'Upcoming Event', title_en: 'Upcoming Event', date: new Date(Date.now() + 86400000).toISOString(), location: 'Test Location', image_url: '/test.jpg', image_alt: 'Test Image', link: '#' },
      { id: 2, title: 'Past Event', title_en: 'Past Event', date: new Date(Date.now() - 86400000).toISOString(), location: 'Test Location', image_url: '/test.jpg', image_alt: 'Test Image', link: '#' },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEvents),
    });

    render(
      <LanguageProvider>
        <EventsSection />
      </LanguageProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Upcoming Event')).toBeInTheDocument();
      expect(screen.getByText('Past Event')).toBeInTheDocument();
    });
  });
});
