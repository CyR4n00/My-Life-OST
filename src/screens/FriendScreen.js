import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import RetroAvatar from '../components/RetroAvatar';

// 仮のフレンドデータ
const MOCK_FRIENDS = [
  { id: '1', name: 'CyberBoy', status: 'Online', isClose: true, icon: 'robot-outline', color: colors.magenta },
  { id: '2', name: 'NeonCat', status: 'Last seen 2h ago', isClose: false, icon: 'cat', color: colors.accent },
  { id: '3', name: 'UserA_001', status: 'Online', isClose: true, icon: 'alien-outline', color: colors.cyan },
  { id: '4', name: 'Player1', status: 'Last seen 1d ago', isClose: false, icon: 'gamepad-variant-outline', color: colors.primary },
];

export default function FriendScreen() {
  const renderItem = ({ item }) => (
    <BlurView intensity={80} tint="light" style={[styles.friendCard, globalStyles.glassmorphism]}>
      <View style={{ marginRight: 15 }}>
        <RetroAvatar size={46} iconName={item.icon} backgroundColor={item.color} borderWidth={1} />
      </View>
      <View style={styles.friendInfo}>
        <Text style={[globalStyles.textPixel, styles.friendName]}>{item.name}</Text>
        <Text style={styles.friendStatus}>{item.status}</Text>
      </View>
      {item.isClose ? (
        <View style={styles.nearbyBadge}>
          <MaterialCommunityIcons name="radar" size={14} color={colors.white} />
          <Text style={styles.nearbyText}>NEARBY</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.actionBtn}>
           <MaterialCommunityIcons name="email-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
    </BlurView>
  );

  return (
    <SafeAreaView style={globalStyles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={[globalStyles.textPixel, styles.title]}>FRIENDS</Text>
        <TouchableOpacity style={styles.addBtn}>
          <MaterialCommunityIcons name="account-plus" size={24} color={colors.magenta} />
        </TouchableOpacity>
      </View>

      {/* フレンド限定機能の紹介エリア */}
      <View style={styles.bannerContainer}>
        <BlurView intensity={80} tint="dark" style={styles.banner}>
          <MaterialCommunityIcons name="lock-open-alert" size={24} color={colors.cyan} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>SECRET DROP</Text>
            <Text style={styles.bannerText}>
              フレンドだけにしか見えない・拾えない秘密のドロップを埋めることができます。
            </Text>
          </View>
        </BlurView>
      </View>

      <FlatList
        data={MOCK_FRIENDS}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: colors.primary,
    textShadowColor: colors.cyan,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  addBtn: {
    padding: 5,
  },
  bannerContainer: {
    padding: 15,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bannerTitle: {
    color: colors.cyan,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  bannerText: {
    color: colors.white,
    fontSize: 12,
    lineHeight: 16,
  },
  listContent: {
    padding: 15,
    paddingBottom: 100, // ナビゲーションバー用
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  friendStatus: {
    fontSize: 12,
    color: colors.gray,
  },
  nearbyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.magenta,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nearbyText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(107, 59, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
