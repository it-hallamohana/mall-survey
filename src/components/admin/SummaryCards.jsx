import React from 'react';
import { Users, CalendarCheck, Calendar, ArrowRight, Star } from 'lucide-react';

export default function SummaryCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border border-gray-border bg-white p-4 shadow-sm">
            <div className="h-4 w-24 rounded bg-gray-200 mb-4"></div>
            <div className="h-8 w-16 rounded bg-gray-300"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  let topSatisfaction = 'N/A';
  if (stats.satisfactionDistribution && stats.satisfactionDistribution.length > 0) {
    topSatisfaction = stats.satisfactionDistribution.reduce((prev, current) => 
      (prev.value > current.value) ? prev : current
    ).name;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-lg border border-gray-border border-l-4 border-l-pxchange-teal bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">Total Responden</p>
          <Users className="h-5 w-5 text-pxchange-teal" />
        </div>
        <p className="mt-2 text-3xl font-bold text-charcoal">{stats.totalResponses}</p>
      </div>

      <div className="rounded-lg border border-gray-border border-l-4 border-l-pxchange-coral bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">Responden Hari Ini</p>
          <CalendarCheck className="h-5 w-5 text-pxchange-coral" />
        </div>
        <p className="mt-2 text-3xl font-bold text-charcoal">{stats.todayResponses}</p>
      </div>

      <div className="rounded-lg border border-gray-border border-l-4 border-l-pxchange-orange bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">Responden Bulan Ini</p>
          <Calendar className="h-5 w-5 text-pxchange-orange" />
        </div>
        <p className="mt-2 text-3xl font-bold text-charcoal">{stats.monthResponses}</p>
      </div>

      <div className="rounded-lg border border-gray-border border-l-4 border-l-pxchange-green bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">Kunjungan Kembali</p>
          <ArrowRight className="h-5 w-5 text-pxchange-green" />
        </div>
        <p className="mt-2 text-3xl font-bold text-charcoal">{stats.revisitPercentage}%</p>
      </div>

      <div className="rounded-lg border border-gray-border border-l-4 border-l-pxchange-purple bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">Rata-rata Kepuasan</p>
          <Star className="h-5 w-5 text-pxchange-purple" />
        </div>
        <p className="mt-2 text-xl font-bold text-charcoal">{topSatisfaction}</p>
      </div>
    </div>
  );
}
