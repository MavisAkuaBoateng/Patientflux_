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

    // 🔍 Decide whether to hit /api/query (DB) or /api/chat (LLM)
    const isDBQuery = /\b(patients?|queue|doctor|department|wait time|blockchain)\b/i.test(query);
    const endpoint = isDBQuery ? '/api/query' : '/api/chat';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Failed to process query' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Input + button */}
          <div className="card p-4">
            <label className="label">Natural-language query</label>
            <input
              className="input mb-3 w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="btn"
              onClick={runQuery}
              disabled={loading}
            >
              {loading ? 'Running...' : 'Run Query'}
            </button>
          </div>

          {/* Database table results */}
          {result?.rows && (
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-2">Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(result.rows[0] || {}).map((k) => (
                        <th
                          key={k}
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {result.rows.map((row: any, idx: number) => (
                      <tr key={idx}>
                        {Object.values(row).map((v: any, i: number) => (
                          <td key={i} className="px-3 py-2 whitespace-nowrap">
                            {String(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Chat answer */}
          {result?.text && (
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-2">Answer</h3>
              <p>{result.text}</p>
            </div>
          )}

          {/* Error */}
          {result?.error && (
            <div className="card p-4 text-red-600">
              {result.error}
            </div>
          )}
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-4">
          <AnalyticsWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}
