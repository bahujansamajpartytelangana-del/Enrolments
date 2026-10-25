import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/iosTheme';

export default function KPICard({
  title,
  subTitle,
  value,
  iconName,
  accentColor = colors.primary,
  bgColor = colors.primaryLight,
  progress = null,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.75 : 1}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: bgColor }]}>
          <Ionicons name={iconName} size={20} color={accentColor} />
        </View>
        {progress !== null && (
          <View style={[styles.progressTag, { backgroundColor: accentColor + '18' }]}>
            <Text style={[styles.progressTagText, { color: accentColor }]}>
              {progress}% Verified
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.value, { color: colors.textPrimary }]}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      {subTitle ? (
        <Text style={styles.subText} numberOfLines={1}>
          {subTitle}
        </Text>
      ) : null}

      {progress !== null && (
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: accentColor },
            ]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48.2%',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
    ...shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTag: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  progressTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  subText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
