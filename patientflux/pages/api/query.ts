import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: 'Missing query' });

  const q = String(query || '').trim().toLowerCase();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  try {
    // High-risk patients today
    if (q.includes('high-risk') && q.includes('today')) {
      const { data, error } = await supabaseAdmin
        .from('patients')
        .select('patient_id, name, department, visit_type, created_at')
        .gte('created_at', startOfDay.toISOString())
        .eq('high_risk', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const summary = data.length
        ? `There are ${data.length} high-risk patients today: ${data.map((p) => p.name).join(', ')}.`
        : 'No high-risk patients registered today.';

      return res.status(200).json({ rows: data, summary });
    }

    // Queue by department
    if ((q.includes('queue') || q.includes('waiting')) && q.includes('department')) {
      const { data, error } = await supabaseAdmin
        .from('patients')
        .select('department, status')
        .eq('status', 'waiting');

      if (error) throw error;

      const counts: Record<string, number> = {};
      (data || []).forEach((r) => {
        counts[r.department] = (counts[r.department] || 0) + 1;
      });

      const rows = Object.entries(counts).map(([department, count]) => ({ department, count }));
      const summary = rows.length
        ? 'Current waiting patients by department: ' + rows.map(r => `${r.department}: ${r.count}`).join(', ')
        : 'No patients are currently waiting.';
// Fallback: if no rule matched and query is unrecognized
return res.status(400).json({
  error: "unrecognized_query",
  message: "Query not understood, try chat fallback"
});

      return res.status(200).json({ rows, summary });
    }

    // Average wait time by department
    if (q.includes('average') && q.includes('wait')) {
      const { data, error } = await supabaseAdmin
        .from('patients')
        .select('department, created_at, seen_at')
        .gte('created_at', startOfDay.toISOString());

      if (error) throw error;

      const totalTimes: Record<string, number> = {};
      const counts: Record<string, number> = {};

      (data || []).forEach((r) => {
        if (r.seen_at) {
          const diffMs = new Date(r.seen_at).getTime() - new Date(r.created_at).getTime();
          totalTimes[r.department] = (totalTimes[r.department] || 0) + diffMs;
          counts[r.department] = (counts[r.department] || 0) + 1;
        }
      });

      const rows = Object.entries(totalTimes).map(([dept, totalMs]) => ({
        department: dept,
        avgWaitMinutes: Math.round(totalMs / counts[dept] / 60000),
      }));

      const summary = rows.length
        ? 'Average wait time by department: ' + rows.map(r => `${r.department}: ${r.avgWaitMinutes} min`).join(', ')
        : 'No completed visits today to calculate wait times.';

      return res.status(200).json({ rows, summary });
    }

    // Default: all patients today
    const { data, error } = await supabaseAdmin
      .from('patients')
      .select('patient_id, name, department, visit_type, high_risk, created_at')
      .gte('created_at', startOfDay.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    const summary = data.length
      ? `Total patients registered today: ${data.length}.`
      : 'No patients registered today.';

    return res.status(200).json({ rows: data, summary });

  } catch (err: any) {
    console.error('Supabase query failed:', err.message || err);
    return res.status(500).json({ error: 'Server error', summary: 'Query failed due to server error.' });
  }
}
