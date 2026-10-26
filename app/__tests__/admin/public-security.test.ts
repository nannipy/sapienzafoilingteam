/** @jest-environment node */
jest.mock('server-only', () => ({}));
const mockHeaders = jest.fn();
const mockRpc = jest.fn();
jest.mock('next/headers', () => ({ headers: () => mockHeaders() }));
jest.mock('@/app/lib/supabase-admin', () => ({ supabaseAdmin: { rpc: (...args: unknown[]) => mockRpc(...args) } }));
import { publicSourceHash, consumePublicLimit, contactInput, sendStaffNotification } from '@/app/lib/public-action-security';

const originalEnv = { ...process.env };
afterEach(() => { process.env = { ...originalEnv }; jest.restoreAllMocks(); });
test('ignores spoofable IP headers and requires a valid Vercel IP in production', async () => {
  process.env.VERCEL = '1'; process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
  mockHeaders.mockResolvedValue(new Headers({'x-forwarded-for':'attacker', 'x-vercel-forwarded-for':'192.0.2.1'}));
  const first = await publicSourceHash();
  mockHeaders.mockResolvedValue(new Headers({'x-forwarded-for':'different', 'x-vercel-forwarded-for':'192.0.2.1'}));
  expect(await publicSourceHash()).toBe(first);
  mockHeaders.mockResolvedValue(new Headers({'x-forwarded-for':'192.0.2.1'}));
  await expect(publicSourceHash()).rejects.toThrow('trusted');
});
test('rate limit failures fail closed and raw recipients are never stored', async () => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
  mockRpc.mockResolvedValue({data:null,error:{code:'unavailable'}});
  expect(await consumePublicLimit('email','private@example.com',3)).toBe(false);
  expect(JSON.stringify(mockRpc.mock.calls)).not.toContain('private@example.com');
});
test('validates contact input before notifying staff', () => {
  expect(contactInput({name:'a'.repeat(161),email:'a@b.it',payment:'cash'})).toBeNull();
  expect(contactInput({name:'Mario\nfake',email:'a@b.it',payment:'cash'})).toBeNull();
  expect(contactInput({name:12,email:'a@b.it',payment:'cash'})).toBeNull();
});
test('Telegram uses plain text, environment recipient and rejects API errors', async () => {
  process.env.TELEGRAM_BOT_TOKEN = 'test'; process.env.TELEGRAM_CHAT_ID = 'staff';
  const fetchMock = jest.spyOn(globalThis,'fetch').mockResolvedValue(new Response('{"ok":false}',{status:400}));
  await expect(sendStaffNotification('[untrusted](https://example.com)')).rejects.toThrow('Notification');
  const body=JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
  expect(body.chat_id).toBe('staff'); expect(body).not.toHaveProperty('parse_mode');
});
