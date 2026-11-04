import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarRange, TrendingUp, TrendingDown, Minus, X, Trophy, Activity } from 'lucide-react';
import { BRAND, fmtNum, AnimatedNumber, Skeleton } from './ui/primitives';

const DailyTooltip = ({ active, payload, label, monthLabel }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-[#14141F] px-3 py-2 text-white shadow-xl">
      <p className="text-[11px] text-white/60">{label} {monthLabel}</p>
      <p className="text-sm font-bold tabular">{fmtNum(payload[0].value)} responden</p>
    </div>
  );
};

export default function MonthlyTrend({ months = [], loading, selectedKey, onSelectMonth }) {
  const [hover, setHover] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [months.length]);

  const stats = useMemo(() => {
    const total = months.reduce((s, m) => s + m.total, 0);
    const active = months.filter(m => m.total > 0);
    const best = active.reduce((b, m) => (!b || m.total > b.total ? m : b), null);
    const avg = active.length ? Math.round(total / active.length) : 0;
    return { total, best, avg };
  }, [months]);

  const max = Math.max(1, ...months.map(m => m.total));
  const selectedIdx = months.findIndex(m => m.key === selectedKey);
  const latestIdx = (() => { for (let i = months.length - 1; i >= 0; i--) if (months[i].total > 0) return i; return months.length - 1; })();
  const focusIdx = selectedIdx >= 0 ? selectedIdx : latestIdx;
  const focus = months[focusIdx];
  const prev = focusIdx > 0 ? months[focusIdx - 1] : null;
  const delta = focus && prev && prev.total > 0 ? Math.round(((focus.total - prev.total) / prev.total) * 100) : null;
  const hoverMonth = months.find(m => m.key === hover);

  if (loading && !months.length) {
    return <div className="dcard p-6"><Skeleton className="h-6 w-48 mb-6" /><Skeleton className="h-64 w-full" /></div>;
  }

  return (
    <div className="dcard reveal overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 px-5 pt-5 sm:px-6 sm:pt-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: `linear-gradient(135deg, ${BRAND.pink}, ${BRAND.purple})` }}>
            <CalendarRange size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-extrabold text-[#14141F]">Tren Respon per Bulan</h3>
            <p className="text-xs text-[#6B6B7B] mt-0.5">Klik bar bulan untuk memfilter <b>seluruh dashboard</b> ke bulan tersebut</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-2xl bg-[#F6F6FA] px-3 py-2.5 sm:px-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6B7B] flex items-center gap-1"><Activity size={11} /> Total</p>
            <AnimatedNumber value={stats.total} className="font-display text-lg font-extrabold text-[#14141F]" />
          </div>
          <div className="rounded-2xl bg-[#F6F6FA] px-3 py-2.5 sm:px-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6B7B]">Rata-rata/bln</p>
            <AnimatedNumber value={stats.avg} className="font-display text-lg font-extrabold text-[#14141F]" />
          </div>
          <div className="rounded-2xl px-3 py-2.5 sm:px-4" style={{ background: `${BRAND.yellow}22` }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9A6B00] flex items-center gap-1"><Trophy size={11} /> Tertinggi</p>
            <p className="font-display text-lg font-extrabold text-[#14141F] leading-tight">{stats.best?.label || '-'}</p>
          </div>
        </div>
      </div>

      {/* Monthly columns */}
      <div className="relative px-3 sm:px-4 pt-6">
        <div ref={scrollRef} className="overflow-x-auto thin-scroll pb-2">
          <div className="flex items-end gap-1.5 sm:gap-2 px-2" style={{ height: 250, minWidth: months.length * 52 }}>
            {months.map((m) => {
              const isSel = m.key === selectedKey;
              const isHover = m.key === hover;
              const dim = selectedKey && !isSel;
              const h = m.total ? Math.max(6, (m.total / max) * 180) : 3;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => onSelectMonth(isSel ? null : m)}
                  onMouseEnter={() => setHover(m.key)}
                  onMouseLeave={() => setHover(null)}
                  className="group relative flex-1 min-w-[44px] h-full flex flex-col items-center justify-end focus:outline-none"
                  aria-label={`${m.longLabel}: ${m.total} responden`}
                >
                  <span className={`text-[11px] font-bold tabular mb-1 transition-all ${isSel || isHover ? 'text-[#14141F] -translate-y-0.5' : 'text-[#9A9AAA]'}`}>
                    {m.total ? fmtNum(m.total) : ''}
                  </span>
                  <div
                    className="w-full max-w-[40px] rounded-t-xl rounded-b-md origin-bottom transition-all duration-300"
                    style={{
                      height: h,
                      background: isSel
                        ? `linear-gradient(180deg, ${BRAND.yellow}, ${BRAND.orange})`
                        : m.total ? `linear-gradient(180deg, ${BRAND.pink}, ${BRAND.purple})` : 'rgba(20,20,31,0.08)',
                      opacity: dim ? 0.3 : 1,
                      transform: isHover ? 'scaleX(1.08)' : 'scaleX(1)',
                      boxShadow: isSel ? `0 14px 28px -12px ${BRAND.orange}` : isHover ? `0 14px 28px -14px ${BRAND.pink}` : 'none',
                      animation: 'growY 0.9s cubic-bezier(.2,.8,.2,1) both',
                    }}
                  />
                  <span className={`mt-2 text-[10px] sm:text-[11px] font-semibold whitespace-nowrap ${isSel ? 'text-[#F15A29]' : 'text-[#6B6B7B]'}`}>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        {hoverMonth && (
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 rounded-xl bg-[#14141F] px-3 py-2 text-white shadow-xl text-center animate-[popIn_0.15s_ease]">
            <p className="text-[11px] text-white/60">{hoverMonth.longLabel}</p>
            <p className="text-sm font-bold tabular">{fmtNum(hoverMonth.total)} responden</p>
            {hoverMonth.total > 0 && (
              <p className="text-[10px] text-white/70 tabular">Puas {hoverMonth.satisfiedPct}% · Kembali {hoverMonth.revisitPct}%</p>
            )}
          </div>
        )}
        <style>{`@keyframes growY { from { transform: scaleY(0); } to { transform: scaleY(1); } }`}</style>
      </div>

      {/* Daily drill-down */}
      {focus && (
        <div className="mx-3 mb-3 sm:mx-4 sm:mb-4 mt-2 rounded-2xl bg-gradient-to-br from-[#14141F] to-[#2A1B3D] p-4 sm:p-5 text-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/50 font-semibold">
                {selectedKey ? 'Bulan terpilih · rincian harian' : 'Bulan terakhir · rincian harian'}
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <h4 className="font-display text-2xl font-extrabold">{focus.longLabel}</h4>
                <span className="text-white/70 text-sm tabular">{fmtNum(focus.total)} responden</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {delta !== null && (
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${delta > 0 ? 'bg-emerald-400/15 text-emerald-300' : delta < 0 ? 'bg-rose-400/15 text-rose-300' : 'bg-white/10 text-white/70'}`}>
                  {delta > 0 ? <TrendingUp size={13} /> : delta < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
                  {delta > 0 ? '+' : ''}{delta}% vs {prev.label}
                </span>
              )}
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tabular">Puas {focus.satisfiedPct}%</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tabular">Kembali {focus.revisitPct}%</span>
              {selectedKey ? (
                <button onClick={() => onSelectMonth(null)} className="inline-flex items-center gap-1 rounded-full bg-white text-[#14141F] px-3 py-1 text-xs font-bold hover:bg-white/90">
                  <X size={13} /> Semua bulan
                </button>
              ) : (
                <button onClick={() => onSelectMonth(focus)} className="rounded-full px-3 py-1 text-xs font-bold text-[#14141F]" style={{ background: BRAND.yellow }}>
                  Filter bulan ini
                </button>
              )}
            </div>
          </div>
          <div style={{ height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focus.daily} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="dailyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND.yellow} stopOpacity={0.6} />
                    <stop offset="100%" stopColor={BRAND.pink} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={8} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<DailyTooltip monthLabel={focus.longLabel} />} cursor={{ stroke: 'rgba(255,255,255,0.25)', strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="value" stroke={BRAND.yellow} strokeWidth={2.5} fill="url(#dailyFill)" activeDot={{ r: 5, fill: BRAND.yellow, stroke: '#14141F', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
