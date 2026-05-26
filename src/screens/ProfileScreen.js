import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import RetroAvatar from '../components/RetroAvatar';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={globalStyles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={[globalStyles.textPixel, styles.title]}>PROFILE</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* アバター＆ステータスエリア */}
        <BlurView intensity={80} tint="light" style={[styles.profileCard, globalStyles.glassmorphism]}>
          <View style={styles.avatarContainer}>
            <RetroAvatar size={100} iconName="robot-happy-outline" />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <MaterialCommunityIcons name="pencil" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={[globalStyles.textPixel, styles.userName]}>NeoUser_99</Text>
          <Text style={styles.userTitle}>Cyber Explorer</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1,234</Text>
              <Text style={[globalStyles.textPixel, styles.statLabel]}>COLLECTED</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>56</Text>
              <Text style={[globalStyles.textPixel, styles.statLabel]}>DROPPED</Text>
            </View>
          </View>
        </BlurView>

        {/* ガチャ（着せ替え）エリア */}
        <Text style={[globalStyles.textPixel, styles.sectionTitle]}>GACHA / ITEMS</Text>
        <BlurView intensity={80} tint="light" style={[styles.gachaCard, globalStyles.glassmorphism]}>
          <View style={styles.gachaInfo}>
            <MaterialCommunityIcons name="treasure-chest" size={32} color={colors.accent} />
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.gachaTitle}>アバター着せ替えガチャ</Text>
              <Text style={styles.gachaSub}>限定Y3Kアイテムピックアップ中！</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.gachaBtn}>
            <Text style={styles.gachaBtnText}>回す (300 Coin)</Text>
          </TouchableOpacity>
        </BlurView>

        {/* プレミアム機能 */}
        <Text style={[globalStyles.textPixel, styles.sectionTitle]}>PREMIUM</Text>
        <BlurView intensity={80} tint="light" style={[styles.premiumCard, globalStyles.glassmorphism]}>
          <View style={styles.premiumItem}>
            <MaterialCommunityIcons name="star-shooting" size={24} color={colors.magenta} />
            <Text style={styles.premiumText}>ドロップ上限解放（無制限）</Text>
          </View>
          <View style={styles.premiumItem}>
            <MaterialCommunityIcons name="eye-off" size={24} color={colors.cyan} />
            <Text style={styles.premiumText}>広告非表示</Text>
          </View>
          <TouchableOpacity style={styles.premiumBtn}>
            <Text style={styles.premiumBtnText}>UPGRADE</Text>
          </TouchableOpacity>
        </BlurView>

      </ScrollView>
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
    color: colors.cyan,
    textShadowColor: colors.primaryLight,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // ナビゲーションバー用
  },
  profileCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.magenta,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  userName: {
    fontSize: 20,
    color: colors.text,
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(107, 59, 255, 0.1)',
    paddingTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: colors.gray,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(107, 59, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 10,
    marginLeft: 5,
  },
  gachaCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
  },
  gachaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  gachaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  gachaSub: {
    fontSize: 12,
    color: colors.accent,
  },
  gachaBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  gachaBtnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  premiumCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  premiumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  premiumText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 15,
    fontWeight: '500',
  },
  premiumBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  premiumBtnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 2,
  },
});
