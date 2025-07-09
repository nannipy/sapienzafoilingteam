import React from 'react';
import { render, screen } from '@testing-library/react';
import SocialMediaSection from '../../components/SocialMediaSection';
import { LanguageProvider } from '../../context/LanguageContext';
import { homeTranslations } from '../../translations/home';

const renderWithProvider = (component: React.ReactElement) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('SocialMediaSection', () => {
  it('renders social media links', () => {
    renderWithProvider(<SocialMediaSection />);
    expect(screen.getByText(homeTranslations.it.followUs)).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toHaveAttribute('href', 'https://www.instagram.com/sapienzafoilingteam/');
    expect(screen.getByLabelText('LinkedIn')).toHaveAttribute('href', 'https://www.linkedin.com/company/sapienza-foiling-team/about/');
    expect(screen.getByLabelText('Facebook')).toHaveAttribute('href', 'https://www.facebook.com/profile.php?id=61572515878295');
  });
});
