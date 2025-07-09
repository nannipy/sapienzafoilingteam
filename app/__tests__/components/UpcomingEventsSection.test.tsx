import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UpcomingEventsSection from '../../components/UpcomingEventsSection';
import { LanguageProvider } from '../../context/LanguageContext';
import { homeTranslations } from '../../translations/home';

// Mock window.open for navigation tests
const mockOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockOpen,
  writable: true
});

const renderWithProvider = (component: React.ReactElement) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('UpcomingEventsSection', () => {
  beforeEach(() => {
    mockOpen.mockClear();
  });

  it('renders upcoming events section with event details', () => {
    renderWithProvider(<UpcomingEventsSection />);
    expect(screen.getByText(homeTranslations.it.upcomingEvents)).toBeInTheDocument();
    expect(screen.getByText('2025 SuMoth Challenge')).toBeInTheDocument();
    expect(screen.getByText('16 Giugno 2025')).toBeInTheDocument();
    expect(screen.getByText('Garda, Verona')).toBeInTheDocument();
  });

  it('handles event card click', () => {
    renderWithProvider(<UpcomingEventsSection />);
    const eventCard = screen.getByText('2025 SuMoth Challenge').closest('div');
    if (eventCard) fireEvent.click(eventCard);
    expect(mockOpen).toHaveBeenCalledWith('https://sumoth.org', '_blank');
  });
});
