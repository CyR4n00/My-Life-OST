import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

/**
 * レトロ・Y3Kテイストのアバターを表示するコンポーネント
 * （将来的にパーツの着せ替えなどを実装するベースとしてコンポーネント化）
 */
export default function RetroAvatar({
  size = 60,
  backgroundColor = colors.primary,
  iconName = 'robot-outline', // デフォルトはロボット（サイバー感）
  iconColor = colors.white,
  borderColor = colors.cyan,
  borderWidth = 2,
}) {
  const radius = size / 2;

  return (
    <View style={[
      styles.container,
      {
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor,
        borderColor,
        borderWidth,
      }
    ]}>
      {/* TODO: 本番ではここにドット絵の画像やSVGパーツを重ね合わせて表示する */}
      <MaterialCommunityIcons name={iconName} size={size * 0.6} color={iconColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: colors.magenta,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
});
