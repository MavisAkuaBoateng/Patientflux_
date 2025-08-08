import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { DEPARTMENTS } from '../lib/constants';
import { RoleBadge } from './RoleBadge';

export type Patient = {
  id: string;
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  department: string;
  visit_type: string;
  symptoms: string;
  high_risk: boolean;
  priority_tag: string;
  status: string;
  created_at: string;
};

export default function QueueList({ defaultDepartment }: { defaultDepartment?: string }) {
  const [department, setDepartment] = useState<string>(defaultDepartment || 'All');
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchPatients = async () => {
      const { data } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: true });
      setPatients(data || []);
    };
    fetchPatients();

    // Subscribe to realtime inserts/updates/deletes
    const channel = supabase
      .channel('public:patients')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, (payload: any) => {
        setPatients((prev) => {
          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            return prev.filter((p) => p.id !== deletedId);
          }
          const row = payload.new as Patient;
          const existingIdx = prev.findIndex((p) => p.id === row.id);
          if (existingIdx >= 0) {
            const updated = [...prev];
            updated[existingIdx] = row;
            return updated.sort((a, b) => a.created_at.localeCompare(b.created_at));
          }
          return [...prev, row].sort((a, b) => a.created_at.localeCompare(b.created_at));
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    return department === 'All' ? patients : patients.filter((p) => p.department === department);
  }, [patients, department]);

  function queuePosition(p: Patient) {
    const inDept = patients.filter((x) => x.department === p.department && x.status === 'waiting');
    return inDept.findIndex((x) => x.id === p.id) + 1;
  }

  return (
    <div className="card p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold">Real-Time Queue</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm">Department:</label>
          <select className="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option>All</option>
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Type</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap font-mono">{queuePosition(p)}</td>
                <td className="px-3 py-2 whitespace-nowrap">{p.name}</td>
                <td className="px-3 py-2 whitespace-nowrap text-gray-600">{p.department}</td>
                <td className="px-3 py-2 whitespace-nowrap">{p.visit_type}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {p.high_risk ? <RoleBadge label="High-Risk" tone="danger" /> : <RoleBadge label="Normal" />}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <RoleBadge label={p.status} tone={p.status === 'waiting' ? 'default' : 'success'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}