import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Share } from 'react-native';
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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I found a Secret Drop from ${dropData?.user || 'UNKNOWN'}! \n\n"${dropData?.message || ''}"\n\n#DropZone #Y3K`,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

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

        {/* 開封後のメッセージカード（ガラケーメール/レトロゲーム風） */}
        {phase === 'opened' && (
          <Animated.View style={[styles.retroMessageCard, animatedMessageStyle]}>
            {/* ガラケー風のヘッダーバー */}
            <View style={styles.retroHeader}>
              <MaterialCommunityIcons name="email-arrow-right" size={16} color={colors.white} />
              <Text style={[globalStyles.textPixel, styles.retroHeaderText]}>INBOX</Text>
              <Text style={[globalStyles.textPixel, styles.retroHeaderTime]}>12:34</Text>
            </View>

            {/* メールのメタデータ */}
            <View style={styles.retroMeta}>
              <View style={styles.retroMetaRow}>
                <Text style={styles.retroMetaLabel}>From:</Text>
                <Text style={styles.retroMetaValue}>{dropData.user || 'UNKNOWN'}</Text>
              </View>
              <View style={styles.retroMetaRow}>
                <Text style={styles.retroMetaLabel}>Sub:</Text>
                <Text style={styles.retroMetaValue}>{dropData.title || 'SECRET DROP'}</Text>
              </View>
            </View>

            {/* 写真添付枠（ダミー画像） */}
            {dropData.hasPhoto && (
              <View style={styles.retroPhotoContainer}>
                <MaterialCommunityIcons name="image" size={40} color={colors.gray} />
                <Text style={styles.retroPhotoText}>attached_image.jpg</Text>
              </View>
            )}

            <View style={styles.retroBody}>
              <Text style={styles.retroMessageText}>{dropData.message || 'No message.'}</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <MaterialCommunityIcons name="share-variant" size={20} color={colors.white} />
                <Text style={styles.shareButtonText}>SHARE</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeButtonText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
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
  retroMessageCard: {
    width: width * 0.85,
    backgroundColor: '#d3d3d3', // レトロなグレー
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#888',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 5,
  },
  retroHeader: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#555',
  },
  retroHeaderText: {
    color: colors.white,
    fontSize: 14,
    marginLeft: 6,
    flex: 1,
  },
  retroHeaderTime: {
    color: colors.white,
    fontSize: 12,
  },
  retroMeta: {
    backgroundColor: '#fff',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
  },
  retroMetaRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  retroMetaLabel: {
    width: 45,
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  retroMetaValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  retroPhotoContainer: {
    backgroundColor: '#e9e9e9',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
  },
  retroPhotoText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  retroBody: {
    backgroundColor: '#fff',
    minHeight: 100,
    padding: 12,
  },
  retroMessageText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#d3d3d3',
    borderTopWidth: 1,
    borderTopColor: '#aaa',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.magenta,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#880044',
  },
  shareButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  closeButton: {
    backgroundColor: '#999',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#555',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
