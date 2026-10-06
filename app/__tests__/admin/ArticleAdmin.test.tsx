import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ArticleAdmin from '@/app/components/ArticleAdmin';
import { AdminProvider } from '@/app/context/AdminContext';
import { getArticles, createArticle, updateArticleAction } from '@/app/actions/articles';
import type { User } from '@supabase/supabase-js';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }));
jest.mock('@/app/context/LanguageContext', () => ({ useLanguage: () => ({ language: 'it' }) }));
jest.mock('@/app/lib/supabase', () => ({ supabase: {} }));
jest.mock('@/app/actions/articles', () => ({ getArticles: jest.fn(), createArticle: jest.fn(), updateArticleAction: jest.fn(), deleteArticleAction: jest.fn() }));
jest.mock('next/dynamic', () => () => function Editor({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <textarea aria-label="Contenuto" value={value} onChange={e => onChange(e.target.value)} />; });
const draft = { id: 'draft', title: 'Bozza iniziale', content: '', title_en: '', content_en: '', status: 'draft', created_at: '2026-10-06', image_url: null };
const published = { ...draft, id: 'published', title: 'Articolo pubblico', title_en: 'Published', content: 'Testo', content_en: 'Text', status: 'published' };
function mount(section: 'draft' | 'published' = 'draft') {
  return render(<AdminProvider user={{ id: 'admin' } as User}><ArticleAdmin section={section} /></AdminProvider>);
}
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
  (getArticles as jest.Mock).mockResolvedValue([draft, published]);
  (createArticle as jest.Mock).mockImplementation(async data => ({ ...draft, ...data }));
  (updateArticleAction as jest.Mock).mockImplementation(async (id, data) => ({ ...draft, ...data, id }));
});
afterEach(() => jest.restoreAllMocks());

test('draft section saves an incomplete article and keeps typed content when title changes', async () => {
  mount();
  await screen.findByText('Bozza iniziale');
  expect(screen.queryByText('Articolo pubblico')).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('Nuovo articolo'));
  fireEvent.change(screen.getAllByLabelText('Contenuto')[0], { target: { value: 'Ultima frase appena scritta' } });
  fireEvent.change(screen.getByLabelText(/Titolo.*IT/), { target: { value: 'Nuova bozza' } });
  expect(screen.getAllByLabelText('Contenuto')[0]).toHaveValue('Ultima frase appena scritta');
  fireEvent.click(screen.getByText('Salva bozza'));
  await waitFor(() => expect(createArticle).toHaveBeenCalledWith(expect.objectContaining({ title: 'Nuova bozza', content: 'Ultima frase appena scritta', status: 'draft' })));
  expect(await screen.findByRole('status')).toHaveTextContent('Bozza salvata');
});

test('publishing validates both languages and moves a completed draft to articles', async () => {
  mount();
  fireEvent.click(await screen.findByTitle('Modifica'));
  fireEvent.click(screen.getByText('Pubblica articolo'));
  expect(await screen.findByRole('alert')).toHaveTextContent('entrambe le lingue');
  expect(updateArticleAction).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText(/Titolo.*EN/), { target: { value: 'English title' } });
  fireEvent.change(screen.getAllByLabelText('Contenuto')[0], { target: { value: 'Italiano' } });
  fireEvent.change(screen.getAllByLabelText('Contenuto')[1], { target: { value: 'English' } });
  fireEvent.click(screen.getByText('Pubblica articolo'));
  await waitFor(() => expect(updateArticleAction).toHaveBeenCalledWith('draft', expect.objectContaining({ status: 'published', content_en: 'English' })));
  expect(mockPush).toHaveBeenCalledWith('/admin');
});

test('published articles can be moved back into drafts', async () => {
  mount('published');
  fireEvent.click(await screen.findByTitle('Modifica'));
  fireEvent.click(screen.getByText('Salva bozza'));
  await waitFor(() => expect(updateArticleAction).toHaveBeenCalledWith('published', expect.objectContaining({ status: 'draft' })));
  expect(mockPush).toHaveBeenCalledWith('/admin/drafts');
});
