import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/iosTheme';

export default function AddEnrollmentModal({ visible, onClose, onSubmit }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Hyderabad');
  const [constituency, setConstituency] = useState('Jubilee Hills');
  const [mandal, setMandal] = useState('Khairatabad');
  const [village, setVillage] = useState('Banjara Hills');
  const [isBulk, setIsBulk] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const districtsList = [
    { name: 'Hyderabad', defaultConstit: 'Jubilee Hills' },
    { name: 'Rangareddy', defaultConstit: 'Serilingampally' },
    { name: 'Medchal-Malkajgiri', defaultConstit: 'Uppal' },
    { name: 'Karimnagar', defaultConstit: 'Huzurabad' },
  ];

  const handleDistrictChange = (dist) => {
    setDistrict(dist.name);
    setConstituency(dist.defaultConstit);
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required', 'Please enter applicant full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      Alert.alert('Required', 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        full_name: fullName.trim(),
        phone: phone.trim().startsWith('+91') ? phone.trim() : `+91 ${phone.trim()}`,
        district,
        constituency,
        mandal,
        village,
        is_bulk: isBulk,
        status: 'pending',
        operator: 'Employee Mobile App',
        notes,
      });

      // Reset
      setFullName('');
      setPhone('');
      setNotes('');
      setIsBulk(false);
      onClose();
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not save enrollment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetSub}>MANUAL ENTRY PORTAL</Text>
              <Text style={styles.sheetTitle}>New MLC Enrollment</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Full Name */}
            <Text style={styles.label}>Applicant Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ramesh Kumar"
              placeholderTextColor={colors.textMuted}
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Phone */}
            <Text style={styles.label}>WhatsApp / Mobile Phone *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 9848011223"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            {/* District Selector */}
            <Text style={styles.label}>District *</Text>
            <View style={styles.pillRow}>
              {districtsList.map((d) => (
                <TouchableOpacity
                  key={d.name}
                  onPress={() => handleDistrictChange(d)}
                  style={[
                    styles.choicePill,
                    district === d.name && styles.choicePillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.choicePillText,
                      district === d.name && styles.choicePillTextActive,
                    ]}
                  >
                    {d.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Constituency */}
            <Text style={styles.label}>Constituency *</Text>
            <TextInput
              style={styles.input}
              placeholder="Constituency name"
              placeholderTextColor={colors.textMuted}
              value={constituency}
              onChangeText={setConstituency}
            />

            {/* Mandal & Village Row */}
            <View style={styles.dualRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.label}>Mandal / Division</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mandal name"
                  placeholderTextColor={colors.textMuted}
                  value={mandal}
                  onChangeText={setMandal}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Village / Ward</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Village name"
                  placeholderTextColor={colors.textMuted}
                  value={village}
                  onChangeText={setVillage}
                />
              </View>
            </View>

            {/* Bulk Toggle */}
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchLabel}>Bulk Entry</Text>
                <Text style={styles.switchSub}>
                  Flag this record as part of a group or batch submission
                </Text>
              </View>
              <Switch
                value={isBulk}
                onValueChange={setIsBulk}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            {/* Notes */}
            <Text style={styles.label}>Notes / Reference</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Optional notes, college or office name, verified documents..."
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Bottom Action */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSave}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.submitBtnText}>Save to Supabase Database</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sheetSub: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formScroll: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 70,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  choicePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  choicePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  choicePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  choicePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dualRow: {
    flexDirection: 'row',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  switchSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
