import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#00B4D8', '#E63946', '#F4A261', '#2A9D8F', '#7B2D8E', '#4A4A4A'];

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

export default function DemographicsCharts({ data, loading }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChartCard title="Distribusi Usia" loading={loading}>
        {data.ageGroups?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.ageGroups} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="value" fill="#00B4D8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Distribusi Gender" loading={loading}>
        {data.genders?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.genders}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.genders.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="10 Kota Teratas" loading={loading}>
        {data.cities?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.cities} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
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
