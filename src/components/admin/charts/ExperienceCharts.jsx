import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SATISFACTION_COLORS = { 'Sangat Puas': '#10B981', 'Puas': '#0EA5E9', 'Cukup': '#F59E0B', 'Kurang Puas': '#EF4444' };
const REVISIT_COLORS = { 'Ya': '#10B981', 'Mungkin': '#F59E0B', 'Tidak': '#EF4444' };

const ChartCard = ({ title, subtitle, children, className = '' }) => (
  <div className={`chart-card ${className}`}><div className="chart-card-header"><div><h3 className="text-[15px] font-semibold text-gray-800">{title}</h3>{subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}</div></div><div className="chart-card-body">{children}</div></div>
);

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (<div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl text-sm"><p className="font-medium">{payload[0].name}</p><p style={{ color: payload[0].payload.fill }} className="font-bold">{payload[0].value?.toLocaleString('id-ID')} responden</p></div>);
};

const renderPercentLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  if (percent < 0.005) return null;
  const RADIAN = Math.PI / 180; const r = outerRadius + 18;
  const x = cx + r * Math.cos(-midAngle * RADIAN); const y = cy + r * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} fontSize={12} fontWeight={600}>{(percent*100).toFixed(0)}%</text>;
};

export default function ExperienceCharts({ data, loading }) {
  if (loading) return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{[1,2,3].map(i=><div key={i} className="chart-card"><div className="h-64 animate-pulse bg-gray-50 rounded-xl m-6"/></div>)}</div>;
  if (!data) return <div className="text-center text-gray-400 py-10">Belum ada data</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Satisfaction */}
      <ChartCard title="Tingkat Kepuasan" subtitle="Kepuasan keseluruhan">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data.satisfactionLevel} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" nameKey="name" label={renderPercentLabel}>
              {data.satisfactionLevel?.map((entry, i) => <Cell key={i} fill={SATISFACTION_COLORS[entry.name] || '#94A3B8'} />)}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Revisit Intention */}
      <ChartCard title="Niat Berkunjung Kembali" subtitle="Dalam 1 bulan ke depan">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data.revisitIntention} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" nameKey="name" label={renderPercentLabel}>
              {data.revisitIntention?.map((entry, i) => <Cell key={i} fill={REVISIT_COLORS[entry.name] || '#94A3B8'} />)}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Visitor Suggestions */}
      <ChartCard title="Saran Pengunjung" subtitle="Masukan terbaru">
        <div className="max-h-[270px] overflow-y-auto pr-2">
          {data.visitorSuggestions?.length > 0 ? (
            data.visitorSuggestions.slice(0, 30).map((text, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-xs font-bold text-gray-300 w-6 shrink-0 pt-0.5">{i + 1}</span>
                <span className="text-sm text-gray-600 leading-relaxed">{text}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-6 text-sm">Belum ada saran</p>
          )}
        </div>
      </ChartCard>
    </div>
  );
}
