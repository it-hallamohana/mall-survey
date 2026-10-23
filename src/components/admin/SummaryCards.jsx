import React from 'react';
import { Users, CalendarCheck, Calendar, ArrowRight, Star } from 'lucide-react';

export default function SummaryCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card-premium overflow-hidden animate-pulse flex flex-col justify-between">
            <div className="flex items-center p-5">
              <div className="h-12 w-12 rounded-xl bg-gray-200"></div>
              <div className="ml-4 space-y-2">
                <div className="h-4 w-24 rounded bg-gray-200"></div>
                <div className="h-7 w-16 rounded bg-gray-300"></div>
              </div>
            </div>
            <div className="h-1 bg-gray-200"></div>
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
      <div className="card-premium overflow-hidden flex flex-col justify-between">
        <div className="flex items-center p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0" style={{ background: 'linear-gradient(135deg, #00B4D8, #0096B4)' }}>
            <Users className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Responden</p>
            <p className="text-2xl font-bold text-charcoal animate-count-up">{stats.totalResponses}</p>
          </div>
        </div>
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #00B4D8, #2A9D8F)' }}></div>
      </div>

      <div className="card-premium overflow-hidden flex flex-col justify-between">
        <div className="flex items-center p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0" style={{ background: 'linear-gradient(135deg, #E63946, #C62D39)' }}>
            <CalendarCheck className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Responden Hari Ini</p>
            <p className="text-2xl font-bold text-charcoal animate-count-up">{stats.todayResponses}</p>
          </div>
        </div>
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #E63946, #C62D39)' }}></div>
      </div>

      <div className="card-premium overflow-hidden flex flex-col justify-between">
        <div className="flex items-center p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0" style={{ background: 'linear-gradient(135deg, #F4A261, #E8913F)' }}>
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Responden Bulan Ini</p>
            <p className="text-2xl font-bold text-charcoal animate-count-up">{stats.monthResponses}</p>
          </div>
        </div>
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #F4A261, #E8913F)' }}></div>
      </div>

      <div className="card-premium overflow-hidden flex flex-col justify-between">
        <div className="flex items-center p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0" style={{ background: 'linear-gradient(135deg, #2A9D8F, #1E8A7E)' }}>
            <ArrowRight className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Kunjungan Kembali</p>
            <p className="text-2xl font-bold text-charcoal animate-count-up">{stats.revisitPercentage}%</p>
          </div>
        </div>
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #2A9D8F, #1E8A7E)' }}></div>
      </div>

      <div className="card-premium overflow-hidden flex flex-col justify-between">
        <div className="flex items-center p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0" style={{ background: 'linear-gradient(135deg, #7B2D8E, #6B2580)' }}>
            <Star className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4 min-w-0">
            <p className="text-sm font-medium text-gray-500">Rata-rata Kepuasan</p>
            <p className="text-xl font-bold text-charcoal animate-count-up truncate" title={topSatisfaction}>{topSatisfaction}</p>
          </div>
        </div>
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #7B2D8E, #6B2580)' }}></div>
      </div>
    </div>
  );
}
