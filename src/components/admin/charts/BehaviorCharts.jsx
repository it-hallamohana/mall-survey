import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0EA5E9', '#F43F5E', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const ChartCard = ({ title, children, loading, accentColor = '#F59E0B' }) => (
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
        <p className="text-lg font-bold" style={{ color: payload[0].fill || payload[0].color || '#F59E0B' }}>
          {payload[0].value} responden
        </p>
      </div>
    );
  }
  return null;
};

export default function BehaviorCharts({ data, loading }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <ChartCard title="Frekuensi Kunjungan" loading={loading} accentColor="#F59E0B">
        {data.visitFrequency?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.visitFrequency} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Tujuan Kunjungan" loading={loading} accentColor="#F59E0B">
        {data.visitPurpose?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.visitPurpose} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Pendamping Kunjungan" loading={loading} accentColor="#F59E0B">
        {data.companions?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.companions} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Durasi Kunjungan" loading={loading} accentColor="#F59E0B">
        {data.visitDuration?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.visitDuration} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>
      
      <ChartCard title="Perkiraan Pengeluaran" loading={loading} accentColor="#F59E0B">
        {data.estimatedSpending?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.estimatedSpending} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#F43F5E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>
    </div>
  );
}
