import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: 'Missing query' });

  const q = String(query).toLowerCase();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  // Heuristic: support a few common admin queries for MVP
  if (q.includes('high-risk') && q.includes("today")) {
    const { data, error } = await supabaseAdmin
      .from('patients')
      .select('patient_id, name, department, visit_type, created_at')
      .gte('created_at', startOfDay.toISOString())
      .eq('high_risk', true)
      .order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ rows: data });
  }

  if ((q.includes('queue') || q.includes('waiting')) && q.includes('by department')) {
    const { data, error } = await supabaseAdmin
      .from('patients')
      .select('department, status')
      .eq('status', 'waiting');
    if (error) return res.status(500).json({ error: error.message });
    const counts: Record<string, number> = {};
    (data || []).forEach((r) => {
      counts[r.department] = (counts[r.department] || 0) + 1;
    });
    const rows = Object.entries(counts).map(([department, count]) => ({ department, count }));
    return res.status(200).json({ rows });
  }

  // Default: return today's patients basic list
  const { data, error } = await supabaseAdmin
    .from('patients')
    .select('patient_id, name, department, visit_type, high_risk, created_at')
    .gte('created_at', startOfDay.toISOString())
    .order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ rows: data });
}