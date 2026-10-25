import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LeaderCard from '../components/LeaderCard';
import { colors } from '../theme/iosTheme';
import { STATE_INCHARGES } from '../data/mockData';

export default function InchargesScreen({ hierarchy }) {
  // Navigation Hierarchy Drill-down state
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [selectedMandal, setSelectedMandal] = useState(null);

  // Top Segmented Mode: 'drilldown' or flat level 'constituency' | 'mandal' | 'village'
  const [viewMode, setViewMode] = useState('drilldown');
  const [searchQuery, setSearchQuery] = useState('');

  // Breadcrumb Reset Functions
  const resetToDistricts = () => {
    setSelectedDistrict(null);
    setSelectedConstituency(null);
    setSelectedMandal(null);
    setViewMode('drilldown');
  };

  const resetToConstituencies = () => {
    setSelectedConstituency(null);
    setSelectedMandal(null);
    setViewMode('drilldown');
  };

  const resetToMandals = () => {
    setSelectedMandal(null);
    setViewMode('drilldown');
  };

  // Flattened lists for Segmented Filter View
  const allConstituencies = useMemo(() => {
    const list = [];
    hierarchy.forEach((d) => {
      d.constituencies.forEach((c) => {
        list.push({ ...c, districtName: d.name, districtPhone: d.phone });
      });
    });
    return list;
  }, [hierarchy]);

  const allMandals = useMemo(() => {
    const list = [];
    hierarchy.forEach((d) => {
      d.constituencies.forEach((c) => {
        c.mandals.forEach((m) => {
          list.push({
            ...m,
            districtName: d.name,
            constituencyName: c.name,
          });
        });
      });
    });
    return list;
  }, [hierarchy]);

  const allVillages = useMemo(() => {
    const list = [];
    hierarchy.forEach((d) => {
      d.constituencies.forEach((c) => {
        c.mandals.forEach((m) => {
          m.villages.forEach((v) => {
            list.push({
              ...v,
              districtName: d.name,
              constituencyName: c.name,
              mandalName: m.name,
            });
          });
        });
      });
    });
    return list;
  }, [hierarchy]);

  // Global search filtering across any leader
  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    const matches = [];

    // Search Districts
    hierarchy.forEach((d) => {
      if (
        d.name.toLowerCase().includes(q) ||
        d.incharge.toLowerCase().includes(q) ||
        d.phone.includes(q)
      ) {
        matches.push({
          type: 'District',
          item: d,
          title: `${d.name} District`,
          leaderName: d.incharge,
          role: 'District Incharge',
          phone: d.phone,
          photo: d.photo,
          badgeColor: colors.primary,
          subCountLabel: `${d.constituencies.length} Constituencies`,
          onPress: () => {
            setSelectedDistrict(d);
            setSelectedConstituency(null);
            setSelectedMandal(null);
            setViewMode('drilldown');
            setSearchQuery('');
          },
        });
      }

      // Search Constituencies
      d.constituencies.forEach((c) => {
        if (
          c.name.toLowerCase().includes(q) ||
          c.inchargeName.toLowerCase().includes(q) ||
          c.phone.includes(q)
        ) {
          matches.push({
            type: 'Constituency',
            item: c,
            title: `${c.name} (${d.name})`,
            leaderName: c.inchargeName,
            role: 'Constituency Incharge',
            phone: c.phone,
            photo: c.photo,
            badgeColor: colors.purple,
            subCountLabel: `${c.mandals.length} Mandals`,
            onPress: () => {
              setSelectedDistrict(d);
              setSelectedConstituency(c);
              setSelectedMandal(null);
              setViewMode('drilldown');
              setSearchQuery('');
            },
          });
        }

        // Search Mandals
        c.mandals.forEach((m) => {
          if (
            m.name.toLowerCase().includes(q) ||
            m.inchargeName.toLowerCase().includes(q) ||
            m.phone.includes(q)
          ) {
            matches.push({
              type: 'Mandal',
              item: m,
              title: `${m.name} (${c.name.replace(' Constituency', '')})`,
              leaderName: m.inchargeName,
              role: 'Mandal Incharge',
              phone: m.phone,
              photo: m.photo,
              badgeColor: colors.warning,
              subCountLabel: `${m.villages.length} Villages`,
              onPress: () => {
                setSelectedDistrict(d);
                setSelectedConstituency(c);
                setSelectedMandal(m);
                setViewMode('drilldown');
                setSearchQuery('');
              },
            });
          }

          // Search Villages
          m.villages.forEach((v) => {
            if (
              v.name.toLowerCase().includes(q) ||
              v.inchargeName.toLowerCase().includes(q) ||
              v.phone.includes(q)
            ) {
              matches.push({
                type: 'Village',
                item: v,
                title: `${v.name} (${m.name})`,
                leaderName: v.inchargeName,
                role: v.role || 'Village Leader',
                phone: v.phone,
                photo: v.photo,
                badgeColor: colors.success,
              });
            }
          });
        });
      });
    });

    return matches;
  }, [hierarchy, searchQuery]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.subHeader}>POLITICAL COMMAND STRUCTURE</Text>
          <Text style={styles.largeTitle}>Leadership Directory</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={17} color={colors.textMuted} />
          <TextInput
            placeholder="Search leader, district, constituency..."
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

        {/* Top Segmented Filter Controls */}
        <View style={styles.segmentedFilter}>
          {[
            { id: 'drilldown', label: 'Hierarchy' },
            { id: 'constituency', label: 'Constituency' },
            { id: 'mandal', label: 'Mandal' },
            { id: 'village', label: 'Village' },
          ].map((seg) => {
            const isActive = viewMode === seg.id && !searchQuery;
            return (
              <TouchableOpacity
                key={seg.id}
                onPress={() => {
                  setViewMode(seg.id);
                  setSearchQuery('');
                }}
                style={[styles.segBtn, isActive && styles.segBtnActive]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.segBtnText,
                    isActive && styles.segBtnTextActive,
                  ]}
                >
                  {seg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SEARCH RESULTS VIEW */}
        {filteredSearchResults !== null ? (
          <>
            <View style={styles.searchSummaryRow}>
              <Text style={styles.sectionHeader}>
                SEARCH MATCHES ({filteredSearchResults.length})
              </Text>
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearSearchText}>Clear Search</Text>
              </TouchableOpacity>
            </View>

            {filteredSearchResults.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="search" size={32} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>No Leaders Found</Text>
                <Text style={styles.emptySub}>
                  No leaders match "{searchQuery}". Check the spelling.
                </Text>
              </View>
            ) : (
              filteredSearchResults.map((res, idx) => (
                <LeaderCard
                  key={`search-${idx}`}
                  title={res.title}
                  leaderName={res.leaderName}
                  role={res.role}
                  phone={res.phone}
                  photo={res.photo}
                  badgeColor={res.badgeColor}
                  subCountLabel={res.subCountLabel}
                  onPressCard={res.onPress}
                />
              ))
            )}
          </>
        ) : viewMode === 'constituency' ? (
          /* FLAT CONSTITUENCY VIEW */
          <>
            <Text style={styles.sectionHeader}>
              ALL CONSTITUENCY INCHARGES ({allConstituencies.length})
            </Text>
            {allConstituencies.map((c) => (
              <LeaderCard
                key={`c-${c.id}`}
                title={`${c.name} • ${c.districtName}`}
                leaderName={c.inchargeName}
                role="Constituency Incharge"
                phone={c.phone}
                photo={c.photo}
                badgeColor={colors.purple}
                subCountLabel={`${c.mandals.length} Mandals`}
              />
            ))}
          </>
        ) : viewMode === 'mandal' ? (
          /* FLAT MANDAL VIEW */
          <>
            <Text style={styles.sectionHeader}>
              ALL MANDAL INCHARGES ({allMandals.length})
            </Text>
            {allMandals.map((m) => (
              <LeaderCard
                key={`m-${m.id}`}
                title={`${m.name} • ${m.constituencyName.replace(' Constituency', '')}`}
                leaderName={m.inchargeName}
                role="Mandal Incharge"
                phone={m.phone}
                photo={m.photo}
                badgeColor={colors.warning}
                subCountLabel={`${m.villages.length} Villages`}
              />
            ))}
          </>
        ) : viewMode === 'village' ? (
          /* FLAT VILLAGE VIEW */
          <>
            <Text style={styles.sectionHeader}>
              ALL VILLAGE & WARD LEADERS ({allVillages.length})
            </Text>
            {allVillages.map((v) => (
              <LeaderCard
                key={`v-${v.id}`}
                title={`${v.name} • ${v.mandalName}`}
                leaderName={v.inchargeName}
                role={v.role || 'Village Leader'}
                phone={v.phone}
                photo={v.photo}
                badgeColor={colors.success}
              />
            ))}
          </>
        ) : (
          /* 5-LEVEL INTERACTIVE DRILL-DOWN VIEW */
          <>
            {/* Breadcrumb Navigation Bar */}
            <View style={styles.breadcrumbBar}>
              <TouchableOpacity
                onPress={resetToDistricts}
                style={styles.crumbItem}
              >
                <Ionicons
                  name="business"
                  size={14}
                  color={!selectedDistrict ? colors.primary : colors.textMuted}
                />
                <Text
                  style={[
                    styles.breadcrumbText,
                    !selectedDistrict && styles.breadcrumbActive,
                  ]}
                >
                  Telangana State (33)
                </Text>
              </TouchableOpacity>

              {selectedDistrict && (
                <>
                  <Ionicons name="chevron-forward" size={13} color="#C7C7CC" />
                  <TouchableOpacity
                    onPress={resetToConstituencies}
                    style={styles.crumbItem}
                  >
                    <Text
                      style={[
                        styles.breadcrumbText,
                        !selectedConstituency && styles.breadcrumbActive,
                      ]}
                      numberOfLines={1}
                    >
                      {selectedDistrict.name}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {selectedConstituency && (
                <>
                  <Ionicons name="chevron-forward" size={13} color="#C7C7CC" />
                  <TouchableOpacity
                    onPress={resetToMandals}
                    style={styles.crumbItem}
                  >
                    <Text
                      style={[
                        styles.breadcrumbText,
                        !selectedMandal && styles.breadcrumbActive,
                      ]}
                      numberOfLines={1}
                    >
                      {selectedConstituency.name.replace(' Constituency', '')}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {selectedMandal && (
                <>
                  <Ionicons name="chevron-forward" size={13} color="#C7C7CC" />
                  <Text
                    style={[styles.breadcrumbText, styles.breadcrumbActive]}
                    numberOfLines={1}
                  >
                    {selectedMandal.name}
                  </Text>
                </>
              )}
            </View>

            {/* LEVEL 1: STATE INCHARGES + ALL 33 DISTRICTS */}
            {!selectedDistrict && (
              <>
                <Text style={styles.sectionHeader}>
                  STATE LEADERSHIP (TELANGANA STATE HEADQUARTERS)
                </Text>
                {STATE_INCHARGES.map((st) => (
                  <LeaderCard
                    key={st.id}
                    title={st.state}
                    leaderName={st.name}
                    role={st.role}
                    phone={st.phone}
                    photo={st.photo}
                    subCountLabel="33 Districts • 119 Constituencies"
                    badgeColor="#AF52DE"
                  />
                ))}

                <Text style={styles.sectionHeader}>
                  ALL 33 DISTRICT INCHARGES ({hierarchy.length} DISTRICTS)
                </Text>
                {hierarchy.map((dist) => (
                  <LeaderCard
                    key={dist.id}
                    title={`${dist.name} District`}
                    leaderName={dist.incharge}
                    role="District Incharge"
                    phone={dist.phone}
                    photo={dist.photo}
                    subCountLabel={`${dist.constituencies.length} Constituencies`}
                    badgeColor={colors.primary}
                    onPressCard={() => setSelectedDistrict(dist)}
                  />
                ))}
              </>
            )}

            {/* LEVEL 2: CONSTITUENCIES UNDER SELECTED DISTRICT */}
            {selectedDistrict && !selectedConstituency && (
              <>
                <Text style={styles.sectionHeader}>DISTRICT LEADER IN-CHARGE</Text>
                <LeaderCard
                  title={`${selectedDistrict.name} District`}
                  leaderName={selectedDistrict.incharge}
                  role="District Incharge"
                  phone={selectedDistrict.phone}
                  photo={selectedDistrict.photo}
                  badgeColor={colors.primary}
                  isHeaderBanner={true}
                />

                <Text style={styles.sectionHeader}>
                  CONSTITUENCIES IN {selectedDistrict.name.toUpperCase()} ({selectedDistrict.constituencies.length})
                </Text>
                {selectedDistrict.constituencies.map((constit) => (
                  <LeaderCard
                    key={constit.id}
                    title={constit.name}
                    leaderName={constit.inchargeName}
                    role="Constituency Incharge"
                    phone={constit.phone}
                    photo={constit.photo}
                    subCountLabel={`${constit.mandals.length} Mandals`}
                    badgeColor={colors.purple}
                    onPressCard={() => setSelectedConstituency(constit)}
                  />
                ))}
              </>
            )}

            {/* LEVEL 3: MANDALS UNDER SELECTED CONSTITUENCY */}
            {selectedConstituency && !selectedMandal && (
              <>
                <Text style={styles.sectionHeader}>CONSTITUENCY LEADER</Text>
                <LeaderCard
                  title={selectedConstituency.name}
                  leaderName={selectedConstituency.inchargeName}
                  role="Constituency Incharge"
                  phone={selectedConstituency.phone}
                  photo={selectedConstituency.photo}
                  badgeColor={colors.purple}
                  isHeaderBanner={true}
                />

                <Text style={styles.sectionHeader}>
                  MANDALS IN {selectedConstituency.name.replace(' Constituency', '').toUpperCase()} ({selectedConstituency.mandals.length})
                </Text>
                {selectedConstituency.mandals.map((mandal) => (
                  <LeaderCard
                    key={mandal.id}
                    title={mandal.name}
                    leaderName={mandal.inchargeName}
                    role="Mandal Incharge"
                    phone={mandal.phone}
                    photo={mandal.photo}
                    subCountLabel={`${mandal.villages.length} Villages`}
                    badgeColor={colors.warning}
                    onPressCard={() => setSelectedMandal(mandal)}
                  />
                ))}
              </>
            )}

            {/* LEVEL 4: VILLAGES UNDER SELECTED MANDAL */}
            {selectedMandal && (
              <>
                <Text style={styles.sectionHeader}>MANDAL INCHARGE</Text>
                <LeaderCard
                  title={selectedMandal.name}
                  leaderName={selectedMandal.inchargeName}
                  role="Mandal Incharge"
                  phone={selectedMandal.phone}
                  photo={selectedMandal.photo}
                  badgeColor={colors.warning}
                  isHeaderBanner={true}
                />

                <Text style={styles.sectionHeader}>
                  VILLAGES / COMMITTEES IN {selectedMandal.name.toUpperCase()} ({selectedMandal.villages.length})
                </Text>
                {selectedMandal.villages.map((village) => (
                  <LeaderCard
                    key={village.id}
                    title={village.name}
                    leaderName={village.inchargeName}
                    role={village.role || 'Village Leader'}
                    phone={village.phone}
                    photo={village.photo}
                    badgeColor={colors.success}
                  />
                ))}
              </>
            )}
          </>
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
  segmentedFilter: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
  },
  segBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 8,
  },
  segBtnActive: {
    backgroundColor: colors.card,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  segBtnTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  breadcrumbBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  crumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  breadcrumbText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  breadcrumbActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 10,
    marginTop: 6,
    letterSpacing: 0.6,
  },
  searchSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clearSearchText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  emptyBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
});
