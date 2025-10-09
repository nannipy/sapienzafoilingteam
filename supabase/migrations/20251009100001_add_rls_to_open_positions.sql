alter table public.open_positions enable row level security;
create policy "Allow public read access to open positions" on public.open_positions for select using (true);
