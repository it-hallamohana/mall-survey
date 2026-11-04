import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, ChevronDown, MousePointerClick } from 'lucide-react';

// ---------------------------------------------------------------------------
// Palette (PXchange brand guide)
// ---------------------------------------------------------------------------
export const BRAND = {
  pink: '#ED145B',
  orange: '#F15A29',
  teal: '#00A59C',
  purple: '#B41E8E',
  yellow: '#FDB913',
  charcoal: '#4D4D4F',
  gray: '#8A8C8E',
  blue: '#3B82F6',
};

export const PALETTE = [BRAND.pink, BRAND.teal, BRAND.orange, BRAND.purple, BRAND.yellow, BRAND.blue, BRAND.charcoal, BRAND.gray];

export const COLOR_MAPS = {
  satisfaction: { 'Kurang Puas': BRAND.pink, 'Cukup': BRAND.yellow, 'Puas': BRAND.teal, 'Sangat Puas': '#047857' },
  revisit: { 'Ya': BRAND.teal, 'Mungkin': BRAND.yellow, 'Tidak': BRAND.pink },
  gender: { 'Laki-laki': BRAND.teal, 'Perempuan': BRAND.pink },
  interest: { 'Kurang tertarik': BRAND.pink, 'Tertarik': BRAND.orange, 'Sangat tertarik': BRAND.purple },
  variety: { 'Kurang beragam': BRAND.pink, 'Cukup lengkap': BRAND.yellow, 'Sangat lengkap': BRAND.teal },
};

export const fmtNum = (n) => (n ?? 0).toLocaleString('id-ID');
export const fmtPct = (part, total) => {
  if (!total) return '0%';
  const p = (part / total) * 100;
  if (p === 0) return '0%';
  if (p < 1) return `${p.toFixed(1).replace('.', ',')}%`;
  if (p < 10) return `${p.toFixed(1).replace('.', ',').replace(',0', '')}%`;
  return `${Math.round(p)}%`;
};

