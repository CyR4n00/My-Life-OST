import { StyleSheet } from 'react-native';

export const colors = {
  background: '#0a0a0a',
  radarGreen: '#39ff14', // レーダーっぽい蛍光グリーン
  radarDarkGreen: '#0f380f',
  text: '#ffffff',
  accent: '#ff0055',
  gray: '#333333',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  textRetro: {
    fontFamily: 'monospace', // 初期は組み込みの等幅フォントでレトロ感を出す
    color: colors.radarGreen,
  },
});
