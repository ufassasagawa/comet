// 配布・認証まわりの定数（秘密情報は含めない）

// ログインを許可する Google アカウントのドメイン（社内限定）
export const ALLOWED_DOMAIN = 'ufas.co.jp'

// デスクトップ版の配布リンク（Google Drive・ufas.co.jp ドメイン限定共有）
// フォルダ: https://drive.google.com/drive/folders/1R-8MVBoe7hiSCTa5IAgrcxFsF0R1at7x

// Mac（.dmg）
export const DRIVE_DMG_URL = 'https://drive.google.com/file/d/1wLlrjRzw1beELK4Wc0cv2A41j3kr2SBN/view'
export const DMG_FILENAME = 'Comet-0.1.0.dmg'
export const DMG_SIZE_LABEL = '約192MB'

// Windows（.exe / NSIS）— GitHub Actions でビルドした exe を Drive にアップ後、実 URL へ差し替える
export const DRIVE_EXE_URL = 'https://drive.google.com/__PLACEHOLDER_EXE__'
export const EXE_FILENAME = 'Comet-Setup-0.1.0.exe'
export const EXE_SIZE_LABEL = '約90MB'

// 説明書（comet-desktop/INSTALL.md のコピーを public/ に配置。更新時は手動同期）
export const INSTALL_MD_PATH = '/INSTALL.md'