// ---------------------------------------------------------------------------
// Animated number
// ---------------------------------------------------------------------------
export function useCountUp(value, duration = 1000) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
  useEffect(() => {
    const target = Number(value) || 0;
    const from = fromRef.current;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (target - from) * eased;
      setDisplay(v);
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

export function AnimatedNumber({ value, suffix = '', className = '' }) {
  const v = useCountUp(value);
  return <span className={`tabular ${className}`}>{Math.round(v).toLocaleString('id-ID')}{suffix}</span>;
}

// ---------------------------------------------------------------------------
// Card + Section header
// ---------------------------------------------------------------------------
export function Card({ title, subtitle, icon: Icon, accent = BRAND.pink, action, children, className = '', bodyClassName = '' }) {
  return (
    <div className={`dcard reveal flex flex-col ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="flex items-start gap-3 min-w-0">
            {Icon && (
              <div className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center" style={{ background: `${accent}14`, color: accent }}>
                <Icon size={18} />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-display text-[15px] font-bold text-[#14141F] leading-tight">{title}</h3>
              {subtitle && <p className="text-xs text-[#6B6B7B] mt-1">{subtitle}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      <div className={`flex-1 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
}

export function SectionHeader({ id, index, title, subtitle, icon: Icon, color = BRAND.pink, highlight }) {
  return (
    <div id={id} className="section-anchor flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between pt-4">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center text-white shadow-lg"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)`, boxShadow: `0 12px 24px -12px ${color}` }}>
          <Icon size={22} />
          <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-[#14141F] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#F6F6FA]">
            {String(index).padStart(2, '0')}
          </span>
        </div>
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#14141F]">{title}</h2>
          {subtitle && <p className="text-sm text-[#6B6B7B]">{subtitle}</p>}
        </div>
      </div>
      {highlight && (
        <div className="text-sm text-[#6B6B7B] bg-white border border-[rgba(20,20,31,0.07)] rounded-2xl px-4 py-2.5 max-w-md">
          {highlight}
        </div>
      )}
    </div>
  );
}

export const ClickHint = () => (
  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[#6B6B7B] bg-[#F6F6FA] rounded-full px-2.5 py-1 shrink-0">
    <MousePointerClick size={12} /> Klik untuk filter
  </span>
);

export const Skeleton = ({ className = '' }) => <div className={`skeleton ${className}`} />;

export const EmptyState = ({ text = 'Belum ada data' }) => (
  <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-[#6B6B7B]">{text}</div>
);

// ---------------------------------------------------------------------------
// BarList — horizontal ranked bars with count + percentage
// ---------------------------------------------------------------------------
export function BarList({ data = [], total, color, colors, maxItems = 8, onSelect, activeName, unitLabel = 'responden', rankOffset = 0, maxValue }) {
  const [expanded, setExpanded] = useState(false);
  const base = total ?? data.reduce((s, d) => s + d.value, 0);
  const max = maxValue || Math.max(1, ...data.map(d => d.value));
  const shown = expanded ? data : data.slice(0, maxItems);

  if (!data.length) return <EmptyState />;

  return (
    <div>
      <div className={`space-y-0.5 ${activeName ? 'barlist-dim' : ''}`}>
        {shown.map((item, i) => {
          const c = colors?.[item.name] || color || PALETTE[i % PALETTE.length];
          const isActive = activeName === item.name;
          const Tag = onSelect ? 'button' : 'div';
          return (
            <Tag
              key={item.name}
              type={onSelect ? 'button' : undefined}
              onClick={onSelect ? () => onSelect(item.name) : undefined}
              className={`barlist-row group ${onSelect ? 'cursor-pointer' : ''}`}
              style={isActive ? { opacity: 1, background: `${c}10` } : undefined}
              title={`${item.name}: ${fmtNum(item.value)} ${unitLabel}`}
            >
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[11px] font-bold w-5 text-center shrink-0 rounded-md py-0.5"
                    style={i + rankOffset < 3 ? { background: `${c}18`, color: c } : { color: '#9A9AAA' }}>
                    {i + 1 + rankOffset}
                  </span>
                  <span className="text-[13px] font-medium text-[#14141F] truncate">{item.name}</span>
                </div>
                <div className="flex items-baseline gap-2 shrink-0">
                  <span className="text-[13px] font-bold tabular text-[#14141F]">{fmtNum(item.value)}</span>
                  <span className="text-[11px] font-semibold tabular w-11 text-right" style={{ color: c }}>{fmtPct(item.value, base)}</span>
                </div>
              </div>
              <div className="barlist-track ml-7">
                <div
                  className="barlist-fill"
                  style={{
                    width: `${Math.max(1.5, (item.value / max) * 100)}%`,
                    background: `linear-gradient(90deg, ${c}, ${c}B3)`,
                    animationDelay: `${i * 60}ms`,
                  }}
                />
              </div>
            </Tag>
          );
        })}
      </div>
      {data.length > maxItems && (
        <button onClick={() => setExpanded(!expanded)} className="mt-3 ml-2 inline-flex items-center gap-1 text-xs font-semibold text-[#ED145B] hover:underline">
          {expanded ? 'Tampilkan lebih sedikit' : `Lihat semua (${data.length})`}
          <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Donut — pure SVG, hover syncs with legend, all percentages visible in legend
// ---------------------------------------------------------------------------
export function Donut({ data = [], colorMap, onSelect, activeName, centerLabel = 'Responden', size = 200, wide = false }) {
  const [hover, setHover] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

  const items = data.filter(d => d.value > 0);
  const total = items.reduce((s, d) => s + d.value, 0);
  const r = 42;
  const C = 2 * Math.PI * r;
  const gap = items.length > 1 ? 1.2 : 0;

  const segments = useMemo(() => {
    let acc = 0;
    return items.map((d, i) => {
      const len = total ? (d.value / total) * C : 0;
      const seg = { ...d, color: colorMap?.[d.name] || PALETTE[i % PALETTE.length], len: Math.max(0.6, len - gap), offset: acc };
      acc += len;
      return seg;
    });
  }, [items, total, C, colorMap, gap]);

  if (!total) return <EmptyState />;

  const focus = segments.find(s => s.name === (hover || activeName));

  return (
    <div className={`flex flex-col items-center gap-5 ${wide ? 'sm:flex-row' : ''}`}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(20,20,31,0.05)" strokeWidth="11" />
          {segments.map((s) => {
            const isFocus = focus?.name === s.name;
            const dim = focus && !isFocus;
            return (
              <circle
                key={s.name}
                cx="50" cy="50" r={r} fill="none"
                stroke={s.color}
                strokeWidth={isFocus ? 14 : 11}
                strokeLinecap="butt"
                strokeDasharray={`${mounted ? s.len : 0} ${C}`}
                strokeDashoffset={-s.offset}
                style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(.2,.8,.2,1), stroke-width 0.2s ease, opacity 0.2s ease', opacity: dim ? 0.3 : 1, cursor: onSelect ? 'pointer' : 'default' }}
                onMouseEnter={() => setHover(s.name)}
                onMouseLeave={() => setHover(null)}
                onClick={onSelect ? () => onSelect(s.name) : undefined}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-6">
          {focus ? (
            <>
              <span className="font-display text-3xl font-extrabold tabular" style={{ color: focus.color }}>{fmtPct(focus.value, total)}</span>
              <span className="text-[11px] font-semibold text-[#14141F] leading-tight mt-0.5 line-clamp-2">{focus.name}</span>
              <span className="text-[10px] text-[#6B6B7B] tabular">{fmtNum(focus.value)} orang</span>
            </>
          ) : (
            <>
              <AnimatedNumber value={total} className="font-display text-3xl font-extrabold text-[#14141F]" />
              <span className="text-[11px] text-[#6B6B7B] font-medium">{centerLabel}</span>
            </>
          )}
        </div>
      </div>

      <div className="w-full space-y-1">
        {segments.map((s) => {
          const isFocus = focus?.name === s.name;
          return (
            <button
              key={s.name}
              type="button"
              onMouseEnter={() => setHover(s.name)}
              onMouseLeave={() => setHover(null)}
              onClick={onSelect ? () => onSelect(s.name) : undefined}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-all ${isFocus ? 'bg-[#F6F6FA]' : 'hover:bg-[#F6F6FA]'} ${onSelect ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="h-2.5 w-2.5 rounded-full shrink-0 transition-transform" style={{ background: s.color, transform: isFocus ? 'scale(1.4)' : 'scale(1)' }} />
              <span className="text-[13px] font-medium text-[#14141F] flex-1 truncate">{s.name}</span>
              <span className="text-[12px] text-[#6B6B7B] tabular">{fmtNum(s.value)}</span>
              <span className="text-[13px] font-bold tabular w-12 text-right" style={{ color: s.color }}>{fmtPct(s.value, total)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Columns — vertical bars for ordinal data (ordered small -> large)
// ---------------------------------------------------------------------------
export function Columns({ data = [], color = BRAND.pink, colorMap, height = 200, onSelect, activeName }) {
  const [hover, setHover] = useState(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const max = Math.max(1, ...data.map(d => d.value));
  if (!total) return <EmptyState />;

  return (
    <div className="flex items-end gap-2 sm:gap-3" style={{ height: height + 56 }}>
      {data.map((d, i) => {
        const c = colorMap?.[d.name] || color;
        const h = Math.max(4, (d.value / max) * height);
        const focus = hover === d.name || activeName === d.name;
        const dim = (hover || activeName) && !focus;
        const opacity = colorMap ? 1 : 0.45 + (0.55 * (i + 1)) / data.length;
        const Tag = onSelect ? 'button' : 'div';
        return (
          <Tag
            key={d.name}
            type={onSelect ? 'button' : undefined}
            className={`group flex-1 min-w-0 flex flex-col items-center justify-end h-full ${onSelect ? 'cursor-pointer' : ''}`}
            onMouseEnter={() => setHover(d.name)}
            onMouseLeave={() => setHover(null)}
            onClick={onSelect ? () => onSelect(d.name) : undefined}
            style={{ opacity: dim ? 0.4 : 1, transition: 'opacity 0.2s ease' }}
          >
            <span className="text-[13px] font-extrabold tabular mb-0.5" style={{ color: c }}>{fmtPct(d.value, total)}</span>
            <span className={`text-[10px] tabular text-[#6B6B7B] mb-1.5 transition-opacity ${focus ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'}`}>{fmtNum(d.value)}</span>
            <div
              className="w-full max-w-[72px] rounded-t-xl rounded-b-md origin-bottom"
              style={{
                height: h,
                background: `linear-gradient(180deg, ${c}, ${c}99)`,
                opacity,
                transform: focus ? 'scaleY(1.03)' : 'scaleY(1)',
                boxShadow: focus ? `0 12px 24px -10px ${c}` : 'none',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                animation: `growY 0.9s cubic-bezier(.2,.8,.2,1) ${i * 80}ms both`,
              }}
            />
            <span className="mt-2 text-[11px] sm:text-xs font-medium text-[#14141F] text-center leading-tight h-8 line-clamp-2">{d.name}</span>
          </Tag>
        );
      })}
      <style>{`@keyframes growY { from { transform: scaleY(0); } to { transform: scaleY(1); } }`}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TextFeed — searchable list of free-text answers
// ---------------------------------------------------------------------------
export function TextFeed({ items = [], placeholder = 'Cari...', accent = BRAND.pink, height = 300 }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? items.filter(s => s.toLowerCase().includes(t)) : items;
  }, [items, q]);

  const highlight = (text) => {
    const t = q.trim();
    if (!t) return text;
    const idx = text.toLowerCase().indexOf(t.toLowerCase());
    if (idx < 0) return text;
    return (<>{text.slice(0, idx)}<mark className="rounded px-0.5" style={{ background: `${accent}25`, color: 'inherit' }}>{text.slice(idx, idx + t.length)}</mark>{text.slice(idx + t.length)}</>);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9AAA]" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder={placeholder} className="dinput pl-9 py-2 text-[13px]" />
      </div>
      <p className="text-[11px] text-[#6B6B7B] mb-2 tabular">{fmtNum(filtered.length)} dari {fmtNum(items.length)} masukan</p>
      <div className="overflow-y-auto thin-scroll pr-1 space-y-2" style={{ maxHeight: height }}>
        {filtered.length ? filtered.map((text, i) => (
          <div key={i} className="flex gap-3 rounded-xl bg-[#F6F6FA] px-3 py-2.5 hover:bg-[#EFEFF5] transition-colors">
            <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: accent }} />
            <p className="text-[13px] text-[#2A2A3A] leading-relaxed">{highlight(text)}</p>
          </div>
        )) : <EmptyState text="Tidak ada masukan yang cocok" />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers for sections
// ---------------------------------------------------------------------------
export const topOf = (arr = []) => arr.reduce((b, d) => (!b || d.value > b.value ? d : b), null);
export const sumOf = (arr = []) => arr.reduce((s, d) => s + d.value, 0);

export const Insight = ({ children }) => (
  <span className="inline-flex items-start gap-2">
    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#ED145B] shrink-0" />
    <span>{children}</span>
  </span>
);

export function SectionSkeleton({ cols = 3, count = 3 }) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:gap-5 ${cols === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="dcard p-6"><Skeleton className="h-5 w-40 mb-6" /><Skeleton className="h-52 w-full" /></div>
      ))}
    </div>
  );
}
