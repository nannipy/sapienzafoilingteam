import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../../page';
import { LanguageProvider } from '../../context/LanguageContext';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { id: 1, title: 'Upcoming Event', title_en: 'Upcoming Event', date: new Date(Date.now() + 86400000).toISOString(), location: 'Test Location', image_url: '/test.jpg', image_alt: 'Test Image', link: '#' },
    ]),
  } as Response)
);

// Mock window.scrollTo for navigation tests
const mockScrollTo = jest.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true
});
Object.defineProperty(window, 'pageYOffset', {
  value: 0,
  writable: true
});

const renderWithProvider = (component: React.ReactElement) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('Home Page', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  it('renders all sections of the home page', async () => {
    renderWithProvider(<HomePage />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    // Check for elements from each section to ensure they are rendered
    expect(screen.getByText('Sapienza Foiling Team')).toBeInTheDocument(); // From HeroSection
    expect(await screen.findByText('Prossimi Eventi')).toBeInTheDocument(); // From UpcomingEventsSection
    expect(screen.getByText('Seguici sui nostri social')).toBeInTheDocument(); // From SocialMediaSection
    expect(screen.getByText('Entra a far parte del team')).toBeInTheDocument(); // From CallToActionSection
  });

  it('scrolls to upcoming events section when chevron is clicked', () => {
    const mockGetBoundingClientRect = jest.fn().mockReturnValue({ top: 500 });
    const mockQuerySelector = jest.fn().mockReturnValue({
      getBoundingClientRect: mockGetBoundingClientRect
    });
    document.querySelector = mockQuerySelector;

    renderWithProvider(<HomePage />);
    const chevronDown = screen.getByTestId('chevron-down');
    fireEvent.click(chevronDown);

    expect(mockQuerySelector).toHaveBeenCalledWith('#upcoming-events');
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 400,
      behavior: 'smooth'
    });
  });
});
