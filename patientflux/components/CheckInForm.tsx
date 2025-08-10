import { useState } from 'react';
import { DEPARTMENTS, VISIT_TYPES } from '../lib/constants';

export type CheckInPayload = {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  department: string;
  visitType: string;
  symptoms: string;
  highRiskFlag: boolean;
};

export default function CheckInForm() {
  const [form, setForm] = useState<CheckInPayload>({
    name: '',
    age: 0,
    gender: 'Male',
    department: DEPARTMENTS[0],
    visitType: VISIT_TYPES[0],
    symptoms: '',
    highRiskFlag: false,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to check in');
      setResult(data);
      setForm({ ...form, name: '', age: 0, symptoms: '', highRiskFlag: false });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Mobile / QR Check-In</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <label className="label">Age</label>
          <input type="number" className="input" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} required min={0} />
        </div>
        <div>
          <label className="label">Gender</label>
          <select className="select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as any })}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="label">Department</label>
          <select className="select" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
            {DEPARTMENTS.map((dep) => (
              <option key={dep}>{dep}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Visit Type</label>
          <select className="select" value={form.visitType} onChange={(e) => setForm({ ...form, visitType: e.target.value })}>
            {VISIT_TYPES.map((vt) => (
              <option key={vt}>{vt}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="label">Symptoms</label>
          <textarea className="textarea" rows={3} value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} required />
        </div>
        <div className="flex items-center gap-2">
          <input id="highRisk" type="checkbox" checked={form.highRiskFlag} onChange={(e) => setForm({ ...form, highRiskFlag: e.target.checked })} />
          <label htmlFor="highRisk" className="text-sm">High-Risk Flag</label>
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="btn" disabled={loading}>{loading ? 'Submitting...' : 'Check In'}</button>
        </div>
      </form>

      {result?.patient && (
        <div className="mt-4 p-4 border rounded bg-green-50">
          <p className="font-semibold">Checked in successfully.</p>
          <p>Patient ID: <span className="font-mono">{result.patient.patient_id}</span></p>
          <p>Priority: {result.patient.priority_tag}</p>
        </div>
      )}
    </div>
  );
}