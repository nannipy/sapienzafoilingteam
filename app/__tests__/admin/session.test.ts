import { verifySession, requireAdmin } from '@/app/lib/supabase-server';
import { redirect } from 'next/navigation';

const mockGetUser = jest.fn();
jest.mock('@supabase/ssr', () => ({ createServerClient: () => ({ auth: { getUser: mockGetUser } }) }));
jest.mock('next/headers', () => ({ cookies: async () => ({ getAll: () => [], set: jest.fn() }) }));
jest.mock('next/navigation', () => ({ redirect: jest.fn(() => { throw new Error('NEXT_REDIRECT'); }) }));
beforeEach(() => jest.clearAllMocks());
test('uses the verified server identity and sends missing sessions to login', async () => {
  const user = { id: 'admin', app_metadata: { role: 'admin' } };
  mockGetUser.mockResolvedValue({ data: { user }, error: null });
  expect(await requireAdmin()).toEqual(user);
  expect(redirect).not.toHaveBeenCalled();
  mockGetUser.mockResolvedValue({ data: { user: null }, error: { name: 'AuthSessionMissingError' } });
  expect(await verifySession()).toBeNull();
  await expect(requireAdmin()).rejects.toThrow('NEXT_REDIRECT');
  expect(redirect).toHaveBeenCalledWith('/login');
});

test('rejects authenticated users without a server-managed admin claim', async () => {
  for (const user of [{ id: 'member' }, { id: 'member', user_metadata: { role: 'admin' } }, { id: 'member', app_metadata: { role: 'member' } }]) {
    mockGetUser.mockResolvedValue({ data: { user }, error: null });
    await expect(requireAdmin()).rejects.toThrow('NEXT_REDIRECT');
  }
});
