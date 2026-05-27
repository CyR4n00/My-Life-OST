import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Modal, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import EncounterModal from '../components/EncounterModal';
import RetroAvatar from '../components/RetroAvatar';

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
  const [attachedPhoto, setAttachedPhoto] = useState(null);

  // すれちがい（取得）モーダルの管理
  const [encounterData, setEncounterData] = useState(null);

  // ドロップ回数の管理（初期値3）
  const [dropsLeft, setDropsLeft] = useState(3);
  const MAX_DROPS = 3;

  const handleOpenDropModal = () => {
    if (dropsLeft > 0) {
      setDropModalVisible(true);
    } else {
      alert("今日のドロップ回数を使い切りました。明日まで待つか、プレミアム機能で回復してください！");
    }
  };

  const handleDrop = () => {
    // 実際はここでAPI等に送信し、新しいドロップを地図上に追加する処理を書く
    console.log("Dropped:", { icon: selectedIcon, message: dropMessage, photo: attachedPhoto });
    setDropsLeft(prev => Math.max(0, prev - 1));
    setDropModalVisible(false);
    setDropMessage('');
    setAttachedPhoto(null);
  };

  const handlePickDrop = (drop) => {
    // ドロップを拾った際のアクション（すれちがいエフェクトを開始）
    setEncounterData(drop);
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

          {/* テスト用のモックドロップ（Web検証用） */}
          <TouchableOpacity
            style={{ position: 'absolute', top: 150, left: 100 }}
            onPress={() => handlePickDrop({
              id: 1,
              title: '秘密の書き置き',
              message: '〇〇大学の食堂の端の席に、「次の講義ダルいね」という書き置き。',
              user: 'Stranger_1',
              hasPhoto: true,
              color: colors.cyan
            })}
          >
            <View style={styles.activeMarkerContainer}>
                <MaterialCommunityIcons name="treasure-chest" size={20} color={colors.white} />
                <Text style={styles.activeMarkerText}>12m</Text>
                <View style={styles.activeMarkerTail} />
            </View>
          </TouchableOpacity>

          <View style={{ position: 'absolute', top: 200, right: 100, ...styles.radarDotContainer }}>
            <View style={styles.radarDotOuter} />
            <View style={styles.radarDotInner} />
            <Text style={styles.radarDistanceText}>85m</Text>
          </View>
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
            <Marker coordinate={{ latitude: SHIBUYA_LAT, longitude: SHIBUYA_LNG }}>
              <View style={styles.avatarMarkerContainer}>
                <RetroAvatar
                  size={50}
                  bodyColor={colors.white}
                  borderColor={colors.cyan}
                  shoesColor={colors.primary}
                  // eyewear="sunglasses"
                  // headgear="crown"
                />
                <View style={styles.avatarMarkerTail} />
              </View>
            </Marker>

          {/* ドロップのピン（レーダー風表示） */}
          {MOCK_DROPS.map((drop) => {
            // 仮の距離計算（実際はHaversine式などで計算）
            // id=1 は近く(12m)、id=2は遠く(85m)というモック
            const distance = drop.id === 1 ? 12 : drop.id === 2 ? 85 : 200;
            const isClose = distance <= 50;

            return (
              <Marker
                key={drop.id}
                coordinate={{ latitude: drop.lat, longitude: drop.lng }}
                onPress={() => {
                  if (isClose) {
                    handlePickDrop({
                      ...drop,
                      message: '偶然通りかかったね！よろしく！',
                      user: 'Stranger_' + drop.id,
                      userIcon: 'alien-outline',
                      hasPhoto: drop.id === 1 // モックで写真あり判定
                    });
                  } else {
                    alert('近づかないと開けません！');
                  }
                }}
              >
                {isClose ? (
                  // 近くにある場合（拾える）
                  <View style={styles.activeMarkerContainer}>
                      <MaterialCommunityIcons name="treasure-chest" size={20} color={colors.white} />
                      <Text style={styles.activeMarkerText}>{distance}m</Text>
                      <View style={styles.activeMarkerTail} />
                  </View>
                ) : (
                  // 遠くにある場合（光るドット）
                  <View style={styles.radarDotContainer}>
                    <View style={styles.radarDotOuter} />
                    <View style={styles.radarDotInner} />
                    <Text style={styles.radarDistanceText}>{distance}m</Text>
                  </View>
                )}
              </Marker>
            );
          })}
        </MapView>
      )}

      {/* ガラケー風ステータスバー（ワンポイント） */}
      <SafeAreaView style={styles.statusBarContainer} pointerEvents="box-none">
        <View style={styles.statusBar}>
          <Text style={[globalStyles.textPixel, { fontSize: 12, color: colors.magenta }]}>i-mode</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialCommunityIcons name="signal-cellular-3" size={14} color={colors.cyan} />
            <MaterialCommunityIcons name="battery-80" size={14} color={colors.cyan} style={{ marginLeft: 4 }} />
          </View>
        </View>

        {/* 右上のドロップ残数表示 */}
        <View style={styles.dropCounterContainer}>
          <BlurView intensity={80} tint="light" style={[styles.dropCounter, globalStyles.glassmorphism]}>
            <MaterialCommunityIcons name="pill" size={16} color={colors.magenta} />
            <Text style={[globalStyles.textPixel, styles.dropCounterText]}>
              DROPS: {dropsLeft}/{MAX_DROPS}
            </Text>
          </BlurView>
        </View>
      </SafeAreaView>

      {/* ドロップ追加（共通タブバーの上にフローティング表示） */}
      <SafeAreaView style={styles.floatingButtonContainer} pointerEvents="box-none" edges={['bottom', 'right']}>
        <TouchableOpacity style={styles.fabButton} onPress={handleOpenDropModal}>
            <MaterialCommunityIcons name="pencil-plus" size={36} color={colors.white} />
        </TouchableOpacity>
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

          <View style={styles.retroModalContent}>
            {/* ガラケー/レトロ風のヘッダー */}
            <View style={styles.retroModalHeader}>
              <MaterialCommunityIcons name="pencil-box" size={16} color={colors.white} />
              <Text style={[globalStyles.textPixel, styles.retroModalTitle]}>新規作成 (DROP)</Text>
            </View>

            <View style={styles.retroModalBody}>
              <Text style={styles.retroModalSectionTitle}>ICON</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.retroIconSelector}>
                {AVAILABLE_ICONS.map((iconName) => (
                  <TouchableOpacity
                    key={iconName}
                    style={[
                      styles.retroIconOption,
                      selectedIcon === iconName && styles.retroIconOptionSelected
                    ]}
                    onPress={() => setSelectedIcon(iconName)}
                  >
                    <MaterialCommunityIcons
                      name={iconName}
                      size={28}
                      color={selectedIcon === iconName ? '#fff' : '#666'}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.retroModalSectionTitle}>ATTACHMENT</Text>
              <TouchableOpacity
                style={[styles.retroPhotoAttachButton, attachedPhoto && styles.retroPhotoAttachButtonActive]}
                onPress={() => setAttachedPhoto(!attachedPhoto)}
              >
                <MaterialCommunityIcons
                  name={attachedPhoto ? "image-check" : "camera-plus"}
                  size={24}
                  color={attachedPhoto ? '#fff' : '#333'}
                />
                <Text style={[styles.retroPhotoAttachText, attachedPhoto && {color: '#fff'}]}>
                  {attachedPhoto ? "添付ファイル.jpg" : "写真を選択する"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.retroModalSectionTitle}>MESSAGE</Text>
              <TextInput
                style={styles.retroTextInput}
                placeholder="ここにテキストを入力..."
                placeholderTextColor="#999"
                value={dropMessage}
                onChangeText={setDropMessage}
                multiline
              />
            </View>

            {/* ガラケー風アクションボタン */}
            <View style={styles.retroModalActionButtons}>
              <TouchableOpacity style={styles.retroCancelButton} onPress={() => setDropModalVisible(false)}>
                <Text style={styles.retroCancelButtonText}>戻る</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.retroSubmitButton} onPress={handleDrop}>
                <Text style={styles.retroSubmitButtonText}>埋める</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* すれちがい通信風の交流エフェクトモーダル */}
      <EncounterModal
        visible={!!encounterData}
        dropData={encounterData}
        onClose={() => setEncounterData(null)}
      />
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
  dropCounterContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  dropCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  dropCounterText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 90, // タブバーの上
    right: 20, // 右下に配置
    zIndex: 10,
  },
  fabButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.magenta,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 70, // tail分の高さを確保
  },
  avatarMarkerTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary, // アバターの色と合わせるか、アクセントカラー
    marginTop: -5, // アバターに少し被せる
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
    left: '50%',
    marginLeft: -8,
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
  radarDotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarDotOuter: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 255, 255, 0.4)',
  },
  radarDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.cyan,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  radarDistanceText: {
    fontSize: 10,
    color: colors.white,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginTop: 4,
    overflow: 'hidden',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  retroModalContent: {
    width: width * 0.95,
    backgroundColor: '#d3d3d3',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#888',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 5,
  },
  retroModalHeader: {
    backgroundColor: colors.magenta,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#555',
  },
  retroModalTitle: {
    color: colors.white,
    fontSize: 14,
    marginLeft: 6,
    flex: 1,
  },
  retroModalBody: {
    padding: 15,
    backgroundColor: '#e6e6e6',
  },
  retroModalSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  retroIconSelector: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  retroIconOption: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  retroIconOptionSelected: {
    backgroundColor: colors.magenta,
    borderColor: '#550022',
  },
  retroPhotoAttachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#aaa',
    marginBottom: 15,
  },
  retroPhotoAttachButtonActive: {
    backgroundColor: colors.cyan,
    borderColor: '#005555',
  },
  retroPhotoAttachText: {
    marginLeft: 10,
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  retroTextInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#000',
    fontFamily: 'monospace',
  },
  retroModalActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#d3d3d3',
    borderTopWidth: 2,
    borderTopColor: '#aaa',
  },
  retroCancelButton: {
    flex: 1,
    paddingVertical: 16,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#999',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#555',
  },
  retroCancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  retroSubmitButton: {
    flex: 1,
    paddingVertical: 16,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: colors.cyan,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#005555',
  },
  retroSubmitButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
});
