@AGENTS.md

# Comet ☄️

オンライン会議（Google Meet 等）の画面共有に、参加者のコメントを弾幕、スタンプをポップで流すツール。
本番: https://comet-nu.vercel.app ／ 要件定義: `../要件定義.md`

## 構成
- **Next.js 16 (App Router) + Supabase (Auth/DB/Realtime) + Vercel**
- 認証: 主催者のみ Google ログイン（`@supabase/ssr` cookie ベース）。**ufas.co.jp ドメイン限定**（hd パラメータ＋ callback でメール検証）。参加者はログイン不要
- ルーティング保護は `src/proxy.ts`（Next.js 16 で middleware→proxy にリネーム済み）

## ブラウザ／アプリの出し分け（フェーズ3）
- デスクトップ版（`../comet-desktop/`）が起動時に **`comet_app` クッキー**をセット。proxy.ts がこれで分岐
- **ブラウザ**: `/` = ランディング（紹介・DL導線）、ログイン後は `/download`（DLボタン・手順・ログ閲覧のみ）。`/dashboard` 完全一致はブラウザだと `/download` へリダイレクト
- **アプリ**: 従来どおり `/` → `/dashboard` フル機能（ルーム作成・弾幕）
- ログページ `/dashboard/rooms/[id]/log` はブラウザでも閲覧可。`/overlay` の URL 直打ちも黙認（導線なし）
- .dmg 本体は Google Drive 社内限定共有（リンクは `src/lib/constants.ts` の `DRIVE_DMG_URL`）

## 主要ファイル
- `src/app/page.tsx` + `src/components/landing/` … ブラウザ向けランディング
- `src/app/download/` … DLページ（認証必須。Drive リンク・手順・ログ一覧）
- `src/app/dashboard/` … 主催者: ルーム作成・URL発行・コメントログ（アプリ専用）
- `src/app/r/[slug]/` … 参加ページ（コメント＋スタンプ、スマホ前提）
- `src/app/overlay/[slug]/` … 弾幕ページ（`?app=1` で背景透明＝Electron用）
- `src/components/overlay/DanmakuLayer.tsx` … 弾幕（5レーン固定・流れ切ったレーンを上から再利用）
- `src/components/overlay/StampPopper.tsx` … スタンプ（Realtime Broadcast、DB保存なし）
- `src/lib/constants.ts` … `ALLOWED_DOMAIN` / `DRIVE_DMG_URL` 等の定数
- `public/INSTALL.md` … 説明書（ソースは `../comet-desktop/INSTALL.md`、更新時は手動同期）
- `supabase/migrations/0001_init.sql` … rooms / messages テーブル + RLS

## データ方針
- コメント = `messages` に保存 → Realtime(postgres_changes) で弾幕へ（履歴で見返せる）
- スタンプ = Realtime Broadcast のみ（保存しない・連打対応）

## ローカル開発
`npm run dev`（要 `.env.local`: `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`）
