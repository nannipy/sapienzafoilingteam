import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { LanguageProvider } from '../../context/LanguageContext';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: { src: string; alt: string; }) => {
    return <Image {...props} alt={props.alt || ''} />
  },
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('Footer Component', () => {
  it('displays the copyright text', () => {
    renderWithProvider(<Footer />);
    expect(screen.getByText(`© ${new Date().getFullYear()} Sapienza Foiling Team`)).toBeInTheDocument();
  });

  it('renders social media links', () => {
    renderWithProvider(<Footer />);
    for (const name of ['Instagram', 'LinkedIn', 'Facebook']) {
      const link = screen.getByRole('link', {name});
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
    expect(screen.getByRole('link', {name: 'Privacy Policy'})).toHaveAttribute('href', '/privacy-policy');
    expect(screen.getByRole('link', {name: 'sapienzafoilingteam@gmail.com'})).toHaveAttribute('href', 'mailto:sapienzafoilingteam@gmail.com');
  });

  it('has accessible social media links', () => {
    // Basic accessibility check - ensure links have hrefs
    renderWithProvider(<Footer />);
    const socialLinks = screen.getAllByRole('link');
    socialLinks.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('has social media icons', () => {
    renderWithProvider(<Footer />);
    // Just verify icons exist
    const icons = document.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });
});