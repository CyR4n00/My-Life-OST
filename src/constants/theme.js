import { StyleSheet } from 'react-native';

export const colors = {
  background: '#1a1a1a', // マップに合わせて少し調整
  accent: '#ff0055',     // Y2Kっぽいビビッドなピンク
  primary: '#00d0ff',    // サイバーなブルー
  gray: '#333333',
  text: '#ffffff',
  mapOverlay: 'rgba(0,0,0,0.3)',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  textRetro: {
    fontFamily: 'monospace',
    color: colors.primary,
  },
});
