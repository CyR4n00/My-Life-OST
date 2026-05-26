import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { colors, globalStyles } from '../constants/theme';
import RetroAvatar from './RetroAvatar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

/**
 * すれちがい通信風の交流アニメーションと、その後のメッセージ表示を行うモーダルコンポーネント
 */
export default function EncounterModal({ visible, dropData, onClose }) {
  if (!visible || !dropData) return null;

  const [phase, setPhase] = useState('approaching'); // approaching -> meeting -> opened

  // アニメーション用の値
  const leftAvatarX = useSharedValue(-width / 2 - 100);
  const rightAvatarX = useSharedValue(width / 2 + 100);
  const messageScale = useSharedValue(0);
  const messageOpacity = useSharedValue(0);
  const flashOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // 1. アバターが左右から登場する
      leftAvatarX.value = withTiming(-40, { duration: 800 });
      rightAvatarX.value = withTiming(40, { duration: 800 }, (finished) => {
        if (finished) {
          // 2. ぶつかった瞬間のフラッシュエフェクト
          flashOpacity.value = withSequence(
            withTiming(0.8, { duration: 100 }),
            withTiming(0, { duration: 200 })
          );

          runOnJS(setPhase)('meeting');

          // 3. 少し待ってからメッセージを開く
          setTimeout(() => {
            runOnJS(setPhase)('opened');
            messageScale.value = withSpring(1);
            messageOpacity.value = withTiming(1, { duration: 500 });

            // アバターは少し外側に避ける
            leftAvatarX.value = withTiming(-width / 2 + 50, { duration: 500 });
            rightAvatarX.value = withTiming(width / 2 - 50, { duration: 500 });
          }, 1000);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const animatedLeftStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftAvatarX.value }],
  }));

  const animatedRightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightAvatarX.value }],
  }));

  const animatedMessageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: messageScale.value }],
    opacity: messageOpacity.value,
  }));

  const animatedFlashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const handleClose = () => {
    // 閉じる時はリセットする
    leftAvatarX.value = -width / 2 - 100;
    rightAvatarX.value = width / 2 + 100;
    messageScale.value = 0;
    messageOpacity.value = 0;
    setPhase('approaching');
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />

      {/* 画面全体のフラッシュエフェクト */}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.white }, animatedFlashStyle]} pointerEvents="none" />

      <View style={styles.contentContainer}>

        {/* 開封後のメッセージカード */}
        {phase === 'opened' && (
          <Animated.View style={[styles.messageCard, globalStyles.glassmorphism, animatedMessageStyle]}>
            <View style={styles.cardHeader}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons name={dropData.icon} size={24} color={colors.white} />
              </View>
              <Text style={[globalStyles.textPixel, styles.cardTitle]}>{dropData.title || 'SECRET DROP'}</Text>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.messageText}>{dropData.message || 'メッセージはありません。'}</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.closeButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* アバターアニメーション層（メッセージの上か下に配置） */}
        <View style={styles.avatarLayer} pointerEvents="none">
          {/* 左側：自分 */}
          <Animated.View style={[styles.avatarWrapper, animatedLeftStyle]}>
             <RetroAvatar size={80} bodyColor={colors.white} eyewear="sunglasses" />
             {phase === 'opened' && <Text style={[globalStyles.textPixel, styles.avatarLabel]}>YOU</Text>}
          </Animated.View>

          {/* 右側：相手 */}
          <Animated.View style={[styles.avatarWrapper, animatedRightStyle]}>
             <RetroAvatar size={80} bodyColor={dropData.color || colors.magenta} headgear="crown" />
             {phase === 'opened' && <Text style={[globalStyles.textPixel, styles.avatarLabel]}>{dropData.user || 'UNKNOWN'}</Text>}
          </Animated.View>
        </View>

        {/* 出会った瞬間のテキスト演出 */}
        {phase === 'meeting' && (
           <View style={styles.meetingTextContainer}>
             <Text style={[globalStyles.textPixel, styles.meetingText]}>ENCOUNTER!</Text>
           </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLayer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    alignItems: 'center',
    position: 'absolute',
  },
  avatarLabel: {
    color: colors.white,
    fontSize: 12,
    marginTop: 8,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  meetingTextContainer: {
    position: 'absolute',
    top: height / 2 - 100,
  },
  meetingText: {
    fontSize: 32,
    color: colors.cyan,
    textShadowColor: colors.magenta,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  messageCard: {
    width: width * 0.85,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryLight,
    paddingBottom: 10,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.magenta,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    color: colors.primary,
  },
  cardBody: {
    width: '100%',
    minHeight: 100,
    backgroundColor: 'rgba(107, 59, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: colors.cyan,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});
