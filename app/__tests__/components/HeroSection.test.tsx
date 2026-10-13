import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import HeroSection from '../../components/HeroSection';
import { LanguageProvider } from '../../context/LanguageContext';

const renderWithProvider = (component: React.ReactElement) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('HeroSection', () => {
  const mockOnChevronClick = jest.fn();
  const mockOpen = jest.fn();
  Object.defineProperty(window, 'open', {
    value: mockOpen,
    writable: true
  });
  Object.defineProperty(window, 'scrollTo', {
    value: jest.fn(),
    writable: true
  });

  beforeEach(() => {
    mockOnChevronClick.mockClear();
  });

  it('renders the hero section with team name', () => {
    renderWithProvider(<HeroSection />); // onChevronClick prop was removed from component? checking file content... yes, handled internally
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Sapienza');
    expect(headings[0]).toHaveTextContent('Foiling Team');
  });

  it('renders call to action buttons with correct links', () => {
    renderWithProvider(<HeroSection />);
    const links = screen.getAllByRole('link');
    expect(links.some(l => l.getAttribute('href') === '/team')).toBe(true);
    expect(links.some(l => l.getAttribute('href') === '/boat')).toBe(true);
  });

  it('renders slide navigation buttons', () => {
    renderWithProvider(<HeroSection />);
    const slideButtons = screen.getAllByRole('button');
    expect(slideButtons.length).toBeGreaterThan(0);
  });
  it('scorre automaticamente e permette di mettere in pausa la galleria', () => {
    jest.useFakeTimers();
    const view = renderWithProvider(<HeroSection />);
    try {
      act(() => { jest.advanceTimersByTime(5000); });
      expect(screen.getByAltText('Il Moth del team in regata')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', {name: 'Pausa galleria'}));
      act(() => { jest.advanceTimersByTime(10000); });
      expect(screen.getByAltText('Il Moth del team in regata')).toBeInTheDocument();
      expect(screen.getByRole('button', {name: 'Riprendi galleria'})).toBeInTheDocument();
    } finally {
      view.unmount();
      jest.useRealTimers();
    }
  });

});
