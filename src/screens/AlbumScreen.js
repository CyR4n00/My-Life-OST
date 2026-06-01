import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// 仮の拾ったドロップ履歴データ
const MOCK_COLLECTION = [
  { id: '1', date: '2023-10-24 14:30', location: 'Shibuya', title: '秘密の書き置き', message: '〇〇大学の食堂の端の席に、「次の講義ダルいね」という書き置き。', user: 'UserA_001', hasPhoto: true },
  { id: '2', date: '2023-10-24 09:15', location: 'Shinjuku', title: '駅のホームで', message: 'ここの自販機、たまに当たりが出るよ！', user: 'NeonCat', hasPhoto: false },
  { id: '3', date: '2023-10-23 20:00', location: 'Harajuku', title: '路上ライブ', message: '今日のバンド、エモすぎた。', user: 'CyberBoy', hasPhoto: true },
  { id: '4', date: '2023-10-22 18:45', location: 'Ikebukuro', title: 'ゲーセン報告', message: 'クレーンゲームで神引きしたから記念に埋めとく。', user: 'Player1', hasPhoto: true },
];

export default function AlbumScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.retroListCard}>
      {/* ガラケー風リストアイテムヘッダー */}
      <View style={styles.retroListHeader}>
        <MaterialCommunityIcons name={item.hasPhoto ? "email-open" : "email-open-outline"} size={16} color={colors.primary} />
        <Text style={[globalStyles.textPixel, styles.retroListTitle]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[globalStyles.textPixel, styles.retroListDate]}>{item.date.split(' ')[0]}</Text>
      </View>

      <View style={styles.retroListBody}>
        <View style={styles.retroListMeta}>
          <Text style={styles.retroListUser}>From: {item.user}</Text>
          <View style={styles.locationBadge}>
            <MaterialCommunityIcons name="map-marker" size={12} color={colors.white} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        </View>
        <Text style={styles.retroListMessage} numberOfLines={2}>
          {item.message}
        </Text>
        {item.hasPhoto && (
          <View style={styles.photoIndicator}>
             <MaterialCommunityIcons name="paperclip" size={14} color="#666" />
             <Text style={styles.photoIndicatorText}>画像添付あり</Text>
          </View>
        )}
      </View>
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
    backgroundColor: '#e6e6e6', // レトロな背景
  },
  retroListCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 3,
  },
  retroListHeader: {
    backgroundColor: '#d3d3d3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
  },
  retroListTitle: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#000',
  },
  retroListDate: {
    fontSize: 12,
    color: '#333',
  },
  retroListBody: {
    padding: 10,
  },
  retroListMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  retroListUser: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  retroListMessage: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#222',
    lineHeight: 20,
    marginBottom: 8,
  },
  photoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  photoIndicatorText: {
    fontSize: 10,
    color: '#666',
    marginLeft: 4,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cyan,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  locationText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 2,
  },
});
