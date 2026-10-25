import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/iosTheme';

export default function HeroMetricCard({
  todayEnrollments = 0,
  bulkTodayEnrollments = 0,
  lastUpdatedText = 'Live from WhatsApp Bot Stream',
}) {
  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="flash" size={17} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>TODAY'S ENROLLMENT INFLOW</Text>
          <Text style={styles.subtitle}>{lastUpdatedText}</Text>
        </View>
        <View style={styles.liveTag}>
          <Text style={styles.liveTagText}>24H LIVE</Text>
        </View>
      </View>

      {/* Hero Numbers Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{todayEnrollments.toLocaleString()}</Text>
          <Text style={styles.metricLabel}>Today's Enrollments</Text>
          <Text style={styles.metricSub}>Individual Entries</Text>
        </View>

        <View style={styles.verticalDivider} />

        <View style={styles.metricItem}>
          <Text style={[styles.metricValue, { color: '#E8F5E9' }]}>
            {bulkTodayEnrollments.toLocaleString()}
          </Text>
          <Text style={styles.metricLabel}>Bulk Today Enrollments</Text>
          <Text style={styles.metricSub}>Batch Inflow</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    ...shadows.hero,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.82)',
    marginTop: 1,
  },
  liveTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  liveTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    textAlign: 'center',
  },
  metricSub: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.72)',
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
