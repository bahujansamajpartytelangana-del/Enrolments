import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EnrollmentCard from '../components/EnrollmentCard';
import { colors } from '../theme/iosTheme';

export default function EnrollmentsScreen({
  enrollmentsList,
  refreshing,
  onRefresh,
  onMarkEnrolled,
  onOpenAddModal,
}) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'pending' | 'enrolled' | 'bulk'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredList = useMemo(() => {
    return enrollmentsList.filter((item) => {
      // 1. Status Filter
      if (activeFilter === 'pending' && item.status !== 'pending') return false;
      if (activeFilter === 'enrolled' && item.status !== 'enrolled') return false;
      if (activeFilter === 'bulk' && !item.is_bulk) return false;

      // 2. Search Query Filter
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = (item.full_name || '').toLowerCase().includes(query);
        const phoneMatch = (item.phone || '').toLowerCase().includes(query);
        const distMatch = (item.district || '').toLowerCase().includes(query);
        const constMatch = (item.constituency || '').toLowerCase().includes(query);
        return nameMatch || phoneMatch || distMatch || constMatch;
      }

      return true;
    });
  }, [enrollmentsList, activeFilter, searchQuery]);

  const pendingCount = enrollmentsList.filter((i) => i.status === 'pending').length;
  const enrolledCount = enrollmentsList.filter((i) => i.status === 'enrolled').length;
  const bulkCount = enrollmentsList.filter((i) => i.is_bulk).length;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
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
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <View style={{ flex: 1 }}>
            <Text style={styles.subHeader}>WHATSAPP BOT INFLOW STREAM</Text>
            <Text style={styles.largeTitle}>Enrollments</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={onOpenAddModal}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addBtnText}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color={colors.textMuted} />
          <TextInput
            placeholder="Search by name, phone, constituency..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Segmented Control */}
        <View style={styles.filterBar}>
          {[
            { id: 'all', label: 'All', count: enrollmentsList.length },
            { id: 'pending', label: 'Pending', count: pendingCount },
            { id: 'enrolled', label: 'Enrolled', count: enrolledCount },
            { id: 'bulk', label: 'Bulk', count: bulkCount },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveFilter(tab.id)}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isActive && styles.filterPillTextActive,
                  ]}
                >
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Summary Info Banner */}
        <View style={styles.summaryBanner}>
          <Ionicons name="information-circle" size={16} color={colors.primary} />
          <Text style={styles.summaryBannerText}>
            Showing {filteredList.length} applications. Live synchronized with WhatsApp Bot.
          </Text>
        </View>

        {/* List of Cards */}
        {filteredList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={38} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Records Found</Text>
            <Text style={styles.emptySub}>
              {searchQuery
                ? 'Try a different search keyword or clear filters.'
                : 'No applications match this filter.'}
            </Text>
          </View>
        ) : (
          filteredList.map((item) => (
            <EnrollmentCard
              key={item.id}
              item={item}
              onMarkEnrolled={onMarkEnrolled}
              showActions={true}
            />
          ))
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.textPrimary,
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
  },
  filterPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 8,
  },
  filterPillActive: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  filterPillTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    marginBottom: 14,
    gap: 6,
  },
  summaryBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
    flex: 1,
  },
  emptyContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});
