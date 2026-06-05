-- rooms の「アクティブなら誰でも読める」ポリシーは、全ルームの slug/タイトルを
-- 匿名で列挙できる漏れになっていた。テーブル全体への匿名 SELECT を撤去し、
-- 参加者は slug を知っている1件だけを SECURITY DEFINER 関数で読めるようにする。

-- 参加ページ用: アクティブなルームを slug で1件だけ取得（列挙不可）
create or replace function public.get_active_room(p_slug text)
returns table (id uuid, title text, is_active boolean, expires_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select id, title, is_active, expires_at
  from rooms
  where slug = p_slug
    and is_active = true
    and expires_at > now()
$$;
grant execute on function public.get_active_room(text) to anon, authenticated;

-- 投稿チェック用: ルームが開いているか（RLS を貫通して確認）
create or replace function public.is_room_open(p_room_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from rooms
    where id = p_room_id
      and is_active = true
      and expires_at > now()
  )
$$;
grant execute on function public.is_room_open(uuid) to anon, authenticated;

-- messages の投稿ポリシーを関数ベースに張り替え
-- （rooms への直接サブクエリは broad SELECT ポリシーに依存していたため）
drop policy "anyone inserts to active room" on messages;
create policy "anyone inserts to active room"
  on messages for insert
  with check ( public.is_room_open(room_id) );

-- rooms 全体への「誰でも読める」ポリシーを撤去（列挙を防ぐ）
-- ホストは "host manages own rooms"（FOR ALL）で自分のルームを読めるため影響なし
drop policy "active room readable" on rooms;
