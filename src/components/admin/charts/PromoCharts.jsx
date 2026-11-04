import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#00B4D8', '#E63946', '#F4A261', '#2A9D8F', '#7B2D8E', '#0EA5E9', '#EC4899', '#84CC16'];

const ChartCard = ({ title, subtitle, children, className = '' }) => (
  <div className={`chart-card ${className}`}><div className="chart-card-header"><div><h3 className="text-[15px] font-semibold text-gray-800">{title}</h3>{subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}</div></div><div className="chart-card-body">{children}</div></div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (<div className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl text-sm"><p className="font-medium">{label}</p><p className="text-sky-300 font-bold">{payload[0].value?.toLocaleString('id-ID')} responden</p></div>);
};

export default function PromoCharts({ data, loading }) {
  if (loading) return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{[1,2,3].map(i=><div key={i} className="chart-card"><div className="h-64 animate-pulse bg-gray-50 rounded-xl m-6"/></div>)}</div>;
  if (!data) return <div className="text-center text-gray-400 py-10">Belum ada data</div>;

  const renderChart = (chartData, title, subtitle) => (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12, fill: '#6B7280' }} />
          <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12, fill: '#6B7280' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" barSize={24} radius={[0, 6, 6, 0]}>
            {chartData?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {renderChart(data.preferredPromotions, 'Promosi yang Disukai', 'Tipe promo paling menarik')}
      {renderChart(data.promotionInfoSources, 'Sumber Informasi Promosi', 'Dari mana mengetahui info')}
      {renderChart(data.effectiveMediaChannels, 'Media Komunikasi Efektif', 'Media paling efektif')}
    </div>
  );
}
