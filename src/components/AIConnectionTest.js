import { useState } from 'react';

export default function AIConnectionTest() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    if (!query.trim()) {
      setStatus('⚠️ Please enter a query to test.');
      return;
    }

    setLoading(true);
    setStatus('');
    setRows([]);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const err = await response.json();
        setStatus(`❌ Connection failed: ${err.error || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      const data = await response.json();

      setRows(data.rows || []);
      setStatus(data.summary || '✅ AI connection successful!');
    } catch (err) {
      setStatus(`❌ Connection failed: ${err.message || 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-gray-50 max-w-xl mx-auto mt-4">
      <h2 className="text-lg font-semibold mb-2">AI Query Test</h2>

      <input
        type="text"
        placeholder="Enter query (e.g., 'high-risk today')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      <button
        onClick={handleTest}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Run Query'}
      </button>

      {status && (
        <p className={`mt-2 ${status.startsWith('❌') ? 'text-red-600' : 'text-green-600'}`}>
          {status}
        </p>
      )}

      {rows.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(rows[0]).map((key) => (
                  <th key={key} className="border px-2 py-1 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="even:bg-gray-50">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="border px-2 py-1">
                      {val?.toString() || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
