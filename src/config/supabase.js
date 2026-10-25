import { createClient } from '@supabase/supabase-js';

// ============================================================================
// SUPABASE CONFIGURATION
// Project URL: https://apibdsfzrdfszamphvfn.supabase.co
// ============================================================================
export const SUPABASE_URL = 'https://apibdsfzrdfszamphvfn.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWJkc2Z6cmRmc3phbXBodmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NjcxMDUsImV4cCI6MjEwODQ0MzEwNX0.CYt3AV7Waup5_LIGt6Mz3CulxGFgOr7TpFOa5rddALs';

export const supabase =
  SUPABASE_URL.startsWith('http') && !SUPABASE_URL.includes('YOUR_PROJECT_ID')
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: false,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      })
    : null;

/**
 * Fetch executive dashboard metric counts from Supabase
 */
export async function fetchDashboardCounts() {
  if (!supabase) return null;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayIso = today.toISOString();

    const [
      { count: totalCount, error: errTotal },
      { count: enrolledCount, error: errEnrolled },
      { count: pendingCount, error: errPending },
      { count: todayCount, error: errToday },
      { count: bulkTodayCount, error: errBulkToday },
    ] = await Promise.all([
      supabase.from('enrollments').select('*', { count: 'exact', head: true }),
      supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'enrolled'),
      supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayIso),
      supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('is_bulk', true)
        .gte('created_at', todayIso),
    ]);

    if (errTotal) throw errTotal;

    return {
      totalWhatsappBot: totalCount ?? 0,
      mlcEnrolledPeople: enrolledCount ?? 0,
      pendingPeople: pendingCount ?? 0,
      todayEnrollments: todayCount ?? 0,
      bulkTodayEnrollments: bulkTodayCount ?? 0,
      totalMembers: (totalCount ?? 0) + 15200, // baseline cumulative member database
    };
  } catch (error) {
    console.warn('Supabase fetch counts warning:', error.message);
    return null;
  }
}

/**
 * Fetch enrollments with filtering and optional search
 */
export async function fetchEnrollmentsList({ status = 'all', search = '', limit = 50 } = {}) {
  if (!supabase) return null;

  try {
    let query = supabase
      .from('enrollments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status === 'enrolled') {
      query = query.eq('status', 'enrolled');
    } else if (status === 'pending') {
      query = query.eq('status', 'pending');
    } else if (status === 'bulk') {
      query = query.eq('is_bulk', true);
    }

    if (search && search.trim().length > 0) {
      const term = search.trim();
      query = query.or(
        `full_name.ilike.%${term}%,phone.ilike.%${term}%,district.ilike.%${term}%,constituency.ilike.%${term}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.warn('Supabase fetch enrollments warning:', error.message);
    return null;
  }
}

/**
 * Mark a pending application as MLC Enrolled
 */
export async function updateEnrollmentStatus(id, operatorName = 'Online Team (Verified)') {
  if (!supabase) return { success: true };

  try {
    const { data, error } = await supabase
      .from('enrollments')
      .update({
        status: 'enrolled',
        operator: operatorName,
        enrolled_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating enrollment status:', error);
    return { success: false, error };
  }
}

/**
 * Insert a new enrollment (manual registration from mobile app)
 */
export async function createEnrollment(record) {
  if (!supabase) return { success: true, data: record };

  try {
    const { data, error } = await supabase
      .from('enrollments')
      .insert([
        {
          full_name: record.full_name,
          phone: record.phone,
          district: record.district,
          constituency: record.constituency,
          mandal: record.mandal || '',
          village: record.village || '',
          status: record.status || 'pending',
          is_bulk: Boolean(record.is_bulk),
          operator: record.operator || 'Employee App',
          notes: record.notes || '',
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error inserting enrollment:', error);
    return { success: false, error };
  }
}
