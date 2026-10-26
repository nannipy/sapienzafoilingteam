import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import BoatGallerySection from '@/app/components/BoatGallerySection';

jest.mock('@/app/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'it' }) }));

test('switches between photos and manually played videos, and wraps navigation', () => {
  const { container } = render(<BoatGallerySection />);
  expect(screen.getByRole('img', { name: 'Meravijosa sul Garda' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Video: Meravijosa in acqua' }));
  const video = container.querySelector('video');
  expect(video).toHaveAttribute('controls');
  expect(video).toHaveAttribute('preload', 'none');
  expect(video).not.toHaveAttribute('autoplay');
  fireEvent.click(screen.getByRole('button', { name: 'Contenuto precedente' }));
  expect(container.querySelector('video')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Contenuto precedente' }));
  expect(screen.getByRole('button', { name: 'Foto: Gli ultimi dettagli' })).toHaveAttribute('aria-pressed', 'true');
});
