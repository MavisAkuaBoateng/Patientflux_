export function RoleBadge({ label, tone = 'default' }: { label: string; tone?: 'default' | 'danger' | 'success' }) {
  const toneClasses =
    tone === 'danger' ? 'bg-red-100 text-red-800' : tone === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  return <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${toneClasses}`}>{label}</span>;
}