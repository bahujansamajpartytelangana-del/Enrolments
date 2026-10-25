import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Linking,
  RefreshControl,
  Platform,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

// ============================================================================
// 1. SUPABASE CONFIGURATION (LIVE INTEGRATED DATABASE)
// ============================================================================
const SUPABASE_URL = 'https://apibdsfzrdfszamphvfn.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWJkc2Z6cmRmc3phbXBodmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NjcxMDUsImV4cCI6MjEwODQ0MzEwNX0.CYt3AV7Waup5_LIGt6Mz3CulxGFgOr7TpFOa5rddALs';

const supabase =
  SUPABASE_URL.startsWith('http') && !SUPABASE_URL.includes('YOUR_PROJECT_ID')
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true },
        realtime: { params: { eventsPerSecond: 10 } },
      })
    : null;

// ============================================================================
// 2. PRESET AVATARS FOR PROFILE IMAGE PICKER
// ============================================================================
const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80',
];

// 3 Major Telangana Graduate MLC Election Constituencies
const GRADUATE_CONSTITUENCIES = [
  'Hyderabad-Rangareddy-Mahabubnagar Graduates',
  'Warangal-Khammam-Nalgonda Graduates',
  'Karimnagar-Nizamabad-Adilabad-Medak Graduates',
];

// ============================================================================
// 3. TELANGANA STATE INCHARGES + ALL 33 DISTRICTS & 119 CONSTITUENCIES
// ============================================================================
const STATE_INCHARGES = [
  {
    id: 'st-1',
    name: 'Ibrahim Sekhar',
    role: 'State Chief Coordinator & MLC Campaign Head',
    state: 'Telangana State Command',
    phone: '+919848000001',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80',
  },
  {
    id: 'st-2',
    name: 'Simon',
    role: 'State Digital & Operations Head',
    state: 'Telangana State Command',
    phone: '+919848000002',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
  },
];

const RAW_TELANGANA_DISTRICTS = [
  // NORTH TELANGANA ZONE (10 Districts)
  { id: 'd22', zone: 'North Telangana', code: 'ADB', name: 'Adilabad', incharge: 'Jogu Ramanna', phone: '+919848100122', strength: 'Weak', score: 49, botTotal: 1250, enrolled: 610, pending: 640, actionPlan: 'Appoint dedicated mandal operators in Boath and Adilabad rural.', constituencies: ['Adilabad', 'Boath'] },
  { id: 'd25', zone: 'North Telangana', code: 'KB', name: 'Kumuram Bheem Asifabad', incharge: 'A. Sakku', phone: '+919848100125', strength: 'Weak', score: 44, botTotal: 980, enrolled: 430, pending: 550, actionPlan: 'Set up offline assistance desks in Sirpur and Asifabad mandal headquarters.', constituencies: ['Asifabad', 'Sirpur'] },
  { id: 'd23', zone: 'North Telangana', code: 'NRM', name: 'Nirmal', incharge: 'A. Indrakaran', phone: '+919848100123', strength: 'Moderate', score: 60, botTotal: 1340, enrolled: 805, pending: 535, actionPlan: 'Improve document verification speed in Mudhole and Khanapur.', constituencies: ['Nirmal', 'Mudhole', 'Khanapur'] },
  { id: 'd24', zone: 'North Telangana', code: 'MCL', name: 'Mancherial', incharge: 'N. Diwakar Rao', phone: '+919848100124', strength: 'Moderate', score: 65, botTotal: 1560, enrolled: 1015, pending: 545, actionPlan: 'Coordinate with Bellampalli and Chennur town youth committees.', constituencies: ['Mancherial', 'Bellampalli', 'Chennur'] },
  { id: 'd17', zone: 'North Telangana', code: 'NZB', name: 'Nizamabad', incharge: 'A. Ganesh Gupta', phone: '+919848100117', strength: 'Moderate', score: 67, botTotal: 2340, enrolled: 1565, pending: 775, actionPlan: 'Increase WhatsApp bot awareness campaigns in Armoor and Bodhan.', constituencies: ['Nizamabad Urban', 'Nizamabad Rural', 'Armoor', 'Balkonda', 'Bodhan', 'Banswada'] },
  { id: 'd26', zone: 'North Telangana', code: 'JGT', name: 'Jagtial', incharge: 'M. Sanjay Kumar', phone: '+919848100126', strength: 'Moderate', score: 68, botTotal: 1680, enrolled: 1140, pending: 540, actionPlan: 'Boost Korutla and Dharmapuri mandal WhatsApp bot campaigns.', constituencies: ['Jagtial', 'Korutla', 'Dharmapuri'] },
  { id: 'd27', zone: 'North Telangana', code: 'PDP', name: 'Peddapalli', incharge: 'D. Manohar Reddy', phone: '+919848100127', strength: 'Moderate', score: 71, botTotal: 1720, enrolled: 1220, pending: 500, actionPlan: 'Engage Ramagundam industrial graduate employees.', constituencies: ['Peddapalli', 'Ramagundam', 'Manthani'] },
  { id: 'd18', zone: 'North Telangana', code: 'KMR', name: 'Kamareddy', incharge: 'M. Govardhan', phone: '+919848100118', strength: 'Weak', score: 52, botTotal: 1420, enrolled: 740, pending: 680, actionPlan: 'Need urgent field mobilization in Jukkal and Yellareddy.', constituencies: ['Kamareddy', 'Yellareddy', 'Jukkal'] },
  { id: 'd28', zone: 'North Telangana', code: 'SRC', name: 'Rajanna Sircilla', incharge: 'K. Ramesh Babu', phone: '+919848100128', strength: 'Strong', score: 76, botTotal: 1490, enrolled: 1130, pending: 360, actionPlan: 'Consistent performance in Sircilla and Vemulawada.', constituencies: ['Sircilla', 'Vemulawada'] },
  { id: 'd10', zone: 'North Telangana', code: 'KNR', name: 'Karimnagar', incharge: 'V. Prabhakar Rao', phone: '+919848100110', strength: 'Strong', score: 81, botTotal: 3100, enrolled: 2510, pending: 590, actionPlan: 'Strong urban response. Push rural mandal incharges in Choppadandi and Manakondur.', constituencies: ['Karimnagar', 'Choppadandi', 'Manakondur', 'Huzurabad'] },

  // CENTRAL & EAST TELANGANA ZONE (10 Districts)
  { id: 'd32', zone: 'Central & East Zone', code: 'BPL', name: 'Jayashankar Bhupalpally', incharge: 'G. Venkata Ramana', phone: '+919848100132', strength: 'Weak', score: 51, botTotal: 990, enrolled: 505, pending: 485, actionPlan: 'Assign special task force for Bhupalpally mandal committees.', constituencies: ['Bhupalpally'] },
  { id: 'd20', zone: 'Central & East Zone', code: 'MDK', name: 'Medak', incharge: 'M. Padma Devender', phone: '+919848100120', strength: 'Moderate', score: 63, botTotal: 1380, enrolled: 870, pending: 510, actionPlan: 'Conduct village-level enrollment drives in Narsapur and Medak.', constituencies: ['Medak', 'Narsapur'] },
  { id: 'd21', zone: 'Central & East Zone', code: 'SDP', name: 'Siddipet', incharge: 'T. Harish Kumar', phone: '+919848100121', strength: 'Strong', score: 80, botTotal: 2210, enrolled: 1770, pending: 440, actionPlan: 'High efficiency in Siddipet and Gajwel. Focus on Husnabad pending list.', constituencies: ['Siddipet', 'Gajwel', 'Dubbak', 'Husnabad'] },
  { id: 'd11', zone: 'Central & East Zone', code: 'HNK', name: 'Hanumakonda', incharge: 'R. Vinay Bhaskar', phone: '+919848100111', strength: 'Strong', score: 84, botTotal: 2950, enrolled: 2480, pending: 470, actionPlan: 'Leverage university and college networks in Warangal West and Parkal.', constituencies: ['Warangal West', 'Parkal', 'Wardhannapet'] },
  { id: 'd12', zone: 'Central & East Zone', code: 'WGL', name: 'Warangal', incharge: 'N. Narender', phone: '+919848100112', strength: 'Moderate', score: 70, botTotal: 2100, enrolled: 1470, pending: 630, actionPlan: 'Speed up online MLC portal entry for Narsampet and Warangal East.', constituencies: ['Warangal East', 'Narsampet'] },
  { id: 'd33', zone: 'Central & East Zone', code: 'MLG', name: 'Mulugu', incharge: 'D. Anasuya Seethakka', phone: '+919848100133', strength: 'Weak', score: 48, botTotal: 890, enrolled: 425, pending: 465, actionPlan: 'Deploy mobile enrollment vans across remote villages in Mulugu.', constituencies: ['Mulugu'] },
  { id: 'd31', zone: 'Central & East Zone', code: 'JGN', name: 'Jangaon', incharge: 'M. Yadagiri Reddy', phone: '+919848100131', strength: 'Moderate', score: 67, botTotal: 1450, enrolled: 970, pending: 480, actionPlan: 'Increase outreach in Ghanpur Station and Palakurthi.', constituencies: ['Jangaon', 'Ghanpur Station', 'Palakurthi'] },
  { id: 'd30', zone: 'Central & East Zone', code: 'MBD', name: 'Mahabubabad', incharge: 'B. Shankar Naik', phone: '+919848100130', strength: 'Weak', score: 53, botTotal: 1210, enrolled: 640, pending: 570, actionPlan: 'Strengthen Dornakal and Mahabubabad town coordination.', constituencies: ['Mahabubabad', 'Dornakal'] },
  { id: 'd29', zone: 'Central & East Zone', code: 'KGM', name: 'Bhadradri Kothagudem', incharge: 'V. Venkateswara Rao', phone: '+919848100129', strength: 'Moderate', score: 64, botTotal: 1850, enrolled: 1185, pending: 665, actionPlan: 'Clear pending queue in Kothagudem, Yellandu, and Bhadrachalam.', constituencies: ['Kothagudem', 'Yellandu', 'Bhadrachalam', 'Pinapaka', 'Aswaraopeta'] },
  { id: 'd13', zone: 'Central & East Zone', code: 'KMM', name: 'Khammam', incharge: 'T. Ajay Kumar', phone: '+919848100113', strength: 'Strong', score: 79, botTotal: 2800, enrolled: 2210, pending: 590, actionPlan: 'Continue strong momentum in Khammam urban and Madhira.', constituencies: ['Khammam', 'Palair', 'Madhira', 'Wyra', 'Sathupalli'] },

  // GREATER HYDERABAD & CORE URBAN ZONE (6 Districts)
  { id: 'd19', zone: 'Greater Hyderabad & Core Zone', code: 'SRD', name: 'Sangareddy', incharge: 'T. Jayaprakash', phone: '+919848100119', strength: 'Strong', score: 77, botTotal: 2490, enrolled: 1915, pending: 575, actionPlan: 'Target industrial and educational hubs in Patancheru and Sangareddy.', constituencies: ['Sangareddy', 'Patancheru', 'Zahirabad', 'Narayankhed', 'Andole'] },
  { id: 'd3', zone: 'Greater Hyderabad & Core Zone', code: 'MDL', name: 'Medchal-Malkajgiri', incharge: 'P. Srinivas Goud', phone: '+919848100103', strength: 'Strong', score: 82, botTotal: 3890, enrolled: 3190, pending: 700, actionPlan: 'Expand apartment-level WhatsApp QR code enrollment drives in Kukatpally, Uppal, and Malkajgiri.', constituencies: ['Medchal', 'Malkajgiri', 'Quthbullapur', 'Kukatpally', 'Uppal'] },
  { id: 'd1', zone: 'Greater Hyderabad & Core Zone', code: 'HYD', name: 'Hyderabad', incharge: 'M. Vikramarka Rao', phone: '+919848100101', strength: 'Strong', score: 89, botTotal: 4250, enrolled: 3780, pending: 470, actionPlan: 'Maintain high-speed online verification in Jubilee Hills and Khairatabad. Deploy 2 extra operators for weekend bulk WhatsApp inflow.', constituencies: ['Musheerabad', 'Malakpet', 'Amberpet', 'Khairatabad', 'Jubilee Hills', 'Sanathnagar', 'Nampally', 'Karwan', 'Goshamahal', 'Charminar', 'Chandrayangutta', 'Yakutpura', 'Bahadurpura', 'Secunderabad', 'Secunderabad Cantt'] },
  { id: 'd2', zone: 'Greater Hyderabad & Core Zone', code: 'RR', name: 'Rangareddy', incharge: 'K. Rajasekhar Reddy', phone: '+919848100102', strength: 'Strong', score: 85, botTotal: 5120, enrolled: 4350, pending: 770, actionPlan: 'Focus on IT corridor graduate drives in Serilingampally and Rajendranagar. Clear 770 pending applications within 48 hours.', constituencies: ['Ibrahimpatnam', 'Lal Bahadur Nagar', 'Maheshwaram', 'Rajendranagar', 'Serilingampally', 'Chevella', 'Shadnagar', 'Kalwakurthy'] },
  { id: 'd9', zone: 'Greater Hyderabad & Core Zone', code: 'VKB', name: 'Vikarabad', incharge: 'A. Anand Prasad', phone: '+919848100109', strength: 'Moderate', score: 66, botTotal: 1750, enrolled: 1155, pending: 595, actionPlan: 'Mobilize youth wing volunteers across Kodangal and Tandur mandals.', constituencies: ['Vikarabad', 'Tandur', 'Pargi', 'Kodangal'] },
  { id: 'd16', zone: 'Greater Hyderabad & Core Zone', code: 'YBG', name: 'Yadadri Bhuvanagiri', incharge: 'P. Shekar Reddy', phone: '+919848100116', strength: 'Strong', score: 76, botTotal: 1620, enrolled: 1230, pending: 390, actionPlan: 'Maintain steady enrollment verification in Bhongir and Alair.', constituencies: ['Bhongir', 'Alair'] },

  // SOUTH TELANGANA ZONE (7 Districts)
  { id: 'd4', zone: 'South Telangana Zone', code: 'MBN', name: 'Mahabubnagar', incharge: 'G. Venkat Ramulu', phone: '+919848100104', strength: 'Moderate', score: 68, botTotal: 2450, enrolled: 1665, pending: 785, actionPlan: 'Conduct Mandal Incharge review meeting in Jadcherla and Devarkadra. Assign dedicated calling team to verify pending graduate documents.', constituencies: ['Mahabubnagar', 'Jadcherla', 'Devarkadra'] },
  { id: 'd8', zone: 'South Telangana Zone', code: 'NRP', name: 'Narayanpet', incharge: 'C. Chittaranjan Das', phone: '+919848100108', strength: 'Moderate', score: 61, botTotal: 1320, enrolled: 805, pending: 515, actionPlan: 'Organize special enrollment camps in Makthal and Narayanpet town.', constituencies: ['Narayanpet', 'Makthal'] },
  { id: 'd6', zone: 'South Telangana Zone', code: 'WNP', name: 'Wanaparthy', incharge: 'B. Niranjan', phone: '+919848100106', strength: 'Strong', score: 78, botTotal: 1540, enrolled: 1200, pending: 340, actionPlan: 'Good conversion rate. Complete remaining 340 pending entries and initiate degree college alumni outreach.', constituencies: ['Wanaparthy'] },
  { id: 'd7', zone: 'South Telangana Zone', code: 'GDL', name: 'Jogulamba Gadwal', incharge: 'S. Sampath Kumar', phone: '+919848100107', strength: 'Weak', score: 46, botTotal: 1180, enrolled: 540, pending: 640, actionPlan: 'Urgent intervention required in Alampur and Gadwal. Replace inactive mandal coordinators and clear 640 backlog entries.', constituencies: ['Gadwal', 'Alampur'] },
  { id: 'd5', zone: 'South Telangana Zone', code: 'NGK', name: 'Nagarkurnool', incharge: 'D. Sudhakar', phone: '+919848100105', strength: 'Moderate', score: 64, botTotal: 1920, enrolled: 1230, pending: 690, actionPlan: 'Strengthen village-level coordinators in Achampet and Kollapur. Increase daily WhatsApp bot referrals.', constituencies: ['Nagarkurnool', 'Achampet', 'Kollapur'] },
  { id: 'd14', zone: 'South Telangana Zone', code: 'NLG', name: 'Nalgonda', incharge: 'K. Bhupal Reddy', phone: '+919848100114', strength: 'Moderate', score: 72, botTotal: 2650, enrolled: 1910, pending: 740, actionPlan: 'Deploy 3 additional online operators for Miryalaguda and Devarakonda pending queue.', constituencies: ['Nalgonda', 'Nakrekal', 'Munugode', 'Devarakonda', 'Nagarjuna Sagar', 'Miryalaguda'] },
  { id: 'd15', zone: 'South Telangana Zone', code: 'SRP', name: 'Suryapet', incharge: 'G. Jagadish', phone: '+919848100115', strength: 'Moderate', score: 69, botTotal: 1980, enrolled: 1365, pending: 615, actionPlan: 'Follow up with Huzurnagar and Kodad constituency coordinators.', constituencies: ['Suryapet', 'Tungaturthi', 'Kodad', 'Huzurnagar'] },
];

