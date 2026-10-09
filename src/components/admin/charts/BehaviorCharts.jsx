import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartCard = ({ title, children, loading }) => (
  <div className="rounded-lg border border-gray-border bg-white p-4 shadow-sm">
    <div className="mb-4 flex items-center">
      <div className="mr-2 h-4 w-4 bg-pxchange-orange rounded-sm"></div>
      <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
    </div>
    <div className="h-72 w-full">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-pxchange-orange"></div>
        </div>
      ) : children}
    </div>
  </div>
);

export default function BehaviorCharts({ data, loading }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChartCard title="Frekuensi Kunjungan" loading={loading}>
        {data.visitFrequency?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.visitFrequency} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#F4A261" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Tujuan Kunjungan" loading={loading}>
        {data.visitPurpose?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.visitPurpose} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#2A9D8F" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Pendamping Kunjungan" loading={loading}>
        {data.companions?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.companions} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#7B2D8E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Durasi Kunjungan" loading={loading}>
        {data.visitDuration?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.visitDuration} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#00B4D8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>
      
      <ChartCard title="Perkiraan Pengeluaran" loading={loading}>
        {data.estimatedSpending?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.estimatedSpending} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#E63946" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>
    </div>
  );
}
