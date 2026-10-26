import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import SftDayPopup from '../../components/SftDayPopup';
import { LanguageProvider } from '../../context/LanguageContext';
import { sftDayPromoTranslations } from '../../translations/sftDayPromo';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

jest.mock('framer-motion', () => ({
  useReducedMotion: () => true,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

jest.mock('posthog-js/react', () => ({
  usePostHog: () => ({ capture: jest.fn() }),
}));

const renderWithProvider = (component: React.ReactElement) =>
  render(<LanguageProvider>{component}</LanguageProvider>);

describe('SftDayPopup', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-10-26T12:00:00Z'));
    localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the SFT Day invitation and links to the booking page', () => {
    renderWithProvider(<SftDayPopup />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1300);
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(sftDayPromoTranslations.it.title)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: sftDayPromoTranslations.it.cta })).toHaveAttribute(
      'href',
      '/sft-day',
    );
  });

  it('stays hidden after the campaign deadline', () => {
    jest.setSystemTime(new Date('2026-11-10T12:00:00Z'));
    renderWithProvider(<SftDayPopup />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('can be dismissed without leaving the page', () => {
    renderWithProvider(<SftDayPopup />);

    act(() => {
      jest.advanceTimersByTime(1300);
    });

    fireEvent.click(screen.getByText(sftDayPromoTranslations.it.dismiss));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
