import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Phone, MapPin, CalendarClock, User, Footprints, UtensilsCrossed, PartyPopper, Megaphone, Star, BellRing } from 'lucide-react';
import { fetchResponseDetail } from '../../services/dashboardService';
import { BRAND, COLOR_MAPS, Skeleton } from './ui/primitives';

const Section = ({ title, icon: Icon, color, children }) => (
  <div className="dcard p-4 sm:p-5">
    <div className="flex items-center gap-2.5 mb-4">
      <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, color }}><Icon size={16} /></div>
      <h4 className="font-display font-bold text-[15px] text-[#14141F]">{title}</h4>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">{children}</div>
  </div>
);

const Field = ({ label, value, wide, color = BRAND.pink }) => {
  const isArr = Array.isArray(value);
  const empty = isArr ? value.length === 0 : !value;
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9AAA] mb-1.5">{label}</p>
      {empty ? <p className="text-sm text-[#BBBBC8]">-</p> : isArr ? (
        <div className="flex flex-wrap gap-1.5">
          {value.map((v, i) => (
            <span key={i} className="rounded-full px-2.5 py-1 text-[12px] font-medium" style={{ background: `${color}12`, color: '#14141F', border: `1px solid ${color}30` }}>{v}</span>
          ))}
        </div>
      ) : <p className="text-sm font-medium text-[#14141F] leading-relaxed">{value}</p>}
    </div>
  );
};

