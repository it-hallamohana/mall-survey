import React from 'react';
import { Users, CalendarCheck, Calendar, RefreshCw, Star } from 'lucide-react';

const CARDS_CONFIG = [
  {
    label: 'Total Responden',
    key: 'totalResponses',
    icon: Users,
    gradient: 'linear-gradient(135deg, #00B4D8, #0891B2)',
    border: 'linear-gradient(90deg, #00B4D8, #0891B2)',
  },
  {
    label: 'Hari Ini',
    key: 'todayResponses',
    icon: CalendarCheck,
    gradient: 'linear-gradient(135deg, #E63946, #DC2626)',
    border: 'linear-gradient(90deg, #E63946, #DC2626)',
  },
  {
    label: 'Bulan Ini',
    key: 'monthResponses',
    icon: Calendar,
    gradient: 'linear-gradient(135deg, #F4A261, #EA580C)',
    border: 'linear-gradient(90deg, #F4A261, #EA580C)',
  },
  {
    label: 'Kembali Berkunjung',
    key: 'revisitPercentage',
    icon: RefreshCw,
    suffix: '%',
    gradient: 'linear-gradient(135deg, #2A9D8F, #059669)',
    border: 'linear-gradient(90deg, #2A9D8F, #059669)',
  },
  {
    label: 'Rata-rata Kepuasan',
    key: 'topSatisfaction',
    icon: Star,
    gradient: 'linear-gradient(135deg, #7B2D8E, #7C3AED)',
    border: 'linear-gradient(90deg, #7B2D8E, #7C3AED)',
  },
];

export default function SummaryCards({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="kpi-card animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gray-200" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-6 w-12 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  const getTopSatisfaction = () => {
    if (!stats?.satisfactionDistribution?.length) return 'N/A';
    const sorted = [...stats.satisfactionDistribution].sort((a, b) => b.value - a.value);
    return sorted[0]?.name || 'N/A';
  };

  const getValue = (key) => {
    if (key === 'topSatisfaction') return getTopSatisfaction();
    return stats?.[key] ?? 0;
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {CARDS_CONFIG.map((card) => {
        const Icon = card.icon;
        const value = getValue(card.key);
        return (
          <div key={card.key} className="kpi-card">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: card.gradient }}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-medium truncate">{card.label}</p>
                <p className="text-2xl font-bold text-charcoal animate-count-up leading-tight">
                  {value}{card.suffix || ''}
                </p>
              </div>
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 h-[3px]"
              style={{ background: card.border }}
            />
          </div>
        );
      })}
    </div>
  );
}
