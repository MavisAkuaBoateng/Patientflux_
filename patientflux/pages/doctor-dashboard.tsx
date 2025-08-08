import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { supabase } from '../lib/supabaseClient';
import { DEPARTMENTS } from '../lib/constants';
import type { Patient } from '../components/QueueList';
import { RoleBadge } from '../components/RoleBadge';

export default function DoctorDashboard() {
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [triageResult, setTriageResult] = useState<Record<string, any>>({});

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('patients')
        .select('*')
        .eq('department', department)
        .eq('status', 'waiting')
        .order('created_at', { ascending: true });
      setPatients(data || []);
    };
    load();
  }, [department]);

  async function runTriage(p: Patient) {
    setTriageResult((prev) => ({ ...prev, [p.id]: { loading: true } }));
    const res = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms: p.symptoms }),
    });
    const data = await res.json();
    setTriageResult((prev) => ({ ...prev, [p.id]: data }));
  }

  const display = useMemo(() => patients, [patients]);

  return (
    <DashboardLayout title="Doctor Dashboard">
      <div className="flex items-center gap-3 mb-4">
        <label>Department</label>
        <select className="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
          {DEPARTMENTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="card p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symptoms</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {display.map((p) => (
              <tr key={p.id}>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">{p.high_risk ? <RoleBadge label="High-Risk" tone="danger" /> : <RoleBadge label="Normal" />}</td>
                <td className="px-3 py-2 text-gray-600 max-w-xl">{p.symptoms}</td>
                <td className="px-3 py-2 text-right">
                  <button className="btn" onClick={() => runTriage(p)} disabled={!!triageResult[p.id]?.loading}>AI Triage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {Object.entries(triageResult).map(([id, res]: any) => (
        res?.urgency && (
          <div key={id} className="mt-4 p-4 border rounded bg-blue-50">
            <p className="font-semibold">AI Triage Result</p>
            <p>Urgency: <span className="font-bold capitalize">{res.urgency}</span></p>
            <p>Next Step: {res.nextStep}</p>
          </div>
        )
      ))}
    </DashboardLayout>
  );
}