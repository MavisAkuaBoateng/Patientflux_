import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AnalyticsWidget() {
  const [todayTotal, setTodayTotal] = useState(0);
  const [todayHighRisk, setTodayHighRisk] = useState(0);

  useEffect(() => {
    const load = async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const { count: total } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString());
      const { count: high } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfDay.toISOString())
        .eq('high_risk', true);
      setTodayTotal(total || 0);
      setTodayHighRisk(high || 0);
    };
    load();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="card p-4">
        <p className="text-sm text-gray-600">Patients Today</p>
        <p className="text-2xl font-bold">{todayTotal}</p>
      </div>
      <div className="card p-4">
        <p className="text-sm text-gray-600">High-Risk Today</p>
        <p className="text-2xl font-bold text-red-600">{todayHighRisk}</p>
      </div>
    </div>
  );
}