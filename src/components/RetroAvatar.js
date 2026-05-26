import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { colors } from '../constants/theme';

/**
 * カスタマイズ可能なドット絵アバターを表示するコンポーネント
 */
export default function RetroAvatar({
  size = 60,
  bodyColor = colors.white,
  borderColor = null, // ドット絵なので未使用
  borderWidth = 0,    // ドット絵なので未使用
  headgear = null,    // e.g., 'crown', 'cap'
  eyewear = null,     // e.g., 'glasses', 'sunglasses'
  shoesColor = colors.primary, // ブーツの色
}) {
  const PIXEL_SIZE = size / 10;

  // 10x10のドット絵マトリックス (0: 透明, 1: 体, 2: 目, 3: 靴, 4: アクセサリー)
  // ベースとなるキャラクター
  const baseMatrix = [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,2,1,1,2,1,1,0],
    [0,1,1,2,1,1,2,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,0,3,3,0,3,3,0,0],
    [0,0,3,3,3,0,3,3,3,0]
  ];

  const renderPixel = (val, x, y) => {
    if (val === 0) return null;

    let color = bodyColor;
    if (val === 2) color = '#000000'; // 目
    if (val === 3) color = shoesColor; // 靴

    // アイテムによる上書き
    if (headgear === 'crown') {
        if (y === 0 && (x >= 2 && x <= 7)) return <Rect key={`${x}-${y}`} x={x * PIXEL_SIZE} y={y * PIXEL_SIZE} width={PIXEL_SIZE} height={PIXEL_SIZE} fill="#FFD700" />;
        if (y === 1 && (x === 2 || x === 4 || x === 5 || x === 7)) return <Rect key={`${x}-${y}`} x={x * PIXEL_SIZE} y={y * PIXEL_SIZE} width={PIXEL_SIZE} height={PIXEL_SIZE} fill="#FFD700" />;
    }

    if (eyewear === 'sunglasses') {
        if (y === 3 && x >= 2 && x <= 7) return <Rect key={`${x}-${y}`} x={x * PIXEL_SIZE} y={y * PIXEL_SIZE} width={PIXEL_SIZE} height={PIXEL_SIZE} fill="#333333" />;
        if (y === 4 && (x === 3 || x === 6)) return <Rect key={`${x}-${y}`} x={x * PIXEL_SIZE} y={y * PIXEL_SIZE} width={PIXEL_SIZE} height={PIXEL_SIZE} fill="#333333" />;
    }

    return (
      <Rect
        key={`${x}-${y}`}
        x={x * PIXEL_SIZE}
        y={y * PIXEL_SIZE}
        width={PIXEL_SIZE + 0.5} // 隙間防止
        height={PIXEL_SIZE + 0.5} // 隙間防止
        fill={color}
      />
    );
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {baseMatrix.map((row, y) =>
          row.map((val, x) => renderPixel(val, x, y))
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // 影をつけるとドット絵っぽさが消える可能性があるので一旦オフか弱めに
    shadowColor: colors.magenta,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});
