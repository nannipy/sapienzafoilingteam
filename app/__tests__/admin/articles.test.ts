import { articlePayload } from '@/app/lib/article-validation';
import { getArticles, getArticle } from '@/app/lib/db/articles';
import { createArticle, updateArticleAction } from '@/app/actions/articles';

jest.mock('server-only', () => ({}));
jest.mock('react', () => ({ ...jest.requireActual('react'), cache: (fn: unknown) => fn }));
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@/app/lib/supabase-server', () => ({ requireAuth: jest.fn().mockResolvedValue({ id: 'admin' }) }));
const mockQuery = { select: jest.fn(), order: jest.fn(), eq: jest.fn(), single: jest.fn(), insert: jest.fn(), update: jest.fn() };
jest.mock('@/app/lib/supabase-admin', () => ({ supabaseAdmin: { from: () => mockQuery } }));
const published = { id: 'published', title: 'Articolo', title_en: 'Article', content: 'Testo', content_en: 'Text', status: 'published' as const };
const draft = { id: 'draft', title: 'In preparazione', status: 'draft' as const };

beforeEach(() => {
  jest.clearAllMocks();
  for (const method of ['select', 'eq', 'insert', 'update'] as const) mockQuery[method].mockReturnValue(mockQuery);
  mockQuery.order.mockResolvedValue({ data: [published, draft, { id: 'legacy' }], error: null });
  mockQuery.single.mockResolvedValue({ data: draft, error: null });
});

test('incomplete drafts need only a title; publication needs both languages', () => {
  expect(articlePayload({ title: ' Bozza ' })).toMatchObject({ title: 'Bozza', status: 'draft', content_en: '' });
  expect(() => articlePayload({ title: '  ' })).toThrow();
  expect(() => articlePayload({ ...draft, status: 'published' })).toThrow();
  expect(articlePayload(published).status).toBe('published');
  expect(() => articlePayload({ title: 'Test', status: 'invalid' as never })).toThrow();
});

test('drafts stay outside public lists and direct article URLs, including legacy compatibility', async () => {
  expect((await getArticles()).map(a => a.id)).toEqual(['published', 'legacy']);
  expect((await getArticles(true)).map(a => a.id)).toEqual(['published', 'draft', 'legacy']);
  expect(await getArticle('draft')).toBeNull();
  mockQuery.single.mockResolvedValue({ data: published, error: null });
  expect(await getArticle('published')).toEqual(published);
});

test('actions save incomplete drafts and validate before publishing or updating', async () => {
  await createArticle({ title: 'Bozza' });
  expect(mockQuery.insert).toHaveBeenCalledWith([expect.objectContaining({ status: 'draft', title: 'Bozza', content: '', author_id: 'admin' })]);
  await expect(updateArticleAction('draft', { ...draft, status: 'published' })).rejects.toThrow();
  expect(mockQuery.update).not.toHaveBeenCalled();
  mockQuery.single.mockResolvedValue({ data: published, error: null });
  await updateArticleAction('draft', published);
  expect(mockQuery.update).toHaveBeenCalledWith(expect.objectContaining({ status: 'published' }));
});
