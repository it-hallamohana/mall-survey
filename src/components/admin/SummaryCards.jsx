import React from 'react';
import { Users, CalendarDays, Smile, Repeat, TrendingUp, TrendingDown, Sun } from 'lucide-react';
import { AnimatedNumber, BRAND, Skeleton, useCountUp } from './ui/primitives';

const Sparkline = ({ values = [], color }) => {
  if (values.length < 2) return null;
  const max = Math.max(1, ...values);
  const w = 120, h = 36;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - (v / max) * (h - 4) - 2]);
  const line = pts.map(p => p.join(',')).join(' ');
  const area = `0,${h} ${line} ${w},${h}`;
  const id = `spark-${color.replace('#', '')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-9" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const Ring = ({ pct = 0, color }) => {
  const v = useCountUp(pct);
  const r = 22, C = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90 shrink-0">
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(20,20,31,0.07)" strokeWidth="6" />
      <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(v / 100) * C} ${C}`} />
    </svg>
  );
};

const Delta = ({ value, label }) => {
  if (value === null || value === undefined) return <span className="text-[11px] text-[#9A9AAA]">{label}</span>;
  const up = value >= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold rounded-full px-2 py-0.5 ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {up ? '+' : ''}{value}% <span className="font-medium opacity-70">{label}</span>
    </span>
  );
};

export default function SummaryCards({ stats, months = [], loading }) {
  if (loading && !stats) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {[0, 1, 2, 3].map(i => <div key={i} className="dcard p-5"><Skeleton className="h-4 w-24 mb-4" /><Skeleton className="h-8 w-20 mb-3" /><Skeleton className="h-8 w-full" /></div>)}
      </div>
    );
  }

  const now = new Date();
  const curKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const curIdx = months.findIndex(m => m.key === curKey);
  const cur = curIdx >= 0 ? months[curIdx] : null;
  const prev = curIdx > 0 ? months[curIdx - 1] : null;
  const monthTotal = cur?.total || 0;
  const todayTotal = cur?.daily?.[now.getDate() - 1]?.value || 0;
  const yesterdayTotal = cur?.daily?.[now.getDate() - 2]?.value;
  const mom = prev && prev.total > 0 ? Math.round(((monthTotal - prev.total) / prev.total) * 100) : null;
  const spark = months.slice(-12).map(m => m.total);
  const curDaily = (cur?.daily || []).slice(0, now.getDate()).map(d => d.value);

  const cards = [
    {
      label: 'Total Responden', icon: Users, color: BRAND.pink,
      value: stats?.totalResponses || 0,
      foot: <span className="text-[11px] text-[#6B6B7B]">Sesuai filter aktif</span>,
      chart: <Sparkline values={spark} color={BRAND.pink} />,
    },
    {
      label: 'Bulan Ini', icon: CalendarDays, color: BRAND.orange,
      value: monthTotal,
      foot: <Delta value={mom} label={prev ? `vs ${prev.label}` : 'bulan pertama'} />,
      chart: <Sparkline values={curDaily} color={BRAND.orange} />,
    },
    {
      label: 'Tingkat Puas', icon: Smile, color: BRAND.teal, suffix: '%',
      value: stats?.satisfiedPercentage || 0,
      foot: <span className="text-[11px] text-[#6B6B7B]">Puas + Sangat Puas</span>,
      ring: true,
    },
    {
      label: 'Akan Kembali', icon: Repeat, color: BRAND.purple, suffix: '%',
      value: stats?.revisitPercentage || 0,
      foot: <span className="text-[11px] text-[#6B6B7B]">Jawab "Ya" dalam 1 bulan</span>,
      ring: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="dcard dcard-lift kpi reveal" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="kpi-glow" style={{ background: c.color }} />
            <div className="relative flex items-center justify-between mb-3">
              <span className="text-[12px] sm:text-[13px] font-semibold text-[#6B6B7B]">{c.label}</span>
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}BB)` }}>
                <Icon size={16} />
              </div>
            </div>
            {c.ring ? (
              <div className="relative flex items-center gap-3">
                <Ring pct={c.value} color={c.color} />
                <AnimatedNumber value={c.value} suffix={c.suffix} className="font-display text-3xl sm:text-4xl font-extrabold text-[#14141F]" />
              </div>
            ) : (
              <>
                <AnimatedNumber value={c.value} className="relative font-display text-3xl sm:text-4xl font-extrabold text-[#14141F]" />
                <div className="relative mt-1 -mx-1">{c.chart}</div>
              </>
            )}
            <div className="relative mt-2 flex items-center gap-2 flex-wrap">
              {c.foot}
              {i === 1 && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#6B6B7B]">
                  <Sun size={11} /> Hari ini <b className="text-[#14141F] tabular">{todayTotal}</b>
                  {yesterdayTotal !== undefined && <span className="opacity-70">(kemarin {yesterdayTotal})</span>}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
