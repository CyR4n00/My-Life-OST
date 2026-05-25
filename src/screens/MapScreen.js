import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Modal, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

// Webでは react-native-maps がデフォルトでは動かないため、フォールバックを用意する
let MapView, Marker, Circle;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Circle = Maps.Circle;
}

const { width, height } = Dimensions.get('window');

// 仮のドロップデータ（現在地の近くの緯度経度）
// 渋谷駅周辺の座標をベースに
const SHIBUYA_LAT = 35.6580;
const SHIBUYA_LNG = 139.7016;

const MOCK_DROPS = [
  { id: 1, lat: SHIBUYA_LAT + 0.0005, lng: SHIBUYA_LNG + 0.0005, icon: 'food-apple', title: 'Apple' },
  { id: 2, lat: SHIBUYA_LAT - 0.0003, lng: SHIBUYA_LNG + 0.0002, icon: 'tshirt-crew', title: 'T-Shirt' },
  { id: 3, lat: SHIBUYA_LAT + 0.0002, lng: SHIBUYA_LNG - 0.0006, icon: 'fish', title: 'Fish' },
  { id: 4, lat: SHIBUYA_LAT - 0.0005, lng: SHIBUYA_LNG - 0.0005, icon: 'tennis-ball', title: 'Tennis' },
];

