import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import HeroMetricCard from '../components/HeroMetricCard';
import KPICard from '../components/KPICard';
import EnrollmentCard from '../components/EnrollmentCard';
import { colors } from '../theme/iosTheme';

export default function DashboardScreen({
  metrics,
  enrollmentsList,
  refreshing,
  isLive,
  onRefresh,
  onMarkEnrolled,
  onOpenAddModal,
  onNavigateToEnrollments,
}) {
  const conversionRate =
    metrics.totalWhatsappBot > 0
      ? Math.round((metrics.mlcEnrolledPeople / metrics.totalWhatsappBot) * 100)
      : 74;

  const latestFeed = enrollmentsList.slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      {/* Executive Header */}
      <Header
        subTitle="MLC ENROLLMENT COMMAND CENTER"
        title="Executive Dashboard"
        isLive={isLive}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      {/* Hero Metric Card: Today & Bulk Today */}
      <HeroMetricCard
        todayEnrollments={metrics.todayEnrollments}
        bulkTodayEnrollments={metrics.bulkTodayEnrollments}
        lastUpdatedText="Live WhatsApp Bot & Field Stream"
      />

      {/* Quick Action Bar */}
      <View style={styles.quickBar}>
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={onOpenAddModal}
          activeOpacity={0.8}
        >
          <View style={styles.quickActionIcon}>
            <Ionicons name="person-add" size={16} color={colors.primary} />
          </View>
          <Text style={styles.quickActionText}>New Enrollment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickActionBtn, styles.quickActionSecondary]}
          onPress={onNavigateToEnrollments}
          activeOpacity={0.8}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: colors.warningBg }]}>
            <Ionicons name="time" size={16} color={colors.warning} />
          </View>
          <Text style={styles.quickActionText}>
            Review Pending ({metrics.pendingPeople})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4 Core KPI Cards (2x2 Grid) */}
      <Text style={styles.sectionHeader}>DATABASE OVERVIEW</Text>
      <View style={styles.kpiGrid}>
        {/* 1. Total WhatsApp Bot Enrollments */}
        <KPICard
          title="Total WhatsApp Bot"
          subTitle="Incoming Bot Submissions"
          value={metrics.totalWhatsappBot}
          iconName="logo-whatsapp"
          accentColor={colors.whatsappGreen}
          bgColor={colors.whatsappBg}
        />

        {/* 2. MLC Enrolled People (Completed) */}
        <KPICard
          title="MLC Enrolled"
          subTitle="Online Form Completed"
          value={metrics.mlcEnrolledPeople}
          iconName="checkmark-done-circle"
          accentColor={colors.primary}
          bgColor={colors.primaryLight}
        />

        {/* 3. Pending People */}
        <KPICard
          title="Pending Verification"
          subTitle="Awaiting Employee Review"
          value={metrics.pendingPeople}
          iconName="time"
          accentColor={colors.warning}
          bgColor={colors.warningBg}
        />

        {/* 4. Total Members & Conversion Progress */}
        <KPICard
          title="Total Members Base"
          subTitle="Cumulative Membership Base"
          value={metrics.totalMembers}
          iconName="people"
          accentColor={colors.purple}
          bgColor={colors.purpleBg}
          progress={conversionRate}
        />
      </View>

      {/* Recent WhatsApp Bot Feed */}
      <View style={styles.feedHeaderRow}>
        <View>
          <Text style={styles.sectionHeaderNoMargin}>LIVE WHATSAPP STREAM</Text>
          <Text style={styles.feedSub}>Latest incoming voter registrations</Text>
        </View>

        <TouchableOpacity
          style={styles.seeAllBtn}
          onPress={onNavigateToEnrollments}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>View All ({enrollmentsList.length})</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {latestFeed.length === 0 ? (
        <View style={styles.emptyFeedBox}>
          <Ionicons name="chatbubbles-outline" size={32} color={colors.textMuted} />
          <Text style={styles.emptyFeedText}>No enrollments received yet.</Text>
        </View>
      ) : (
        latestFeed.map((item) => (
          <EnrollmentCard
            key={item.id}
            item={item}
            onMarkEnrolled={onMarkEnrolled}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  quickBar: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    gap: 8,
  },
  quickActionSecondary: {
    backgroundColor: colors.card,
  },
  quickActionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 10,
    marginTop: 4,
    letterSpacing: 0.6,
  },
  sectionHeaderNoMargin: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  feedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  feedSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyFeedBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyFeedText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 8,
  },
});
