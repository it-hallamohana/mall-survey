import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#00B4D8', '#E63946', '#F4A261', '#2A9D8F', '#7B2D8E', '#0EA5E9', '#EC4899', '#84CC16'];
const IMPORTANCE_COLORS = { 'Sangat penting': '#10B981', 'Penting': '#0EA5E9', 'Biasa saja': '#F59E0B', 'Tidak penting': '#EF4444' };

const ChartCard = ({ title, subtitle, children, className = '' }) => (
  <div className={`chart-card ${className}`}><div className="chart-card-header"><div><h3 className="text-[15px] font-semibold text-gray-800">{title}</h3>{subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}</div></div><div className="chart-card-body">{children}</div></div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (<div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl text-sm"><p className="font-medium">{label}</p><p className="text-sky-300 font-bold">{payload[0].value?.toLocaleString('id-ID')} responden</p></div>);
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (<div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl text-sm"><p className="font-medium">{payload[0].name}</p><p style={{ color: payload[0].payload.fill }} className="font-bold">{payload[0].value?.toLocaleString('id-ID')} responden</p></div>);
};

const renderPercentLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  if (percent < 0.03) return null;
  const RADIAN = Math.PI / 180; const r = outerRadius + 18;
  const x = cx + r * Math.cos(-midAngle * RADIAN); const y = cy + r * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} fontSize={12} fontWeight={600}>{(percent*100).toFixed(0)}%</text>;
};

export default function EntertainmentCharts({ data, loading }) {
  if (loading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{[1,2,3,4].map(i=><div key={i} className="chart-card"><div className="h-64 animate-pulse bg-gray-50 rounded-xl m-6"/></div>)}</div>;
  if (!data) return <div className="text-center text-gray-400 py-10">Belum ada data</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Entertainment Areas */}
      <ChartCard title="Area Hiburan" subtitle="Area yang paling sering digunakan">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.entertainmentAreas} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" barSize={26} radius={[0, 6, 6, 0]}>
              {data.entertainmentAreas?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Family Entertainment Importance */}
      <ChartCard title="Pentingnya Hiburan Keluarga">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.familyEntertainmentImportance} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" barSize={28} radius={[0, 6, 6, 0]}>
              {data.familyEntertainmentImportance?.map((entry, i) => <Cell key={i} fill={IMPORTANCE_COLORS[entry.name] || COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Desired Events */}
      <ChartCard title="Event yang Diminati">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.desiredEvents} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" barSize={26} radius={[0, 6, 6, 0]}>
              {data.desiredEvents?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Event Visit Interest */}
      <ChartCard title="Minat Karena Event">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data.eventVisitInterest} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" nameKey="name" label={renderPercentLabel}>
              {data.eventVisitInterest?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
