import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CallToActionSection from '../../components/CallToActionSection';
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

describe('CallToActionSection', () => {
  beforeEach(() => {
    mockOpen.mockClear();
  });

  it('renders call-to-action section', () => {
    renderWithProvider(<CallToActionSection />);
    expect(screen.getByText(homeTranslations.it.joinTeamTitle)).toBeInTheDocument();
    expect(screen.getByText(homeTranslations.it.joinUsButton)).toBeInTheDocument();
  });

  it('handles call-to-action button click', () => {
    renderWithProvider(<CallToActionSection />);
    const joinButton = screen.getByText(homeTranslations.it.joinUsButton);
    fireEvent.click(joinButton);
    expect(mockOpen).toHaveBeenCalledWith('https://forms.gle/vQZf3VMJkiYtFqpZA', '_blank');
  });
});
