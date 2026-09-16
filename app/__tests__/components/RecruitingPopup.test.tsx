import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import RecruitingPopup from '../../components/RecruitingPopup';
import { LanguageProvider } from '../../context/LanguageContext';
import { recruitingPopupTranslations } from '../../translations/recruitingPopup';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock framer-motion for instant unmounting in tests
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock posthog
jest.mock('posthog-js/react', () => ({
  usePostHog: () => ({
    capture: jest.fn(),
  }),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('RecruitingPopup', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the popup after initial delay when before deadline', () => {
    // Current test date is 2026-09-16 (before 2026-10-04)
    renderWithProvider(<RecruitingPopup />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(recruitingPopupTranslations.it.title)).toBeInTheDocument();
    expect(screen.getByText(recruitingPopupTranslations.it.cta)).toBeInTheDocument();
    expect(screen.getByText('4 Ottobre')).toBeInTheDocument();
  });

  it('closes when clicking the close button', () => {
    renderWithProvider(<RecruitingPopup />);

    act(() => {
      jest.advanceTimersByTime(800);
    });

    const closeBtn = screen.getByLabelText(recruitingPopupTranslations.it.closeAria);
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when clicking the dismiss button', () => {
    renderWithProvider(<RecruitingPopup />);

    act(() => {
      jest.advanceTimersByTime(800);
    });

    const dismissBtn = screen.getByText(recruitingPopupTranslations.it.dismiss);
    fireEvent.click(dismissBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has CTA link pointing to /career', () => {
    renderWithProvider(<RecruitingPopup />);

    act(() => {
      jest.advanceTimersByTime(800);
    });

    const ctaLink = screen.getByText(recruitingPopupTranslations.it.cta).closest('a');
    expect(ctaLink).toHaveAttribute('href', '/career');
  });
});
