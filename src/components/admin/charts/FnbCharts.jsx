import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0EA5E9', '#F43F5E', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const ChartCard = ({ title, children, loading, accentColor = '#10B981' }) => (
  <div className="rounded-xl border border-gray-200/60 bg-white p-5 shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="mb-5 flex items-center">
      <div className="mr-3 h-8 w-1 rounded-full" style={{ backgroundColor: accentColor }}></div>
      <h3 className="text-base font-semibold text-charcoal">{title}</h3>
    </div>
    <div className="h-80 w-full">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200" style={{ borderTopColor: accentColor }}></div>
        </div>
      ) : children}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
        <p className="text-sm font-medium text-charcoal">{label || payload[0].name}</p>
        <p className="text-lg font-bold" style={{ color: payload[0].fill || payload[0].color || '#10B981' }}>
          {payload[0].value} responden
        </p>
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
        <p className="text-sm font-medium text-charcoal">{payload[0].name}</p>
        <p className="text-lg font-bold" style={{ color: payload[0].payload?.fill || payload[0].fill || '#10B981' }}>
          {payload[0].value} responden
        </p>
      </div>
    );
  }
  return null;
};

export default function FnbCharts({ data, loading }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <ChartCard title="Opini Variasi Makanan" loading={loading} accentColor="#10B981">
        {data.foodVariety?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.foodVariety}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.foodVariety.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Tenant F&B yang Diinginkan" loading={loading} accentColor="#10B981">
        {data.desiredFnbTenants?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.desiredFnbTenants.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Faktor Menentukan Tempat Bersantap" loading={loading} accentColor="#10B981">
        {data.diningFactors?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.diningFactors} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Permintaan Tenant Khusus" loading={loading} accentColor="#10B981">
        {data.requestedTenants?.length > 0 ? (
          <div className="h-full overflow-y-auto pr-2 pb-2 space-y-2.5">
            {data.requestedTenants.map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/80 p-3 text-sm text-charcoal hover:bg-gray-100/80 transition-colors"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                  {i + 1}
                </span>
                <span className="font-medium text-charcoal">{text}</span>
              </div>
            ))}
          </div>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>
    </div>
  );
}
