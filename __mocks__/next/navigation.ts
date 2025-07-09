// __mocks__/next/navigation.ts
export const usePathname = jest.fn(() => '/'); // Ritorna un path di default
export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
}));
export const useParams = jest.fn(() => ({}));
// Aggiungi altri hook se necessari per altri test