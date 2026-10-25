import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/iosTheme';

export default function DistrictProfilesScreen({ hierarchy }) {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [actionPlans, setActionPlans] = useState(() => {
    const plans = {};
    hierarchy.forEach((d) => {
      plans[d.id] = d.actionPlan;
    });
    return plans;
  });
  const [editingId, setEditingId] = useState(null);
  const [tempPlanText, setTempPlanText] = useState('');
  const [strengthFilter, setStrengthFilter] = useState('ALL'); // 'ALL' | 'Strong' | 'Moderate' | 'Weak'

  const getStrengthColor = (strength) => {
    if (strength === 'Strong') return colors.success;
    if (strength === 'Moderate') return colors.warning;
    return colors.danger;
  };

  const handleStartEdit = (dist) => {
    setEditingId(dist.id);
    setTempPlanText(actionPlans[dist.id] || dist.actionPlan || '');
  };

  const handleSavePlan = (distId) => {
    setActionPlans((prev) => ({
      ...prev,
      [distId]: tempPlanText,
    }));
    setEditingId(null);
    Alert.alert('Action Plan Saved', 'Strategic action plan has been successfully updated.');
  };

  const filteredDistricts = hierarchy.filter((d) =>
    strengthFilter === 'ALL' ? true : d.strength === strengthFilter
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.subHeader}>ELECTORAL AUDIT & STRATEGY</Text>
          <Text style={styles.largeTitle}>District Profiles</Text>
        </View>

        {/* Strength Filter Pills */}
        <View style={styles.segmentedControl}>
          {['ALL', 'Strong', 'Moderate', 'Weak'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.segmentBtn,
                strengthFilter === tab && styles.segmentBtnActive,
              ]}
              onPress={() => setStrengthFilter(tab)}
            >
              <Text
                style={[
                  styles.segmentBtnText,
                  strengthFilter === tab && styles.segmentBtnTextActive,
                ]}
              >
                {tab.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* District Profile Cards */}
        {filteredDistricts.map((dist) => {
          const strengthColor = getStrengthColor(dist.strength);
          const isSelected = selectedDistrict?.id === dist.id;
          const currentPlan = actionPlans[dist.id] || dist.actionPlan;
          const enrolledPercent = Math.round((dist.enrolled / dist.botTotal) * 100);

          return (
            <TouchableOpacity
              key={dist.id}
              style={[
                styles.profileCard,
                isSelected && styles.profileCardActive,
              ]}
              activeOpacity={0.9}
              onPress={() => setSelectedDistrict(isSelected ? null : dist)}
            >
              {/* Card Header */}
              <View style={styles.topRow}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.districtTitle}>{dist.name} District</Text>
                  <Text style={styles.inchargeSub}>
                    Incharge: {dist.incharge} • {dist.phone}
                  </Text>
                </View>

                <View
                  style={[
                    styles.strengthBadge,
                    { backgroundColor: strengthColor + '18' },
                  ]}
                >
                  <View style={[styles.statusDot, { backgroundColor: strengthColor }]} />
                  <Text style={[styles.strengthBadgeText, { color: strengthColor }]}>
                    {dist.strength.toUpperCase()} ({dist.score}%)
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Enrollment Conversion</Text>
                  <Text style={[styles.progressVal, { color: strengthColor }]}>
                    {enrolledPercent}% Completed
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(100, Math.max(0, enrolledPercent))}%`,
                        backgroundColor: strengthColor,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* KPI Stat Blocks */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>
                    {dist.botTotal.toLocaleString()}
                  </Text>
                  <Text style={styles.statLabel}>WhatsApp Inflow</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statBox}>
                  <Text style={[styles.statNumber, { color: colors.primary }]}>
                    {dist.enrolled.toLocaleString()}
                  </Text>
                  <Text style={styles.statLabel}>MLC Enrolled</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statBox}>
                  <Text style={[styles.statNumber, { color: colors.warning }]}>
                    {dist.pending.toLocaleString()}
                  </Text>
                  <Text style={styles.statLabel}>Pending Backlog</Text>
                </View>
              </View>

              {/* Constituency Status Pills */}
              <Text style={styles.miniLabel}>
                Constituency Strength Breakdown ({dist.constituencies.length}):
              </Text>
              <View style={styles.chipsWrap}>
                {dist.constituencies.map((c) => {
                  const cColor = getStrengthColor(c.strength);
                  return (
                    <View
                      key={c.id}
                      style={[
                        styles.constitChip,
                        { borderColor: cColor + '40', backgroundColor: cColor + '08' },
                      ]}
                    >
                      <View style={[styles.miniDot, { backgroundColor: cColor }]} />
                      <Text style={styles.constitName}>
                        {c.name.replace(' Constituency', '')}
                      </Text>
                      <Text style={[styles.constitTag, { color: cColor }]}>
                        {c.strength}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Action Plan Box (What Needs To Be Done) */}
              <View
                style={[
                  styles.actionPlanContainer,
                  dist.strength === 'Weak' && styles.actionPlanWeak,
                ]}
              >
                <View style={styles.actionPlanHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                    <Ionicons
                      name="bulb"
                      size={17}
                      color={dist.strength === 'Weak' ? colors.danger : colors.warning}
                    />
                    <Text
                      style={[
                        styles.actionPlanTitle,
                        {
                          color:
                            dist.strength === 'Weak'
                              ? colors.danger
                              : '#9A5B00',
                        },
                      ]}
                    >
                      STRATEGIC ACTION PLAN (WHAT NEEDS TO BE DONE):
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleStartEdit(dist)}
                    style={styles.editPlanBtn}
                  >
                    <Ionicons name="create-outline" size={14} color={colors.primary} />
                    <Text style={styles.editPlanText}>
                      {editingId === dist.id ? 'Cancel' : 'Edit Plan'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {editingId === dist.id ? (
                  <View style={{ marginTop: 8 }}>
                    <TextInput
                      style={styles.planInput}
                      value={tempPlanText}
                      onChangeText={setTempPlanText}
                      multiline
                      numberOfLines={4}
                      placeholder="Enter strategic priority tasks for this district..."
                    />
                    <TouchableOpacity
                      style={styles.savePlanBtn}
                      onPress={() => handleSavePlan(dist.id)}
                    >
                      <Ionicons name="checkmark-done" size={15} color="#FFFFFF" />
                      <Text style={styles.savePlanBtnText}>Save Action Plan</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.actionPlanBody}>{currentPlan}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollArea: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },
  headerBlock: {
    marginBottom: 14,
  },
  subHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  largeTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    padding: 3,
    marginBottom: 14,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636366',
  },
  segmentBtnTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  profileCardActive: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  districtTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  inchargeSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 3,
  },
  strengthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  strengthBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  progressVal: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    height: 7,
    backgroundColor: colors.border,
    borderRadius: 3.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 12,
    marginVertical: 12,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  constitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },
  miniDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  constitName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  constitTag: {
    fontSize: 10,
    fontWeight: '700',
  },
  actionPlanContainer: {
    backgroundColor: '#FFF9ED',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFE8B8',
  },
  actionPlanWeak: {
    backgroundColor: '#FFF1F0',
    borderColor: '#FFCCC7',
  },
  actionPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionPlanTitle: {
    fontSize: 11,
    fontWeight: '800',
  },
  editPlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  editPlanText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  actionPlanBody: {
    fontSize: 13,
    color: '#3A3A3C',
    lineHeight: 18,
    marginTop: 4,
    fontWeight: '500',
  },
  planInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 13,
    color: colors.textPrimary,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  savePlanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 7,
    marginTop: 8,
    gap: 6,
  },
  savePlanBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
