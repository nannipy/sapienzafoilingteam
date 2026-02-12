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

  it('calls scroll logic when chevron is clicked', () => {
    renderWithProvider(<HeroSection />);
    const chevronDown = screen.getByTestId('chevron-down');

    // Mock getBoundingClientRect
    const mockGetBoundingClientRect = jest.fn(() => ({ top: 100 }));
    // Mock document.querySelector to return a fake element
    const mockElement = { getBoundingClientRect: mockGetBoundingClientRect };
    jest.spyOn(document, 'querySelector').mockReturnValue(mockElement as any);

    fireEvent.click(chevronDown.closest('button')!);

    expect(window.scrollTo).toHaveBeenCalled();
  });
});
