import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import RetroAvatar from '../components/RetroAvatar';

const EYEWEAR_OPTIONS = [null, 'glasses', 'sunglasses'];
const HEADGEAR_OPTIONS = [null, 'crown', 'hat-fedora', 'headphones'];
const COLOR_OPTIONS = [colors.white, colors.primaryLight, '#ffb6c1', '#98fb98', '#add8e6'];

export default function ProfileScreen() {
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  // アバターの状態管理
  const [avatarState, setAvatarState] = useState({
    bodyColor: colors.white,
    eyewear: null,
    headgear: null,
    shoesColor: colors.primary,
  });

  const updateAvatar = (key, value) => {
    setAvatarState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={globalStyles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={[globalStyles.textPixel, styles.title]}>PROFILE</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* アバター＆ステータスエリア */}
        <BlurView intensity={80} tint="light" style={[styles.profileCard, globalStyles.glassmorphism]}>
          <View style={styles.avatarContainer}>
            <RetroAvatar
              size={120}
              bodyColor={avatarState.bodyColor}
              eyewear={avatarState.eyewear}
              headgear={avatarState.headgear}
              shoesColor={avatarState.shoesColor}
            />
            <TouchableOpacity style={styles.editAvatarBtn} onPress={() => setEditModalVisible(true)}>
              <MaterialCommunityIcons name="pencil" size={20} color={colors.white} />
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

        {/* プレミアム機能 */}
        <Text style={[globalStyles.textPixel, styles.sectionTitle]}>PREMIUM</Text>
        <BlurView intensity={80} tint="light" style={[styles.premiumCard, globalStyles.glassmorphism]}>
          <View style={styles.premiumItem}>
            <MaterialCommunityIcons name="star-shooting" size={24} color={colors.magenta} />
            <Text style={styles.premiumText}>Unlimited Drops</Text>
          </View>
          <View style={styles.premiumItem}>
            <MaterialCommunityIcons name="eye-off" size={24} color={colors.cyan} />
            <Text style={styles.premiumText}>Ad-Free Experience</Text>
          </View>
          <TouchableOpacity style={styles.premiumBtn}>
            <Text style={styles.premiumBtnText}>UPGRADE</Text>
          </TouchableOpacity>
        </BlurView>

      </ScrollView>

      {/* アバター編集モーダル */}
      <Modal visible={isEditModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <BlurView intensity={90} tint="light" style={[styles.modalContent, globalStyles.glassmorphism]}>
            <Text style={[globalStyles.textPixel, styles.modalTitle]}>DRESS UP AVATAR</Text>

            <View style={styles.previewContainer}>
              <RetroAvatar
                size={100}
                {...avatarState}
              />
            </View>

            <ScrollView style={styles.editOptionsScroll}>
              <Text style={styles.editSectionTitle}>BODY COLOR</Text>
              <View style={styles.optionsRow}>
                {COLOR_OPTIONS.map((c, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.colorOption, { backgroundColor: c }, avatarState.bodyColor === c && styles.selectedOption]}
                    onPress={() => updateAvatar('bodyColor', c)}
                  />
                ))}
              </View>

              <Text style={styles.editSectionTitle}>EYEWEAR</Text>
              <View style={styles.optionsRow}>
                {EYEWEAR_OPTIONS.map((e, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.itemOption, avatarState.eyewear === e && styles.selectedOption]}
                    onPress={() => updateAvatar('eyewear', e)}
                  >
                    {e ? <MaterialCommunityIcons name={e} size={24} color={colors.text} /> : <Text style={styles.noneText}>None</Text>}
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.editSectionTitle}>HEADGEAR</Text>
              <View style={styles.optionsRow}>
                {HEADGEAR_OPTIONS.map((h, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.itemOption, avatarState.headgear === h && styles.selectedOption]}
                    onPress={() => updateAvatar('headgear', h)}
                  >
                    {h ? <MaterialCommunityIcons name={h} size={24} color={colors.accent} /> : <Text style={styles.noneText}>None</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.closeBtnText}>DONE</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </Modal>

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
    bottom: -5,
    right: -10,
    backgroundColor: colors.magenta,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.magenta,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    height: '75%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.cyan,
    marginBottom: 20,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
  },
  editOptionsScroll: {
    flex: 1,
  },
  editSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.gray,
    marginBottom: 10,
    marginTop: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemOption: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: 'rgba(107, 59, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: colors.magenta,
  },
  noneText: {
    fontSize: 12,
    color: colors.gray,
  },
  closeBtn: {
    backgroundColor: colors.cyan,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  closeBtnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
