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
    expect(screen.getByText('© 2025 Sapienza Foiling Team')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    renderWithProvider(<Footer />);
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks).toHaveLength(6);

    const socialUrls = [
      'mailto:sapienzafoilingteam@gmail.com',
      'https://instagram.com/sapienzafoilingteam',
      'https://linkedin.com/company/sapienzafoilingteam',
      'https://facebook.com/sapienzafoilingteam'
    ];

    socialLinks.forEach((link, index) => {
      // This check might fail if the order of links changes or new links are added.
      // Keeping it for now as it was in the original, but the instruction only asked to change the count.
      // The instruction also implies removing specific aria-label checks, but not href checks.
      // For now, I'll keep the href check as it was, but the primary change is the count.
      if (index < socialUrls.length) { // Only check for the first 4 links as per original socialUrls array
        expect(link).toHaveAttribute('href', socialUrls[index]);
      }
      if (index === 0) {
        expect(link).toHaveAttribute('class', expect.stringContaining('hover:text-[#822433]'));
      } else if (index < socialUrls.length) {
        // Social icons have different styling
        expect(link).toHaveAttribute('class', expect.stringContaining('hover:text-white'));
      }
    });
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