import React from 'react';
import { Search, Download, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ArrowRight, CalendarDays, Inbox, MapPin } from 'lucide-react';
import { BRAND, COLOR_MAPS, fmtNum, Skeleton } from './ui/primitives';

const Badge = ({ value, map }) => {
  if (!value) return <span className="text-[#BBBBC8]">-</span>;
  const c = map[value] || BRAND.gray;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold" style={{ background: `${c}14`, color: c }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />{value}
    </span>
  );
};

const Avatar = ({ name }) => {
  const n = (name || '?').trim();
  const initials = n.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '?';
  const colors = [BRAND.pink, BRAND.teal, BRAND.orange, BRAND.purple, BRAND.yellow];
  const c = colors[n.charCodeAt(0) % colors.length] || BRAND.pink;
  return <div className="h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-white text-[12px] font-bold" style={{ background: `linear-gradient(135deg, ${c}, ${c}AA)` }}>{initials}</div>;
};

const COLUMNS = [
  { field: 'visitor_name', label: 'Responden' },
  { field: 'created_at', label: 'Tanggal' },
  { field: 'age_group', label: 'Usia' },
  { field: 'gender', label: 'Gender' },
  { field: 'visit_purpose', label: 'Tujuan' },
  { field: 'satisfaction_level', label: 'Kepuasan' },
  { field: 'revisit_intention', label: 'Kembali' },
];

const SAT_CHIPS = ['Sangat Puas', 'Puas', 'Cukup', 'Kurang Puas'];

