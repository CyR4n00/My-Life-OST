import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// 仮の拾ったドロップ履歴データ
const MOCK_COLLECTION = [
  { id: '1', date: '2023-10-24 14:30', location: 'Shibuya', icon: 'food-apple', title: 'Apple', message: 'お腹すいた', user: 'UserA_001' },
  { id: '2', date: '2023-10-24 09:15', location: 'Shinjuku', icon: 'coffee', title: 'Coffee', message: 'ここのカフェおすすめ！', user: 'NeonCat' },
  { id: '3', date: '2023-10-23 20:00', location: 'Harajuku', icon: 'music-note', title: 'Music', message: '路上ライブ最高だった', user: 'CyberBoy' },
  { id: '4', date: '2023-10-22 18:45', location: 'Ikebukuro', icon: 'gamepad-variant', title: 'Game', message: 'ゲーセンで神引きした', user: 'Player1' },
];

export default function AlbumScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <BlurView intensity={80} tint="light" style={[styles.card, globalStyles.glassmorphism]}>
        {/* ヘッダー部分：ユーザー名と日時 */}
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <MaterialCommunityIcons name="account-circle" size={20} color={colors.primary} />
            <Text style={[globalStyles.textPixel, styles.username]}>{item.user}</Text>
          </View>
          <Text style={[globalStyles.textPixel, styles.date]}>{item.date}</Text>
        </View>

        {/* メインコンテンツ */}
        <View style={styles.cardBody}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={item.icon} size={36} color={colors.magenta} />
          </View>
          <View style={styles.messageContainer}>
            <Text style={[globalStyles.textNormal, styles.message]}>{item.message}</Text>
            <View style={styles.locationBadge}>
              <MaterialCommunityIcons name="map-marker" size={14} color={colors.cyan} />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          </View>
        </View>
      </BlurView>
    </View>
  );

  return (
    <SafeAreaView style={globalStyles.container} edges={['top', 'left', 'right']}>
      {/* 共通ヘッダー風（戻るボタンはReact Navigation導入後に機能させる） */}
      <View style={styles.header}>
        <Text style={[globalStyles.textPixel, styles.title]}>COLLECTION</Text>
      </View>

      <FlatList
        data={MOCK_COLLECTION}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryLight,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: colors.magenta,
    textShadowColor: colors.primaryLight,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  listContent: {
    padding: 15,
    paddingBottom: 100, // ボトムナビゲーションのスペース確保
  },
  cardContainer: {
    marginBottom: 15,
  },
  card: {
    borderRadius: 16,
    padding: 15,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 59, 255, 0.1)',
    paddingBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 6,
  },
  date: {
    fontSize: 10,
    color: colors.gray,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 0, 255, 0.1)', // 薄いマゼンタ
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 255, 0.1)', // 薄いシアン
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 4,
  },
});
