import React from 'react';
import { Search, ChevronDown, ChevronUp, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const satisfactionBadge = (level) => {
  const map = {
    'Sangat Puas': 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    'Puas': 'bg-blue-50 text-blue-700 ring-blue-600/10',
    'Cukup': 'bg-amber-50 text-amber-700 ring-amber-600/10',
    'Kurang Puas': 'bg-red-50 text-red-700 ring-red-600/10',
  };
  return map[level] || 'bg-gray-50 text-gray-600 ring-gray-500/10';
};

const revisitBadge = (value) => {
  const map = {
    'Ya': 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    'Mungkin': 'bg-amber-50 text-amber-700 ring-amber-600/10',
    'Tidak': 'bg-red-50 text-red-700 ring-red-600/10',
  };
  return map[value] || 'bg-gray-50 text-gray-600 ring-gray-500/10';
};

export default function ResponseTable({
  data, count, loading, page, pageSize, setPage,
  sortField, setSortField, sortDirection, setSortDirection,
  searchTerm, setSearchTerm, onRowClick, onExport
}) {
  const totalPages = Math.ceil((count || 0) / pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />;
    return sortDirection === 'asc' ?
      <ChevronUp className="ml-1 h-3.5 w-3.5 text-pxchange-teal" /> :
      <ChevronDown className="ml-1 h-3.5 w-3.5 text-pxchange-teal" />;
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-800">Daftar Responden</h3>
          <p className="text-xs text-gray-400 mt-0.5">{count || 0} total responden</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau kota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-56 rounded-full bg-gray-50 border border-gray-200 py-2 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:border-pxchange-teal focus:outline-none focus:ring-1 focus:ring-pxchange-teal transition-colors"
            />
          </div>
          {/* Export */}
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr>
              {[
                { field: 'created_at', label: 'Tanggal' },
                { field: 'visitor_name', label: 'Nama' },
                { field: 'age_group', label: 'Usia' },
                { field: 'gender', label: 'Gender' },
                { field: 'city', label: 'Kota' },
                { field: 'visit_purpose', label: 'Tujuan' },
                { field: 'satisfaction_level', label: 'Kepuasan' },
                { field: 'revisit_intention', label: 'Kunjungan Ulang' },
              ].map(({ field, label }) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className="group cursor-pointer bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    {label}
                    <SortIcon field={field} />
                  </div>
                </th>
              ))}
              <th className="bg-gray-50 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="9" className="p-8 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-pxchange-teal"></div>
                    <span className="text-sm text-gray-400">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={row.id}
                  className={`transition-colors hover:bg-blue-50/50 ${index % 2 === 1 ? 'bg-gray-50/50' : ''}`}
                >
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{new Date(row.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{row.visitor_name}</td>
                  <td className="px-4 py-3 text-gray-600">{row.age_group}</td>
                  <td className="px-4 py-3 text-gray-600">{row.gender}</td>
                  <td className="px-4 py-3 text-gray-600">{row.city}</td>
                  <td className="px-4 py-3 text-gray-600 truncate max-w-[150px]">{row.visit_purpose}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${satisfactionBadge(row.satisfaction_level)}`}>
                      {row.satisfaction_level || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${revisitBadge(row.revisit_intention)}`}>
                      {row.revisit_intention || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onRowClick(row.id)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-gray-400 hover:text-pxchange-teal hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-8 text-center text-sm text-gray-400">
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between border-t border-gray-100 px-6 py-4 sm:flex-row">
        <span className="mb-4 text-sm text-gray-500 sm:mb-0">
          Menampilkan <span className="font-medium text-gray-700">{count === 0 ? 0 : (page - 1) * pageSize + 1}</span> hingga{' '}
          <span className="font-medium text-gray-700">{Math.min(page * pageSize, count)}</span> dari{' '}
          <span className="font-medium text-gray-700">{count}</span> data
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-pxchange-teal text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