export default function ResponseTable({
  data = [], count = 0, loading, page, pageSize, setPage, setPageSize,
  sortField, setSortField, sortDirection, setSortDirection,
  searchTerm, setSearchTerm, onRowClick, onExport, exporting,
  months = [], selectedMonthKey, onSelectMonth, filters = {}, onFilter,
}) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const allTotal = months.reduce((s, m) => s + m.total, 0);

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection(field === 'created_at' ? 'desc' : 'asc'); }
  };

  const pages = (() => {
    const out = [];
    let s = Math.max(1, page - 2), e = Math.min(totalPages, s + 4);
    s = Math.max(1, e - 4);
    for (let i = s; i <= e; i++) out.push(i);
    return out;
  })();

  const fmtDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  const fmtTime = (d) => new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Month strip */}
      <div className="dcard reveal p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-[#ED145B]" />
            <h3 className="font-display font-bold text-[15px]">Pilih Bulan</h3>
          </div>
          <span className="text-xs text-[#6B6B7B]">{months.length} bulan data</span>
        </div>
        <div className="flex gap-2 overflow-x-auto thin-scroll pb-1">
          <button onClick={() => onSelectMonth(null)} className={`month-chip ${!selectedMonthKey ? 'active' : ''}`}>
            <span className={`text-[11px] font-semibold ${!selectedMonthKey ? 'text-white/80' : 'text-[#6B6B7B]'}`}>Semua</span>
            <span className="font-display text-lg font-extrabold tabular">{fmtNum(allTotal)}</span>
          </button>
          {[...months].reverse().map(m => {
            const active = m.key === selectedMonthKey;
            return (
              <button key={m.key} onClick={() => onSelectMonth(active ? null : m)} disabled={!m.total} className={`month-chip disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none ${active ? 'active' : ''}`}>
                <span className={`text-[11px] font-semibold whitespace-nowrap ${active ? 'text-white/80' : 'text-[#6B6B7B]'}`}>{m.label}</span>
                <span className="font-display text-lg font-extrabold tabular">{fmtNum(m.total)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table card */}
      <div className="dcard reveal overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 p-4 sm:p-5 border-b border-black/5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9AAA]" />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Cari nama atau kota..." className="dinput pl-9" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto thin-scroll">
              {SAT_CHIPS.map(s => {
                const active = filters.satisfactionLevel === s;
                const c = COLOR_MAPS.satisfaction[s];
                return (
                  <button key={s} onClick={() => onFilter('satisfactionLevel', s)}
                    className="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold border transition-all"
                    style={active ? { background: c, color: '#fff', borderColor: c } : { borderColor: 'rgba(20,20,31,0.08)', color: '#4D4D4F', background: '#fff' }}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="dinput w-auto py-2 text-[13px]">
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} / halaman</option>)}
            </select>
            <button onClick={onExport} disabled={exporting} className="dbtn dbtn-dark whitespace-nowrap disabled:opacity-60">
              <Download size={15} /> {exporting ? 'Menyiapkan...' : 'Export CSV'}
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-5 py-2.5 bg-[#FAFAFC] text-[12px] text-[#6B6B7B] border-b border-black/5">
          <b className="text-[#14141F] tabular">{fmtNum(count)}</b> responden ditemukan · klik baris untuk melihat detail lengkap
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto thin-scroll">
          <table className="dtable w-full text-sm">
            <thead>
              <tr>
                <th className="w-12 text-center">#</th>
                {COLUMNS.map(c => (
                  <th key={c.field} onClick={() => handleSort(c.field)} className="cursor-pointer select-none hover:text-[#14141F]">
                    <span className="inline-flex items-center gap-1">
                      {c.label}
                      {sortField === c.field ? (sortDirection === 'asc' ? <ChevronUp size={13} className="text-[#ED145B]" /> : <ChevronDown size={13} className="text-[#ED145B]" />) : <ChevronDown size={13} className="opacity-20" />}
                    </span>
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}><td colSpan={9}><Skeleton className="h-8 w-full" /></td></tr>
              )) : data.length ? data.map((row, i) => (
                <tr key={row.id} onClick={() => onRowClick(i)}>
                  <td className="text-center text-[12px] text-[#9A9AAA] tabular">{(page - 1) * pageSize + i + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={row.visitor_name} />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#14141F] truncate max-w-[200px]">{row.visitor_name || 'Tanpa nama'}</p>
                        <p className="text-[12px] text-[#9A9AAA] truncate max-w-[200px] inline-flex items-center gap-1"><MapPin size={11} />{row.city || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td><p className="text-[#14141F] tabular">{fmtDate(row.created_at)}</p><p className="text-[11px] text-[#9A9AAA] tabular">{fmtTime(row.created_at)}</p></td>
                  <td className="text-[#4D4D4F]">{row.age_group || '-'}</td>
                  <td className="text-[#4D4D4F]">{row.gender || '-'}</td>
                  <td className="text-[#4D4D4F] max-w-[180px] truncate">{row.visit_purpose || '-'}</td>
                  <td><Badge value={row.satisfaction_level} map={COLOR_MAPS.satisfaction} /></td>
                  <td><Badge value={row.revisit_intention} map={COLOR_MAPS.revisit} /></td>
                  <td className="text-right pr-5"><ArrowRight size={16} className="row-arrow inline text-[#ED145B]" /></td>
                </tr>
              )) : (
                <tr><td colSpan={9} className="py-16 text-center text-[#9A9AAA]"><Inbox className="mx-auto mb-2" size={28} />Tidak ada data yang cocok</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-black/5">
          {loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="p-4"><Skeleton className="h-16 w-full" /></div>)
            : data.length ? data.map((row, i) => (
              <button key={row.id} onClick={() => onRowClick(i)} className="w-full text-left p-4 active:bg-[#F6F6FA] transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar name={row.visitor_name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-[#14141F] truncate">{row.visitor_name || 'Tanpa nama'}</p>
                      <span className="text-[11px] text-[#9A9AAA] tabular shrink-0">{fmtDate(row.created_at)}</span>
                    </div>
                    <p className="text-[12px] text-[#6B6B7B] truncate">{[row.age_group, row.gender, row.city].filter(Boolean).join(' · ')}</p>
                  </div>
                </div>
                <div className="mt-2.5 ml-12 flex flex-wrap gap-1.5">
                  <Badge value={row.satisfaction_level} map={COLOR_MAPS.satisfaction} />
                  <Badge value={row.revisit_intention ? `Kembali: ${row.revisit_intention}` : null} map={{ [`Kembali: ${row.revisit_intention}`]: COLOR_MAPS.revisit[row.revisit_intention] }} />
                </div>
              </button>
            )) : <div className="py-16 text-center text-[#9A9AAA]"><Inbox className="mx-auto mb-2" size={28} />Tidak ada data yang cocok</div>}
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-black/5 px-4 sm:px-5 py-4 sm:flex-row">
          <span className="text-[13px] text-[#6B6B7B] tabular">
            {count ? <>Menampilkan <b className="text-[#14141F]">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, count)}</b> dari <b className="text-[#14141F]">{fmtNum(count)}</b></> : 'Tidak ada data'}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="h-9 w-9 rounded-xl border border-black/10 bg-white flex items-center justify-center disabled:opacity-30"><ChevronLeft size={16} /></button>
            {pages[0] > 1 && <><button onClick={() => setPage(1)} className="h-9 min-w-9 px-2 rounded-xl text-[13px] font-semibold hover:bg-black/5">1</button><span className="px-1 text-[#9A9AAA]">…</span></>}
            {pages.map(p => (
              <button key={p} onClick={() => setPage(p)} className={`h-9 min-w-9 px-2 rounded-xl text-[13px] font-semibold tabular transition-all ${p === page ? 'text-white shadow-md' : 'hover:bg-black/5 text-[#4D4D4F]'}`}
                style={p === page ? { background: `linear-gradient(135deg, ${BRAND.pink}, ${BRAND.orange})` } : undefined}>{p}</button>
            ))}
            {pages[pages.length - 1] < totalPages && <><span className="px-1 text-[#9A9AAA]">…</span><button onClick={() => setPage(totalPages)} className="h-9 min-w-9 px-2 rounded-xl text-[13px] font-semibold hover:bg-black/5 tabular">{totalPages}</button></>}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="h-9 w-9 rounded-xl border border-black/10 bg-white flex items-center justify-center disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
