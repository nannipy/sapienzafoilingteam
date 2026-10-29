import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { getEvents } from '@/app/lib/db/events';

jest.mock('@/app/lib/db/events', () => ({ getEvents: jest.fn() }));
jest.mock('@/app/components/HeroSection', () => ({ __esModule: true, default: () => <h1>Sapienza Foiling Team</h1> }));
jest.mock('@/app/components/BoatGallerySection', () => ({ __esModule: true, default: () => <p>Galleria della barca</p> }));
jest.mock('@/app/components/FleetShowcaseSection', () => ({ __esModule: true, default: () => <p>La flotta</p> }));
jest.mock('@/app/components/CallToActionSection', () => ({ __esModule: true, default: () => <p>Entra nel team</p> }));
jest.mock('@/app/components/EventsSection', () => ({ __esModule: true, default: ({ events, unavailable }: { events: unknown[]; unavailable: boolean }) => <p>{unavailable ? 'Eventi non raggiungibili' : `Eventi: ${events.length}`}</p> }));
jest.mock('@/app/components/SftDayCountdownBanner', () => ({ __esModule: true, default: () => null }));

const load = jest.mocked(getEvents);
describe('Homepage event availability', () => {
  beforeEach(() => { jest.clearAllMocks(); });
  it('keeps the rest of the homepage available when the database fails', async () => {
    load.mockRejectedValue(new Error('fetch failed'));
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      render(await Home());
      expect(screen.getByRole('heading', { name: 'Sapienza Foiling Team' })).toBeInTheDocument();
      expect(screen.getByText('La flotta')).toBeInTheDocument();
      expect(screen.getByText('Entra nel team')).toBeInTheDocument();
      expect(screen.getByText('Eventi non raggiungibili')).toBeInTheDocument();
      expect(load.mock.calls[0][0]).toBeDefined();
    } finally { log.mockRestore(); }
  });
  it('shows events normally after a successful read', async () => {
    load.mockResolvedValue([]);
    render(await Home());
    expect(screen.getByText('Eventi: 0')).toBeInTheDocument();
    expect(screen.queryByText('Eventi non raggiungibili')).not.toBeInTheDocument();
  });
});
