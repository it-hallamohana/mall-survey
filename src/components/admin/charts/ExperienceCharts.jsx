import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0EA5E9', '#F43F5E', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const satisfactionColors = {
  'Sangat Puas': '#10B981',
  'Puas': '#0EA5E9',
  'Cukup': '#F59E0B',
  'Kurang Puas': '#F43F5E',
  'Tidak Puas': '#EF4444'
};

const revisitColors = {
  'Ya': '#10B981',
  'Mungkin': '#F59E0B',
  'Tidak': '#F43F5E'
};

const ChartCard = ({ title, children, loading, accentColor = '#F43F5E' }) => (
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
        <p className="text-lg font-bold" style={{ color: payload[0].fill || payload[0].color || '#F43F5E' }}>
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
        <p className="text-lg font-bold" style={{ color: payload[0].payload?.fill || payload[0].fill || '#F43F5E' }}>
          {payload[0].value} responden
        </p>
      </div>
    );
  }
  return null;
};

export default function ExperienceCharts({ data, loading }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <ChartCard title="Tingkat Kepuasan" loading={loading} accentColor="#F43F5E">
        {data.satisfactionLevel?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.satisfactionLevel}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.satisfactionLevel.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={satisfactionColors[entry.name] || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Niat Kunjungan Ulang" loading={loading} accentColor="#F43F5E">
        {data.revisitIntention?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.revisitIntention}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.revisitIntention.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={revisitColors[entry.name] || (entry.name === 'Ya' ? '#10B981' : entry.name === 'Mungkin' ? '#F59E0B' : '#F43F5E')}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Saran Pengunjung" loading={loading} accentColor="#F43F5E">
        {data.visitorSuggestions?.length > 0 ? (
          <div className="h-full overflow-y-auto pr-2 pb-2 space-y-2.5">
            {data.visitorSuggestions.slice(0, 20).map((text, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-100 bg-gray-50/80 p-3 text-sm text-charcoal/90 hover:bg-gray-100/70 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <span className="text-gray-400 font-serif text-base leading-none select-none">“</span>
                  <p className="italic text-xs leading-relaxed text-charcoal">{text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada saran</p>}
      </ChartCard>
    </div>
  );
}
