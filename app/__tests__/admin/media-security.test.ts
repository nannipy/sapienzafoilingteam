/** @jest-environment node */
jest.mock('server-only', () => ({}));
jest.mock('@/app/lib/supabase-server', () => ({ requireAdmin: jest.fn() }));
const mockUpload = jest.fn();
jest.mock('@/app/lib/supabase-admin', () => ({ supabaseAdmin: { storage: { from: () => ({ upload: mockUpload }) } } }));
import { uploadMedia, createMediaFolder } from '@/app/actions/media';
import { requireAdmin } from '@/app/lib/supabase-server';
import sharp from 'sharp';
function form(bytes: Uint8Array, type: string, path='test.png') {
  const f=new FormData(); f.set('path',path); f.set('file',new File([bytes as BlobPart],'test',{type})); return f;
}
beforeEach(() => { jest.clearAllMocks(); jest.mocked(requireAdmin).mockResolvedValue({id:'admin'} as never); });
test('rejects unauthorized calls before touching storage', async () => {
  jest.mocked(requireAdmin).mockRejectedValue(new Error('NEXT_REDIRECT'));
  await expect(uploadMedia(new FormData())).rejects.toThrow('NEXT_REDIRECT');
  expect(mockUpload).not.toHaveBeenCalled();
});
test('rejects SVG disguised as PNG and path traversal', async () => {
  const svg=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>');
  await expect(uploadMedia(form(svg,'image/png'))).rejects.toThrow('Contenuto');
  await expect(createMediaFolder('../.emptyFolderPlaceholder')).rejects.toThrow('Percorso');
  expect(mockUpload).not.toHaveBeenCalled();
});
test('uploads a genuine raster image with verified MIME through the server client', async () => {
  const png=await sharp({create:{width:1,height:1,channels:3,background:'white'}}).png().toBuffer();
  mockUpload.mockResolvedValue({data:{path:'test.png'},error:null});
  await expect(uploadMedia(form(png,'image/png'))).resolves.toMatchObject({data:{path:'test.png'},error:null});
  expect(mockUpload).toHaveBeenCalledWith('test.png',expect.any(Buffer),{contentType:'image/png',upsert:false});
});
