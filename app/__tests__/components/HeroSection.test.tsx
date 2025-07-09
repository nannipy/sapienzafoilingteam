import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from '../../components/HeroSection';
import { LanguageProvider } from '../../context/LanguageContext';

const renderWithProvider = (component: React.ReactElement) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('HeroSection', () => {
  const mockOnChevronClick = jest.fn();

  beforeEach(() => {
    mockOnChevronClick.mockClear();
  });

  it('renders the hero section with team name', () => {
    renderWithProvider(<HeroSection onChevronClick={mockOnChevronClick} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Sapienza Foiling Team');
  });

  it('calls onChevronClick when chevron is clicked', () => {
    renderWithProvider(<HeroSection onChevronClick={mockOnChevronClick} />);
    const chevronDown = screen.getByTestId('chevron-down');
    fireEvent.click(chevronDown);
    expect(mockOnChevronClick).toHaveBeenCalledTimes(1);
  });
});
