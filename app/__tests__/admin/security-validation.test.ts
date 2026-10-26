import { articlePayload } from '@/app/lib/article-validation';
import { eventPayload, positionPayload } from '@/app/lib/admin-validation';

test('rejects oversized articles, wrong runtime types and unsafe image URLs', () => {
  for (const patch of [{title:'x'.repeat(301)}, {title:42}, {content:'x'.repeat(100001)}, {image_url:'javascript:alert(1)'}, {image_url:'//evil.test/a.png'}]) {
    expect(() => articlePayload({title:'Bozza', ...patch} as never)).toThrow();
  }
});
test('event and position payloads whitelist fields and validate runtime input', () => {
  expect(eventPayload({title:'Evento', title_en:'Event', location:'Roma', date:'2026-11-08', id:'injected'})).not.toHaveProperty('id');
  expect(() => eventPayload({title:'Evento', title_en:'Event', location:'Roma',date:'invalid'})).toThrow();
  expect(() => positionPayload({requirements:[42]},true)).toThrow();
  expect(positionPayload({title:'Developer',is_admin:true},true)).toEqual({title:'Developer'});
});
