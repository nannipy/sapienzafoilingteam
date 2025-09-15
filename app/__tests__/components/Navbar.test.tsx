// app/components/__tests__/Navbar.test.tsx

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { usePathname } from 'next/navigation'; // Questo importerà il mock da __mocks__
import Navbar from '../../components/Navbar'; // Path relativo corretto al componente
import { LanguageProvider, useLanguage } from '../../context/LanguageContext'; // Path relativo corretto
import { navbarTranslations } from '../../translations/navbar'; // Path relativo corretto

// Mock di useLanguage per fornire valori controllati
// Questo mock è specifico per questo file di test e sovrascriverà
// qualsiasi mock globale per useLanguage se esistesse (ma non dovrebbe per i contesti)
jest.mock('../../context/LanguageContext', () => ({
  ...jest.requireActual('../../context/LanguageContext'), // Importa l'originale per LanguageProvider
  useLanguage: jest.fn(),
}));

// usePathname è già mockato globalmente tramite __mocks__/next/navigation.ts
// Ma possiamo riaffermare il mock qui se vogliamo essere espliciti o sovrascriverlo
// jest.mock('next/navigation', () => ({
//   usePathname: jest.fn(),
// }));
// Non è strettamente necessario se il mock globale funziona, ma per chiarezza:
const mockUsePathname = usePathname as jest.Mock;


