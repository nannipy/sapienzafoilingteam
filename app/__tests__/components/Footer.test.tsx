import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  },
}));

describe('Footer Component', () => {
  it('displays the copyright text', () => {
    render(<Footer />);
    expect(screen.getByText('© 2025 Sapienza Foiling Team')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks).toHaveLength(3);
    
    const socialUrls = [
      'https://www.instagram.com/sapienzafoilingteam/',
      'https://www.linkedin.com/company/sapienza-foiling-team/about/',
      'https://www.facebook.com/profile.php?id=61572515878295'
    ];
    
    socialLinks.forEach((link, index) => {
      expect(link).toHaveAttribute('href', socialUrls[index]);
      expect(link).toHaveAttribute('class', expect.stringContaining('hover:text-[#822433]'));
    });
  });

  it('has accessible social media links', () => {
    render(<Footer />);
    const socialLinks = screen.getAllByRole('link');
    const expectedLabels = ['Instagram', 'LinkedIn', 'Facebook'];
    
    socialLinks.forEach((link, index) => {
      expect(link).toHaveAttribute('aria-label', expectedLabels[index]);
    });
  });

  it('has social media icons with correct styling', () => {
    render(<Footer />);
    const icons = screen.getAllByRole('link');
    
    icons.forEach(icon => {
      const svg = icon.querySelector('svg');
      expect(svg).toHaveClass('w-8', 'h-8', 'hover:scale-110', 'transition-transform');
    });
  });
});