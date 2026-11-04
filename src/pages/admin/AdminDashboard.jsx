import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar, { MobileBottomNav } from '../../components/admin/Sidebar';
import SummaryCards from '../../components/admin/SummaryCards';
import MonthlyTrend from '../../components/admin/MonthlyTrend';
import DemographicsCharts from '../../components/admin/charts/DemographicsCharts';
import BehaviorCharts from '../../components/admin/charts/BehaviorCharts';
import FnbCharts from '../../components/admin/charts/FnbCharts';
import EntertainmentCharts from '../../components/admin/charts/EntertainmentCharts';
import PromoCharts from '../../components/admin/charts/PromoCharts';
import ExperienceCharts from '../../components/admin/charts/ExperienceCharts';
import ResponseTable from '../../components/admin/ResponseTable';
import ResponseDetail from '../../components/admin/ResponseDetail';
import { exportToCSV } from '../../utils/csvExport';
import { BRAND, fmtNum, AnimatedNumber } from '../../components/admin/ui/primitives';
import {
  SlidersHorizontal, RefreshCw, X, LogOut, LayoutGrid, Users, Footprints, UtensilsCrossed,
  PartyPopper, Megaphone, Star, ArrowRight, Download, Sparkles, ArrowUp, Filter
} from 'lucide-react';
import {
  fetchSurveyStats, fetchDemographicsData, fetchBehaviorData, fetchFnbData,
  fetchEntertainmentData, fetchPromoData, fetchExperienceData, fetchResponses,
  exportResponses, fetchMonthlyTrend
} from '../../services/dashboardService';

const EMPTY_FILTERS = { dateFrom: '', dateTo: '', ageGroup: '', gender: '', city: '', satisfactionLevel: '', visitPurpose: '' };

const SECTIONS = [
  { id: 'ringkasan', label: 'Ringkasan', icon: LayoutGrid },
  { id: 'demografi', label: 'Demografi', icon: Users },
  { id: 'perilaku', label: 'Perilaku', icon: Footprints },
  { id: 'kuliner', label: 'Kuliner', icon: UtensilsCrossed },
  { id: 'hiburan', label: 'Hiburan', icon: PartyPopper },
  { id: 'promosi', label: 'Promosi', icon: Megaphone },
  { id: 'pengalaman', label: 'Kepuasan', icon: Star },
];

const FILTER_LABELS = {
  ageGroup: 'Usia', gender: 'Gender', city: 'Kota', satisfactionLevel: 'Kepuasan', visitPurpose: 'Tujuan',
};

const AGE_OPTIONS = ['< 17 Tahun', '17–24 Tahun', '25–34 Tahun', '35–54 Tahun', '> 55 Tahun'];
const SAT_OPTIONS = ['Sangat Puas', 'Puas', 'Cukup', 'Kurang Puas'];

const greeting = () => {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
};