describe('Navbar Component', () => {
  const mockSetLanguage = jest.fn();

  beforeEach(() => {
    // Resetta i mock prima di ogni test
    mockSetLanguage.mockClear();
    (useLanguage as jest.Mock).mockClear();
    mockUsePathname.mockClear(); // Resetta anche il mock di usePathname

    // Impostazioni di default per i mock, possono essere sovrascritte nei singoli test
    (useLanguage as jest.Mock).mockReturnValue({
      language: 'it', // Default a IT per la maggior parte dei test esistenti
      setLanguage: mockSetLanguage,
    });
    mockUsePathname.mockReturnValue('/'); // Default path
  });

  // --- Test dal "vecchio" file, ora adattati ---
  it('renders the logo and navigation items in IT', () => {
    // useLanguage è già mockato per ritornare 'it' dal beforeEach
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    const desktopNav = screen.getByTestId('desktop-nav'); // Assicurati che data-testid esista nel JSX
    
    expect(desktopNav.querySelector('a[href="/boat"]')).toHaveTextContent(navbarTranslations.it.boat);
    expect(desktopNav.querySelector('a[href="/team"]')).toHaveTextContent(navbarTranslations.it.team);
    expect(desktopNav.querySelector('a[href="/sponsor"]')).toHaveTextContent(navbarTranslations.it.sponsor);
    expect(desktopNav.querySelector('a[href="/contact"]')).toHaveTextContent(navbarTranslations.it.contact);
    expect(desktopNav.querySelector('a[href="/blog"]')).toHaveTextContent(navbarTranslations.it.blog);
    expect(desktopNav.querySelector('a[target="_blank"]')).toHaveTextContent(navbarTranslations.it.joinUs);
  });

  it('renders the logo and navigation items in EN', () => {
    (useLanguage as jest.Mock).mockReturnValue({ // Sovrascrivi per questo test
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
    // ... eccetera per gli altri link in EN
    expect(desktopNav.querySelector('a[href="/blog"]')).toHaveTextContent(navbarTranslations.en.blog);
    expect(desktopNav.querySelector('a[target="_blank"]')).toHaveTextContent(navbarTranslations.en.joinUs);
  });

  it('highlights the current navigation item', () => {
    mockUsePathname.mockReturnValue('/team'); // usePathname mockato globalmente o localmente
    // language è 'it' dal beforeEach
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );
    const desktopNav = screen.getByTestId('desktop-nav');
    const teamLink = desktopNav.querySelector('a[href="/team"]');
    expect(teamLink).toHaveClass('bg-gray-100'); // Verifica la classe di highlighting
  });

  it('toggles mobile menu when hamburger button is clicked', async () => {
    // language è 'it' dal beforeEach
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );
    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation/i }); // NUOVA RIGA CORRETTA
    // Dovrai trovare il bottone del menu hamburger specificamente.
    // Potrebbe essere necessario aggiungere un aria-label o data-testid al bottone del menu hamburger.
    // Esempio se avesse un aria-label="Toggle menu":
    const mobileMenu = screen.getByTestId('mobile-menu'); // Assicurati che data-testid esista
    
    fireEvent.click(hamburgerButton!); // Usa ! se sei sicuro che esista, altrimenti controlla prima

    // La logica con act e setTimeout può essere mantenuta per ora
    // per gestire le transizioni CSS, sebbene ci siano tecniche più avanzate
    // come jest.useFakeTimers() se le transizioni sono basate su JS setTimeout
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350)); // Leggermente più del transition duration
    });
    
    expect(mobileMenu).toHaveClass('max-h-96', 'opacity-100'); // Verifica le classi di visibilità
    
    fireEvent.click(hamburgerButton!);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });
    
    expect(mobileMenu).toHaveClass('max-h-0', 'opacity-0'); // Verifica le classi di chiusura
  });

    it('closes mobile menu when a generic navigation item is clicked', async () => {
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );
    // Usa il selettore corretto e robusto per il bottone hamburger
    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation/i });
    const mobileMenu = screen.getByTestId('mobile-menu');

    // 1. Apri il menu mobile
    fireEvent.click(hamburgerButton);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });
    // Verifica che il menu sia aperto (opzionale ma buono per debug)
    expect(mobileMenu).toHaveClass('max-h-96', 'opacity-100');

    // 2. Trova e clicca un item di navigazione (es. "Team") nel menu mobile
    // Nota: mobileMenu.querySelector(...) cerca solo DENTRO il menu mobile
    const teamLinkInMobile = mobileMenu.querySelector(`a[href="/team"]`);
    expect(teamLinkInMobile).toBeInTheDocument(); // Assicurati che il link sia lì
    fireEvent.click(teamLinkInMobile!);
    
    // 3. Aspetta la transizione di chiusura
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });
    
    // 4. Verifica che il menu sia chiuso
    expect(mobileMenu).toHaveClass('max-h-0', 'opacity-0');
  });

  // Test separato per il link "Join Us" per coprire la linea 115
  it('closes mobile menu when "Join Us" link is clicked', async () => {
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );
    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation/i });
    const mobileMenu = screen.getByTestId('mobile-menu');

    // 1. Apri il menu mobile
    fireEvent.click(hamburgerButton);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });
    expect(mobileMenu).toHaveClass('max-h-96', 'opacity-100');

    // 2. Trova e clicca il link "Join Us" nel menu mobile
    const joinUsLinkInMobile = mobileMenu.querySelector(`a[href^="https://docs.google.com/forms"]`);
    expect(joinUsLinkInMobile).toBeInTheDocument();
    fireEvent.click(joinUsLinkInMobile!);
    
    // 3. Aspetta la transizione di chiusura
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });
    
    // 4. Verifica che il menu sia chiuso
    expect(mobileMenu).toHaveClass('max-h-0', 'opacity-0');
  });

  // --- Test dal "nuovo" file (cambio lingua) ---
  it('mostra la bandiera EN e chiama setLanguage("it") quando la lingua corrente è EN', () => {
    (useLanguage as jest.Mock).mockReturnValue({ // Sovrascrivi per questo test
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
    expect(flagImage).toHaveAttribute('src', expect.stringContaining('/flags/it-flag.png'));

    const languageButton = screen.getByRole('button', { name: /switch language/i }); 
    fireEvent.click(languageButton);

    expect(mockSetLanguage).toHaveBeenCalledTimes(1);
    expect(mockSetLanguage).toHaveBeenCalledWith('it');
  });

  it('mostra la bandiera IT e chiama setLanguage("en") quando la lingua corrente è IT', () => {
    // language è 'it' dal beforeEach, quindi non serve sovrascrivere useLanguage qui
    render(
      <LanguageProvider>
        <Navbar />
      </LanguageProvider>
    );

    const flagImage = screen.getByAltText('British Flag');
    expect(flagImage).toBeInTheDocument();
    expect(flagImage).toHaveAttribute('src', expect.stringContaining('/flags/en-flag.png'));

    const languageButton = screen.getByRole('button', { name: /switch language/i }); // NUOVA RIGA CORRETTA
    fireEvent.click(languageButton);

    expect(mockSetLanguage).toHaveBeenCalledTimes(1);
    expect(mockSetLanguage).toHaveBeenCalledWith('en');
  });

});