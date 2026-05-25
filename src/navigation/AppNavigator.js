import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../constants/theme';

import MapScreen from '../screens/MapScreen';
import AlbumScreen from '../screens/AlbumScreen';
import FriendScreen from '../screens/FriendScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

// カスタムのボトムタブバー（MapScreenから移植して共通化）
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 10) }]} pointerEvents="box-none">
      <View style={styles.bottomNavContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          let iconName;
          let iconColor = isFocused ? colors.magenta : colors.primary;

          if (route.name === 'Map') iconName = 'map-outline';
          else if (route.name === 'Album') iconName = 'folder-heart-outline';
          else if (route.name === 'Friend') iconName = 'account-multiple-outline';
          else if (route.name === 'Profile') iconName = 'account-circle-outline';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity key={route.key} onPress={onPress}>
              <BlurView intensity={80} tint="light" style={[styles.navButton, globalStyles.glassmorphism]}>
                <MaterialCommunityIcons name={iconName} size={28} color={iconColor} />
              </BlurView>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Album" component={AlbumScreen} />
      <Tab.Screen name="Friend" component={FriendScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
    paddingTop: 10,
    marginBottom: 20,
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
});
