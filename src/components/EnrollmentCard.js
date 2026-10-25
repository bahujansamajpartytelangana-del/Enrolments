import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/iosTheme';

export default function EnrollmentCard({
  item,
  onMarkEnrolled,
  showActions = true,
}) {
  const isEnrolled = item.status === 'enrolled';
  const cleanPhone = item.phone ? item.phone.replace(/[^0-9]/g, '') : '';

  const handleCall = () => {
    if (item.phone) Linking.openURL(`tel:${item.phone}`);
  };

  const handleWhatsApp = () => {
    if (cleanPhone) {
      Linking.openURL(
        `https://wa.me/${cleanPhone}?text=Hello ${item.full_name}, verifying your MLC enrollment details.`
      );
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {item.full_name}
            </Text>
            {item.is_bulk && (
              <View style={styles.bulkTag}>
                <Text style={styles.bulkTagText}>BULK</Text>
              </View>
            )}
          </View>

          <Text style={styles.locationSub} numberOfLines={1}>
            {item.district} • {item.constituency}
            {item.mandal ? ` • ${item.mandal}` : ''}
          </Text>

          <Text style={styles.metaText}>
            {item.phone} • {item.created_at ? item.created_at : 'Recently'}
          </Text>
        </View>

        {/* Status Badge */}
        {isEnrolled ? (
          <View style={styles.enrolledBadge}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.enrolledBadgeText}>Enrolled</Text>
          </View>
        ) : (
          <View style={styles.pendingBadge}>
            <Ionicons name="time" size={13} color={colors.warning} />
            <Text style={styles.pendingBadgeText}>Pending</Text>
          </View>
        )}
      </View>

      {/* Operator and Action Row */}
      <View style={styles.footerRow}>
        <View style={styles.operatorRow}>
          <Ionicons name="person-circle-outline" size={14} color={colors.textMuted} />
          <Text style={styles.operatorText}>
            {item.operator || (isEnrolled ? 'Verified Employee' : 'Unassigned Bot Inflow')}
          </Text>
        </View>

        {showActions && (
          <View style={styles.actionsGroup}>
            {/* Quick Contact Icons */}
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={handleCall}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={13} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.circleBtn}
              onPress={handleWhatsApp}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-whatsapp" size={14} color="#25D366" />
            </TouchableOpacity>

            {/* Mark Enrolled Button */}
            {!isEnrolled && onMarkEnrolled && (
              <TouchableOpacity
                style={styles.verifyBtn}
                onPress={() => onMarkEnrolled(item.id)}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                <Text style={styles.verifyBtnText}>Mark Enrolled</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bulkTag: {
    backgroundColor: colors.purpleBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bulkTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.purple,
    letterSpacing: 0.5,
  },
  locationSub: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
  },
  metaText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
  },
  enrolledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  enrolledBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningBg,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.warning,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  operatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  operatorText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  circleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
