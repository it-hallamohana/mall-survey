import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from '../../layouts/AdminLayout';
import Sidebar from '../../components/admin/Sidebar';
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
import { Menu, SlidersHorizontal, RefreshCw } from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  fetchSurveyStats, fetchDemographicsData, fetchBehaviorData,
  fetchFnbData, fetchEntertainmentData, fetchPromoData,
  fetchExperienceData, fetchResponses, exportResponses
} from '../../services/dashboardService';

const PAGE_TITLES = {
  overview: 'Dashboard Overview',
  demographics: 'Demografi Pengunjung',
  behavior: 'Perilaku Kunjungan',
  fnb: 'Kuliner & F&B',
  entertainment: 'Hiburan & Event',
  promo: 'Media & Promosi',
  experience: 'Pengalaman Pengunjung',
  responses: 'Data Responden',
};

const DONUT_COLORS = ['#00B4D8', '#E63946', '#F4A261', '#2A9D8F', '#7B2D8E', '#EC4899'];

export default function AdminDashboard() {
  const { user, signOut } = useAuth();

  // Tab & UI states
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Data states
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

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const getPageTitle = () => PAGE_TITLES[activeTab] || 'Dashboard';

  // --- Overview quick charts ---
  const renderOverviewContent = () => {
    const ageData = data.demographics?.ageGroups || [];
    const satisfactionData = data.stats?.satisfactionDistribution || [];

    return (
      <div className="space-y-6">
        <SummaryCards stats={data.stats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Age Distribution Bar Chart */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="text-base font-semibold text-charcoal">Distribusi Usia</h3>
            </div>
            <div className="chart-card-body">
              {loading ? (
                <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#00B4D8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Satisfaction Donut */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="text-base font-semibold text-charcoal">Tingkat Kepuasan</h3>
            </div>
            <div className="chart-card-body">
              {loading ? (
                <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={satisfactionData}
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {satisfactionData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Recent Responses */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="text-base font-semibold text-charcoal">Responden Terbaru</h3>
            <button
              onClick={() => setActiveTab('responses')}
              className="text-sm text-pxchange-teal hover:underline font-medium"
            >
              Lihat Semua →
            </button>
          </div>
          <div className="chart-card-body responsive-table">
            {tableLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 animate-pulse bg-gray-100 rounded" />
                ))}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-gray-500">
                    <th className="pb-3 font-medium">Nama</th>
                    <th className="pb-3 font-medium">Usia</th>
                    <th className="pb-3 font-medium">Kota</th>
                    <th className="pb-3 font-medium">Kepuasan</th>
                    <th className="pb-3 font-medium">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedResponseId(row.id)}>
                      <td className="py-2.5 text-charcoal font-medium">{row.visitor_name || '-'}</td>
                      <td className="py-2.5 text-gray-600">{row.age_group || '-'}</td>
                      <td className="py-2.5 text-gray-600">{row.city || '-'}</td>
                      <td className="py-2.5">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          row.satisfaction_level === 'Sangat Puas' ? 'bg-green-100 text-green-700' :
                          row.satisfaction_level === 'Puas' ? 'bg-blue-100 text-blue-700' :
                          row.satisfaction_level === 'Cukup' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {row.satisfaction_level || '-'}
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-500">{row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID') : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewContent();
      case 'demographics':
        return <DemographicsCharts data={data.demographics} loading={loading} />;
      case 'behavior':
        return <BehaviorCharts data={data.behavior} loading={loading} />;
      case 'fnb':
        return <FnbCharts data={data.fnb} loading={loading} />;
      case 'entertainment':
        return <EntertainmentCharts data={data.entertainment} loading={loading} />;
      case 'promo':
        return <PromoCharts data={data.promo} loading={loading} />;
      case 'experience':
        return <ExperienceCharts data={data.experience} loading={loading} />;
      case 'responses':
        return (
          <ResponseTable
            data={tableData} count={tableCount} loading={tableLoading}
            page={page} pageSize={pageSize} setPage={setPage}
            sortField={sortField} setSortField={setSortField}
            sortDirection={sortDirection} setSortDirection={setSortDirection}
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            onRowClick={setSelectedResponseId} onExport={handleExport}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="flex min-h-screen">
        {/* Mobile hamburger button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md border border-gray-200 text-charcoal hover:bg-gray-50 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Sidebar overlay for mobile */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 h-screen z-50 lg:z-auto transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            user={user}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Top header bar */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="pl-10 lg:pl-0">
                <h1 className="text-xl font-bold text-charcoal">{getPageTitle()}</h1>
                <p className="text-sm text-gray-500">{formattedDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showFilters
                      ? 'bg-pxchange-teal text-white'
                      : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
                <div className="h-9 w-9 rounded-full bg-pxchange-teal flex items-center justify-center text-white font-semibold text-sm">
                  {user?.email?.charAt(0).toUpperCase() || '?'}
                </div>
              </div>
            </div>

            {/* Collapsible filter panel */}
            {showFilters && (
              <div className="px-6 pb-4 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-charcoal-light">Dari Tanggal</label>
                    <input type="date" value={filters.dateFrom} onChange={e => setFilters({...filters, dateFrom: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none focus:ring-1 focus:ring-pxchange-teal/20" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-charcoal-light">Sampai Tanggal</label>
                    <input type="date" value={filters.dateTo} onChange={e => setFilters({...filters, dateTo: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none focus:ring-1 focus:ring-pxchange-teal/20" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-charcoal-light">Kelompok Usia</label>
                    <select value={filters.ageGroup} onChange={e => setFilters({...filters, ageGroup: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none focus:ring-1 focus:ring-pxchange-teal/20">
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
                    <select value={filters.gender} onChange={e => setFilters({...filters, gender: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none focus:ring-1 focus:ring-pxchange-teal/20">
                      <option value="">Semua Gender</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-charcoal-light">Kota</label>
                    <input type="text" placeholder="Cari kota..." value={filters.city} onChange={e => setFilters({...filters, city: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none focus:ring-1 focus:ring-pxchange-teal/20" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-charcoal-light">Kepuasan</label>
                    <select value={filters.satisfactionLevel} onChange={e => setFilters({...filters, satisfactionLevel: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none focus:ring-1 focus:ring-pxchange-teal/20">
                      <option value="">Semua Tingkat</option>
                      <option value="Sangat Puas">Sangat Puas</option>
                      <option value="Puas">Puas</option>
                      <option value="Cukup">Cukup</option>
                      <option value="Kurang Puas">Kurang Puas</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-charcoal-light">Tujuan Kunjungan</label>
                    <select value={filters.visitPurpose} onChange={e => setFilters({...filters, visitPurpose: e.target.value})} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pxchange-teal focus:outline-none focus:ring-1 focus:ring-pxchange-teal/20">
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
                  <button onClick={handleApplyFilter} className="rounded-lg bg-pxchange-teal px-4 py-2 text-sm font-medium text-white hover:bg-pxchange-teal-dark transition-colors">
                    Terapkan Filter
                  </button>
                  <button onClick={handleResetFilter} className="flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-charcoal hover:bg-gray-50 transition-colors">
                    <RefreshCw className="mr-2 h-4 w-4" /> Reset
                  </button>
                </div>
              </div>
            )}
          </header>

          {/* Page content */}
          <div className="p-6 tab-content" key={activeTab}>
            {renderTabContent()}
          </div>
        </main>
      </div>

      {selectedResponseId && (
        <ResponseDetail
          responseId={selectedResponseId}
          onClose={() => setSelectedResponseId(null)}
        />
      )}
    </AdminLayout>
  );
}
