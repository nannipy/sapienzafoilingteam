// app/components/__tests__/Navbar.test.tsx

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { LanguageProvider, useLanguage } from '../../context/LanguageContext';
import { navbarTranslations } from '../../translations/navbar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('../../context/LanguageContext', () => ({
  ...jest.requireActual('../../context/LanguageContext'),
  useLanguage: jest.fn(),
}));

const mockUsePathname = usePathname as jest.Mock;

describe('Navbar Component', () => {
  const mockSetLanguage = jest.fn();

  beforeEach(() => {
    mockSetLanguage.mockClear();
    (useLanguage as jest.Mock).mockClear();
    mockUsePathname.mockClear();

    (useLanguage as jest.Mock).mockReturnValue({
      language: 'it',
      setLanguage: mockSetLanguage,
    });
    mockUsePathname.mockReturnValue('/');
  });

  it('renders the logo and navigation items in IT', () => {
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    const desktopNav = screen.getByTestId('desktop-nav');

    expect(desktopNav.querySelector('a[href="/boat"]')).toHaveTextContent(navbarTranslations.it.boat);
    expect(desktopNav.querySelector('a[href="/team"]')).toHaveTextContent(navbarTranslations.it.team);
    expect(desktopNav.querySelector('a[href="/sponsor"]')).toHaveTextContent(navbarTranslations.it.sponsor);
    expect(desktopNav.querySelector('a[href="/contact"]')).toHaveTextContent(navbarTranslations.it.contact);
    expect(desktopNav.querySelector('a[href="/blog"]')).toHaveTextContent(navbarTranslations.it.blog);
    expect(desktopNav.querySelector('a[href="/career"]')).toHaveTextContent(navbarTranslations.it.career);
  });

  it('renders the logo and navigation items in EN', () => {
    (useLanguage as jest.Mock).mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
    });

    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    const desktopNav = screen.getByTestId('desktop-nav');

    expect(desktopNav.querySelector('a[href="/boat"]')).toHaveTextContent(navbarTranslations.en.boat);
    expect(desktopNav.querySelector('a[href="/team"]')).toHaveTextContent(navbarTranslations.en.team);
    expect(desktopNav.querySelector('a[href="/blog"]')).toHaveTextContent(navbarTranslations.en.blog);
    expect(desktopNav.querySelector('a[href="/career"]')).toHaveTextContent(navbarTranslations.en.career);
  });

  it('highlights the current navigation item', () => {
    mockUsePathname.mockReturnValue('/team');
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );
    const desktopNav = screen.getByTestId('desktop-nav');
    const teamLink = desktopNav.querySelector('a[href="/team"]');
    expect(teamLink).toHaveClass('bg-gray-100');
  });

  it('toggles mobile menu when hamburger button is clicked', async () => {
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );
    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation/i });

    fireEvent.click(hamburgerButton!);
    screen.getByTestId('mobile-menu');

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    fireEvent.click(hamburgerButton!);
    // After clicking again, it should disappear or start disappearing.
    // Framer motion removes it from DOM after exit animation.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('closes mobile menu when a generic navigation item is clicked', async () => {
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );
    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation/i });

    fireEvent.click(hamburgerButton);
    const mobileMenu = screen.getByTestId('mobile-menu');
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });
    expect(mobileMenu).toBeInTheDocument();

    const teamLinkInMobile = mobileMenu.querySelector(`a[href="/team"]`);
    expect(teamLinkInMobile).toBeInTheDocument();
    fireEvent.click(teamLinkInMobile!);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('closes mobile menu when "Join Us" link is clicked', async () => {
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );
    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation/i });

    fireEvent.click(hamburgerButton);
    const mobileMenu = screen.getByTestId('mobile-menu');
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    expect(mobileMenu).toBeInTheDocument();

    const joinUsLinkInMobile = mobileMenu.querySelector(`a[href="/career"]`);
    expect(joinUsLinkInMobile).toBeInTheDocument();
    fireEvent.click(joinUsLinkInMobile!);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('mostra la bandiera EN e chiama setLanguage("it") quando la lingua corrente è EN', () => {
    (useLanguage as jest.Mock).mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
    });

    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );

    const flagImage = screen.getByAltText('Italian Flag');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).toHaveAttribute('src', expect.stringContaining('_next/image?url=%2Fflags%2Fit-flag.png'));

    const languageButton = screen.getByRole('button', { name: /switch language/i });
    fireEvent.click(languageButton);

    expect(mockSetLanguage).toHaveBeenCalledTimes(1);
    expect(mockSetLanguage).toHaveBeenCalledWith('it');
  });

  it('mostra la bandiera IT e chiama setLanguage("en") quando la lingua corrente è IT', () => {
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );

    const flagImage = screen.getByAltText('British Flag');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).toHaveAttribute('src', expect.stringContaining('_next/image?url=%2Fflags%2Fen-flag.png'));

    const languageButton = screen.getByRole('button', { name: /switch language/i });
    fireEvent.click(languageButton);

    expect(mockSetLanguage).toHaveBeenCalledTimes(1);
    expect(mockSetLanguage).toHaveBeenCalledWith('en');
  });

});