const INITIAL_DISTRICTS_DATA = RAW_TELANGANA_DISTRICTS.map((dist, dIdx) => ({
  ...dist,
  photo: `https://i.pravatar.cc/200?img=${(dIdx % 50) + 10}`,
  districtMembers: [
    { id: `${dist.id}-mem-1`, name: `Rakesh Reddy (${dist.code})`, qualification: 'B.Tech Graduate', constituency: dist.constituencies[0], status: 'MLC Enrolled', phone: `+9198482${String(dIdx + 10).padStart(2, '0')}111`, batch: 'WhatsApp Bot' },
    { id: `${dist.id}-mem-2`, name: `Sneha Latha (${dist.code})`, qualification: 'M.B.A Graduate', constituency: dist.constituencies[0], status: 'MLC Enrolled', phone: `+9198482${String(dIdx + 10).padStart(2, '0')}222`, batch: 'Online Team' },
    { id: `${dist.id}-mem-3`, name: `Karthikeya Goud (${dist.code})`, qualification: 'B.Sc Computers', constituency: dist.constituencies[dist.constituencies.length - 1], status: 'Pending', phone: `+9198482${String(dIdx + 10).padStart(2, '0')}333`, batch: 'Bulk WhatsApp' },
    { id: `${dist.id}-mem-4`, name: `Divya Bharathi (${dist.code})`, qualification: 'M.Com Graduate', constituency: dist.constituencies[0], status: 'MLC Enrolled', phone: `+9198482${String(dIdx + 10).padStart(2, '0')}444`, batch: 'WhatsApp Bot' },
  ],
  districtUsers: [
    { id: `${dist.id}-usr-1`, name: `Kiran Kumar (${dist.code} Lead)`, role: 'Online MLC Operator', email: `kiran.${dist.code.toLowerCase()}@bsptgs.in`, processedCount: 412, phone: `+9190001${String(dIdx + 10).padStart(2, '0')}001`, status: 'Active Online' },
    { id: `${dist.id}-usr-2`, name: `Priyanka Rao (${dist.code} Desk)`, role: 'Verification Executive', email: `priyanka.${dist.code.toLowerCase()}@bsptgs.in`, processedCount: 318, phone: `+9190001${String(dIdx + 10).padStart(2, '0')}002`, status: 'Active Online' },
    { id: `${dist.id}-usr-3`, name: `Suresh Yadav (${dist.code} Field)`, role: 'Field Volunteer User', email: `suresh.${dist.code.toLowerCase()}@bsptgs.in`, processedCount: 195, phone: `+9190001${String(dIdx + 10).padStart(2, '0')}003`, status: 'Field Sync' },
  ],
  constituencies: dist.constituencies.map((cName, cIdx) => ({
    id: `${dist.id}-c${cIdx + 1}`,
    name: `${cName} Constituency`,
    inchargeName: `${cName} Coordinator #${cIdx + 1}`,
    role: 'Constituency Incharge',
    phone: `+919849${String(dIdx + 1).padStart(2, '0')}${String(cIdx + 11).padStart(4, '0')}`,
    photo: `https://i.pravatar.cc/200?img=${((dIdx + cIdx) % 50) + 12}`,
    strength: cIdx % 3 === 0 ? 'Strong' : cIdx % 3 === 1 ? 'Moderate' : 'Weak',
    mandals: [
      {
        id: `${dist.id}-c${cIdx + 1}-m1`,
        name: `${cName} Urban Mandal`,
        inchargeName: `S. Naveen Kumar (${cName} Urban)`,
        role: 'Mandal Incharge',
        phone: `+919701${String(dIdx + 1).padStart(2, '0')}1101`,
        photo: `https://i.pravatar.cc/200?img=${((dIdx + cIdx + 3) % 50) + 15}`,
        villages: [
          {
            id: `${dist.id}-c${cIdx + 1}-m1-v1`,
            name: `${cName} Ward / Village 1`,
            inchargeName: 'R. Kranthi Kiran',
            role: 'Village / Ward Leader',
            phone: `+919666${String(dIdx + 1).padStart(2, '0')}2201`,
            photo: `https://i.pravatar.cc/200?img=${((dIdx + 5) % 50) + 18}`,
          },
          {
            id: `${dist.id}-c${cIdx + 1}-m1-v2`,
            name: `${cName} Ward / Village 2`,
            inchargeName: 'M. Sandeep Reddy',
            role: 'Village / Ward Leader',
            phone: `+919666${String(dIdx + 1).padStart(2, '0')}2202`,
            photo: `https://i.pravatar.cc/200?img=${((dIdx + 8) % 50) + 20}`,
          },
        ],
      },
      {
        id: `${dist.id}-c${cIdx + 1}-m2`,
        name: `${cName} Rural Mandal`,
        inchargeName: `B. Mallikarjun (${cName} Rural)`,
        role: 'Mandal Incharge',
        phone: `+919701${String(dIdx + 1).padStart(2, '0')}1102`,
        photo: `https://i.pravatar.cc/200?img=${((dIdx + cIdx + 6) % 50) + 22}`,
        villages: [
          {
            id: `${dist.id}-c${cIdx + 1}-m2-v1`,
            name: 'Rampur Grama Committee',
            inchargeName: 'K. Ashok Yadav',
            role: 'Village Leader',
            phone: `+919550${String(dIdx + 1).padStart(2, '0')}3301`,
            photo: `https://i.pravatar.cc/200?img=${((dIdx + 11) % 50) + 25}`,
          },
        ],
      },
    ],
  })),
}));

const INITIAL_BOT_ENROLLMENTS = [
  { id: '101', full_name: 'Anil Kumar Reddy', phone: '+91 98481 23451', district: 'Rangareddy', constituency: 'Serilingampally', status: 'enrolled', is_bulk: false, created_at: 'Today, 10:42 AM', operator: 'Emp #04 (Kiran)' },
  { id: '102', full_name: 'Swathi Priya Rao', phone: '+91 99890 11223', district: 'Hyderabad', constituency: 'Jubilee Hills', status: 'pending', is_bulk: true, created_at: 'Today, 10:38 AM', operator: 'Pending Queue' },
  { id: '103', full_name: 'Mahesh Babu Goud', phone: '+91 97012 44556', district: 'Mahabubnagar', constituency: 'Jadcherla', status: 'pending', is_bulk: true, created_at: 'Today, 10:15 AM', operator: 'Pending Queue' },
  { id: '104', full_name: 'Lakshmi Narayana', phone: '+91 94401 88990', district: 'Medchal-Malkajgiri', constituency: 'Uppal', status: 'enrolled', is_bulk: false, created_at: 'Today, 09:50 AM', operator: 'Emp #02 (Divya)' },
  { id: '105', full_name: 'Sunitha Rao', phone: '+91 98485 77889', district: 'Rangareddy', constituency: 'Chevella', status: 'enrolled', is_bulk: true, created_at: 'Today, 09:12 AM', operator: 'Emp #01 (Suresh)' },
  { id: '106', full_name: 'Venugopal Reddy', phone: '+91 97018 99001', district: 'Karimnagar', constituency: 'Huzurabad', status: 'pending', is_bulk: false, created_at: 'Today, 08:35 AM', operator: 'Pending Queue' },
  { id: '107', full_name: 'Ramesh Varma', phone: '+91 98480 33441', district: 'Karimnagar', constituency: 'Huzurabad', status: 'enrolled', is_bulk: false, created_at: 'Today, 08:10 AM', operator: 'Emp #03 (Raj)' },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <MainAppContent />
    </SafeAreaProvider>
  );
}

