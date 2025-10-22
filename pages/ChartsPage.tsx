
import React from 'react';
import { useData } from '../context/DataContext';
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { INJECTION_SITES } from '../constants';

const ChartsPage: React.FC = () => {
  const { weights, injections, sideEffects, theme } = useData();

  const weightChartData = useMemo(() => {
    return [...weights]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(w => ({ date: w.date, Вес: w.weight }));
  }, [weights]);

  const doseChartData = useMemo(() => {
    return [...injections]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(i => ({ date: i.date, Доза: i.dose }));
  }, [injections]);

  const sideEffectFrequencyData = useMemo(() => {
    const weeklyCounts: { [week: string]: number } = {};
    sideEffects.forEach(se => {
        const date = new Date(se.date);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        const weekKey = weekStart.toISOString().split('T')[0];
        weeklyCounts[weekKey] = (weeklyCounts[weekKey] || 0) + 1;
    });
    return Object.entries(weeklyCounts)
        .map(([date, count]) => ({ date, 'Количество': count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [sideEffects]);

  const injectionSiteData = useMemo(() => {
    const counts = {
      abdomen_left: 0,
      abdomen_right: 0,
      arm_left: 0,
      arm_right: 0,
    };
    injections.forEach(i => {
      counts[i.site]++;
    });
    return Object.entries(counts).map(([site, count]) => ({
      name: INJECTION_SITES[site as keyof typeof INJECTION_SITES],
      'Количество': count
    }));
  }, [injections]);
  
  const tickColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

  const ChartWrapper: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div className="bg-card dark:bg-gray-800 rounded-xl p-4 shadow space-y-3">
        <h2 className="text-xl font-bold">{title}</h2>
        <div style={{ width: '100%', height: 300 }}>
            {children}
        </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Графики и аналитика</h1>

      <ChartWrapper title="Динамика веса">
        <ResponsiveContainer>
          <LineChart data={weightChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: tickColor }} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 12, fill: tickColor }} />
            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: `1px solid ${gridColor}` }} />
            <Legend wrapperStyle={{color: tickColor}} />
            <Line type="monotone" dataKey="Вес" stroke={theme === 'dark' ? '#22c55e' : '#34c759'} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper title="Динамика дозирования">
        <ResponsiveContainer>
          <LineChart data={doseChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: tickColor }} />
            <YAxis tick={{ fontSize: 12, fill: tickColor }} />
            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: `1px solid ${gridColor}` }} />
            <Legend wrapperStyle={{color: tickColor}} />
            <Line type="monotone" dataKey="Доза" stroke={theme === 'dark' ? '#3b82f6' : '#007aff'} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
      
      <ChartWrapper title="Частота побочных эффектов (по неделям)">
        <ResponsiveContainer>
            <BarChart data={sideEffectFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: tickColor }} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: `1px solid ${gridColor}` }} />
              <Legend wrapperStyle={{color: tickColor}} />
              <Bar dataKey="Количество" fill={theme === 'dark' ? '#f87171' : '#ef4444'} />
            </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>

      <ChartWrapper title="Частота использования мест инъекций">
        <ResponsiveContainer>
          <BarChart data={injectionSiteData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis type="number" tick={{ fontSize: 12, fill: tickColor }} />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12, fill: tickColor }} />
            <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', border: `1px solid ${gridColor}` }} />
            <Legend wrapperStyle={{color: tickColor}} />
            <Bar dataKey="Количество" fill={theme === 'dark' ? '#fb923c' : '#ff9500'} />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </div>
  );
};

export default ChartsPage;