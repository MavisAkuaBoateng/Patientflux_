import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AnalyticsWidget from '../components/AnalyticsWidget';

export default function AdminDashboard() {
  const [query, setQuery] = useState("Show today's high-risk patients");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function runQuery() {
    setLoading(true);
    setResult(null);
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-4">
            <label className="label">Natural-language query</label>
            <input className="input mb-3" value={query} onChange={(e) => setQuery(e.target.value)} />
            <button className="btn" onClick={runQuery} disabled={loading}>{loading ? 'Running...' : 'Run Query'}</button>
          </div>

          {result?.rows && (
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-2">Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(result.rows[0] || {}).map((k) => (
                        <th key={k} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{k}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {result.rows.map((row: any, idx: number) => (
                      <tr key={idx}>
                        {Object.values(row).map((v: any, i: number) => (
                          <td key={i} className="px-3 py-2 whitespace-nowrap">{String(v)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <AnalyticsWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}