const AVAILABLE_ICONS = [
  'message-text', 'food-apple', 'tshirt-crew', 'fish', 'tennis-ball',
  'coffee', 'camera', 'music-note', 'heart', 'star'
];

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: SHIBUYA_LAT,
    longitude: SHIBUYA_LNG,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [isDropModalVisible, setDropModalVisible] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(AVAILABLE_ICONS[0]);
  const [dropMessage, setDropMessage] = useState('');

  const handleDrop = () => {
    // 実際はここでAPI等に送信し、新しいドロップを地図上に追加する処理を書く
    console.log("Dropped:", { icon: selectedIcon, message: dropMessage });
    setDropModalVisible(false);
    setDropMessage('');
  };

  return (
    <View style={globalStyles.container}>
      {/* マップ部分 */}
      {Platform.OS === 'web' ? (
        <View style={styles.webMapPlaceholder}>
          <MaterialCommunityIcons name="map-marker-off" size={64} color={colors.primary} />
          <Text style={[globalStyles.textNormal, styles.webMapText]}>
            マップ表示はiOS/Android端末でのみサポートされています。
          </Text>
          <Text style={[globalStyles.textNormal, { color: '#888', marginTop: 10 }]}>
            (Webプレビュー用モック: 本来はライトパープル系のマップが表示されます)
          </Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={region}
            showsUserLocation={false} // カスタムで現在地を描画するためfalse
            showsMyLocationButton={false}
            userInterfaceStyle="light" // ライトテーマに変更
        >
            {/* 現在地の擬似的な表現 */}
          <Circle
            center={{ latitude: SHIBUYA_LAT, longitude: SHIBUYA_LNG }}
              radius={80} // 取得可能範囲
              strokeWidth={0}
              fillColor={'rgba(107, 59, 255, 0.2)'}
          />
            <Marker coordinate={{ latitude: SHIBUYA_LAT, longitude: SHIBUYA_LNG }}>
              <View style={styles.currentLocationDot}>
                <View style={styles.currentLocationInnerDot} />
              </View>
            </Marker>

          {/* ドロップのピン */}
          {MOCK_DROPS.map((drop) => (
            <Marker
              key={drop.id}
              coordinate={{ latitude: drop.lat, longitude: drop.lng }}
              title={drop.title}
            >
                <View style={styles.markerContainer}>
                  <MaterialCommunityIcons name={drop.icon} size={22} color={colors.accent} />
                  {/* 下向きの三角形（吹き出しのしっぽ） */}
                  <View style={styles.markerTail} />
              </View>
            </Marker>
          ))}

            {/* アクティブなドロップのピン（モック） */}
            <Marker coordinate={{ latitude: SHIBUYA_LAT - 0.0001, longitude: SHIBUYA_LNG - 0.0002 }}>
                <View style={styles.activeMarkerContainer}>
                    <MaterialCommunityIcons name="weight-lifter" size={24} color={colors.white} />
                    <Text style={styles.activeMarkerText}>Gym Beam</Text>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={colors.white} />
                    <View style={styles.activeMarkerTail} />
                </View>
            </Marker>
        </MapView>
      )}

      {/* ガラケー風ステータスバー（ワンポイント） */}
      <SafeAreaView style={styles.statusBarContainer} pointerEvents="none">
        <View style={styles.statusBar}>
          <Text style={[globalStyles.textPixel, { fontSize: 12, color: colors.magenta }]}>i-mode</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="signal-cellular-3" size={14} color={colors.cyan} />
            <MaterialCommunityIcons name="battery-80" size={14} color={colors.cyan} style={{ marginLeft: 4 }} />
          </View>
        </View>
      </SafeAreaView>

      {/* 検索バー風ヘッダー（スケルトン素材） */}
      <SafeAreaView style={styles.headerContainer} pointerEvents="box-none">
        <BlurView intensity={80} tint="light" style={[styles.searchBar, globalStyles.glassmorphism]}>
          <MaterialCommunityIcons name="map-marker-outline" size={24} color={colors.magenta} />
          <Text style={[globalStyles.textNormal, styles.searchText]}>Do you want to go Gym Beam?</Text>
          <MaterialCommunityIcons name="check" size={24} color={colors.cyan} />
        </BlurView>
      </SafeAreaView>

      {/* ボトムナビゲーション（スケルトン素材の丸ボタンリスト） */}
      <SafeAreaView style={styles.bottomContainer} pointerEvents="box-none" edges={['bottom']}>
        <View style={styles.bottomNavContainer}>
          <TouchableOpacity>
            <BlurView intensity={80} tint="light" style={[styles.navButton, globalStyles.glassmorphism]}>
              <MaterialCommunityIcons name="home" size={28} color={colors.primary} />
            </BlurView>
          </TouchableOpacity>
          <TouchableOpacity>
            <BlurView intensity={80} tint="light" style={[styles.navButton, globalStyles.glassmorphism]}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={28} color={colors.primary} />
            </BlurView>
          </TouchableOpacity>
          <TouchableOpacity>
            <BlurView intensity={80} tint="light" style={[styles.navButton, globalStyles.glassmorphism]}>
              <MaterialCommunityIcons name="run" size={28} color={colors.magenta} />
            </BlurView>
          </TouchableOpacity>
          <TouchableOpacity>
            <BlurView intensity={80} tint="light" style={[styles.navButton, globalStyles.glassmorphism]}>
              <MaterialCommunityIcons name="tshirt-crew" size={28} color={colors.primary} />
            </BlurView>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDropModalVisible(true)}>
            <BlurView intensity={80} tint="light" style={[styles.navButton, globalStyles.glassmorphism]}>
              <MaterialCommunityIcons name="plus" size={28} color={colors.cyan} />
            </BlurView>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ドロップUI（モーダル） */}
      <Modal
        visible={isDropModalVisible}
        transparent={true}
        animationType="fade"
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />

          <View style={[styles.modalContent, globalStyles.glassmorphism]}>
            <Text style={[globalStyles.textPixel, styles.modalTitle]}>NEW DROP</Text>

            <Text style={styles.modalSectionTitle}>SELECT ICON</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconSelector}>
              {AVAILABLE_ICONS.map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  style={[
                    styles.iconOption,
                    selectedIcon === iconName && styles.iconOptionSelected
                  ]}
                  onPress={() => setSelectedIcon(iconName)}
                >
                  <MaterialCommunityIcons
                    name={iconName}
                    size={28}
                    color={selectedIcon === iconName ? colors.white : colors.primary}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.modalSectionTitle}>MESSAGE</Text>
            <TextInput
              style={styles.textInput}
              placeholder="What's happening here?"
              placeholderTextColor={colors.gray}
              value={dropMessage}
              onChangeText={setDropMessage}
              multiline
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setDropModalVisible(false)}>
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleDrop}>
                <Text style={styles.submitButtonText}>DROP IT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  webMapPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webMapText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  statusBarContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 5,
    zIndex: 10,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    opacity: 0.8,
  },
  headerContainer: {
    position: 'absolute',
    top: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 30,
    overflow: 'hidden', // BlurViewの角丸を効かせるため
  },
  searchText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.text,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
  },
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  currentLocationDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  currentLocationInnerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
  },
  markerContainer: {
    backgroundColor: colors.white,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  markerTail: {
    position: 'absolute',
    bottom: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.white,
  },
  activeMarkerContainer: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
    position: 'relative',
  },
  activeMarkerText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  activeMarkerTail: {
    position: 'absolute',
    bottom: -8,
    left: 20, // 左寄せ気味
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.accent,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  modalTitle: {
    fontSize: 20,
    color: colors.magenta,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.gray,
    marginBottom: 10,
  },
  iconSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(107, 59, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconOptionSelected: {
    backgroundColor: colors.magenta,
    shadowColor: colors.magenta,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 15,
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    marginRight: 10,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.gray,
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 15,
    marginLeft: 10,
    borderRadius: 30,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  submitButtonText: {
    color: colors.text,
    fontWeight: 'bold',
  },
});
