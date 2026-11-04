import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#00B4D8', '#E63946', '#F4A261', '#2A9D8F', '#7B2D8E', '#0EA5E9', '#EC4899', '#84CC16'];

const ChartCard = ({ title, subtitle, children, className = '' }) => (
  <div className={`chart-card ${className}`}>
    <div className="chart-card-header">
      <div>
        <h3 className="text-[15px] font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="chart-card-body">{children}</div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl text-sm">
      <p className="font-medium">{label}</p>
      <p className="text-sky-300 font-bold">{payload[0].value?.toLocaleString('id-ID')} responden</p>
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl text-sm">
      <p className="font-medium">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.fill }} className="font-bold">{payload[0].value?.toLocaleString('id-ID')} responden</p>
    </div>
  );
};

const renderPercentLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  if (percent < 0.005) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} fontSize={12} fontWeight={600}>{(percent * 100).toFixed(0)}%</text>;
};

const Loading = () => <div className="h-full flex items-center justify-center text-gray-400 text-sm">Memuat data...</div>;
const Empty = () => <div className="h-full flex items-center justify-center text-gray-400 text-sm">Belum ada data</div>;

export default function DemographicsCharts({ data, loading }) {
  if (loading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{[1,2,3].map(i => <div key={i} className="chart-card"><div className="h-80 animate-pulse bg-gray-50 rounded-xl m-6" /></div>)}</div>;
  if (!data) return <Empty />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Age Distribution */}
      <ChartCard title="Distribusi Usia" subtitle="Kelompok usia pengunjung">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.ageGroups} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" barSize={28} radius={[0, 6, 6, 0]}>
              {data.ageGroups?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Gender Distribution */}
      <ChartCard title="Distribusi Gender">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data.genders} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" nameKey="name" label={renderPercentLabel}>
              {data.genders?.map((_, i) => <Cell key={i} fill={i === 0 ? '#0EA5E9' : '#EC4899'} />)}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Top Cities */}
      <ChartCard title="10 Kota Teratas" subtitle="Domisili pengunjung terbanyak" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.cities} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis dataKey="name" type="category" width={130} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#00B4D8" barSize={24} radius={[0, 6, 6, 0]}>
              {data.cities?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
