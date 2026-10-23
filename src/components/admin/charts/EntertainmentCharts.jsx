import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0EA5E9', '#F43F5E', '#F59E0B', '#10B981', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const ChartCard = ({ title, children, loading, accentColor = '#8B5CF6' }) => (
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
        <p className="text-lg font-bold" style={{ color: payload[0].fill || payload[0].color || '#8B5CF6' }}>
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
        <p className="text-lg font-bold" style={{ color: payload[0].payload?.fill || payload[0].fill || '#8B5CF6' }}>
          {payload[0].value} responden
        </p>
      </div>
    );
  }
  return null;
};

export default function EntertainmentCharts({ data, loading }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <ChartCard title="Area Hiburan yang Diminati" loading={loading} accentColor="#8B5CF6">
        {data.entertainmentAreas?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.entertainmentAreas} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Pentingnya Hiburan Keluarga" loading={loading} accentColor="#8B5CF6">
        {data.familyEntertainmentImportance?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.familyEntertainmentImportance} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>

      <ChartCard title="Acara yang Diinginkan" loading={loading} accentColor="#8B5CF6">
        {data.desiredEvents?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.desiredEvents} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#F43F5E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>
      
      <ChartCard title="Minat Kunjungan Acara" loading={loading} accentColor="#8B5CF6">
        {data.eventVisitInterest?.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.eventVisitInterest}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.eventVisitInterest.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : <p className="text-center text-gray-500 pt-24">Belum ada data</p>}
      </ChartCard>
    </div>
  );
}
