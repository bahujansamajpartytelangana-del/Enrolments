import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/iosTheme';

export default function Header({
  subTitle = 'MLC ENROLLMENT COMMAND',
  title = 'Executive Dashboard',
  isLive = true,
  refreshing = false,
  onRefresh,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrap}>
        <Text style={styles.subTitle}>{subTitle}</Text>
        <Text style={styles.mainTitle}>{title}</Text>
      </View>

      <View style={styles.actionsWrap}>
        {/* Real-time Status Badge */}
        <View style={styles.liveBadge}>
          <View style={[styles.statusDot, isLive ? styles.greenDot : styles.amberDot]} />
          <Text style={styles.liveText}>{isLive ? 'Supabase Live' : 'Connecting'}</Text>
        </View>

        {/* Refresh Button */}
        {onRefresh && (
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={onRefresh}
            activeOpacity={0.7}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="reload" size={17} color={colors.primary} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 14,
  },
  titleWrap: {
    flex: 1,
    paddingRight: 8,
  },
  subTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  mainTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
    letterSpacing: -0.4,
  },
  actionsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.badge,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  greenDot: {
    backgroundColor: colors.success,
  },
  amberDot: {
    backgroundColor: colors.warning,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.badge,
  },
});
