// 配布・認証まわりの定数（秘密情報は含めない）

// ログインを許可する Google アカウントのドメイン（社内限定）
export const ALLOWED_DOMAIN = 'ufas.co.jp'

// デスクトップ版 .dmg の配布リンク（Google Drive・ufas.co.jp ドメイン限定共有）
// アップロード後に実 URL へ差し替える
export const DRIVE_DMG_URL = 'https://drive.google.com/__PLACEHOLDER__'
export const DMG_FILENAME = 'Comet-0.1.0.dmg'
export const DMG_SIZE_LABEL = '約192MB'

// 説明書（comet-desktop/INSTALL.md のコピーを public/ に配置。更新時は手動同期）
export const INSTALL_MD_PATH = '/INSTALL.md'
