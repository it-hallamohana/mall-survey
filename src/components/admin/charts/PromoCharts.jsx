import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartCard = ({ title, children, loading }) => (
  <div className="rounded-lg border border-gray-border bg-white p-4 shadow-sm">
    <div className="mb-4 flex items-center">
      <div className="mr-2 h-4 w-4 bg-pxchange-teal rounded-sm"></div>
      <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
    </div>
    <div className="h-72 w-full">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-pxchange-teal"></div>
        </div>
      ) : children}
    </div>
  </div>
);

export default function PromoCharts({ data, loading }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChartCard title="Promosi yang Disukai" loading={loading}>
        {data.preferredPromotions?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.preferredPromotions} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#00B4D8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Sumber Informasi Promosi" loading={loading}>
        {data.promotionInfoSources?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.promotionInfoSources} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#F4A261" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>

      <div className="lg:col-span-2">
        <ChartCard title="Media Komunikasi Efektif" loading={loading}>
          {data.effectiveMediaChannels?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.effectiveMediaChannels} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#E63946" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
        </ChartCard>
      </div>
    </div>
  );
}
