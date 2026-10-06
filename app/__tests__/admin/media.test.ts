import { getMediaItems } from '@/app/actions/media';
import { requireAuth } from '@/app/lib/supabase-server';

jest.mock('server-only', () => ({}));
jest.mock('@/app/lib/supabase-server', () => ({ requireAuth: jest.fn() }));
const mockList = jest.fn();
jest.mock('@/app/lib/supabase-admin', () => ({ supabaseAdmin: { storage: { from: () => ({ list: mockList }) } } }));
beforeEach(() => {
  jest.clearAllMocks();
  (requireAuth as jest.Mock).mockResolvedValue({ id: 'admin' });
});
test('reads all pages and preserves folders and placeholders for recursive operations', async () => {
  const first = Array.from({ length: 100 }, (_, i) => ({ name: `image-${i}`, id: `${i}` }));
  const last = [{ name: 'subfolder', id: null }, { name: '.emptyFolderPlaceholder', id: 'placeholder' }];
  mockList.mockResolvedValueOnce({ data: first, error: null }).mockResolvedValueOnce({ data: last, error: null });
  expect(await getMediaItems('blog')).toEqual([...first, ...last]);
  expect(mockList).toHaveBeenNthCalledWith(2, 'blog', expect.objectContaining({ offset: 100 }));
});
test('requires authentication before reading privileged storage', async () => {
  (requireAuth as jest.Mock).mockRejectedValue(new Error('NEXT_REDIRECT'));
  await expect(getMediaItems('')).rejects.toThrow('NEXT_REDIRECT');
  expect(mockList).not.toHaveBeenCalled();
});
test('rejects invalid paths and reports storage errors instead of empty results', async () => {
  await expect(getMediaItems('../private')).rejects.toThrow('Percorso');
  expect(mockList).not.toHaveBeenCalled();
  mockList.mockResolvedValue({ data: null, error: { message: 'Storage unavailable' } });
  await expect(getMediaItems('')).rejects.toThrow('Storage unavailable');
});
