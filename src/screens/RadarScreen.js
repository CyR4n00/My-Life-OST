import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// 仮のドロップデータ
const MOCK_DROPS = [
  { id: 1, distance: 12, angle: 45 },
  { id: 2, distance: 35, angle: 120 },
  { id: 3, distance: 50, angle: 280 },
];

export default function RadarScreen() {
  const [isScanning, setIsScanning] = useState(true);

  // レーダーの回転アニメーション用（今回はシンプルなUIベースなので静的に表示）

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={[globalStyles.textRetro, styles.title]}>DropZone</Text>
        <Text style={[globalStyles.textRetro, styles.status]}>
          {isScanning ? 'SCANNING...' : 'STANDBY'}
        </Text>
      </View>

      {/* レーダーUI */}
      <View style={styles.radarContainer}>
        <View style={styles.radarCircle}>
          <View style={styles.radarInnerCircle1} />
          <View style={styles.radarInnerCircle2} />
          <View style={styles.radarCrosshairHorizontal} />
          <View style={styles.radarCrosshairVertical} />

          {/* モックのドロップを表示 */}
          {isScanning && MOCK_DROPS.map(drop => {
            // 中心からの距離と角度を座標に変換（簡易的な計算）
            const maxRadius = (width * 0.8) / 2;
            const r = (drop.distance / 50) * maxRadius; // 50mを最大とする
            const theta = (drop.angle - 90) * (Math.PI / 180); // 上を0度とする

            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);

            return (
              <View
                key={drop.id}
                style={[
                  styles.dropDot,
                  { transform: [{ translateX: x }, { translateY: y }] }
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* 近いドロップの情報 */}
      <View style={styles.infoContainer}>
        <Text style={[globalStyles.textRetro, styles.infoText]}>
          NEARBY DROPS: {MOCK_DROPS.length}
        </Text>
        <Text style={[globalStyles.textRetro, styles.closestText]}>
          CLOSEST: {Math.min(...MOCK_DROPS.map(d => d.distance))}m
        </Text>
      </View>

      {/* アクションボタン */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="pencil-box-outline" size={24} color={colors.background} />
          <Text style={styles.buttonText}>DROP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.collectionButton]}>
          <MaterialCommunityIcons name="folder-outline" size={24} color={colors.radarGreen} />
          <Text style={[styles.buttonText, { color: colors.radarGreen }]}>LOGS</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.radarDarkGreen,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    animation: 'blink 1s infinite',
  },
  radarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarCircle: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    borderWidth: 2,
    borderColor: colors.radarGreen,
    backgroundColor: colors.radarDarkGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarInnerCircle1: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.3)',
  },
  radarInnerCircle2: {
    position: 'absolute',
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.1,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.3)',
  },
  radarCrosshairHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(57, 255, 20, 0.3)',
  },
  radarCrosshairVertical: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(57, 255, 20, 0.3)',
  },
  dropDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.radarGreen,
    shadowColor: colors.radarGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  infoContainer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.radarDarkGreen,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closestText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: colors.radarGreen,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.radarGreen,
  },
  buttonText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.background,
    marginLeft: 8,
  },
});
