import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/iosTheme';

export default function BottomTabBar({
  activeTab,
  onTabChange,
  pendingCount = 0,
}) {
  const tabs = [
    {
      id: 'home',
      label: 'Home',
      activeIcon: 'grid',
      inactiveIcon: 'grid-outline',
    },
    {
      id: 'incharges',
      label: 'Incharges',
      activeIcon: 'people',
      inactiveIcon: 'people-outline',
    },
    {
      id: 'districts',
      label: 'District Profiles',
      activeIcon: 'analytics',
      inactiveIcon: 'analytics-outline',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBarInner}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrap}>
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.inactiveIcon}
                  size={23}
                  color={isActive ? colors.primary : colors.textMuted}
                />
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
    ...shadows.tabBar,
  },
  tabBarInner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconWrap: {
    position: 'relative',
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 4,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
