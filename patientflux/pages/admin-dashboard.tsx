import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AnalyticsWidget from '../components/AnalyticsWidget';

export default function AdminDashboard() {
  const [query, setQuery] = useState("Show today's high-risk patients");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"db" | "chat">("db"); // NEW toggle state

  async function runQuery() {
    setLoading(true);
    setResult(null);

    const endpoint = mode === "db" ? "/api/query" : "/api/chat";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error running query:", err);
      setResult({ error: "Something went wrong. Try again." });
    }

    setLoading(false);
  }

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-4">
            <label className="label">Natural-language query</label>
            <input
              className="input mb-3"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* Mode toggle */}
            <div className="flex items-center space-x-4 mb-3">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="db"
                  checked={mode === "db"}
                  onChange={() => setMode("db")}
                />
                <span>Database Query</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="chat"
                  checked={mode === "chat"}
                  onChange={() => setMode("chat")}
                />
                <span>General Q&A</span>
              </label>
            </div>

            <button
              className="btn"
              onClick={runQuery}
              disabled={loading}
            >
              {loading ? "Running..." : "Run Query"}
            </button>
          </div>

          {/* Database table results */}
          {mode === "db" && result?.rows && (
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
                          <td
                            key={i}
                            className="px-3 py-2 whitespace-nowrap"
                          >
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

          {/* General Q&A answer */}
          {mode === "chat" && result?.text && (
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-2">Answer</h3>
              <p>{result.text}</p>
            </div>
          )}

          {/* Errors */}
          {result?.error && (
            <div className="card p-4 text-red-600">
              <h3 className="text-lg font-semibold mb-2">Error</h3>
              <p>{result.error}</p>
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
