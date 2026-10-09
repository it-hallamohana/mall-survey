import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from '../../layouts/AdminLayout';
import SummaryCards from '../../components/admin/SummaryCards';
import DemographicsCharts from '../../components/admin/charts/DemographicsCharts';
import BehaviorCharts from '../../components/admin/charts/BehaviorCharts';
import FnbCharts from '../../components/admin/charts/FnbCharts';
import EntertainmentCharts from '../../components/admin/charts/EntertainmentCharts';
import PromoCharts from '../../components/admin/charts/PromoCharts';
import ExperienceCharts from '../../components/admin/charts/ExperienceCharts';
import ResponseTable from '../../components/admin/ResponseTable';
import ResponseDetail from '../../components/admin/ResponseDetail';
import { exportToCSV } from '../../utils/csvExport';
import { LogOut, Filter, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { 
  fetchSurveyStats, fetchDemographicsData, fetchBehaviorData, 
  fetchFnbData, fetchEntertainmentData, fetchPromoData, 
  fetchExperienceData, fetchResponses, exportResponses 
} from '../../services/dashboardService';

export default function AdminDashboard() {
  const { user, signOut } = useAuth();
  
  // States
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: null, demographics: null, behavior: null,
    fnb: null, entertainment: null, promo: null, experience: null
  });
  
  // Table states
  const [tableData, setTableData] = useState([]);
  const [tableCount, setTableCount] = useState(0);
  const [tableLoading, setTableLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Modal state
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  
  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '', dateTo: '', ageGroup: '', gender: '', 
    city: '', satisfactionLevel: '', visitPurpose: ''
  });
  const [activeFilters, setActiveFilters] = useState({});

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadDashboardData = async (currentFilters) => {
    setLoading(true);
    try {
      const [stats, demographics, behavior, fnb, entertainment, promo, experience] = await Promise.all([
        fetchSurveyStats(currentFilters),
        fetchDemographicsData(currentFilters),
        fetchBehaviorData(currentFilters),
        fetchFnbData(currentFilters),
        fetchEntertainmentData(currentFilters),
        fetchPromoData(currentFilters),
        fetchExperienceData(currentFilters)
      ]);
      
      setData({ stats, demographics, behavior, fnb, entertainment, promo, experience });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTableData = async () => {
    setTableLoading(true);
    try {
      const { data, count } = await fetchResponses(
        activeFilters, page, pageSize, sortField, sortDirection, debouncedSearch
      );
      setTableData(data);
      setTableCount(count);
    } catch (error) {
      console.error('Error loading table data:', error);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData(activeFilters);
  }, [activeFilters]);

  useEffect(() => {
    loadTableData();
  }, [activeFilters, page, sortField, sortDirection, debouncedSearch]);

  const handleApplyFilter = () => {
    setActiveFilters({ ...filters });
    setPage(1);
  };

  const handleResetFilter = () => {
    const reset = { dateFrom: '', dateTo: '', ageGroup: '', gender: '', city: '', satisfactionLevel: '', visitPurpose: '' };
    setFilters(reset);
    setActiveFilters(reset);
    setSearchTerm('');
    setPage(1);
  };

  const handleExport = async () => {
    try {
      const allData = await exportResponses(activeFilters);
      exportToCSV(allData);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Gagal mengexport data.');
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-border bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <img src="/assets/pxchange-logo.png" alt="PXchange" className="h-8 mr-4" />
            <h1 className="text-xl font-bold text-charcoal hidden sm:block">Visitor Survey Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden text-sm text-gray-500 md:block">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="hidden h-6 w-px bg-gray-border md:block"></div>
            <div className="text-sm font-medium text-charcoal">{user?.email}</div>
            <button
              onClick={signOut}
              className="flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-charcoal hover:bg-gray-200 transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Filters */}
        <section className="rounded-lg border border-gray-border bg-white shadow-sm">
          <div 
            className="flex cursor-pointer items-center justify-between p-4"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <div className="flex items-center font-medium text-charcoal">
              <Filter className="mr-2 h-5 w-5 text-pxchange-teal" />
              Filter Data
            </div>
            {isFilterOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
          </div>
          
          {isFilterOpen && (
            <div className="border-t border-gray-border p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal-light">Dari Tanggal</label>
                  <input type="date" value={filters.dateFrom} onChange={e => setFilters({...filters, dateFrom: e.target.value})} className="w-full rounded border border-gray-border px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal-light">Sampai Tanggal</label>
                  <input type="date" value={filters.dateTo} onChange={e => setFilters({...filters, dateTo: e.target.value})} className="w-full rounded border border-gray-border px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal-light">Kelompok Usia</label>
                  <select value={filters.ageGroup} onChange={e => setFilters({...filters, ageGroup: e.target.value})} className="w-full rounded border border-gray-border px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none">
                    <option value="">Semua Usia</option>
                    <option value="< 17 Tahun">&lt; 17 Tahun</option>
                    <option value="17–24 Tahun">17–24 Tahun</option>
                    <option value="25–34 Tahun">25–34 Tahun</option>
                    <option value="35–54 Tahun">35–54 Tahun</option>
                    <option value="> 55 Tahun">&gt; 55 Tahun</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal-light">Gender</label>
                  <select value={filters.gender} onChange={e => setFilters({...filters, gender: e.target.value})} className="w-full rounded border border-gray-border px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none">
                    <option value="">Semua Gender</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal-light">Kota</label>
                  <input type="text" placeholder="Cari kota..." value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})} className="w-full rounded border border-gray-border px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal-light">Kepuasan</label>
                  <select value={filters.satisfactionLevel} onChange={e => setFilters({...filters, satisfactionLevel: e.target.value})} className="w-full rounded border border-gray-border px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none">
                    <option value="">Semua Tingkat</option>
                    <option value="Sangat Puas">Sangat Puas</option>
                    <option value="Puas">Puas</option>
                    <option value="Cukup">Cukup</option>
                    <option value="Kurang Puas">Kurang Puas</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-charcoal-light">Tujuan Kunjungan</label>
                  <select value={filters.visitPurpose} onChange={e => setFilters({...filters, visitPurpose: e.target.value})} className="w-full rounded border border-gray-border px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none">
                    <option value="">Semua Tujuan</option>
                    <option value="Makan/Kuliner">Makan/Kuliner</option>
                    <option value="Hiburan/Entertainment">Hiburan/Entertainment</option>
                    <option value="Nongkrong/Santai">Nongkrong/Santai</option>
                    <option value="Belanja/Shopping">Belanja/Shopping</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex space-x-3">
                <button onClick={handleApplyFilter} className="rounded bg-pxchange-teal px-4 py-2 text-sm font-medium text-white hover:bg-pxchange-teal-dark">
                  Terapkan Filter
                </button>
                <button onClick={handleResetFilter} className="flex items-center rounded border border-gray-border px-4 py-2 text-sm font-medium text-charcoal hover:bg-gray-50">
                  <RefreshCw className="mr-2 h-4 w-4" /> Reset
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Summary Cards */}
        <section>
          <SummaryCards stats={data.stats} loading={loading} />
        </section>

        {/* Charts Grid */}
        <section className="space-y-8">
          <div>
            <h2 className="mb-4 text-xl font-bold text-charcoal">Demografi Pengunjung</h2>
            <DemographicsCharts data={data.demographics} loading={loading} />
          </div>
          <div>
            <h2 className="mb-4 text-xl font-bold text-charcoal">Perilaku Kunjungan</h2>
            <BehaviorCharts data={data.behavior} loading={loading} />
          </div>
          <div>
            <h2 className="mb-4 text-xl font-bold text-charcoal">Preferensi Food & Beverage</h2>
            <FnbCharts data={data.fnb} loading={loading} />
          </div>
          <div>
            <h2 className="mb-4 text-xl font-bold text-charcoal">Hiburan & Acara</h2>
            <EntertainmentCharts data={data.entertainment} loading={loading} />
          </div>
          <div>
            <h2 className="mb-4 text-xl font-bold text-charcoal">Media & Promosi</h2>
            <PromoCharts data={data.promo} loading={loading} />
          </div>
          <div>
            <h2 className="mb-4 text-xl font-bold text-charcoal">Pengalaman & Kepuasan</h2>
            <ExperienceCharts data={data.experience} loading={loading} />
          </div>
        </section>

        {/* Table */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-charcoal">Data Responden</h2>
          <ResponseTable 
            data={tableData} count={tableCount} loading={tableLoading}
            page={page} pageSize={pageSize} setPage={setPage}
            sortField={sortField} setSortField={setSortField}
            sortDirection={sortDirection} setSortDirection={setSortDirection}
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            onRowClick={setSelectedResponseId} onExport={handleExport}
          />
        </section>

      </main>

      {selectedResponseId && (
        <ResponseDetail 
          responseId={selectedResponseId} 
          onClose={() => setSelectedResponseId(null)} 
        />
      )}
    </AdminLayout>
  );
}
