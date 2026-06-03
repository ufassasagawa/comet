-- rooms テーブル
create table rooms (
  id          uuid primary key default gen_random_uuid(),
  host_id     uuid references auth.users(id) not null,
  slug        text unique not null,
  title       text not null,
  is_active   boolean default true,
  expires_at  timestamptz not null default (now() + interval '7 days'),
  created_at  timestamptz default now()
);

alter table rooms enable row level security;

-- ホストは自分のルームを全操作可
create policy "host manages own rooms"
  on rooms for all
  using (host_id = auth.uid())
  with check (host_id = auth.uid());

-- アクティブなルームは誰でも読める（参加ページ・弾幕ページのアクセスチェック用）
create policy "active room readable"
  on rooms for select
  using (is_active = true and expires_at > now());


-- messages テーブル
create table messages (
  id         uuid primary key default gen_random_uuid(),
  room_id    uuid references rooms(id) on delete cascade not null,
  content    text not null check (char_length(content) <= 40),
  color      text not null default 'white',
  nickname   text,
  created_at timestamptz default now()
);

alter table messages enable row level security;

-- 誰でもアクティブなルームにコメントを投稿できる
create policy "anyone inserts to active room"
  on messages for insert
  with check (
    exists (
      select 1 from rooms
      where id = room_id
        and is_active = true
        and expires_at > now()
    )
  );

-- ホストは自分のルームのコメントを読める
create policy "host reads own room messages"
  on messages for select
  using (
    exists (
      select 1 from rooms
      where id = room_id
        and host_id = auth.uid()
    )
  );

-- Realtime を有効化
alter publication supabase_realtime add table messages;
