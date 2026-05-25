import { StyleSheet } from 'react-native';

export const colors = {
  // ベースのクリーンなマップ色
  background: '#f4f0ff',

  // サイバーカラー
  primary: '#6b3bff',    // メインの紫
  primaryLight: 'rgba(107, 59, 255, 0.2)', // 薄い紫（枠線や背景用）
  magenta: '#ff00ff',    // サイバーマゼンタ
  cyan: '#00ffff',       // サイバーシアン
  accent: '#ff9800',     // 差し色のオレンジ

  // スケルトン素材（グラスモーフィズム）用
  glassWhite: 'rgba(255, 255, 255, 0.4)',
  glassDark: 'rgba(0, 0, 0, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.6)',

  white: '#ffffff',
  gray: '#888888',
  text: '#333333',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  textNormal: {
    fontFamily: 'System',
    color: colors.text,
  },
  textPixel: {
    fontFamily: 'monospace', // Y3K/ガラケー感を出すピクセルフォントの代用
    color: colors.primary,
    letterSpacing: 1,
  },
  // 平成レトロなスケルトン素材風の共通スタイル
  glassmorphism: {
    backgroundColor: colors.glassWhite,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    // Note: React Nativeの標準だけでは完璧なblurが難しいため、ExpoのBlurViewを後で組み合わせる想定
  }
});
