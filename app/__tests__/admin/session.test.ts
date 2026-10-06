import { verifySession, requireAuth } from '@/app/lib/supabase-server';
import { redirect } from 'next/navigation';

const mockGetUser = jest.fn();
jest.mock('@supabase/ssr', () => ({ createServerClient: () => ({ auth: { getUser: mockGetUser } }) }));
jest.mock('next/headers', () => ({ cookies: async () => ({ getAll: () => [], set: jest.fn() }) }));
jest.mock('next/navigation', () => ({ redirect: jest.fn(() => { throw new Error('NEXT_REDIRECT'); }) }));
beforeEach(() => jest.clearAllMocks());
test('uses the verified server identity and sends missing sessions to login', async () => {
  const user = { id: 'admin' };
  mockGetUser.mockResolvedValue({ data: { user }, error: null });
  expect(await requireAuth()).toEqual(user);
  expect(redirect).not.toHaveBeenCalled();
  mockGetUser.mockResolvedValue({ data: { user: null }, error: { name: 'AuthSessionMissingError' } });
  expect(await verifySession()).toBeNull();
  await expect(requireAuth()).rejects.toThrow('NEXT_REDIRECT');
  expect(redirect).toHaveBeenCalledWith('/login');
});
