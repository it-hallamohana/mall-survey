import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#00B4D8', '#E63946', '#F4A261', '#2A9D8F', '#7B2D8E', '#4A4A4A'];

const ChartCard = ({ title, children, loading }) => (
  <div className="rounded-lg border border-gray-border bg-white p-4 shadow-sm h-full">
    <div className="mb-4 flex items-center">
      <div className="mr-2 h-4 w-4 bg-pxchange-green rounded-sm"></div>
      <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
    </div>
    <div className="h-72 w-full overflow-hidden">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-pxchange-green"></div>
        </div>
      ) : children}
    </div>
  </div>
);

export default function FnbCharts({ data, loading }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChartCard title="Opini Variasi Makanan" loading={loading}>
        {data.foodVariety?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.foodVariety}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.foodVariety.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Tenant F&B yang Diinginkan" loading={loading}>
        {data.desiredFnbTenants?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.desiredFnbTenants.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#2A9D8F" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Faktor Menentukan Tempat Bersantap" loading={loading}>
        {data.diningFactors?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.diningFactors} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#F4A261" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Permintaan Tenant Khusus" loading={loading}>
        {data.requestedTenants?.length > 0 ? (
          <div className="h-full overflow-y-auto pr-2 pb-4">
            <ul className="space-y-2">
              {data.requestedTenants.map((text, i) => (
                <li key={i} className="rounded border border-gray-border bg-gray-50 p-3 text-sm text-charcoal">
                  {text}
                </li>
              ))}
            </ul>
          </div>
        ) : <p className="text-center text-gray-500 pt-20">Belum ada data</p>}
      </ChartCard>
    </div>
  );
}