const fmtShortDate = (s) => s ? new Date(`${s}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showFilters, setShowFilters] = useState(false);
  const [activeSection, setActiveSection] = useState('ringkasan');
  const [showTop, setShowTop] = useState(false);

  // Data
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ stats: null, demographics: null, behavior: null, fnb: null, entertainment: null, promo: null, experience: null });
  const [months, setMonths] = useState([]);
  const [trendLoading, setTrendLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Filters
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [activeFilters, setActiveFilters] = useState(EMPTY_FILTERS);

  // Table
  const [tableData, setTableData] = useState([]);
  const [tableCount, setTableCount] = useState(0);
  const [tableLoading, setTableLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [exporting, setExporting] = useState(false);

  // Detail drawer
  const [selectedIndex, setSelectedIndex] = useState(null);
  const pendingSelect = useRef(null);

  // ---------- Loaders ----------
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(searchTerm); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([
      fetchSurveyStats(activeFilters), fetchDemographicsData(activeFilters), fetchBehaviorData(activeFilters),
      fetchFnbData(activeFilters), fetchEntertainmentData(activeFilters), fetchPromoData(activeFilters), fetchExperienceData(activeFilters),
    ]).then(([stats, demographics, behavior, fnb, entertainment, promo, experience]) => {
      if (!alive) return;
      setData({ stats, demographics, behavior, fnb, entertainment, promo, experience });
      setLastUpdated(new Date());
    }).catch(err => console.error('Error loading dashboard data:', err))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [activeFilters, refreshKey]);

  // Trend ignores date filters — refetch only when other filters change
  const nonDateKey = JSON.stringify({ ...activeFilters, dateFrom: '', dateTo: '' });
  useEffect(() => {
    let alive = true;
    setTrendLoading(true);
    fetchMonthlyTrend(JSON.parse(nonDateKey))
      .then(m => alive && setMonths(m))
      .catch(err => console.error('Error loading trend:', err))
      .finally(() => alive && setTrendLoading(false));
    return () => { alive = false; };
  }, [nonDateKey, refreshKey]);

  useEffect(() => {
    let alive = true;
    setTableLoading(true);
    fetchResponses(activeFilters, page, pageSize, sortField, sortDirection, debouncedSearch)
      .then(({ data: rows, count }) => {
        if (!alive) return;
        setTableData(rows || []);
        setTableCount(count || 0);
        if (pendingSelect.current && rows?.length) {
          setSelectedIndex(pendingSelect.current === 'first' ? 0 : rows.length - 1);
          pendingSelect.current = null;
        }
      })
      .catch(err => console.error('Error loading table:', err))
      .finally(() => alive && setTableLoading(false));
    return () => { alive = false; };
  }, [activeFilters, page, pageSize, sortField, sortDirection, debouncedSearch, refreshKey]);

  // ---------- Scroll spy & back-to-top ----------
  useEffect(() => {
    if (activeTab !== 'dashboard') return;
    const obs = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveSection(visible[0].target.id);
    }, { rootMargin: '-140px 0px -55% 0px', threshold: 0 });
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [activeTab, loading]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ---------- Filter actions ----------
  const applyFilters = useCallback((next) => {
    setActiveFilters(next);
    setDraft(next);
    setPage(1);
  }, []);

  const toggleFilter = useCallback((field, value) => {
    setActiveFilters(prev => {
      const next = { ...prev, [field]: prev[field] === value ? '' : value };
      setDraft(next);
      return next;
    });
    setPage(1);
  }, []);

  const selectMonth = useCallback((m) => {
    setActiveFilters(prev => {
      const next = { ...prev, dateFrom: m ? m.dateFrom : '', dateTo: m ? m.dateTo : '' };
      setDraft(next);
      return next;
    });
    setPage(1);
  }, []);

  const resetAll = () => { applyFilters(EMPTY_FILTERS); setSearchTerm(''); };

  const selectedMonth = months.find(m => m.dateFrom === activeFilters.dateFrom && m.dateTo === activeFilters.dateTo) || null;

  const chips = useMemo(() => {
    const out = [];
    if (activeFilters.dateFrom || activeFilters.dateTo) {
      out.push({
        key: 'date',
        label: selectedMonth ? `Bulan: ${selectedMonth.longLabel}` : `Tanggal: ${fmtShortDate(activeFilters.dateFrom) || '…'} – ${fmtShortDate(activeFilters.dateTo) || '…'}`,
        clear: () => selectMonth(null),
      });
    }
    Object.keys(FILTER_LABELS).forEach(k => {
      if (activeFilters[k]) out.push({ key: k, label: `${FILTER_LABELS[k]}: ${activeFilters[k]}`, clear: () => toggleFilter(k, activeFilters[k]) });
    });
    return out;
  }, [activeFilters, selectedMonth, selectMonth, toggleFilter]);

  // ---------- Misc actions ----------
  const handleExport = async () => {
    setExporting(true);
    try { exportToCSV(await exportResponses(activeFilters)); }
    catch (e) { console.error(e); alert('Gagal mengexport data.'); }
    finally { setExporting(false); }
  };

  const changeTab = (id) => {
    setActiveTab(id);
    setShowFilters(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Detail navigation (crosses page boundaries)
  const totalPages = Math.max(1, Math.ceil(tableCount / pageSize));
  const absIndex = selectedIndex !== null ? (page - 1) * pageSize + selectedIndex : null;
  const goNext = useCallback(() => {
    if (selectedIndex === null) return;
    if (selectedIndex < tableData.length - 1) setSelectedIndex(selectedIndex + 1);
    else if (page < totalPages) { pendingSelect.current = 'first'; setPage(page + 1); }
  }, [selectedIndex, tableData.length, page, totalPages]);
  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    if (selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
    else if (page > 1) { pendingSelect.current = 'last'; setPage(page - 1); }
  }, [selectedIndex, page]);
  const closeDetail = useCallback(() => setSelectedIndex(null), []);

  const total = data.stats?.totalResponses || 0;
  const allTimeTotal = months.reduce((s, m) => s + m.total, 0);
  const purposeOptions = (data.behavior?.visitPurpose || []).map(p => p.name);
  const genderOptions = (data.demographics?.genders || []).map(g => g.name);

  // ---------- Render ----------
  const FilterPanel = (
    <div className="dcard p-4 sm:p-5 mt-3 animate-[revealUp_0.3s_ease]">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-bold text-[15px] flex items-center gap-2"><Filter size={16} className="text-[#ED145B]" /> Filter Lanjutan</h4>
        <button onClick={() => setShowFilters(false)} className="h-8 w-8 rounded-lg hover:bg-black/5 flex items-center justify-center"><X size={16} /></button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <label className="block"><span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B7B]">Dari tanggal</span>
          <input type="date" value={draft.dateFrom} onChange={e => setDraft({ ...draft, dateFrom: e.target.value })} className="dinput mt-1" /></label>
        <label className="block"><span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B7B]">Sampai tanggal</span>
          <input type="date" value={draft.dateTo} onChange={e => setDraft({ ...draft, dateTo: e.target.value })} className="dinput mt-1" /></label>
        <label className="block"><span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B7B]">Kelompok usia</span>
          <select value={draft.ageGroup} onChange={e => setDraft({ ...draft, ageGroup: e.target.value })} className="dinput mt-1">
            <option value="">Semua usia</option>{AGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select></label>
        <label className="block"><span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B7B]">Gender</span>
          <select value={draft.gender} onChange={e => setDraft({ ...draft, gender: e.target.value })} className="dinput mt-1">
            <option value="">Semua gender</option>{(genderOptions.length ? genderOptions : ['Laki-laki', 'Perempuan']).map(o => <option key={o} value={o}>{o}</option>)}
          </select></label>
        <label className="block"><span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B7B]">Kota (kata kunci)</span>
          <input type="text" placeholder="mis. Kampar" value={draft.city} onChange={e => setDraft({ ...draft, city: e.target.value })} className="dinput mt-1" /></label>
        <label className="block"><span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B7B]">Kepuasan</span>
          <select value={draft.satisfactionLevel} onChange={e => setDraft({ ...draft, satisfactionLevel: e.target.value })} className="dinput mt-1">
            <option value="">Semua tingkat</option>{SAT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select></label>
        <label className="block sm:col-span-2"><span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B7B]">Tujuan kunjungan</span>
          <select value={draft.visitPurpose} onChange={e => setDraft({ ...draft, visitPurpose: e.target.value })} className="dinput mt-1">
            <option value="">Semua tujuan</option>{purposeOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select></label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => { applyFilters(draft); setShowFilters(false); }} className="dbtn dbtn-primary">Terapkan Filter</button>
        <button onClick={resetAll} className="dbtn dbtn-ghost"><RefreshCw size={14} /> Reset semua</button>
      </div>
    </div>
  );

  const ChipsBar = chips.length > 0 && (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B7B]">Filter aktif:</span>
      {chips.map(c => (
        <span key={c.key} className="filter-chip">{c.label}<button onClick={c.clear} aria-label="Hapus filter"><X size={12} /></button></span>
      ))}
      <button onClick={resetAll} className="text-[12px] font-semibold text-[#6B6B7B] hover:text-[#14141F] underline-offset-2 hover:underline">Hapus semua</button>
    </div>
  );

  return (
    <div className="dash-root flex font-sans">
      <Sidebar activeTab={activeTab} onTabChange={changeTab} user={user} totalCount={allTimeTotal} />

      <main className="flex-1 min-w-0 pb-28 lg:pb-10">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 pt-4">
          <div className="rounded-xl bg-white px-3 py-2 shadow-sm"><img src="/assets/pxchange-logo.png" alt="PXchange" className="h-6 w-auto" /></div>
          <button onClick={signOut} className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#6B6B7B]" title="Logout"><LogOut size={17} /></button>
        </div>

        {/* Sticky toolbar */}
        <div className="sticky top-0 z-40 px-4 sm:px-6 lg:px-8 pt-3 pb-3 bg-[#F6F6FA]/80 backdrop-blur-xl border-b border-black/[0.04]">
          <div className="flex items-center gap-3">
            {activeTab === 'dashboard' ? (
              <div className="section-nav flex-1 min-w-0">
                {SECTIONS.map(s => {
                  const Icon = s.icon;
                  return (
                    <button key={s.id} onClick={() => scrollToSection(s.id)} className={`section-pill ${activeSection === s.id ? 'active' : ''}`}>
                      <Icon size={14} /> {s.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-lg sm:text-xl font-extrabold">Data Responden</h1>
                <p className="text-xs text-[#6B6B7B]">Telusuri dan cek jawaban setiap responden</p>
              </div>
            )}
            <button onClick={() => setRefreshKey(k => k + 1)} title="Muat ulang data" className="hidden sm:flex h-10 w-10 shrink-0 rounded-xl bg-white border border-black/[0.07] items-center justify-center text-[#4D4D4F] hover:text-[#ED145B] transition-colors">
              <RefreshCw size={16} className={loading || trendLoading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => setShowFilters(!showFilters)} className={`dbtn shrink-0 ${showFilters ? 'dbtn-dark' : 'dbtn-ghost'}`}>
              <SlidersHorizontal size={15} /> <span className="hidden sm:inline">Filter</span>
              {chips.length > 0 && <span className="h-5 min-w-5 px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white" style={{ background: BRAND.pink }}>{chips.length}</span>}
            </button>
          </div>
          {showFilters && FilterPanel}
          {ChipsBar}
        </div>

        <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6" key={activeTab}>
          {activeTab === 'dashboard' ? (
            <div className="space-y-8 sm:space-y-10">
              {/* HERO + KPI + TREND */}
              <div id="ringkasan" className="section-anchor space-y-4 sm:space-y-5">
                <div className="dash-hero reveal p-6 sm:p-8">
                  <div className="hero-grid" />
                  <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-xl">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="hero-chip"><span className="pulse-dot" /> Live dari survey</span>
                        <span className="hero-chip">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05]">
                        {greeting()}, Admin
                      </h1>
                      <p className="mt-3 text-white/80 text-sm sm:text-base max-w-lg">
                        {selectedMonth
                          ? <>Menampilkan insight pengunjung untuk <b className="text-white">{selectedMonth.longLabel}</b>. Klik "Semua bulan" untuk kembali.</>
                          : <>Ini rangkuman suara pengunjung Pekanbaru Xchange. Klik grafik untuk menyaring data secara instan.</>}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <button onClick={() => changeTab('responses')} className="dbtn bg-white text-[#14141F] hover:bg-white/90">Lihat Data Responden <ArrowRight size={15} /></button>
                        <button onClick={handleExport} disabled={exporting} className="dbtn bg-white/15 text-white border border-white/25 hover:bg-white/25"><Download size={15} /> {exporting ? 'Menyiapkan...' : 'Export CSV'}</button>
                      </div>
                    </div>
                    <div className="lg:text-right">
                      <p className="text-white/70 text-xs font-semibold uppercase tracking-[0.15em] flex items-center gap-1.5 lg:justify-end"><Sparkles size={13} /> {chips.length ? 'Responden (terfilter)' : 'Total suara pengunjung'}</p>
                      <AnimatedNumber value={total} className="font-display text-6xl sm:text-7xl font-extrabold leading-none block mt-1" />
                      <p className="text-white/60 text-xs mt-2">
                        {lastUpdated ? `Diperbarui ${lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : 'Memuat...'}
                        {chips.length > 0 && ` · dari ${fmtNum(allTimeTotal)} total`}
                      </p>
                    </div>
                  </div>
                </div>

                <SummaryCards stats={data.stats} months={months} loading={loading} />
                <MonthlyTrend months={months} loading={trendLoading} selectedKey={selectedMonth?.key} onSelectMonth={selectMonth} />
              </div>

              <DemographicsCharts data={data.demographics} loading={loading} filters={activeFilters} onFilter={toggleFilter} index={1} />
              <BehaviorCharts data={data.behavior} loading={loading} filters={activeFilters} onFilter={toggleFilter} index={2} />
              <FnbCharts data={data.fnb} loading={loading} total={total} index={3} />
              <EntertainmentCharts data={data.entertainment} loading={loading} total={total} index={4} />
              <PromoCharts data={data.promo} loading={loading} total={total} index={5} />
              <ExperienceCharts data={data.experience} loading={loading} filters={activeFilters} onFilter={toggleFilter} index={6} />

              <p className="text-center text-xs text-[#9A9AAA] pt-4">Pekanbaru Xchange · Visitor Survey Dashboard</p>
            </div>
          ) : (
            <ResponseTable
              data={tableData} count={tableCount} loading={tableLoading}
              page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize}
              sortField={sortField} setSortField={setSortField}
              sortDirection={sortDirection} setSortDirection={setSortDirection}
              searchTerm={searchTerm} setSearchTerm={setSearchTerm}
              onRowClick={setSelectedIndex} onExport={handleExport} exporting={exporting}
              months={months} selectedMonthKey={selectedMonth?.key} onSelectMonth={selectMonth}
              filters={activeFilters} onFilter={toggleFilter}
            />
          )}
        </div>
      </main>

      <MobileBottomNav activeTab={activeTab} onTabChange={changeTab} />

      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-5 bottom-24 lg:bottom-8 z-50 h-11 w-11 rounded-2xl text-white shadow-xl flex items-center justify-center animate-[popIn_0.2s_ease]"
          style={{ background: `linear-gradient(135deg, ${BRAND.pink}, ${BRAND.orange})` }} title="Kembali ke atas">
          <ArrowUp size={18} />
        </button>
      )}

      {selectedIndex !== null && tableData[selectedIndex] && (
        <ResponseDetail
          responseId={tableData[selectedIndex].id}
          onClose={closeDetail}
          onNext={goNext}
          onPrev={goPrev}
          hasNext={absIndex !== null && absIndex < tableCount - 1}
          hasPrev={absIndex !== null && absIndex > 0}
          positionLabel={absIndex !== null ? `${fmtNum(absIndex + 1)} / ${fmtNum(tableCount)}` : ''}
        />
      )}
    </div>
  );
}
