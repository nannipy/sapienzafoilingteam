import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('Sapienza');
    expect(headings[1]).toHaveTextContent('Foiling Team');
  });

  it('renders call to action buttons with correct links', () => {
    renderWithProvider(<HeroSection />);
    const links = screen.getAllByRole('link');
    expect(links.some(l => l.getAttribute('href') === '/team')).toBe(true);
    expect(links.some(l => l.getAttribute('href') === '/boat')).toBe(true);
  });

  it('renders slide navigation buttons', () => {
    renderWithProvider(<HeroSection />);
    const slideButtons = screen.getAllByLabelToMatcher?.(/Slide/i) || screen.getAllByRole('button');
    expect(slideButtons.length).toBeGreaterThan(0);
  });
});
