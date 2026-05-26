import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

/**
 * カスタマイズ可能なアバターを表示するコンポーネント
 */
export default function RetroAvatar({
  size = 60,
  bodyColor = colors.white,
  borderColor = colors.cyan,
  borderWidth = 2,
  headgear = null, // e.g., 'crown', 'glass-wine'
  eyewear = null,  // e.g., 'glasses', 'sunglasses'
  shoesColor = colors.primary, // ブーツの色
}) {
  const bodyWidth = size * 0.8;
  const bodyHeight = size * 0.9;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 本体 */}
      <View style={[
        styles.body,
        {
          width: bodyWidth,
          height: bodyHeight,
          backgroundColor: bodyColor,
          borderColor: borderColor,
          borderWidth: borderWidth,
        }
      ]}>
        {/* 目 */}
        <View style={styles.eyesContainer}>
          <View style={styles.eye} />
          <View style={styles.eye} />
        </View>

        {/* メガネ / Eyewear */}
        {eyewear && (
          <View style={styles.eyewearContainer}>
            <MaterialCommunityIcons name={eyewear} size={size * 0.4} color={colors.text} />
          </View>
        )}
      </View>

      {/* 足 (Boots) */}
      <View style={[styles.shoesContainer, { width: bodyWidth }]}>
        <View style={[styles.shoe, { backgroundColor: shoesColor }]} />
        <View style={[styles.shoe, { backgroundColor: shoesColor }]} />
      </View>

      {/* 帽子 / Headgear */}
      {headgear && (
        <View style={styles.headgearContainer}>
          <MaterialCommunityIcons name={headgear} size={size * 0.4} color={colors.accent} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    shadowColor: colors.magenta,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  body: {
    borderRadius: 999, // 楕円形
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  eyesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
    marginTop: '-10%', // 少し上に配置
  },
  eye: {
    width: 6,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#000',
  },
  shoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: -5,
    zIndex: 1,
  },
  shoe: {
    width: '25%',
    height: 12,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  headgearContainer: {
    position: 'absolute',
    top: -10,
    zIndex: 3,
  },
  eyewearContainer: {
    position: 'absolute',
    top: '30%',
    zIndex: 3,
  },
});
