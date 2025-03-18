import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Navbar from '../../components/Navbar';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  },
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('renders the logo and navigation items', () => {
    render(<Navbar />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    const desktopNav = screen.getByTestId('desktop-nav');
    expect(desktopNav.querySelector('a[href="/fleet"]')).toHaveTextContent('Flotta');
    expect(desktopNav.querySelector('a[href="/team"]')).toHaveTextContent('Team');
    expect(desktopNav.querySelector('a[href="/sponsor"]')).toHaveTextContent('Sponsor');
    expect(desktopNav.querySelector('a[href="/contact"]')).toHaveTextContent('Contatti');
    expect(desktopNav.querySelector('a[target="_blank"]')).toHaveTextContent('Join Us');
  });


  it('highlights the current navigation item', () => {
    (usePathname as jest.Mock).mockReturnValue('/team');
    render(<Navbar />);
    const desktopNav = screen.getByTestId('desktop-nav');
    const teamLink = desktopNav.querySelector('a[href="/team"]');
    expect(teamLink).toHaveClass('bg-gray-100');
  });

  it('toggles mobile menu when hamburger button is clicked', async () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button');
    const mobileMenu = screen.getByTestId('mobile-menu');
    
    fireEvent.click(menuButton);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    
    expect(mobileMenu).toHaveClass('opacity-100');
    
    fireEvent.click(menuButton);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    
    expect(mobileMenu).toHaveClass('opacity-0');
  });

  it('closes mobile menu when a navigation item is clicked', async () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button');
    const mobileMenu = screen.getByTestId('mobile-menu');
    
    fireEvent.click(menuButton);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    
    const teamLink = mobileMenu.querySelector('a[href="/team"]');
    fireEvent.click(teamLink!);
    
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    });
    
    expect(mobileMenu).toHaveClass('opacity-0');
  });

  it('has correct href attributes for navigation links', () => {
    render(<Navbar />);
    const desktopNav = screen.getByTestId('desktop-nav');
    expect(desktopNav.querySelector('a[href="/fleet"]')).toBeInTheDocument();
    expect(desktopNav.querySelector('a[href="/team"]')).toBeInTheDocument();
    expect(desktopNav.querySelector('a[href="/sponsor"]')).toBeInTheDocument();
    expect(desktopNav.querySelector('a[href="/contact"]')).toBeInTheDocument();
  });
});