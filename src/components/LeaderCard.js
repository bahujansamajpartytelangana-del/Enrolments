import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/iosTheme';

export default function LeaderCard({
  title,
  leaderName,
  role = 'District Incharge',
  phone,
  photo,
  subCountLabel,
  badgeColor = colors.primary,
  onPressCard,
  isHeaderBanner = false,
}) {
  const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';

  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (cleanPhone) {
      Linking.openURL(`https://wa.me/${cleanPhone}?text=Hello, MLC Enrollment Tracking System`);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={onPressCard ? 0.75 : 1}
      onPress={onPressCard}
      style={[
        styles.card,
        isHeaderBanner && styles.headerBannerCard,
      ]}
    >
      <View style={styles.topRow}>
        {/* Leader Photo */}
        <Image
          source={{
            uri:
              photo ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
          }}
          style={styles.avatar}
        />

        {/* Info */}
        <View style={styles.infoCol}>
          <View style={styles.roleRow}>
            <View style={[styles.rolePill, { backgroundColor: badgeColor + '18' }]}>
              <Text style={[styles.rolePillText, { color: badgeColor }]}>{role}</Text>
            </View>
            {subCountLabel ? (
              <View style={styles.subCountBadge}>
                <Text style={styles.subCountText}>{subCountLabel}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.locationTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.leaderName} numberOfLines={1}>
            {leaderName}
          </Text>
          <Text style={styles.phoneText}>{phone}</Text>
        </View>

        {onPressCard && (
          <View style={styles.chevronWrap}>
            <Ionicons name="chevron-forward" size={19} color="#C7C7CC" />
          </View>
        )}
      </View>

      {/* Action Buttons: Call & WhatsApp */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.callBtn]}
          onPress={handleCall}
          activeOpacity={0.75}
        >
          <Ionicons name="call" size={15} color={colors.primary} />
          <Text style={[styles.actionBtnText, { color: colors.primary }]}>Call Leader</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.whatsappBtn]}
          onPress={handleWhatsApp}
          activeOpacity={0.75}
        >
          <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
          <Text style={[styles.actionBtnText, { color: '#1B8C41' }]}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...shadows.card,
  },
  headerBannerCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    backgroundColor: '#F7FAFF',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.border,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  infoCol: {
    flex: 1,
    marginLeft: 12,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  subCountBadge: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  leaderName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
  },
  phoneText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  chevronWrap: {
    marginLeft: 6,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  callBtn: {
    backgroundColor: colors.primaryLight,
  },
  whatsappBtn: {
    backgroundColor: colors.whatsappBg,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
