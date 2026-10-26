jest.mock('server-only', () => ({}));
jest.mock('@/app/lib/supabase-admin', () => ({ supabaseAdmin: { from: jest.fn() } }));

import { getEvents } from '@/app/lib/db/events';
import { supabaseAdmin } from '@/app/lib/supabase-admin';

const from = jest.mocked(supabaseAdmin.from);
describe('Event reads', () => {
  it('forwards the public-page cancellation signal to the database query', async () => {
    const signal = AbortSignal.timeout(8000);
    const abortSignal = jest.fn().mockResolvedValue({ data: [], error: null });
    from.mockReturnValue({ select: jest.fn().mockReturnValue({ abortSignal }) } as never);
    await expect(getEvents(signal)).resolves.toEqual([]);
    expect(abortSignal).toHaveBeenCalledWith(signal);
  });
  it('still reports failed reads to callers rather than silently returning no events', async () => {
    from.mockReturnValue({ select: jest.fn().mockResolvedValue({ data: null, error: { message: 'fetch failed' } }) } as never);
    await expect(getEvents()).rejects.toThrow('fetch failed');
  });
});
