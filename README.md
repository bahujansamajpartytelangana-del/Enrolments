# MLC Enrollment Tracking & Telangana Political Hierarchy System
### Flagship Executive React Native (Expo) iOS/Android Application

An ultra-premium executive mobile application designed according to **Apple Human Interface Guidelines (iOS 18 Cupertino Design)** and powered by **Supabase Real-Time Database**.

---

## 🔒 Authentication & Access Control

### 1. Three Role Access Portals
- **Master Admin Portal:** Full unrestricted command access to oversee all 33 districts, manage 119 assembly constituencies, verify pending enrollments, and update strategic action plans.
- **Employee / Operator Portal:** Inflow document verification desk, manual voter entry, and quick review stream.
- **Incharge / Public Portal:** Field leaders directory, voter strength metrics, and direct communication lines.

### 2. Hardcoded Master Admin Credentials
- **Email:** `admin@bsptgs.in`
- **Password:** `Simon@bsptgs`
- *Note:* Also fully compatible with `supabase.auth.signInWithPassword` and self-registration via the built-in **"Create Account"** sign-up mode.

---

## 🏛 5-Level Telangana State Political Hierarchy

Fully structured across all official **33 Districts** and **119 Assembly Constituencies** of Telangana State:

1. **Level 1: State Headquarters (Telangana State Command)**
   - State Chief Coordinator & MLC Campaign Head: **Ibrahim Sekhar** (`+919848000001`)
   - State Digital & Operations Head: **Simon** (`+919848000002`)
   - Overview of all 33 Districts & 119 Assembly Constituencies.
2. **Level 2: All 33 Official Districts of Telangana**
   - Adilabad, Bhadradri Kothagudem, Hanumakonda, Hyderabad, Jagtial, Jangaon, Jayashankar Bhupalpally, Jogulamba Gadwal, Kamareddy, Karimnagar, Khammam, Kumuram Bheem Asifabad, Mahabubabad, Mahabubnagar, Mancherial, Medak, Medchal-Malkajgiri, Mulugu, Nagarkurnool, Nalgonda, Narayanpet, Nirmal, Nizamabad, Peddapalli, Rajanna Sircilla, Rangareddy, Sangareddy, Siddipet, Suryapet, Vikarabad, Wanaparthy, Warangal, and Yadadri Bhuvanagiri.
3. **Level 3: All 119 Assembly Constituencies**
   - Mapped to their respective districts with designated Constituency Incharge photos, designations, and contact numbers.
4. **Level 4: Mandals & Urban Divisions**
   - Urban and rural mandal in-charge leadership.
5. **Level 5: Village & Ward Grama Committees**
   - Ground-level booth and village committee leaders.
- **Direct Communications:** One-tap native dialing (`tel:`) and instant WhatsApp chat (`https://wa.me/`) on every leader card.
- **Interactive iOS Breadcrumb Trail:** `Telangana State (33) > District > Constituency > Mandal > Village` with one-tap jump navigation.

---

## 📊 Modules & Key Features

### Module 1: Home (Executive Dashboard)
- **Executive Header:** Logged-in role badge (`MASTER ADMIN` / `OPERATOR`), Live Supabase Sync indicator, and Quick Logout button.
- **Hero Today & Bulk Today Card:** Live 24-hour incoming enrollment metrics.
- **4 Core KPI Cards (2x2 Grid):**
  1. Total WhatsApp Bot Enrollments
  2. Enrolled People (MLC Online Completed)
  3. Pending People (WhatsApp Bot Inflow)
  4. Total Members Database Strength
- **Live WhatsApp Bot Stream:** Filterable stream (`ALL`, `ENROLLED`, `PENDING`) with real-time `Mark Enrolled` toggle and `Add Manual Enrollment` modal.

### Module 2: Incharges (Leadership Directory)
- 5-tier drill-down hierarchy from State to Village.
- Global search by leader name, mobile number, district, or constituency.
- Instant Call and WhatsApp integration.

### Module 3: District Profiles (Strength & Action Plan Strategy)
- Filter districts by health rating: `ALL`, `STRONG` (Green), `MODERATE` (Orange), `WEAK` (Red).
- Enrollment conversion progress bar.
- Constituency strength badges.
- **Strategic Action Plan ("What Needs To Be Done"):** Viewable and editable action plan items with instant save.

---

## ⚡ Supabase Configuration

- **Project URL:** `https://apibdsfzrdfszamphvfn.supabase.co`
- **Real-Time Replication:** Subscribed to `postgres_changes` on the `enrollments` table for live feed and metric updates.
- **Schema:** Defined in [`schema.sql`](file:///d:/Next%20Js%20Projects/Mobile%20Application/schema.sql) with full RLS policies and performance indexing.

---

## 🚀 Running the App

```bash
# Run web preview
npm run web

# Start Expo dev server for iOS / Android (Expo Go)
npx expo start
```