export default function ResponseDetail({ responseId, onClose, onPrev, onNext, hasPrev, hasNext, positionLabel }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!responseId) return;
    let alive = true;
    setLoading(true); setError(null);
    fetchResponseDetail(responseId)
      .then(r => { if (alive) setData(r); })
      .catch(e => { if (alive) setError(e.message); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [responseId]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!responseId) return null;

  const satColor = COLOR_MAPS.satisfaction[data?.satisfaction_level] || BRAND.gray;
  const revColor = COLOR_MAPS.revisit[data?.revisit_intention] || BRAND.gray;
  const initials = (data?.visitor_name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer-panel" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="relative overflow-hidden text-white px-5 pt-5 pb-6 sm:px-6" style={{ background: `linear-gradient(120deg, ${BRAND.pink}, ${BRAND.purple})` }}>
          <div className="hero-grid" />
          <div className="relative flex items-center justify-between mb-5">
            <div className="flex items-center gap-1.5">
              <button onClick={onPrev} disabled={!hasPrev} className="h-9 w-9 rounded-xl bg-white/15 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition" title="Sebelumnya (←)"><ChevronLeft size={18} /></button>
              <button onClick={onNext} disabled={!hasNext} className="h-9 w-9 rounded-xl bg-white/15 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition" title="Berikutnya (→)"><ChevronRight size={18} /></button>
              {positionLabel && <span className="ml-2 text-xs font-semibold text-white/80 tabular">{positionLabel}</span>}
            </div>
            <button onClick={onClose} className="h-9 w-9 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition" title="Tutup (Esc)"><X size={18} /></button>
          </div>
          {loading ? (
            <div className="relative flex items-center gap-4"><div className="h-16 w-16 rounded-2xl bg-white/20 animate-pulse" /><div className="space-y-2"><div className="h-5 w-40 rounded bg-white/20 animate-pulse" /><div className="h-3 w-28 rounded bg-white/20 animate-pulse" /></div></div>
          ) : data && (
            <div className="relative flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-display text-2xl font-extrabold ring-2 ring-white/30">{initials}</div>
              <div className="min-w-0">
                <h3 className="font-display text-xl sm:text-2xl font-extrabold truncate">{data.visitor_name || 'Tanpa nama'}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/85">
                  <span className="inline-flex items-center gap-1"><CalendarClock size={13} />{new Date(data.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  {data.city && <span className="inline-flex items-center gap-1"><MapPin size={13} />{data.city}</span>}
                  {data.phone_number && <span className="inline-flex items-center gap-1"><Phone size={13} />{data.phone_number}</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick badges */}
        {data && !loading && (
          <div className="grid grid-cols-3 gap-2 px-5 sm:px-6 -mt-4 relative z-10">
            {[
              { label: 'Kepuasan', value: data.satisfaction_level, color: satColor },
              { label: 'Kembali', value: data.revisit_intention, color: revColor },
              { label: 'Promo', value: data.promo_consent ? 'Bersedia' : 'Tidak', color: data.promo_consent ? BRAND.teal : BRAND.gray, icon: BellRing },
            ].map(b => (
              <div key={b.label} className="rounded-2xl bg-white px-3 py-2.5 shadow-lg shadow-black/5 border border-black/5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9A9AAA]">{b.label}</p>
                <p className="text-sm font-bold truncate" style={{ color: b.color }}>{b.value || '-'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto thin-scroll px-5 sm:px-6 py-5 space-y-4">
          {loading ? (
            [0, 1, 2].map(i => <div key={i} className="dcard p-5"><Skeleton className="h-5 w-32 mb-4" /><Skeleton className="h-20 w-full" /></div>)
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">Gagal memuat data: {error}</div>
          ) : data && (
            <>
              <Section title="Profil" icon={User} color={BRAND.pink}>
                <Field label="Kelompok Usia" value={data.age_group} />
                <Field label="Gender" value={data.gender} />
              </Section>
              <Section title="Perilaku Kunjungan" icon={Footprints} color={BRAND.orange}>
                <Field label="Frekuensi" value={data.visit_frequency} />
                <Field label="Tujuan Utama" value={data.visit_purpose === 'Lainnya' && data.visit_purpose_other ? `Lainnya: ${data.visit_purpose_other}` : data.visit_purpose} />
                <Field label="Datang Bersama" value={data.companions} />
                <Field label="Durasi" value={data.visit_duration} />
                <Field label="Pengeluaran" value={data.estimated_spending} />
                <Field label="Waktu Favorit" value={data.preferred_visit_time} />
              </Section>
              <Section title="Kuliner & F&B" icon={UtensilsCrossed} color={BRAND.teal}>
                <Field label="Variasi Makanan" value={data.food_variety} wide />
                <Field label="Tenant F&B Diinginkan" value={data.desired_fnb_tenants} wide color={BRAND.teal} />
                <Field label="Faktor Memilih Tempat Makan" value={data.dining_factors} wide color={BRAND.teal} />
                <Field label="Tenant yang Diharapkan" value={data.requested_tenants} wide />
              </Section>
              <Section title="Hiburan & Event" icon={PartyPopper} color={BRAND.purple}>
                <Field label="Area Hiburan" value={data.entertainment_areas} wide color={BRAND.purple} />
                <Field label="Pentingnya Hiburan Keluarga" value={data.family_entertainment_importance} />
                <Field label="Minat Karena Event" value={data.event_visit_interest} />
                <Field label="Event Diinginkan" value={data.desired_events} wide color={BRAND.purple} />
              </Section>
              <Section title="Media & Promosi" icon={Megaphone} color={BRAND.yellow}>
                <Field label="Promosi Disukai" value={data.preferred_promotions} wide color={BRAND.orange} />
                <Field label="Sumber Info Promo" value={data.promotion_information_sources} wide color={BRAND.orange} />
                <Field label="Media Efektif" value={data.effective_media_channels} wide color={BRAND.orange} />
              </Section>
              <Section title="Saran & Masukan" icon={Star} color={BRAND.pink}>
                <div className="sm:col-span-2">
                  {data.visitor_suggestions ? (
                    <blockquote className="relative rounded-2xl bg-[#F6F6FA] p-4 text-[14px] leading-relaxed text-[#2A2A3A] italic border-l-4" style={{ borderColor: BRAND.pink }}>
                      "{data.visitor_suggestions}"
                    </blockquote>
                  ) : <p className="text-sm text-[#BBBBC8]">Tidak ada saran</p>}
                </div>
              </Section>
            </>
          )}
        </div>
        <div className="hidden sm:block px-6 py-3 border-t border-black/5 text-[11px] text-[#9A9AAA] bg-white/60">
          Tips: gunakan tombol <kbd className="px-1.5 py-0.5 rounded bg-black/5 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-black/5 font-mono">→</kbd> untuk pindah responden, <kbd className="px-1.5 py-0.5 rounded bg-black/5 font-mono">Esc</kbd> untuk menutup.
        </div>
      </aside>
    </>
  );
}
