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
  const RADIAN = Math.PI / 180;
  const r = outerRadius + 18;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="#374151" textAnchor={x > cx ? 'start' : 'end'} fontSize={12} fontWeight={600}>{(percent*100).toFixed(0)}%</text>;
};

const Loading = () => <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{[1,2,3,4,5].map(i=><div key={i} className="chart-card"><div className="h-64 animate-pulse bg-gray-50 rounded-xl m-6"/></div>)}</div>;

export default function BehaviorCharts({ data, loading }) {
  if (loading) return <Loading />;
  if (!data) return <div className="text-center text-gray-400 py-10">Belum ada data</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Visit Frequency - horizontal to prevent label truncation */}
      <ChartCard title="Frekuensi Kunjungan">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.visitFrequency} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" barSize={26} radius={[0, 6, 6, 0]}>
              {data.visitFrequency?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Visit Purpose */}
      <ChartCard title="Tujuan Kunjungan">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.visitPurpose} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#2A9D8F" barSize={26} radius={[0, 6, 6, 0]}>
              {data.visitPurpose?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Companions - donut */}
      <ChartCard title="Datang Bersama">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data.companions} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value" nameKey="name" label={renderPercentLabel}>
              {data.companions?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Visit Duration - horizontal */}
      <ChartCard title="Durasi Kunjungan">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.visitDuration} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" barSize={28} radius={[0, 6, 6, 0]}>
              {data.visitDuration?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Estimated Spending - full width */}
      <ChartCard title="Estimasi Pengeluaran" subtitle="Per kunjungan" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.estimatedSpending} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" barSize={30} radius={[0, 6, 6, 0]}>
              {data.estimatedSpending?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
