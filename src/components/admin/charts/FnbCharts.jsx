import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#00B4D8', '#E63946', '#F4A261', '#2A9D8F', '#7B2D8E', '#0EA5E9', '#EC4899', '#84CC16'];

const ChartCard = ({ title, subtitle, children, className = '' }) => (
  <div className={`chart-card ${className}`}>
    <div className="chart-card-header"><div><h3 className="text-[15px] font-semibold text-gray-800">{title}</h3>{subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}</div></div>
    <div className="chart-card-body">{children}</div>
  </div>
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

export default function FnbCharts({ data, loading }) {
  if (loading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{[1,2,3,4].map(i=><div key={i} className="chart-card"><div className="h-64 animate-pulse bg-gray-50 rounded-xl m-6"/></div>)}</div>;
  if (!data) return <div className="text-center text-gray-400 py-10">Belum ada data</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Food Variety */}
      <ChartCard title="Variasi Makanan" subtitle="Opini pengunjung">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data.foodVariety} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" nameKey="name" label={renderPercentLabel}>
              {data.foodVariety?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Desired F&B Tenants */}
      <ChartCard title="Tenant F&B yang Diinginkan">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data.desiredFnbTenants} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#F4A261" barSize={24} radius={[0, 6, 6, 0]}>
              {data.desiredFnbTenants?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Dining Factors */}
      <ChartCard title="Faktor Pemilihan Kuliner">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.diningFactors} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#2A9D8F" barSize={24} radius={[0, 6, 6, 0]}>
              {data.diningFactors?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Requested Tenants - scrollable list */}
      <ChartCard title="Tenant yang Diharapkan" subtitle="Masukan pengunjung">
        <div className="max-h-[260px] overflow-y-auto pr-2">
          {data.requestedTenants?.length > 0 ? (
            data.requestedTenants.slice(0, 50).map((text, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-xs font-bold text-gray-300 w-6 shrink-0 pt-0.5">{i + 1}</span>
                <span className="text-sm text-gray-600">{text}</span>
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