function MainAppContent() {
  const insets = useSafeAreaInsets();

  // ============================================================================
  // AUTHENTICATION & USER PROFILE STATE
  // ============================================================================
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [loginRoleTab, setLoginRoleTab] = useState('Admin'); // 'Admin' | 'Employee' | 'Incharge'
  const [emailInput, setEmailInput] = useState('admin@bsptgs.in');
  const [passwordInput, setPasswordInput] = useState('Simon@bsptgs');
  const [fullNameInput, setFullNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [masterAdminPassword, setMasterAdminPassword] = useState('Simon@bsptgs');

  // Profile & Settings Editable State
  const [profileName, setProfileName] = useState('Simon');
  const [profilePhone, setProfilePhone] = useState('+91 98480 00002');
  const [profileDistrict, setProfileDistrict] = useState('Hyderabad');
  const [profileAvatar, setProfileAvatar] = useState(AVATAR_PRESETS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [currentPasswordField, setCurrentPasswordField] = useState('');
  const [newPasswordField, setNewPasswordField] = useState('');
  const [confirmPasswordField, setConfirmPasswordField] = useState('');
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [compactListMode, setCompactListMode] = useState(false);

  // Main Navigation (5 Tabs: 'home' | 'incharges' | 'hierarchy' | 'districts' | 'profile')
  const [activeTab, setActiveTab] = useState('home');
  const [refreshing, setRefreshing] = useState(false);
  const [isOnlineSync, setIsOnlineSync] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [toastMessage, setToastMessage] = useState(null);

  // Global Instant Search (Feature 1)
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Graduate MLC Enrollment Form Modal State (Feature 2)
  const [isEnrollmentModalVisible, setIsEnrollmentModalVisible] = useState(false);
  const [formGradConstituency, setFormGradConstituency] = useState(GRADUATE_CONSTITUENCIES[0]);
  const [formDistrict, setFormDistrict] = useState('Hyderabad');
  const [formFirstName, setFormFirstName] = useState('');
  const [formSurname, setFormSurname] = useState('');
  const [formRelativeName, setFormRelativeName] = useState('');
  const [formRelativeSurname, setFormRelativeSurname] = useState('');
  const [formGender, setFormGender] = useState('Male');
  const [formDob, setFormDob] = useState('15/08/1995');
  const [formQualification, setFormQualification] = useState('B.Tech Graduate');
  const [formOccupation, setFormOccupation] = useState('Software Engineer');
  const [formAddress, setFormAddress] = useState('Flat 202, Madhapur, Hyderabad - 500081');
  const [formEpicNumber, setFormEpicNumber] = useState('TS/08/102/458120');
  const [formAadhaar, setFormAadhaar] = useState('9876 5432 1098');
  const [formUniversity, setFormUniversity] = useState('JNTU Hyderabad');
  const [formUniversityTelugu, setFormUniversityTelugu] = useState('జెఎన్టియు హైదరాబాద్');
  const [formCompletionYear, setFormCompletionYear] = useState('2018');
  const [formCertDetails, setFormCertDetails] = useState('Roll #14081A0542 • First Class With Distinction');
  const [formMobile, setFormMobile] = useState('+91 98481 99999');
  const [formEmail, setFormEmail] = useState('graduate@bsptgs.in');
  const [formPhotoUri, setFormPhotoUri] = useState(null);
  const [formPhotoName, setFormPhotoName] = useState(null);
  const [formCertUri, setFormCertUri] = useState(null);
  const [formCertName, setFormCertName] = useState(null);
  const [formCertSize, setFormCertSize] = useState(null);
  const [formCertType, setFormCertType] = useState('pdf');
  const [isPhotoPickerLoading, setIsPhotoPickerLoading] = useState(false);
  const [isCertPickerLoading, setIsCertPickerLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Hierarchy Data in State
  const [districtsData, setDistrictsData] = useState(INITIAL_DISTRICTS_DATA);
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [editActionPlanText, setEditActionPlanText] = useState('');
  const [editInchargeName, setEditInchargeName] = useState('');
  const [editInchargePhone, setEditInchargePhone] = useState('');
  const [isDistrictPickerOpen, setIsDistrictPickerOpen] = useState(false);

  // Enrollments State & Filters
  const [enrollmentsList, setEnrollmentsList] = useState(INITIAL_BOT_ENROLLMENTS);
  const [enrollmentFilter, setEnrollmentFilter] = useState('all');

  // Incharges Tab Drill-down State
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [selectedMandal, setSelectedMandal] = useState(null);
  const [inchargeSearchQuery, setInchargeSearchQuery] = useState('');

  // Hierarchy Tab State ('map' | 'tree')
  const [hierarchyViewMode, setHierarchyViewMode] = useState('map');
  const [expandedTreeDistrictId, setExpandedTreeDistrictId] = useState(null);

  // District Profiles Tab
  const [strengthFilter, setStrengthFilter] = useState('ALL');
  const [focusedDistrictProfile, setFocusedDistrictProfile] = useState(null);
  const [districtDetailSubTab, setDistrictDetailSubTab] = useState('incharges');
  const [districtMemberSearch, setDistrictMemberSearch] = useState('');

  // Helper to format timestamps
  const formatTimestamp = (raw) => {
    if (!raw) return 'Recently';
    if (typeof raw === 'string' && raw.includes('Today')) return raw;
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return String(raw);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return String(raw);
    }
  };

  // Toast notification auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // ============================================================================
  // SUPABASE REAL-TIME DATA SYNC & FETCH
  // ============================================================================
  const fetchSupabaseEnrollments = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map((item) => ({
          id: String(item.id),
          full_name: item.full_name,
          phone: item.phone,
          district: item.district,
          constituency: item.constituency || 'Headquarters',
          status: item.status || 'pending',
          is_bulk: !!item.is_bulk,
          created_at: formatTimestamp(item.created_at),
          operator: item.operator || 'Online Queue',
        }));
        setEnrollmentsList(mapped);
        setIsOnlineSync(true);
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.log('Supabase fetch notice:', err);
    }
  }, []);

  useEffect(() => {
    fetchSupabaseEnrollments();
  }, [fetchSupabaseEnrollments]);

  // Realtime channel subscription
  useEffect(() => {
    if (!supabase || !autoSyncEnabled) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enrollments' },
        (payload) => {
          setIsOnlineSync(true);
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

          if (payload.eventType === 'INSERT') {
            const newItem = {
              id: String(payload.new.id),
              full_name: payload.new.full_name,
              phone: payload.new.phone,
              district: payload.new.district,
              constituency: payload.new.constituency || 'General',
              status: payload.new.status || 'pending',
              is_bulk: !!payload.new.is_bulk,
              created_at: 'Just now',
              operator: payload.new.operator || 'WhatsApp Bot',
            };
            setEnrollmentsList((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
            if (pushNotificationsEnabled) {
              setToastMessage(`New Graduate Inflow: ${newItem.full_name} (${newItem.district})`);
            }
          } else if (payload.eventType === 'UPDATE') {
            setEnrollmentsList((prev) =>
              prev.map((item) =>
                item.id === String(payload.new.id)
                  ? {
                      ...item,
                      full_name: payload.new.full_name,
                      status: payload.new.status,
                      operator: payload.new.operator || item.operator,
                    }
                  : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setEnrollmentsList((prev) => prev.filter((i) => i.id !== String(payload.old.id)));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsOnlineSync(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [autoSyncEnabled, pushNotificationsEnabled]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSupabaseEnrollments();
    setRefreshing(false);
  }, [fetchSupabaseEnrollments]);

  // ============================================================================
  // WIKIPEDIA-STYLE GLOBAL INSTANT SEARCH (FEATURE 1)
  // ============================================================================
  const globalSearchResults = useMemo(() => {
    const q = globalSearchQuery.trim().toLowerCase();
    if (!q) return [];
    const results = [];

    // 1. Search State Leaders
    STATE_INCHARGES.forEach((st) => {
      if (st.name.toLowerCase().includes(q) || st.role.toLowerCase().includes(q) || st.phone.includes(q)) {
        results.push({
          type: 'State Leader',
          title: st.name,
          subtitle: `${st.role} • ${st.phone}`,
          phone: st.phone,
          action: () => makeCall(st.phone),
        });
      }
    });

    // 2. Search Districts
    districtsData.forEach((d) => {
      if (d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.incharge.toLowerCase().includes(q)) {
        results.push({
          type: 'District',
          title: `${d.name} District (${d.code})`,
          subtitle: `Incharge: ${d.incharge} • ${d.strength} (${d.score}%)`,
          phone: d.phone,
          action: () => {
            setGlobalSearchQuery('');
            setFocusedDistrictProfile(d);
            setActiveTab('districts');
          },
        });
      }

      // 3. Search Assembly Constituencies & Mandals & Village Leaders
      d.constituencies.forEach((c) => {
        if (c.name.toLowerCase().includes(q) || c.inchargeName.toLowerCase().includes(q) || c.phone.includes(q)) {
          results.push({
            type: 'Constituency',
            title: c.name,
            subtitle: `${d.name} Dist • Incharge: ${c.inchargeName}`,
            phone: c.phone,
            action: () => {
              setGlobalSearchQuery('');
              setSelectedDistrict(d);
              setSelectedConstituency(c);
              setActiveTab('incharges');
            },
          });
        }

        c.mandals.forEach((m) => {
          if (m.name.toLowerCase().includes(q) || m.inchargeName.toLowerCase().includes(q) || m.phone.includes(q)) {
            results.push({
              type: 'Mandal',
              title: m.name,
              subtitle: `${c.name} • Leader: ${m.inchargeName}`,
              phone: m.phone,
              action: () => {
                setGlobalSearchQuery('');
                setSelectedDistrict(d);
                setSelectedConstituency(c);
                setSelectedMandal(m);
                setActiveTab('incharges');
              },
            });
          }

          m.villages.forEach((v) => {
            if (v.name.toLowerCase().includes(q) || v.inchargeName.toLowerCase().includes(q) || v.phone.includes(q)) {
              results.push({
                type: 'Village Leader',
                title: v.name,
                subtitle: `${v.inchargeName} • ${v.phone}`,
                phone: v.phone,
                action: () => makeCall(v.phone),
              });
            }
          });
        });
      });

      // 4. Search District Members
      d.districtMembers.forEach((mem) => {
        if (mem.name.toLowerCase().includes(q) || mem.phone.includes(q) || mem.constituency.toLowerCase().includes(q)) {
          results.push({
            type: 'Enrolled Member',
            title: mem.name,
            subtitle: `${mem.qualification} • ${d.name} (${mem.status})`,
            phone: mem.phone,
            action: () => makeCall(mem.phone),
          });
        }
      });

      // 5. Search App Operators
      d.districtUsers.forEach((usr) => {
        if (usr.name.toLowerCase().includes(q) || usr.email.toLowerCase().includes(q) || usr.role.toLowerCase().includes(q)) {
          results.push({
            type: 'Operator',
            title: usr.name,
            subtitle: `${usr.role} • ${usr.email}`,
            phone: usr.phone,
            action: () => makeCall(usr.phone),
          });
        }
      });
    });

    // 6. Search Real-Time Enrollments Stream
    enrollmentsList.forEach((e) => {
      if (e.full_name.toLowerCase().includes(q) || e.phone.includes(q) || e.district?.toLowerCase().includes(q)) {
        results.push({
          type: 'Live Application',
          title: e.full_name,
          subtitle: `${e.district} • ${e.constituency} • ${e.status.toUpperCase()}`,
          phone: e.phone,
          action: () => makeCall(e.phone),
        });
      }
    });

    return results.slice(0, 15);
  }, [globalSearchQuery, districtsData, enrollmentsList]);

  // ============================================================================
  // COMPUTED REAL-TIME METRICS
  // ============================================================================
  const computedMetrics = useMemo(() => {
    const liveEnrolledCount = enrollmentsList.filter((i) => i.status === 'enrolled').length;
    const livePendingCount = enrollmentsList.filter((i) => i.status === 'pending').length;
    const liveBulkCount = enrollmentsList.filter((i) => i.is_bulk).length;

    const baseBotTotal = districtsData.reduce((acc, d) => acc + d.botTotal, 0);
    const baseEnrolled = districtsData.reduce((acc, d) => acc + d.enrolled, 0);
    const basePending = districtsData.reduce((acc, d) => acc + d.pending, 0);

    return {
      todayEnrollments: 418 + liveEnrolledCount,
      bulkTodayEnrollments: 265 + liveBulkCount,
      totalWhatsappBot: baseBotTotal + enrollmentsList.length,
      mlcEnrolledPeople: baseEnrolled + liveEnrolledCount,
      pendingPeople: Math.max(0, basePending + livePendingCount),
      totalMembers: 78500 + liveEnrolledCount,
    };
  }, [enrollmentsList, districtsData]);

  // ============================================================================
  // AUTHENTICATION HANDLER
  // ============================================================================
  const handleAuthentication = async () => {
    const trimmedEmail = emailInput.trim().toLowerCase();
    const trimmedPass = passwordInput.trim();

    if (!trimmedEmail || !trimmedPass) {
      Alert.alert('Missing Fields', 'Please enter both Email ID and Password.');
      return;
    }

    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        if (!fullNameInput.trim()) {
          Alert.alert('Required Field', 'Please enter your Full Name to create an account.');
          setAuthLoading(false);
          return;
        }

        const newUser = {
          id: `usr-${Date.now()}`,
          name: fullNameInput.trim(),
          email: trimmedEmail,
          password: trimmedPass,
          role: loginRoleTab,
          phone: phoneInput.trim() || '+91 98480 00000',
          avatar: AVATAR_PRESETS[1],
          district: profileDistrict || 'Hyderabad',
        };

        if (supabase) {
          try {
            await supabase.auth.signUp({
              email: trimmedEmail,
              password: trimmedPass,
              options: {
                data: {
                  full_name: newUser.name,
                  role: newUser.role,
                  phone: newUser.phone,
                  district: newUser.district,
                },
              },
            });
          } catch (e) {
            console.log('Supabase signup notice:', e);
          }
        }

        setRegisteredUsers((prev) => [...prev, newUser]);
        setCurrentUser(newUser);
        setProfileName(newUser.name);
        setProfilePhone(newUser.phone);
        setProfileAvatar(newUser.avatar);
        setProfileDistrict(newUser.district);
        setAuthLoading(false);
        Alert.alert('Account Created', `Welcome to MLC Command Center as ${loginRoleTab}!`);
        return;
      }

      // Master Admin check
      if (trimmedEmail === 'admin@bsptgs.in' && trimmedPass === masterAdminPassword) {
        if (supabase) {
          try {
            await supabase.auth.signInWithPassword({
              email: trimmedEmail,
              password: trimmedPass,
            });
          } catch {
            // Offline fallback
          }
        }
        const adminUser = {
          id: 'admin-001',
          name: 'Simon (Master Admin)',
          email: 'admin@bsptgs.in',
          role: 'Master Admin',
          phone: '+91 98480 00002',
          avatar: AVATAR_PRESETS[0],
          district: 'Telangana State HQ (Hyderabad)',
        };
        setCurrentUser(adminUser);
        setProfileName(adminUser.name);
        setProfilePhone(adminUser.phone);
        setProfileDistrict(adminUser.district);
        setProfileAvatar(adminUser.avatar);
        setAuthLoading(false);
        return;
      }

      // Supabase remote auth
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPass,
        });

        if (!error && data?.user) {
          const meta = data.user.user_metadata || {};
          const loggedUser = {
            id: data.user.id,
            name: meta.full_name || trimmedEmail.split('@')[0].toUpperCase(),
            email: trimmedEmail,
            role: meta.role || loginRoleTab,
            phone: meta.phone || '+91 98480 11223',
            avatar: meta.avatar_url || AVATAR_PRESETS[2],
            district: meta.district || 'Hyderabad',
          };
          setCurrentUser(loggedUser);
          setProfileName(loggedUser.name);
          setProfilePhone(loggedUser.phone);
          setProfileAvatar(loggedUser.avatar);
          setProfileDistrict(loggedUser.district);
          setAuthLoading(false);
          return;
        }
      }

      // Local user check
      const existing = registeredUsers.find(
        (u) => u.email === trimmedEmail && u.password === trimmedPass
      );
      if (existing) {
        setCurrentUser(existing);
        setProfileName(existing.name);
        setProfilePhone(existing.phone);
        setProfileAvatar(existing.avatar);
        setProfileDistrict(existing.district);
        setAuthLoading(false);
        return;
      }

      // Quick demo fallback
      if (trimmedEmail.includes('@') && trimmedPass.length >= 4) {
        const staffUser = {
          id: `staff-${Date.now()}`,
          name: trimmedEmail.split('@')[0].toUpperCase(),
          email: trimmedEmail,
          password: trimmedPass,
          role: loginRoleTab,
          phone: '+91 98480 11223',
          avatar: AVATAR_PRESETS[2],
          district: 'Hyderabad',
        };
        setCurrentUser(staffUser);
        setProfileName(staffUser.name);
        setProfilePhone(staffUser.phone);
        setProfileAvatar(staffUser.avatar);
        setProfileDistrict(staffUser.district);
        setAuthLoading(false);
        return;
      }

      Alert.alert(
        'Invalid Credentials',
        'Use Email: admin@bsptgs.in and Password: Simon@bsptgs, or click Create Account.'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // Pick Applicant Photo from Camera or Gallery
  const handlePickPhoto = async () => {
    try {
      Alert.alert(
        'Upload Passport Photo',
        'Select photo source for Graduate MLC Enrollment:',
        [
          {
            text: 'Choose from Photo Library',
            onPress: async () => {
              try {
                setIsPhotoPickerLoading(true);
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ['images'],
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
                });
                if (!result.canceled && result.assets && result.assets.length > 0) {
                  const asset = result.assets[0];
                  setFormPhotoUri(asset.uri);
                  setFormPhotoName(asset.fileName || 'passport_photo.jpg');
                }
              } catch (err) {
                console.log('Pick photo error:', err);
                Alert.alert('Upload Notice', 'Could not open photo gallery.');
              } finally {
                setIsPhotoPickerLoading(false);
              }
            },
          },
          {
            text: 'Take Photo with Camera',
            onPress: async () => {
              try {
                setIsPhotoPickerLoading(true);
                const perm = await ImagePicker.requestCameraPermissionsAsync();
                if (!perm.granted) {
                  Alert.alert('Camera Permission', 'Camera permission is required to capture photo.');
                  setIsPhotoPickerLoading(false);
                  return;
                }
                const result = await ImagePicker.launchCameraAsync({
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
                });
                if (!result.canceled && result.assets && result.assets.length > 0) {
                  const asset = result.assets[0];
                  setFormPhotoUri(asset.uri);
                  setFormPhotoName(asset.fileName || 'captured_photo.jpg');
                }
              } catch (err) {
                console.log('Camera error:', err);
                Alert.alert('Camera Notice', 'Could not open camera.');
              } finally {
                setIsPhotoPickerLoading(false);
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (e) {
      console.log('handlePickPhoto error:', e);
    }
  };

  // Pick Graduation Degree Certificate (PDF / Document / Image)
  const handlePickCertificate = async () => {
    try {
      Alert.alert(
        'Upload Graduation Certificate',
        'Choose document type to attach:',
        [
          {
            text: 'Choose PDF / Document File',
            onPress: async () => {
              try {
                setIsCertPickerLoading(true);
                const result = await DocumentPicker.getDocumentAsync({
                  type: ['application/pdf', 'image/*'],
                  copyToCacheDirectory: true,
                });
                if (!result.canceled && result.assets && result.assets.length > 0) {
                  const asset = result.assets[0];
                  setFormCertUri(asset.uri);
                  setFormCertName(asset.name || 'degree_certificate.pdf');
                  setFormCertSize(
                    asset.size
                      ? (asset.size / (1024 * 1024)).toFixed(2) + ' MB'
                      : 'Document Attached'
                  );
                  setFormCertType(
                    asset.mimeType?.includes('pdf') || asset.name?.toLowerCase().endsWith('.pdf')
                      ? 'pdf'
                      : 'image'
                  );
                }
              } catch (err) {
                console.log('Pick document error:', err);
                Alert.alert('Upload Notice', 'Could not open file manager.');
              } finally {
                setIsCertPickerLoading(false);
              }
            },
          },
          {
            text: 'Choose Certificate Image from Gallery',
            onPress: async () => {
              try {
                setIsCertPickerLoading(true);
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ['images'],
                  allowsEditing: true,
                  quality: 0.9,
                });
                if (!result.canceled && result.assets && result.assets.length > 0) {
                  const asset = result.assets[0];
                  setFormCertUri(asset.uri);
                  setFormCertName(asset.fileName || 'degree_certificate.jpg');
                  setFormCertSize(
                    asset.fileSize
                      ? (asset.fileSize / (1024 * 1024)).toFixed(2) + ' MB'
                      : 'Image Attached'
                  );
                  setFormCertType('image');
                }
              } catch (err) {
                console.log('Pick certificate image error:', err);
                Alert.alert('Upload Notice', 'Could not open photo gallery.');
              } finally {
                setIsCertPickerLoading(false);
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (e) {
      console.log('handlePickCertificate error:', e);
    }
  };

  // Pick Profile Photo
  const handlePickProfilePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileAvatar(result.assets[0].uri);
        Alert.alert('Profile Photo Updated', 'Selected photo set as account avatar.');
      }
    } catch (e) {
      console.log('Pick profile photo error:', e);
    }
  };

  // ============================================================================
  // GRADUATE MLC ENROLLMENT FORM SUBMISSION (FEATURE 2)
  // ============================================================================
  const handleVerifyAndSubmitGraduateEnrollment = async () => {
    if (!formFirstName.trim()) {
      Alert.alert('Required Field', 'Please enter Applicant First Name.');
      return;
    }
    if (!formMobile.trim() || formMobile.trim().length < 8) {
      Alert.alert('Required Field', 'Please enter a valid Mobile Number.');
      return;
    }
    if (!formAadhaar.trim() || formAadhaar.replace(/\s+/g, '').length < 12) {
      Alert.alert('Required Field', 'Please enter a valid 12-digit Aadhaar Card Number.');
      return;
    }
    if (!formUniversity.trim()) {
      Alert.alert('Required Field', 'Please enter the Graduating University Name.');
      return;
    }

    setFormSubmitting(true);

    const fullName = `${formFirstName.trim()} ${formSurname.trim()}`.trim();
    const newRecordId = `grad-${Date.now()}`;
    const operatorTag = `${currentUser?.name || 'Admin'} (Mobile App)`;

    const newRecord = {
      id: newRecordId,
      full_name: fullName,
      phone: formMobile.trim(),
      district: formDistrict,
      constituency: formGradConstituency,
      status: 'pending',
      is_bulk: false,
      created_at: 'Just now',
      operator: operatorTag,
    };

    // 1. Optimistic instant push to stream
    setEnrollmentsList((prev) => [newRecord, ...prev]);

    // 2. Supabase insert with uploaded document paths
    if (supabase) {
      try {
        await supabase.from('enrollments').insert([
          {
            full_name: fullName,
            phone: formMobile.trim(),
            district: formDistrict,
            constituency: formGradConstituency,
            surname: formSurname.trim(),
            relative_name: formRelativeName.trim(),
            relative_surname: formRelativeSurname.trim(),
            gender: formGender,
            dob: formDob,
            qualification: formQualification,
            occupation: formOccupation,
            address: formAddress,
            epic_number: formEpicNumber,
            aadhaar: formAadhaar.trim(),
            university: formUniversity.trim(),
            university_telugu: formUniversityTelugu.trim(),
            completion_year: formCompletionYear,
            certificate_details: formCertDetails,
            photo_url: formPhotoUri || 'Photo Attached',
            certificate_url: formCertName || formCertUri || 'Degree Certificate Attached',
            email: formEmail.trim(),
            status: 'pending',
            operator: operatorTag,
            is_bulk: false,
          },
        ]);
      } catch (e) {
        console.log('Supabase graduate insert error:', e);
      }
    }

    setFormSubmitting(false);
    setIsEnrollmentModalVisible(false);

    // Reset form fields
    setFormFirstName('');
    setFormSurname('');
    setFormRelativeName('');
    setFormRelativeSurname('');
    setFormPhotoUri(null);
    setFormPhotoName(null);
    setFormCertUri(null);
    setFormCertName(null);
    setFormCertSize(null);

    Alert.alert(
      'Graduate MLC Enrollment Submitted!',
      `Application for ${fullName} under ${formGradConstituency} has been successfully registered with attached documents and queued for verification.`
    );
  };

  // Redirect from State Map to District Profile
  const handleSelectDistrictFromMap = (dist) => {
    const fresh = districtsData.find((d) => d.id === dist.id) || dist;
    setFocusedDistrictProfile(fresh);
    setDistrictDetailSubTab('incharges');
    setDistrictMemberSearch('');
    setActiveTab('districts');
  };

  const makeCall = (phone) => Linking.openURL(`tel:${phone}`);
  const openWhatsApp = (phone) =>
    Linking.openURL(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`);

  const handleMarkEnrolled = async (id) => {
    const operatorName = currentUser?.name || 'Admin Officer';

    setEnrollmentsList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'enrolled', operator: operatorName }
          : item
      )
    );

    if (supabase) {
      try {
        await supabase
          .from('enrollments')
          .update({
            status: 'enrolled',
            operator: operatorName,
            enrolled_at: new Date().toISOString(),
          })
          .eq('id', id);
      } catch (e) {
        console.log('Supabase update notice:', e);
      }
    }
  };

  const handleOpenEditDistrictModal = (dist) => {
    setEditingDistrict(dist);
    setEditActionPlanText(dist.actionPlan);
    setEditInchargeName(dist.incharge);
    setEditInchargePhone(dist.phone);
  };

  const handleSaveDistrictEdits = () => {
    if (!editingDistrict) return;
    setDistrictsData((prev) =>
      prev.map((d) =>
        d.id === editingDistrict.id
          ? {
              ...d,
              actionPlan: editActionPlanText,
              incharge: editInchargeName,
              phone: editInchargePhone,
            }
          : d
      )
    );

    if (focusedDistrictProfile && focusedDistrictProfile.id === editingDistrict.id) {
      setFocusedDistrictProfile((prev) => ({
        ...prev,
        actionPlan: editActionPlanText,
        incharge: editInchargeName,
        phone: editInchargePhone,
      }));
    }

    setEditingDistrict(null);
    Alert.alert('Strategic Plan Updated', 'District action plan and leadership details updated.');
  };

  const getStrengthColor = (strength) => {
    if (strength === 'Strong') return '#34C759';
    if (strength === 'Moderate') return '#FF9500';
    return '#FF3B30';
  };

  // ============================================================================
  // LOGIN SCREEN
  // ============================================================================
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.authSafeContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.authHeaderBox}>
              <View style={styles.authLogoCircle}>
                <Ionicons name="shield-checkmark" size={36} color="#FFFFFF" />
              </View>
              <Text style={styles.authAppTitle}>MLC COMMAND CENTER</Text>
              <Text style={styles.authAppSubtitle}>
                Telangana State Graduate Enrollment Portal
              </Text>
            </View>

            <View style={styles.authCard}>
              <Text style={styles.inputLabel}>SELECT ACCESS PORTAL (3 ROLES)</Text>
              <View style={styles.segmentedControl}>
                {['Admin', 'Employee', 'Incharge'].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.segmentBtn,
                      loginRoleTab === role && styles.segmentBtnActive,
                    ]}
                    onPress={() => {
                      setLoginRoleTab(role);
                      if (role === 'Admin' && authMode === 'login') {
                        setEmailInput('admin@bsptgs.in');
                        setPasswordInput(masterAdminPassword);
                      } else if (authMode === 'login') {
                        setEmailInput('');
                        setPasswordInput('');
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.segmentBtnText,
                        loginRoleTab === role && styles.segmentBtnTextActive,
                      ]}
                    >
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {authMode === 'signup' && (
                <>
                  <Text style={styles.inputLabel}>FULL NAME</Text>
                  <TextInput
                    style={styles.iosInput}
                    placeholder="Enter your full name"
                    placeholderTextColor="#8E8E93"
                    value={fullNameInput}
                    onChangeText={setFullNameInput}
                  />

                  <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
                  <TextInput
                    style={styles.iosInput}
                    placeholder="+91 98480 XXXXX"
                    placeholderTextColor="#8E8E93"
                    keyboardType="phone-pad"
                    value={phoneInput}
                    onChangeText={setPhoneInput}
                  />
                </>
              )}

              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.iosInput}
                placeholder="admin@bsptgs.in"
                placeholderTextColor="#8E8E93"
                autoCapitalize="none"
                keyboardType="email-address"
                value={emailInput}
                onChangeText={setEmailInput}
              />

              <Text style={styles.inputLabel}>PASSWORD</Text>
              <TextInput
                style={styles.iosInput}
                placeholder="Enter password"
                placeholderTextColor="#8E8E93"
                secureTextEntry
                value={passwordInput}
                onChangeText={setPasswordInput}
              />

              <TouchableOpacity
                style={styles.primaryAuthButton}
                onPress={handleAuthentication}
                disabled={authLoading}
              >
                {authLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryAuthButtonText}>
                    {authMode === 'login'
                      ? `Sign In as ${loginRoleTab}`
                      : `Create ${loginRoleTab} Account`}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.switchAuthModeBtn}
                onPress={() =>
                  setAuthMode(authMode === 'login' ? 'signup' : 'login')
                }
              >
                <Text style={styles.switchAuthModeText}>
                  {authMode === 'login'
                    ? "Don't have an account? Create Account"
                    : 'Already have an account? Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ============================================================================
  // REUSABLE LEADER CARD
  // ============================================================================
  const renderLeaderCard = ({
    title,
    leaderName,
    role,
    phone,
    photo,
    subCountLabel,
    onPressCard,
    badgeColor = '#007AFF',
  }) => (
    <TouchableOpacity
      activeOpacity={onPressCard ? 0.75 : 1}
      onPress={onPressCard}
      style={[styles.iosLeaderCard, compactListMode && styles.compactLeaderCard]}
    >
      <View style={styles.leaderTopRow}>
        <Image source={{ uri: photo }} style={[styles.leaderAvatar, compactListMode && styles.compactLeaderAvatar]} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.roleBadgeRow}>
            <View style={[styles.rolePill, { backgroundColor: badgeColor + '18' }]}>
              <Text style={[styles.rolePillText, { color: badgeColor }]}>{role}</Text>
            </View>
            {subCountLabel ? (
              <Text style={styles.subCountText}>{subCountLabel}</Text>
            ) : null}
          </View>
          <Text style={styles.locationTitle}>{title}</Text>
          <Text style={styles.leaderNameText}>{leaderName}</Text>
          <Text style={styles.phoneText}>{phone}</Text>
        </View>
        {onPressCard && (
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        )}
      </View>

      <View style={styles.contactButtonsRow}>
        <TouchableOpacity
          style={[styles.contactBtn, { backgroundColor: '#007AFF15' }]}
          onPress={() => makeCall(phone)}
        >
          <Ionicons name="call" size={15} color="#007AFF" />
          <Text style={[styles.contactBtnText, { color: '#007AFF' }]}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactBtn, { backgroundColor: '#34C75918' }]}
          onPress={() => openWhatsApp(phone)}
        >
          <Ionicons name="logo-whatsapp" size={15} color="#28A745" />
          <Text style={[styles.contactBtnText, { color: '#28A745' }]}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // ============================================================================
  // TAB 1: HOME DASHBOARD (WITH WIKIPEDIA SEARCH & NEW GRADUATE FORM BANNER)
  // ============================================================================
  const renderHomeTab = () => {
    const filteredFeed = enrollmentsList.filter((item) =>
      enrollmentFilter === 'all' ? true : item.status === enrollmentFilter
    );

    return (
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 110 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
        }
      >
        {/* Header Block with Quick Avatar Button */}
        <View style={styles.headerBlock}>
          <View>
            <View style={styles.liveSyncBadgeRow}>
              <View style={[styles.syncStatusDot, { backgroundColor: isOnlineSync ? '#34C759' : '#8E8E93' }]} />
              <Text style={styles.iosSubHeader}>
                {currentUser.role.toUpperCase()} • {isOnlineSync ? 'LIVE SUPABASE SYNC' : 'OFFLINE MODE'}
              </Text>
            </View>
            <Text style={styles.iosLargeTitle}>Dashboard</Text>
          </View>

          <TouchableOpacity
            style={styles.topProfileBtn}
            onPress={() => setActiveTab('profile')}
          >
            <Image source={{ uri: profileAvatar }} style={styles.topProfileImg} />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.topProfileName} numberOfLines={1}>
                {profileName.split(' ')[0]}
              </Text>
              <Text style={styles.topProfileSub}>Profile & Settings →</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ==================================================================== */}
        {/* NEW FEATURE 1: WIKIPEDIA-STYLE GLOBAL INSTANT SEARCH BAR */}
        {/* ==================================================================== */}
        <View style={styles.wikiSearchWrapper}>
          <View style={styles.wikiSearchBar}>
            <Ionicons name="search" size={20} color="#007AFF" />
            <TextInput
              style={styles.wikiSearchInput}
              placeholder="Search districts, constituencies, members, phone..."
              placeholderTextColor="#8E8E93"
              value={globalSearchQuery}
              onChangeText={setGlobalSearchQuery}
            />
            {globalSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setGlobalSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>

          {/* Instant Dropdown Results Card */}
          {globalSearchResults.length > 0 && (
            <View style={styles.wikiDropdownCard}>
              <View style={styles.wikiDropdownHeaderRow}>
                <Text style={styles.wikiDropdownHeader}>
                  INSTANT GLOBAL RESULTS ({globalSearchResults.length})
                </Text>
                <TouchableOpacity onPress={() => setGlobalSearchQuery('')}>
                  <Text style={styles.wikiCloseHint}>Close</Text>
                </TouchableOpacity>
              </View>

              {globalSearchResults.map((res, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.wikiResultItem}
                  onPress={res.action}
                >
                  <View style={styles.wikiBadge}>
                    <Text style={styles.wikiBadgeText}>{res.type}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.wikiResultTitle} numberOfLines={1}>
                      {res.title}
                    </Text>
                    <Text style={styles.wikiResultSub} numberOfLines={1}>
                      {res.subtitle}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* ==================================================================== */}
        {/* NEW FEATURE 2: NEW GRADUATE MLC ENROLLMENT BANNER ACTION */}
        {/* ==================================================================== */}
        <TouchableOpacity
          style={styles.createEnrollmentBanner}
          activeOpacity={0.85}
          onPress={() => setIsEnrollmentModalVisible(true)}
        >
          <View style={styles.createEnrollmentIcon}>
            <Ionicons name="person-add" size={24} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.createEnrollmentTitle}>
              ➕ New Graduate MLC Enrollment
            </Text>
            <Text style={styles.createEnrollmentSub}>
              Tap to add official graduate voter application (Form 18)
            </Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Hero Gradient Card (Today's Live Inflow) */}
        <LinearGradient
          colors={['#007AFF', '#0051B3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradientCard}
        >
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroIconWrap}>
              <Ionicons name="flash" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroLabel}>Today's Live Inflow (WhatsApp Bot & Form)</Text>
              <Text style={styles.heroSyncSubtitle}>Synced {lastSyncTime}</Text>
            </View>
            <TouchableOpacity onPress={onRefresh} style={styles.heroRefreshBtn}>
              <Ionicons name="refresh" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroMetricsRow}>
            <View style={styles.heroMetricBox}>
              <Text style={styles.heroMetricValue}>
                {computedMetrics.todayEnrollments.toLocaleString()}
              </Text>
              <Text style={styles.heroMetricSub}>Today Enrollments</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroMetricBox}>
              <Text style={styles.heroMetricValue}>
                {computedMetrics.bulkTodayEnrollments.toLocaleString()}
              </Text>
              <Text style={styles.heroMetricSub}>Bulk Today Enrollments</Text>
            </View>
          </View>
        </LinearGradient>

        {/* 4 Primary KPI Cards (2x2 iOS Grid) */}
        <Text style={styles.sectionHeader}>REAL-TIME ENROLLMENT METRICS</Text>
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconCircle, { backgroundColor: '#25D36620' }]}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            </View>
            <Text style={styles.kpiNumber}>
              {computedMetrics.totalWhatsappBot.toLocaleString()}
            </Text>
            <Text style={styles.kpiTitle}>Total WhatsApp Bot Enrollments</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconCircle, { backgroundColor: '#007AFF20' }]}>
              <Ionicons name="checkmark-done-circle" size={22} color="#007AFF" />
            </View>
            <Text style={[styles.kpiNumber, { color: '#007AFF' }]}>
              {computedMetrics.mlcEnrolledPeople.toLocaleString()}
            </Text>
            <Text style={styles.kpiTitle}>Enrolled People (MLC Online)</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconCircle, { backgroundColor: '#FF950020' }]}>
              <Ionicons name="time" size={22} color="#FF9500" />
            </View>
            <Text style={[styles.kpiNumber, { color: '#FF9500' }]}>
              {computedMetrics.pendingPeople.toLocaleString()}
            </Text>
            <Text style={styles.kpiTitle}>Pending People (WhatsApp Bot)</Text>
          </View>

          <View style={styles.kpiCard}>
            <View style={[styles.kpiIconCircle, { backgroundColor: '#5856D620' }]}>
              <Ionicons name="people" size={20} color="#5856D6" />
            </View>
            <Text style={[styles.kpiNumber, { color: '#5856D6' }]}>
              {computedMetrics.totalMembers.toLocaleString()}
            </Text>
            <Text style={styles.kpiTitle}>Total Members Strength</Text>
          </View>
        </View>

        {/* Live WhatsApp Bot Stream Header & Filters */}
        <View style={styles.queueHeaderRow}>
          <Text style={styles.sectionHeader}>
            MOBILE & WHATSAPP ENROLLMENTS ({filteredFeed.length})
          </Text>
          <View style={styles.filterPillsRow}>
            {['all', 'enrolled', 'pending'].map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setEnrollmentFilter(f)}
                style={[
                  styles.smallFilterPill,
                  enrollmentFilter === f && styles.smallFilterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.smallFilterText,
                    enrollmentFilter === f && styles.smallFilterTextActive,
                  ]}
                >
                  {f.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stream List Cards */}
        {filteredFeed.map((item) => (
          <View key={item.id} style={styles.enrollmentRowCard}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.applicantName}>{item.full_name}</Text>
                {item.is_bulk && (
                  <View style={styles.bulkTag}>
                    <Text style={styles.bulkTagText}>BULK</Text>
                  </View>
                )}
              </View>
              <Text style={styles.applicantSub}>
                {item.district} • {item.constituency}
              </Text>
              <Text style={styles.applicantMeta}>
                {item.phone} • {item.created_at}
              </Text>
            </View>

            {item.status === 'enrolled' ? (
              <View style={styles.enrolledBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#28A745" />
                <Text style={styles.enrolledBadgeText}>MLC Enrolled</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.verifyNowBtn}
                onPress={() => handleMarkEnrolled(item.id)}
              >
                <Text style={styles.verifyNowBtnText}>Mark Enrolled</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    );
  };

  // ============================================================================
  // TAB 2: INCHARGES (5-LEVEL TELANGANA STATE DRILL-DOWN)
  // ============================================================================
  const renderInchargesTab = () => {
    const resetToLevel = (level) => {
      if (level === 0) {
        setSelectedDistrict(null);
        setSelectedConstituency(null);
        setSelectedMandal(null);
      } else if (level === 1) {
        setSelectedConstituency(null);
        setSelectedMandal(null);
      } else if (level === 2) {
        setSelectedMandal(null);
      }
    };

    const filteredDistricts = districtsData.filter(
      (d) =>
        d.name.toLowerCase().includes(inchargeSearchQuery.toLowerCase()) ||
        d.incharge.toLowerCase().includes(inchargeSearchQuery.toLowerCase())
    );

    return (
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View style={styles.headerBlock}>
          <View>
            <Text style={styles.iosSubHeader}>5-LEVEL STATE TO VILLAGE DIRECTORY</Text>
            <Text style={styles.iosLargeTitle}>Incharges</Text>
          </View>
        </View>

        <View style={styles.iosSearchBar}>
          <Ionicons name="search" size={18} color="#8E8E93" />
          <TextInput
            placeholder="Search District, Constituency, Mandal or Leader..."
            placeholderTextColor="#8E8E93"
            value={inchargeSearchQuery}
            onChangeText={setInchargeSearchQuery}
            style={styles.iosSearchInput}
          />
        </View>

        <View style={styles.breadcrumbBar}>
          <TouchableOpacity onPress={() => resetToLevel(0)}>
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
              <Ionicons name="chevron-forward" size={14} color="#8E8E93" />
              <TouchableOpacity onPress={() => resetToLevel(1)}>
                <Text
                  style={[
                    styles.breadcrumbText,
                    !selectedConstituency && styles.breadcrumbActive,
                  ]}
                >
                  {selectedDistrict.name}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {selectedConstituency && (
            <>
              <Ionicons name="chevron-forward" size={14} color="#8E8E93" />
              <TouchableOpacity onPress={() => resetToLevel(2)}>
                <Text
                  style={[
                    styles.breadcrumbText,
                    !selectedMandal && styles.breadcrumbActive,
                  ]}
                >
                  {selectedConstituency.name.replace(' Constituency', '')}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {selectedMandal && (
            <>
              <Ionicons name="chevron-forward" size={14} color="#8E8E93" />
              <Text style={[styles.breadcrumbText, styles.breadcrumbActive]}>
                {selectedMandal.name}
              </Text>
            </>
          )}
        </View>

        {/* Level 0: State Leaders + All 33 Districts */}
        {!selectedDistrict && (
          <>
            <Text style={styles.sectionHeader}>TELANGANA STATE COMMAND</Text>
            {STATE_INCHARGES.map((st) => (
              <View key={st.id}>
                {renderLeaderCard({
                  title: st.state,
                  leaderName: st.name,
                  role: st.role,
                  phone: st.phone,
                  photo: st.photo,
                  subCountLabel: '33 Districts • 119 Constituencies',
                  badgeColor: '#AF52DE',
                })}
              </View>
            ))}

            <Text style={styles.sectionHeader}>
              ALL DISTRICT INCHARGES ({filteredDistricts.length})
            </Text>
            {filteredDistricts.map((dist) => (
              <View key={dist.id}>
                {renderLeaderCard({
                  title: `${dist.name} District`,
                  leaderName: dist.incharge,
                  role: 'District Incharge',
                  phone: dist.phone,
                  photo: dist.photo,
                  subCountLabel: `${dist.constituencies.length} Constituencies`,
                  badgeColor: '#007AFF',
                  onPressCard: () => setSelectedDistrict(dist),
                })}
              </View>
            ))}
          </>
        )}

        {/* Level 1: Selected District -> Constituency Incharges */}
        {selectedDistrict && !selectedConstituency && (
          <>
            <Text style={styles.sectionHeader}>DISTRICT INCHARGE</Text>
            {renderLeaderCard({
              title: `${selectedDistrict.name} District`,
              leaderName: selectedDistrict.incharge,
              role: 'District Incharge',
              phone: selectedDistrict.phone,
              photo: selectedDistrict.photo,
              badgeColor: '#007AFF',
            })}

            <Text style={styles.sectionHeader}>
              CONSTITUENCY INCHARGES ({selectedDistrict.constituencies.length})
            </Text>
            {selectedDistrict.constituencies.map((constit) => (
              <View key={constit.id}>
                {renderLeaderCard({
                  title: constit.name,
                  leaderName: constit.inchargeName,
                  role: 'Constituency Incharge',
                  phone: constit.phone,
                  photo: constit.photo,
                  subCountLabel: `${constit.mandals.length} Mandals`,
                  badgeColor: '#5856D6',
                  onPressCard: () => setSelectedConstituency(constit),
                })}
              </View>
            ))}
          </>
        )}

        {/* Level 2: Selected Constituency -> Mandal Incharges */}
        {selectedConstituency && !selectedMandal && (
          <>
            <Text style={styles.sectionHeader}>CONSTITUENCY LEADER</Text>
            {renderLeaderCard({
              title: selectedConstituency.name,
              leaderName: selectedConstituency.inchargeName,
              role: 'Constituency Incharge',
              phone: selectedConstituency.phone,
              photo: selectedConstituency.photo,
              badgeColor: '#5856D6',
            })}

            <Text style={styles.sectionHeader}>
              MANDAL INCHARGES ({selectedConstituency.mandals.length})
            </Text>
            {selectedConstituency.mandals.map((mandal) => (
              <View key={mandal.id}>
                {renderLeaderCard({
                  title: mandal.name,
                  leaderName: mandal.inchargeName,
                  role: 'Mandal Incharge',
                  phone: mandal.phone,
                  photo: mandal.photo,
                  subCountLabel: `${mandal.villages.length} Villages`,
                  badgeColor: '#FF9500',
                  onPressCard: () => setSelectedMandal(mandal),
                })}
              </View>
            ))}
          </>
        )}

        {/* Level 3: Selected Mandal -> Village / Ward Leaders */}
        {selectedMandal && (
          <>
            <Text style={styles.sectionHeader}>MANDAL LEADER</Text>
            {renderLeaderCard({
              title: selectedMandal.name,
              leaderName: selectedMandal.inchargeName,
              role: 'Mandal Incharge',
              phone: selectedMandal.phone,
              photo: selectedMandal.photo,
              badgeColor: '#FF9500',
            })}

            <Text style={styles.sectionHeader}>
              VILLAGE LEADERS ({selectedMandal.villages.length})
            </Text>
            {selectedMandal.villages.map((village) => (
              <View key={village.id}>
                {renderLeaderCard({
                  title: village.name,
                  leaderName: village.inchargeName,
                  role: village.role,
                  phone: village.phone,
                  photo: village.photo,
                  badgeColor: '#34C759',
                })}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    );
  };

  // ============================================================================
  // TAB 3: HIERARCHY (INTERACTIVE STATE MAP + VISUAL COMMAND TREE)
  // ============================================================================
  const renderHierarchyMapTab = () => {
    const zones = [
      'North Telangana',
      'Central & East Zone',
      'Greater Hyderabad & Core Zone',
      'South Telangana Zone',
    ];

    return (
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View style={styles.headerBlock}>
          <View>
            <Text style={styles.iosSubHeader}>TAP ANY DISTRICT ON MAP TO OPEN PROFILE</Text>
            <Text style={styles.iosLargeTitle}>Hierarchy Map</Text>
          </View>
        </View>

        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              hierarchyViewMode === 'map' && styles.segmentBtnActive,
            ]}
            onPress={() => setHierarchyViewMode('map')}
          >
            <Text
              style={[
                styles.segmentBtnText,
                hierarchyViewMode === 'map' && styles.segmentBtnTextActive,
              ]}
            >
              Interactive State Map
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              hierarchyViewMode === 'tree' && styles.segmentBtnActive,
            ]}
            onPress={() => setHierarchyViewMode('tree')}
          >
            <Text
              style={[
                styles.segmentBtnText,
                hierarchyViewMode === 'tree' && styles.segmentBtnTextActive,
              ]}
            >
              Visual Command Tree
            </Text>
          </TouchableOpacity>
        </View>

        {hierarchyViewMode === 'map' ? (
          <View style={styles.mapCanvasCard}>
            <View style={styles.mapCardHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="map" size={20} color="#007AFF" />
                <Text style={styles.mapTitleText}>Telangana 33 Districts Geo-Map</Text>
              </View>
              <Text style={styles.mapTapHint}>Tap District to Redirect →</Text>
            </View>

            <View style={styles.mapLegendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
                <Text style={styles.legendText}>Strong (75%+)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF9500' }]} />
                <Text style={styles.legendText}>Moderate (55-74%)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
                <Text style={styles.legendText}>Focus (&lt;55%)</Text>
              </View>
            </View>

            {zones.map((zoneName) => {
              const zoneDistricts = districtsData.filter((d) => d.zone === zoneName);
              return (
                <View key={zoneName} style={styles.geoZoneContainer}>
                  <View style={styles.geoZoneHeader}>
                    <Text style={styles.geoZoneTitle}>{zoneName.toUpperCase()}</Text>
                    <Text style={styles.geoZoneBadge}>{zoneDistricts.length} Districts</Text>
                  </View>

                  <View style={styles.mapTilesGrid}>
                    {zoneDistricts.map((dist) => {
                      const tileColor = getStrengthColor(dist.strength);
                      return (
                        <TouchableOpacity
                          key={dist.id}
                          style={[
                            styles.mapDistrictTile,
                            {
                              backgroundColor: tileColor + '15',
                              borderColor: tileColor,
                            },
                          ]}
                          onPress={() => handleSelectDistrictFromMap(dist)}
                        >
                          <View style={styles.mapTileTop}>
                            <Text style={[styles.mapTileCode, { color: tileColor }]}>
                              {dist.code}
                            </Text>
                            <Text style={styles.mapTileScore}>{dist.score}%</Text>
                          </View>
                          <Text style={styles.mapTileName} numberOfLines={1}>
                            {dist.name}
                          </Text>
                          <Text style={styles.mapTileMeta}>
                            {dist.enrolled} Enrolled
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.treeContainerCard}>
            <View style={styles.treeRootNode}>
              <Ionicons name="ribbon" size={24} color="#FFFFFF" />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.treeRootTitle}>TELANGANA STATE SUPREME COMMAND</Text>
                <Text style={styles.treeRootSub}>
                  Ibrahim Sekhar (State Chief) • Simon (Digital & Operations Head)
                </Text>
              </View>
            </View>

            <View style={styles.treeConnectorLine} />

            {districtsData.map((dist) => {
              const isExpanded = expandedTreeDistrictId === dist.id;
              const color = getStrengthColor(dist.strength);

              return (
                <View key={dist.id} style={styles.treeBranchWrapper}>
                  <TouchableOpacity
                    style={[styles.treeBranchCard, { borderLeftColor: color }]}
                    onPress={() =>
                      setExpandedTreeDistrictId(isExpanded ? null : dist.id)
                    }
                  >
                    <View style={styles.treeBranchHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.treeBranchTitle}>
                          {dist.name} District
                        </Text>
                        <Text style={styles.treeBranchLeader}>
                          Incharge: {dist.incharge} • {dist.phone}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.treeJumpBadge}
                        onPress={() => handleSelectDistrictFromMap(dist)}
                      >
                        <Text style={styles.treeJumpText}>Profile</Text>
                        <Ionicons name="arrow-forward" size={12} color="#007AFF" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.treeBranchMeta}>
                      ├─ {dist.constituencies.length} Constituencies •{' '}
                      {dist.constituencies.length * 2} Mandals • {dist.score}% Score
                    </Text>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.treeExpandedBox}>
                      <Text style={styles.treeExpandedTitle}>
                        CONSTITUENCY NODES UNDER {dist.name.toUpperCase()}:
                      </Text>
                      <View style={styles.treeChipsRow}>
                        {dist.constituencies.map((c) => (
                          <View key={c.id} style={styles.treeConstituencyChip}>
                            <Ionicons name="location-sharp" size={12} color="#5856D6" />
                            <Text style={styles.treeChipText}>{c.name}</Text>
                          </View>
                        ))}
                      </View>
                      <TouchableOpacity
                        style={styles.treeOpenFullBtn}
                        onPress={() => handleSelectDistrictFromMap(dist)}
                      >
                        <Text style={styles.treeOpenFullBtnText}>
                          Open Complete {dist.name} District Directory →
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    );
  };

  // ============================================================================
  // TAB 4: DISTRICT PROFILES (DEEP DISTRICT PAGE + MEMBERS & USERS)
  // ============================================================================
  const renderDistrictProfilesTab = () => {
    if (focusedDistrictProfile) {
      const dist =
        districtsData.find((d) => d.id === focusedDistrictProfile.id) ||
        focusedDistrictProfile;
      const color = getStrengthColor(dist.strength);

      const liveForDistrict = enrollmentsList
        .filter((e) => e.district?.toLowerCase() === dist.name.toLowerCase())
        .map((e) => ({
          id: `live-${e.id}`,
          name: e.full_name,
          qualification: 'Voter / Member',
          constituency: e.constituency,
          status: e.status === 'enrolled' ? 'MLC Enrolled' : 'Pending',
          phone: e.phone,
          batch: e.is_bulk ? 'Bulk WhatsApp' : 'WhatsApp Bot Live',
        }));

      const combinedMembers = [...liveForDistrict, ...dist.districtMembers];
      const filteredMembers = combinedMembers.filter((m) =>
        m.name.toLowerCase().includes(districtMemberSearch.toLowerCase()) ||
        m.constituency.toLowerCase().includes(districtMemberSearch.toLowerCase())
      );

      const localUsersForDistrict = registeredUsers
        .filter((u) => u.district?.toLowerCase() === dist.name.toLowerCase())
        .map((u) => ({
          id: u.id,
          name: u.name,
          role: u.role,
          email: u.email,
          processedCount: 0,
          phone: u.phone,
          status: 'Active Registered',
        }));

      const combinedUsers = [...localUsersForDistrict, ...dist.districtUsers];

      return (
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={{ paddingBottom: 110 }}
        >
          <View style={styles.detailBackHeader}>
            <TouchableOpacity
              style={styles.backButtonRow}
              onPress={() => setFocusedDistrictProfile(null)}
            >
              <Ionicons name="chevron-back" size={22} color="#007AFF" />
              <Text style={styles.backButtonText}>All 33 Districts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backMapChip}
              onPress={() => setActiveTab('hierarchy')}
            >
              <Ionicons name="map-outline" size={15} color="#007AFF" />
              <Text style={styles.backMapChipText}>Telangana Map</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.profileTopRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.iosSubHeader}>{dist.zone.toUpperCase()}</Text>
                <Text style={styles.profileDistrictTitle}>
                  {dist.name} District Profile
                </Text>
                <Text style={styles.profileInchargeSub}>
                  Head Incharge: {dist.incharge} • {dist.phone}
                </Text>
              </View>
              <View style={[styles.strengthBadge, { backgroundColor: color + '18' }]}>
                <Text style={[styles.strengthBadgeText, { color }]}>
                  {dist.strength.toUpperCase()} ({dist.score}%)
                </Text>
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${dist.score}%`, backgroundColor: color },
                ]}
              />
            </View>

            <View style={styles.profileStatsRow}>
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatNum}>
                  {dist.botTotal.toLocaleString()}
                </Text>
                <Text style={styles.profileStatLabel}>WhatsApp Bot</Text>
              </View>
              <View style={styles.profileStatItem}>
                <Text style={[styles.profileStatNum, { color: '#007AFF' }]}>
                  {dist.enrolled.toLocaleString()}
                </Text>
                <Text style={styles.profileStatLabel}>MLC Enrolled</Text>
              </View>
              <View style={styles.profileStatItem}>
                <Text style={[styles.profileStatNum, { color: '#FF9500' }]}>
                  {dist.pending.toLocaleString()}
                </Text>
                <Text style={styles.profileStatLabel}>Pending</Text>
              </View>
            </View>

            <View style={styles.actionPlanBox}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.actionPlanTitle}>
                  STRATEGIC ACTION PLAN (WHAT NEEDS TO BE DONE):
                </Text>
                {currentUser?.role === 'Master Admin' && (
                  <TouchableOpacity
                    onPress={() => handleOpenEditDistrictModal(dist)}
                    style={styles.editPlanChip}
                  >
                    <Ionicons name="pencil" size={12} color="#007AFF" />
                    <Text style={styles.editPlanChipText}>Edit Plan</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.actionPlanDesc}>{dist.actionPlan}</Text>
            </View>
          </View>

          <View style={styles.segmentedControl}>
            {[
              { key: 'incharges', label: 'Incharges & Leaders' },
              { key: 'members', label: `All Members (${combinedMembers.length})` },
              { key: 'users', label: `App Users (${combinedUsers.length})` },
            ].map((t) => (
              <TouchableOpacity
                key={t.key}
                style={[
                  styles.segmentBtn,
                  districtDetailSubTab === t.key && styles.segmentBtnActive,
                ]}
                onPress={() => setDistrictDetailSubTab(t.key)}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    districtDetailSubTab === t.key && styles.segmentBtnTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sub-tab 1: Incharges */}
          {districtDetailSubTab === 'incharges' && (
            <>
              <Text style={styles.sectionHeader}>DISTRICT HEAD INCHARGE</Text>
              {renderLeaderCard({
                title: `${dist.name} District Head`,
                leaderName: dist.incharge,
                role: 'District Incharge',
                phone: dist.phone,
                photo: dist.photo,
                badgeColor: '#007AFF',
              })}

              <Text style={styles.sectionHeader}>
                CONSTITUENCY & MANDAL INCHARGES ({dist.constituencies.length})
              </Text>
              {dist.constituencies.map((c) => (
                <View key={c.id}>
                  {renderLeaderCard({
                    title: c.name,
                    leaderName: c.inchargeName,
                    role: 'Constituency Incharge',
                    phone: c.phone,
                    photo: c.photo,
                    subCountLabel: `${c.mandals.length} Mandals`,
                    badgeColor: '#5856D6',
                  })}
                  {c.mandals.map((m) => (
                    <View key={m.id} style={{ paddingLeft: 14 }}>
                      {renderLeaderCard({
                        title: `├─ ${m.name}`,
                        leaderName: m.inchargeName,
                        role: 'Mandal Incharge',
                        phone: m.phone,
                        photo: m.photo,
                        subCountLabel: `${m.villages.length} Villages`,
                        badgeColor: '#FF9500',
                      })}
                    </View>
                  ))}
                </View>
              ))}
            </>
          )}

          {/* Sub-tab 2: Members */}
          {districtDetailSubTab === 'members' && (
            <>
              <View style={styles.iosSearchBar}>
                <Ionicons name="search" size={18} color="#8E8E93" />
                <TextInput
                  placeholder={`Search enrolled members in ${dist.name}...`}
                  placeholderTextColor="#8E8E93"
                  value={districtMemberSearch}
                  onChangeText={setDistrictMemberSearch}
                  style={styles.iosSearchInput}
                />
              </View>

              <Text style={styles.sectionHeader}>
                ENROLLED & PENDING MEMBERS ({filteredMembers.length})
              </Text>
              {filteredMembers.map((mem) => (
                <View key={mem.id} style={styles.enrollmentRowCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.applicantName}>{mem.name}</Text>
                    <Text style={styles.applicantSub}>
                      {mem.qualification} • {mem.constituency}
                    </Text>
                    <Text style={styles.applicantMeta}>
                      {mem.phone} • Source: {mem.batch}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.enrolledBadge,
                      mem.status !== 'MLC Enrolled' && { backgroundColor: '#FF950020' },
                    ]}
                    onPress={() => makeCall(mem.phone)}
                  >
                    <Ionicons
                      name="call"
                      size={13}
                      color={mem.status === 'MLC Enrolled' ? '#28A745' : '#FF9500'}
                    />
                    <Text
                      style={[
                        styles.enrolledBadgeText,
                        mem.status !== 'MLC Enrolled' && { color: '#FF9500' },
                      ]}
                    >
                      {mem.status}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}

          {/* Sub-tab 3: Users */}
          {districtDetailSubTab === 'users' && (
            <>
              <Text style={styles.sectionHeader}>
                ASSIGNED APP USERS & DATA OPERATORS ({combinedUsers.length})
              </Text>
              {combinedUsers.map((usr) => (
                <View key={usr.id} style={styles.enrollmentRowCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.applicantName}>{usr.name}</Text>
                    <Text style={styles.applicantSub}>
                      {usr.role} • {usr.email}
                    </Text>
                    <Text style={styles.applicantMeta}>
                      {usr.phone} • Processed: {usr.processedCount} Applications
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.verifyNowBtn}
                    onPress={() => makeCall(usr.phone)}
                  >
                    <Text style={styles.verifyNowBtnText}>Call User</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      );
    }

    // Default all 33 profiles
    const filteredProfiles = districtsData.filter((d) =>
      strengthFilter === 'ALL' ? true : d.strength === strengthFilter
    );

    return (
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        <View style={styles.headerBlock}>
          <View>
            <Text style={styles.iosSubHeader}>
              TAP ANY DISTRICT TO VIEW INCHARGES, MEMBERS & USERS
            </Text>
            <Text style={styles.iosLargeTitle}>District Profiles</Text>
          </View>
        </View>

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

        {filteredProfiles.map((dist) => {
          const color = getStrengthColor(dist.strength);
          return (
            <TouchableOpacity
              key={dist.id}
              activeOpacity={0.8}
              onPress={() => setFocusedDistrictProfile(dist)}
              style={styles.profileCard}
            >
              <View style={styles.profileTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.profileDistrictTitle}>
                    {dist.name} District
                  </Text>
                  <Text style={styles.profileInchargeSub}>
                    Incharge: {dist.incharge} • Tap to view Members & Users →
                  </Text>
                </View>
                <View style={[styles.strengthBadge, { backgroundColor: color + '18' }]}>
                  <Text style={[styles.strengthBadgeText, { color }]}>
                    {dist.strength.toUpperCase()} ({dist.score}%)
                  </Text>
                </View>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${dist.score}%`, backgroundColor: color },
                  ]}
                />
              </View>

              <View style={styles.profileStatsRow}>
                <View style={styles.profileStatItem}>
                  <Text style={styles.profileStatNum}>
                    {dist.botTotal.toLocaleString()}
                  </Text>
                  <Text style={styles.profileStatLabel}>WhatsApp Bot</Text>
                </View>
                <View style={styles.profileStatItem}>
                  <Text style={[styles.profileStatNum, { color: '#007AFF' }]}>
                    {dist.enrolled.toLocaleString()}
                  </Text>
                  <Text style={styles.profileStatLabel}>MLC Enrolled</Text>
                </View>
                <View style={styles.profileStatItem}>
                  <Text style={[styles.profileStatNum, { color: '#FF9500' }]}>
                    {dist.pending.toLocaleString()}
                  </Text>
                  <Text style={styles.profileStatLabel}>Pending</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  // ============================================================================
  // TAB 5: USER PROFILE & ACCOUNT SETTINGS
  // ============================================================================
  const renderProfileSettingsTab = () => (
    <ScrollView
      style={styles.scrollArea}
      contentContainerStyle={{ paddingBottom: 110 }}
    >
      <View style={styles.headerBlock}>
        <View>
          <Text style={styles.iosSubHeader}>ACCOUNT & SECURITY SETTINGS</Text>
          <Text style={styles.iosLargeTitle}>User Profile</Text>
        </View>
      </View>

      <View style={styles.profileHeroBox}>
        <TouchableOpacity
          style={styles.avatarWrapper}
          activeOpacity={0.8}
          onPress={handlePickProfilePhoto}
        >
          <Image source={{ uri: profileAvatar }} style={styles.largeProfileAvatar} />
          <View style={styles.cameraBadgeCircle}>
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <Text style={styles.profileHeroName}>{profileName}</Text>
        <Text style={styles.profileHeroRole}>
          {currentUser.role} • {currentUser.email}
        </Text>

        <Text style={[styles.inputLabel, { marginTop: 14 }]}>
          CHOOSE PROFILE IMAGE PRESET
        </Text>
        <View style={styles.avatarPresetRow}>
          {AVATAR_PRESETS.map((url, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setProfileAvatar(url)}
              style={[
                styles.avatarThumbWrap,
                profileAvatar === url && styles.avatarThumbActive,
              ]}
            >
              <Image source={{ uri: url }} style={styles.avatarThumb} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customUrlRow}>
          <TextInput
            style={[styles.iosInput, { flex: 1, marginBottom: 0 }]}
            placeholder="Or paste custom image URL..."
            placeholderTextColor="#8E8E93"
            value={customAvatarUrl}
            onChangeText={setCustomAvatarUrl}
          />
          <TouchableOpacity
            style={styles.applyUrlBtn}
            onPress={() => {
              if (customAvatarUrl.trim().startsWith('http')) {
                setProfileAvatar(customAvatarUrl.trim());
                setCustomAvatarUrl('');
                Alert.alert('Avatar Applied', 'Custom image URL set as avatar.');
              } else {
                Alert.alert('Invalid URL', 'Please enter a valid HTTP/HTTPS image URL.');
              }
            }}
          >
            <Text style={styles.applyUrlBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionHeader}>ACCOUNT DETAILS (GROUPED INSET)</Text>
      <View style={styles.settingsCard}>
        <Text style={styles.inputLabel}>FULL NAME</Text>
        <TextInput
          style={styles.iosInput}
          value={profileName}
          onChangeText={setProfileName}
        />

        <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
        <TextInput
          style={styles.iosInput}
          value={profilePhone}
          onChangeText={setProfilePhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.inputLabel}>ASSIGNED DISTRICT</Text>
        <TouchableOpacity
          style={styles.districtSelectorBtn}
          onPress={() => setIsDistrictPickerOpen(true)}
        >
          <Text style={styles.districtSelectorText}>{profileDistrict || 'Select District'}</Text>
          <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveSettingsBtn}
          onPress={() => Alert.alert('Profile Saved', 'Your account details have been updated.')}
        >
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
          <Text style={styles.saveSettingsBtnText}>Save Profile Changes</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>SECURITY & CHANGE PASSWORD</Text>
      <View style={styles.settingsCard}>
        <Text style={styles.inputLabel}>CURRENT PASSWORD</Text>
        <TextInput
          style={styles.iosInput}
          placeholder="Enter current password"
          placeholderTextColor="#8E8E93"
          secureTextEntry
          value={currentPasswordField}
          onChangeText={setCurrentPasswordField}
        />

        <Text style={styles.inputLabel}>NEW PASSWORD</Text>
        <TextInput
          style={styles.iosInput}
          placeholder="Enter new password (min 5 characters)"
          placeholderTextColor="#8E8E93"
          secureTextEntry
          value={newPasswordField}
          onChangeText={setNewPasswordField}
        />

        <Text style={styles.inputLabel}>CONFIRM NEW PASSWORD</Text>
        <TextInput
          style={styles.iosInput}
          placeholder="Re-enter new password"
          placeholderTextColor="#8E8E93"
          secureTextEntry
          value={confirmPasswordField}
          onChangeText={setConfirmPasswordField}
        />

        <TouchableOpacity
          style={[styles.saveSettingsBtn, { backgroundColor: '#5856D6' }]}
          onPress={() => {
            if (!currentPasswordField || !newPasswordField) {
              Alert.alert('Required', 'Please complete all password fields.');
              return;
            }
            if (newPasswordField !== confirmPasswordField) {
              Alert.alert('Mismatch', 'New passwords do not match.');
              return;
            }
            if (currentUser?.role === 'Master Admin') {
              setMasterAdminPassword(newPasswordField);
            }
            setCurrentPasswordField('');
            setNewPasswordField('');
            setConfirmPasswordField('');
            Alert.alert('Password Updated', 'Your password has been changed.');
          }}
        >
          <Ionicons name="key" size={18} color="#FFFFFF" />
          <Text style={styles.saveSettingsBtnText}>Update Password</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>APP PREFERENCES & SETTINGS</Text>
      <View style={styles.settingsCard}>
        <View style={styles.prefToggleRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.prefTitle}>Real-Time WhatsApp Bot Push Alerts</Text>
            <Text style={styles.prefSub}>In-app banner notifications for live enrollments</Text>
          </View>
          <Switch
            value={pushNotificationsEnabled}
            onValueChange={setPushNotificationsEnabled}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
          />
        </View>

        <View style={styles.prefToggleRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.prefTitle}>Auto-Sync Supabase Data</Text>
            <Text style={styles.prefSub}>Keep district counts updated in real time</Text>
          </View>
          <Switch
            value={autoSyncEnabled}
            onValueChange={setAutoSyncEnabled}
            trackColor={{ false: '#D1D1D6', true: '#007AFF' }}
          />
        </View>

        <View style={[styles.prefToggleRow, { borderBottomWidth: 0 }]}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.prefTitle}>Compact List Mode</Text>
            <Text style={styles.prefSub}>Display condensed cards for high density viewing</Text>
          </View>
          <Switch
            value={compactListMode}
            onValueChange={setCompactListMode}
            trackColor={{ false: '#D1D1D6', true: '#5856D6' }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.signOutFullBtn}
        onPress={() => {
          Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Sign Out',
                style: 'destructive',
                onPress: () => {
                  if (supabase) supabase.auth.signOut();
                  setCurrentUser(null);
                },
              },
            ]
          );
        }}
      >
        <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
        <Text style={styles.signOutFullBtnText}>Sign Out of Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

      {toastMessage && (
        <View style={styles.toastBanner}>
          <Ionicons name="notifications-circle" size={22} color="#34C759" />
          <Text style={styles.toastBannerText}>{toastMessage}</Text>
        </View>
      )}

      {activeTab === 'home' && renderHomeTab()}
      {activeTab === 'incharges' && renderInchargesTab()}
      {activeTab === 'hierarchy' && renderHierarchyMapTab()}
      {activeTab === 'districts' && renderDistrictProfilesTab()}
      {activeTab === 'profile' && renderProfileSettingsTab()}

      {/* ==================================================================== */}
      {/* GRADUATE MLC ENROLLMENT FORM MODAL (FEATURE 2) */}
      {/* ==================================================================== */}
      <Modal
        visible={isEnrollmentModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsEnrollmentModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalSubHeader}>OFFICIAL FORM 18 APPLICATION</Text>
              <Text style={styles.modalTitle}>Graduate MLC Enrollment</Text>
            </View>
            <TouchableOpacity onPress={() => setIsEnrollmentModalVisible(false)}>
              <Ionicons name="close-circle" size={28} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={{ flex: 1, paddingHorizontal: 16 }}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {/* 1. Graduate Constituency Selection */}
              <Text style={styles.inputLabel}>1. GRADUATE CONSTITUENCY *</Text>
              <View style={styles.constituencySelectorWrap}>
                {GRADUATE_CONSTITUENCIES.map((gc) => (
                  <TouchableOpacity
                    key={gc}
                    style={[
                      styles.gcOptionPill,
                      formGradConstituency === gc && styles.gcOptionPillActive,
                    ]}
                    onPress={() => setFormGradConstituency(gc)}
                  >
                    <Ionicons
                      name={formGradConstituency === gc ? 'radio-button-on' : 'radio-button-off'}
                      size={16}
                      color={formGradConstituency === gc ? '#007AFF' : '#8E8E93'}
                    />
                    <Text
                      style={[
                        styles.gcOptionPillText,
                        formGradConstituency === gc && styles.gcOptionPillTextActive,
                      ]}
                    >
                      {gc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 2. District Selection */}
              <Text style={styles.inputLabel}>2. DISTRICT OF ENROLLMENT *</Text>
              <TouchableOpacity
                style={styles.districtSelectorBtn}
                onPress={() => setIsDistrictPickerOpen(true)}
              >
                <Text style={styles.districtSelectorText}>{formDistrict}</Text>
                <Ionicons name="chevron-down" size={16} color="#8E8E93" />
              </TouchableOpacity>

              {/* 3. Applicant First Name & Surname */}
              <View style={styles.twoColumnRow}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.inputLabel}>FIRST NAME *</Text>
                  <TextInput
                    style={styles.iosInput}
                    placeholder="e.g. Ramesh"
                    placeholderTextColor="#8E8E93"
                    value={formFirstName}
                    onChangeText={setFormFirstName}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={styles.inputLabel}>SURNAME *</Text>
                  <TextInput
                    style={styles.iosInput}
                    placeholder="e.g. Goud"
                    placeholderTextColor="#8E8E93"
                    value={formSurname}
                    onChangeText={setFormSurname}
                  />
                </View>
              </View>

              {/* 4. Relative Name & Surname */}
              <View style={styles.twoColumnRow}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.inputLabel}>RELATIVE NAME (FATHER/HUSBAND)</Text>
                  <TextInput
                    style={styles.iosInput}
                    placeholder="e.g. Narayana"
                    placeholderTextColor="#8E8E93"
                    value={formRelativeName}
                    onChangeText={setFormRelativeName}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={styles.inputLabel}>RELATIVE SURNAME</Text>
                  <TextInput
                    style={styles.iosInput}
                    placeholder="e.g. Goud"
                    placeholderTextColor="#8E8E93"
                    value={formRelativeSurname}
                    onChangeText={setFormRelativeSurname}
                  />
                </View>
              </View>

              {/* 5. Gender & Date of Birth */}
              <View style={styles.twoColumnRow}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.inputLabel}>GENDER *</Text>
                  <View style={styles.genderRow}>
                    {['Male', 'Female', 'Other'].map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[
                          styles.genderBtn,
                          formGender === g && styles.genderBtnActive,
                        ]}
                        onPress={() => setFormGender(g)}
                      >
                        <Text
                          style={[
                            styles.genderBtnText,
                            formGender === g && styles.genderBtnTextActive,
                          ]}
                        >
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={styles.inputLabel}>DATE OF BIRTH (DD/MM/YYYY) *</Text>
                  <TextInput
                    style={styles.iosInput}
                    placeholder="15/08/1995"
                    placeholderTextColor="#8E8E93"
                    value={formDob}
                    onChangeText={setFormDob}
                  />
                </View>
              </View>

              {/* 6. Educational Qualification & Occupation */}
              <View style={styles.twoColumnRow}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.inputLabel}>QUALIFICATION *</Text>
                  <TextInput
                    style={styles.iosInput}
                    placeholder="e.g. B.Tech / Degree"
                    placeholderTextColor="#8E8E93"
                    value={formQualification}
                    onChangeText={setFormQualification}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={styles.inputLabel}>OCCUPATION *</Text>
                  <TextInput
                    style={styles.iosInput}
                    placeholder="e.g. Software Engineer"
                    placeholderTextColor="#8E8E93"
                    value={formOccupation}
                    onChangeText={setFormOccupation}
                  />
                </View>
              </View>

              {/* 7. Complete Residential Address */}
              <Text style={styles.inputLabel}>7. COMPLETE RESIDENTIAL ADDRESS *</Text>
              <TextInput
                style={[styles.iosInput, { height: 70, textAlignVertical: 'top', paddingTop: 10 }]}
                placeholder="House No, Street, Village/Mandal, Pincode"
                placeholderTextColor="#8E8E93"
                value={formAddress}
                onChangeText={setFormAddress}
                multiline
              />

              {/* 8. Previous EPIC (Voter ID) Details */}
              <Text style={styles.inputLabel}>8. PREVIOUS EPIC (VOTER ID) NUMBER</Text>
              <TextInput
                style={styles.iosInput}
                placeholder="e.g. TS/08/102/458120"
                placeholderTextColor="#8E8E93"
                value={formEpicNumber}
                onChangeText={setFormEpicNumber}
              />

              {/* 9. Aadhaar Card Number */}
              <Text style={styles.inputLabel}>9. AADHAAR CARD NUMBER *</Text>
              <TextInput
                style={styles.iosInput}
                placeholder="12-digit Aadhaar Number"
                placeholderTextColor="#8E8E93"
                keyboardType="numeric"
                value={formAadhaar}
                onChangeText={setFormAadhaar}
              />

              {/* 10. University Name & University Name in Telugu */}
              <Text style={styles.inputLabel}>10. UNIVERSITY NAME (ENGLISH) *</Text>
              <TextInput
                style={styles.iosInput}
                placeholder="e.g. Osmania University / JNTU Hyderabad"
                placeholderTextColor="#8E8E93"
                value={formUniversity}
                onChangeText={setFormUniversity}
              />

              <Text style={styles.inputLabel}>
                UNIVERSITY NAME IN TELUGU (విశ్వవిద్యాలయం పేరు - UNICODE FIELD) *
              </Text>
              <TextInput
                style={styles.iosInput}
                placeholder="e.g. జెఎన్టియు హైదరాబాద్ / ఉస్మానియా విశ్వవిద్యాలయం"
                placeholderTextColor="#8E8E93"
                value={formUniversityTelugu}
                onChangeText={setFormUniversityTelugu}
              />

              {/* 11 & 12. Completion Year & Certificate Details */}
              <View style={styles.twoColumnRow}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.inputLabel}>COMPLETION YEAR *</Text>
                  <TextInput
                    style={styles.iosInput}
                    placeholder="e.g. 2018"
                    placeholderTextColor="#8E8E93"
                    keyboardType="numeric"
                    value={formCompletionYear}
                    onChangeText={setFormCompletionYear}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={styles.inputLabel}>CERTIFICATE NO. / DIVISION</Text>
                  <TextInput
                    style={styles.iosInput}
                    placeholder="e.g. First Class"
                    placeholderTextColor="#8E8E93"
                    value={formCertDetails}
                    onChangeText={setFormCertDetails}
                  />
                </View>
              </View>

              {/* 13 & 14. Document Upload Section with Real Pickers */}
              <Text style={styles.inputLabel}>13. APPLICANT PASSPORT PHOTOGRAPH *</Text>
              {formPhotoUri ? (
                <View style={styles.uploadedDocCard}>
                  <Image source={{ uri: formPhotoUri }} style={styles.uploadedPhotoPreview} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={styles.uploadedStatusPill}>
                      <Ionicons name="checkmark-circle" size={14} color="#34C759" />
                      <Text style={styles.uploadedStatusText}>Photo Attached</Text>
                    </View>
                    <Text style={styles.uploadedFileName} numberOfLines={1}>
                      {formPhotoName || 'passport_photo.jpg'}
                    </Text>
                    <View style={styles.uploadedActionRow}>
                      <TouchableOpacity
                        style={styles.uploadedActionBtn}
                        onPress={handlePickPhoto}
                      >
                        <Ionicons name="camera" size={14} color="#007AFF" />
                        <Text style={styles.uploadedActionText}>Change Photo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.uploadedActionBtn, { borderColor: '#FF3B3040' }]}
                        onPress={() => {
                          setFormPhotoUri(null);
                          setFormPhotoName(null);
                        }}
                      >
                        <Ionicons name="trash-outline" size={14} color="#FF3B30" />
                        <Text style={[styles.uploadedActionText, { color: '#FF3B30' }]}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadDropZone}
                  activeOpacity={0.8}
                  onPress={handlePickPhoto}
                >
                  {isPhotoPickerLoading ? (
                    <ActivityIndicator size="small" color="#007AFF" />
                  ) : (
                    <>
                      <View style={styles.uploadDropIconCircle}>
                        <Ionicons name="camera" size={24} color="#007AFF" />
                      </View>
                      <Text style={styles.uploadDropTitle}>Upload Applicant Passport Photo</Text>
                      <Text style={styles.uploadDropSub}>
                        Tap to choose from Gallery or take with Camera (JPG, PNG)
                      </Text>
                      <View style={styles.uploadDropActionPill}>
                        <Ionicons name="cloud-upload" size={14} color="#007AFF" />
                        <Text style={styles.uploadDropActionText}>Select Photo</Text>
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              )}

              <Text style={[styles.inputLabel, { marginTop: 14 }]}>
                14. GRADUATION DEGREE CERTIFICATE (PDF / SCAN) *
              </Text>
              {formCertUri ? (
                <View style={styles.uploadedDocCard}>
                  <View style={[styles.uploadedDocIconWrap, formCertType === 'pdf' ? { backgroundColor: '#FF3B3015' } : { backgroundColor: '#007AFF15' }]}>
                    <Ionicons
                      name={formCertType === 'pdf' ? 'document-text' : 'image'}
                      size={28}
                      color={formCertType === 'pdf' ? '#FF3B30' : '#007AFF'}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={styles.uploadedStatusPill}>
                      <Ionicons name="checkmark-circle" size={14} color="#34C759" />
                      <Text style={styles.uploadedStatusText}>Document Attached</Text>
                    </View>
                    <Text style={styles.uploadedFileName} numberOfLines={1}>
                      {formCertName || 'degree_certificate.pdf'}
                    </Text>
                    <Text style={styles.uploadedFileSize}>{formCertSize || 'Attached'}</Text>
                    <View style={styles.uploadedActionRow}>
                      <TouchableOpacity
                        style={styles.uploadedActionBtn}
                        onPress={handlePickCertificate}
                      >
                        <Ionicons name="document-attach" size={14} color="#007AFF" />
                        <Text style={styles.uploadedActionText}>Change Document</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.uploadedActionBtn, { borderColor: '#FF3B3040' }]}
                        onPress={() => {
                          setFormCertUri(null);
                          setFormCertName(null);
                          setFormCertSize(null);
                        }}
                      >
                        <Ionicons name="trash-outline" size={14} color="#FF3B30" />
                        <Text style={[styles.uploadedActionText, { color: '#FF3B30' }]}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.uploadDropZone, { borderColor: '#5856D640' }]}
                  activeOpacity={0.8}
                  onPress={handlePickCertificate}
                >
                  {isCertPickerLoading ? (
                    <ActivityIndicator size="small" color="#5856D6" />
                  ) : (
                    <>
                      <View style={[styles.uploadDropIconCircle, { backgroundColor: '#5856D615' }]}>
                        <Ionicons name="document-attach" size={24} color="#5856D6" />
                      </View>
                      <Text style={styles.uploadDropTitle}>Upload Degree / Provisional Certificate</Text>
                      <Text style={styles.uploadDropSub}>
                        Tap to choose PDF document or Degree Certificate scan
                      </Text>
                      <View style={[styles.uploadDropActionPill, { backgroundColor: '#5856D615' }]}>
                        <Ionicons name="folder-open" size={14} color="#5856D6" />
                        <Text style={[styles.uploadDropActionText, { color: '#5856D6' }]}>Browse PDF / Image</Text>
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              )}

              {/* 15. Mobile Number & Email ID */}
              <View style={styles.twoColumnRow}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.inputLabel}>MOBILE NUMBER *</Text>
                  <TextInput
                    style={styles.iosInput}
                    placeholder="+91 98481 XXXXX"
                    placeholderTextColor="#8E8E93"
                    keyboardType="phone-pad"
                    value={formMobile}
                    onChangeText={setFormMobile}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={styles.inputLabel}>EMAIL ADDRESS *</Text>
                  <TextInput
                    style={styles.iosInput}
                    placeholder="graduate@bsptgs.in"
                    placeholderTextColor="#8E8E93"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formEmail}
                    onChangeText={setFormEmail}
                  />
                </View>
              </View>

              {/* Submit Enrollment Button */}
              <TouchableOpacity
                style={styles.submitEnrollmentBtn}
                onPress={handleVerifyAndSubmitGraduateEnrollment}
                disabled={formSubmitting}
              >
                {formSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
                    <Text style={styles.submitEnrollmentBtnText}>
                      Submit Graduate MLC Application
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* 5-Tab Translucent iOS Bottom Tab Bar */}
      <View style={[styles.iosBottomTabBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('home')}
        >
          <Ionicons
            name={activeTab === 'home' ? 'grid' : 'grid-outline'}
            size={22}
            color={activeTab === 'home' ? '#007AFF' : '#8E8E93'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'home' && styles.tabLabelActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('incharges')}
        >
          <Ionicons
            name={activeTab === 'incharges' ? 'people' : 'people-outline'}
            size={22}
            color={activeTab === 'incharges' ? '#007AFF' : '#8E8E93'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'incharges' && styles.tabLabelActive,
            ]}
          >
            Incharges
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('hierarchy')}
        >
          <Ionicons
            name={activeTab === 'hierarchy' ? 'map' : 'map-outline'}
            size={22}
            color={activeTab === 'hierarchy' ? '#007AFF' : '#8E8E93'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'hierarchy' && styles.tabLabelActive,
            ]}
          >
            Hierarchy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setFocusedDistrictProfile(null);
            setActiveTab('districts');
          }}
        >
          <Ionicons
            name={activeTab === 'districts' ? 'analytics' : 'analytics-outline'}
            size={22}
            color={activeTab === 'districts' ? '#007AFF' : '#8E8E93'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'districts' && styles.tabLabelActive,
            ]}
          >
            Districts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('profile')}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person-circle' : 'person-circle-outline'}
            size={24}
            color={activeTab === 'profile' ? '#007AFF' : '#8E8E93'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'profile' && styles.tabLabelActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Edit District Strategy Modal */}
      {editingDistrict && (
        <Modal
          visible={!!editingDistrict}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditingDistrict(null)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalBackdrop}
          >
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle}>
                  Edit {editingDistrict.name} Strategy
                </Text>
                <TouchableOpacity onPress={() => setEditingDistrict(null)}>
                  <Ionicons name="close-circle" size={24} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>DISTRICT INCHARGE NAME</Text>
              <TextInput
                style={styles.iosInput}
                value={editInchargeName}
                onChangeText={setEditInchargeName}
              />

              <Text style={styles.inputLabel}>INCHARGE CONTACT PHONE</Text>
              <TextInput
                style={styles.iosInput}
                value={editInchargePhone}
                onChangeText={setEditInchargePhone}
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>STRATEGIC ACTION PLAN</Text>
              <TextInput
                style={[styles.iosInput, { height: 100, textAlignVertical: 'top', paddingTop: 10 }]}
                value={editActionPlanText}
                onChangeText={setEditActionPlanText}
                multiline
              />

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#E5E5EA' }]}
                  onPress={() => setEditingDistrict(null)}
                >
                  <Text style={[styles.modalBtnText, { color: '#1C1C1E' }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#007AFF' }]}
                  onPress={handleSaveDistrictEdits}
                >
                  <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Save Strategy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}

      {/* District Picker Modal */}
      {isDistrictPickerOpen && (
        <Modal
          visible={isDistrictPickerOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsDistrictPickerOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { maxHeight: '80%' }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle}>Select Assigned District</Text>
                <TouchableOpacity onPress={() => setIsDistrictPickerOpen(false)}>
                  <Ionicons name="close-circle" size={24} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {districtsData.map((d) => (
                  <TouchableOpacity
                    key={d.id}
                    style={[
                      styles.districtOptionRow,
                      (isEnrollmentModalVisible ? formDistrict : profileDistrict) === d.name && styles.districtOptionSelected,
                    ]}
                    onPress={() => {
                      if (isEnrollmentModalVisible) {
                        setFormDistrict(d.name);
                      } else {
                        setProfileDistrict(d.name);
                      }
                      setIsDistrictPickerOpen(false);
                    }}
                  >
                    <Text style={styles.districtOptionText}>
                      {d.name} ({d.zone})
                    </Text>
                    {(isEnrollmentModalVisible ? formDistrict : profileDistrict) === d.name && (
                      <Ionicons name="checkmark" size={18} color="#007AFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

// ============================================================================
// 4. APPLE iOS 18 CUPERTINO STYLESHEET
// ============================================================================
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  authSafeContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  toastBanner: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  toastBannerText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  authHeaderBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  authLogoCircle: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  authAppTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.3,
  },
  authAppSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 6,
    marginTop: 10,
    letterSpacing: 0.6,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
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
  iosInput: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 15,
    color: '#1C1C1E',
    marginBottom: 6,
  },
  primaryAuthButton: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryAuthButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  switchAuthModeBtn: {
    alignItems: 'center',
    marginTop: 16,
  },
  switchAuthModeText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 14,
  },
  liveSyncBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  syncStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  iosSubHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.7,
  },
  iosLargeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
    marginTop: 2,
    letterSpacing: -0.5,
  },
  topProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  topProfileImg: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  topProfileName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  topProfileSub: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: '600',
  },

  // WIKIPEDIA INSTANT SEARCH STYLES
  wikiSearchWrapper: {
    marginBottom: 14,
    zIndex: 99,
  },
  wikiSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  wikiSearchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#1C1C1E',
  },
  wikiDropdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  wikiDropdownHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  wikiDropdownHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8E8E93',
    letterSpacing: 0.6,
  },
  wikiCloseHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007AFF',
  },
  wikiResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  wikiBadge: {
    backgroundColor: '#007AFF15',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  wikiBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#007AFF',
  },
  wikiResultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  wikiResultSub: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },

  // CREATE GRADUATE ENROLLMENT BANNER
  createEnrollmentBanner: {
    backgroundColor: '#34C759',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  createEnrollmentIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createEnrollmentTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  createEnrollmentSub: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 11,
    marginTop: 2,
  },

  heroGradientCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 4,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  heroLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  heroSyncSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    marginTop: 1,
  },
  heroRefreshBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  heroMetricBox: {
    alignItems: 'center',
    flex: 1,
  },
  heroMetricValue: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroMetricSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  heroDivider: {
    width: 1,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 10,
    marginTop: 6,
    letterSpacing: 0.6,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  kpiCard: {
    width: '48.2%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  kpiIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  kpiNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.3,
  },
  kpiTitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    lineHeight: 16,
  },
  queueHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  smallFilterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#E5E5EA',
  },
  smallFilterPillActive: {
    backgroundColor: '#007AFF',
  },
  smallFilterText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#636366',
  },
  smallFilterTextActive: {
    color: '#FFFFFF',
  },
  enrollmentRowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  applicantName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  bulkTag: {
    backgroundColor: '#5856D618',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bulkTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#5856D6',
  },
  applicantSub: {
    fontSize: 12,
    color: '#636366',
    marginTop: 2,
  },
  applicantMeta: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  enrolledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C75918',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  enrolledBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#28A745',
  },
  verifyNowBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  verifyNowBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  iosSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 12,
  },
  iosSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1C1C1E',
  },
  breadcrumbBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 14,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  breadcrumbText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '600',
  },
  breadcrumbActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
  iosLeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  compactLeaderCard: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 14,
  },
  leaderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E5EA',
  },
  compactLeaderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  subCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  leaderNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
    marginTop: 2,
  },
  phoneText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  contactButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  contactBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  mapCanvasCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  mapTapHint: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
  },
  mapLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  geoZoneContainer: {
    marginBottom: 16,
    backgroundColor: '#F9F9FB',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  geoZoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  geoZoneTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#636366',
    letterSpacing: 0.6,
  },
  geoZoneBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
  },
  mapTilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mapDistrictTile: {
    width: '31.5%',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 8,
    marginBottom: 8,
  },
  mapTileTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapTileCode: {
    fontSize: 13,
    fontWeight: '900',
  },
  mapTileScore: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3A3A3C',
  },
  mapTileName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 4,
  },
  mapTileMeta: {
    fontSize: 9,
    color: '#636366',
    marginTop: 2,
  },
  treeContainerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  treeRootNode: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  treeRootTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  treeRootSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 2,
  },
  treeConnectorLine: {
    width: 2,
    height: 16,
    backgroundColor: '#007AFF',
    marginLeft: 24,
  },
  treeBranchWrapper: {
    marginBottom: 10,
  },
  treeBranchCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 4,
  },
  treeBranchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  treeBranchTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  treeBranchLeader: {
    fontSize: 12,
    color: '#3A3A3C',
    marginTop: 2,
  },
  treeJumpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  treeJumpText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
  },
  treeBranchMeta: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 6,
  },
  treeExpandedBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 10,
    marginTop: 6,
    marginLeft: 12,
  },
  treeExpandedTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8E8E93',
    marginBottom: 8,
  },
  treeChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  treeConstituencyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5856D615',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  treeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5856D6',
  },
  treeOpenFullBtn: {
    marginTop: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  treeOpenFullBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
  },
  detailBackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  backButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    marginLeft: 2,
  },
  backMapChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  backMapChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007AFF',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  profileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileDistrictTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  profileInchargeSub: {
    fontSize: 12,
    color: '#636366',
    marginTop: 3,
  },
  strengthBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  strengthBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  profileStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  profileStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  profileStatNum: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  profileStatLabel: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  actionPlanBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFE58F',
  },
  actionPlanTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B25E09',
  },
  actionPlanDesc: {
    fontSize: 13,
    color: '#4A3B00',
    marginTop: 4,
    lineHeight: 18,
  },
  editPlanChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#007AFF40',
  },
  editPlanChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
  },

  // USER PROFILE STYLES
  profileHeroBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
  },
  largeProfileAvatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  cameraBadgeCircle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileHeroName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1C1E',
    marginTop: 10,
  },
  profileHeroRole: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  avatarPresetRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    marginBottom: 12,
  },
  avatarThumbWrap: {
    padding: 2,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarThumbActive: {
    borderColor: '#007AFF',
  },
  avatarThumb: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  customUrlRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 8,
    alignItems: 'center',
  },
  applyUrlBtn: {
    backgroundColor: '#007AFF',
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  applyUrlBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  districtSelectorBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 6,
  },
  districtSelectorText: {
    fontSize: 15,
    color: '#1C1C1E',
  },
  saveSettingsBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveSettingsBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  prefToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  prefTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  prefSub: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  signOutFullBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF3B3030',
  },
  signOutFullBtnText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '800',
  },
  iosBottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#007AFF',
    fontWeight: '700',
  },

  // MODAL STYLES
  modalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalSubHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#007AFF',
    letterSpacing: 0.6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1E',
    marginTop: 2,
  },
  constituencySelectorWrap: {
    gap: 6,
    marginBottom: 8,
  },
  gcOptionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  gcOptionPillActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF08',
  },
  gcOptionPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  gcOptionPillTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderRow: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    padding: 3,
    height: 46,
    alignItems: 'center',
  },
  genderBtn: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  genderBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  genderBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636366',
  },
  genderBtnTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
  uploadedDocCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34C75940',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  uploadedPhotoPreview: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: '#E5E5EA',
    borderWidth: 2,
    borderColor: '#34C759',
  },
  uploadedDocIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34C75915',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 4,
  },
  uploadedStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#28A745',
  },
  uploadedFileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  uploadedFileSize: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  uploadedActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  uploadedActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  uploadedActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
  },
  uploadDropZone: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#007AFF40',
    borderStyle: 'dashed',
    marginBottom: 6,
  },
  uploadDropIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#007AFF15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadDropTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  uploadDropSub: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 3,
    textAlign: 'center',
    marginBottom: 10,
  },
  uploadDropActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#007AFF15',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  uploadDropActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#007AFF',
  },
  submitEnrollmentBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitEnrollmentBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  // DIALOG MODAL STYLES
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  districtOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  districtOptionSelected: {
    backgroundColor: '#007AFF08',
  },
  districtOptionText: {
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '500',
  },
});
