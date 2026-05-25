import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  { id: 1, lat: SHIBUYA_LAT + 0.0005, lng: SHIBUYA_LNG + 0.0005, icon: 'message-text-outline', color: '#ff0055', title: '雑談' },
  { id: 2, lat: SHIBUYA_LAT - 0.0003, lng: SHIBUYA_LNG + 0.0002, icon: 'coffee-outline', color: '#00d0ff', title: 'カフェ情報' },
  { id: 3, lat: SHIBUYA_LAT + 0.0002, lng: SHIBUYA_LNG - 0.0006, icon: 'emoticon-sad-outline', color: '#39ff14', title: '愚痴' },
];

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: SHIBUYA_LAT,
    longitude: SHIBUYA_LNG,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  return (
    <View style={globalStyles.container}>
      {/* マップ部分 */}
      {Platform.OS === 'web' ? (
        <View style={styles.webMapPlaceholder}>
          <MaterialCommunityIcons name="map-marker-off" size={64} color={colors.primary} />
          <Text style={[globalStyles.textRetro, styles.webMapText]}>
            マップ表示はiOS/Android端末でのみサポートされています。
          </Text>
          <Text style={[globalStyles.textRetro, { color: '#888', marginTop: 10 }]}>
            (Webプレビュー用モック)
          </Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          userInterfaceStyle="dark" // マップをダークモードに
        >
          {/* 現在地の擬似的な表現（シミュレータ用） */}
          <Circle
            center={{ latitude: SHIBUYA_LAT, longitude: SHIBUYA_LNG }}
            radius={50} // 取得可能範囲 50m
            strokeWidth={2}
            strokeColor={colors.primary}
            fillColor="rgba(0, 208, 255, 0.2)"
          />

          {/* ドロップのピン */}
          {MOCK_DROPS.map((drop) => (
            <Marker
              key={drop.id}
              coordinate={{ latitude: drop.lat, longitude: drop.lng }}
              title={drop.title}
            >
              <View style={[styles.markerContainer, { backgroundColor: drop.color }]}>
                <MaterialCommunityIcons name={drop.icon} size={20} color="#000" />
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      {/* ヘッダー（マップ上にオーバーレイ） */}
      <SafeAreaView style={styles.headerContainer} pointerEvents="box-none">
        <View style={styles.header}>
          <Text style={[globalStyles.textRetro, styles.title]}>DropZone</Text>
          <View style={styles.statusBadge}>
            <Text style={[globalStyles.textRetro, styles.status]}>NEARBY: {MOCK_DROPS.length}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* ボトムUI（マップ上にオーバーレイ） */}
      <SafeAreaView style={styles.bottomContainer} pointerEvents="box-none" edges={['bottom']}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialCommunityIcons name="map-marker-plus" size={24} color={colors.background} />
            <Text style={styles.buttonText}>DROP HERE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.collectionButton}>
            <MaterialCommunityIcons name="folder-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  webMapPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webMapText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textShadowColor: 'rgba(0, 208, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statusBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.background,
    marginLeft: 10,
  },
  collectionButton: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
});
