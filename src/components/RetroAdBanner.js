import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { colors, globalStyles } from '../constants/theme';

export default function RetroAdBanner() {
  // 簡単な点滅（ピコピコ）アニメーション
  const flashAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 0.5,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [flashAnim]);

  return (
    <TouchableOpacity style={styles.adContainer} onPress={() => console.log('Ad Clicked!')}>
      <View style={styles.adBorder}>
        <Animated.View style={[styles.adContent, { opacity: flashAnim }]}>
          <Text style={[globalStyles.textPixel, styles.adBadge]}>[PR]</Text>
          <Text style={[globalStyles.textPixel, styles.adText]}>
            ★ 激安サイバーガジェット ★{'\n'}＞＞今すぐクリック！＜＜
          </Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  adBorder: {
    width: '100%',
    maxWidth: 320, // ガラケーのバナー風サイズ
    height: 60,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#ff00ff', // ネオンマゼンタ
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  adBadge: {
    color: '#00ffff', // シアン
    fontSize: 10,
    marginRight: 10,
    backgroundColor: 'rgba(0, 255, 255, 0.2)',
    paddingHorizontal: 4,
  },
  adText: {
    color: '#ffff00', // 黄色（レトロバナー風）
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    flex: 1,
  }
});
