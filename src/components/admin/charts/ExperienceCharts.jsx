import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const satisfactionColors = {
  'Sangat Puas': '#2A9D8F',
  'Puas': '#00B4D8',
  'Cukup': '#F4A261',
  'Kurang Puas': '#E63946'
};

const defaultColors = ['#00B4D8', '#E63946', '#F4A261', '#2A9D8F', '#7B2D8E', '#4A4A4A'];

const ChartCard = ({ title, children, loading }) => (
  <div className="rounded-lg border border-gray-border bg-white p-4 shadow-sm h-full">
    <div className="mb-4 flex items-center">
      <div className="mr-2 h-4 w-4 bg-pxchange-coral rounded-sm"></div>
      <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
    </div>
    <div className="h-72 w-full overflow-hidden">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-pxchange-coral"></div>
        </div>
      ) : children}
    </div>
  </div>
);

export default function ExperienceCharts({ data, loading }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <ChartCard title="Tingkat Kepuasan" loading={loading}>
        {data.satisfactionLevel?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.satisfactionLevel}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.satisfactionLevel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={satisfactionColors[entry.name] || defaultColors[index % defaultColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Niat Kunjungan Ulang" loading={loading}>
        {data.revisitIntention?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.revisitIntention}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.revisitIntention.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'Ya' ? '#2A9D8F' : entry.name === 'Mungkin' ? '#F4A261' : '#E63946'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Saran Pengunjung" loading={loading}>
        {data.visitorSuggestions?.length > 0 ? (
          <div className="h-full overflow-y-auto pr-2 pb-4">
            <ul className="space-y-3">
              {data.visitorSuggestions.map((text, i) => (
                <li key={i} className="rounded border border-gray-border bg-gray-50 p-3 text-sm italic text-charcoal-light">
                  "{text}"
                </li>
              ))}
            </ul>
          </div>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada saran</p>}
      </ChartCard>
    </div>
  );
}
