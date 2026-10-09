import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Download, Eye } from 'lucide-react';

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
    if (sortField !== field) return <ChevronDown className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-50" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="ml-1 h-4 w-4 text-pxchange-teal" /> : 
      <ChevronDown className="ml-1 h-4 w-4 text-pxchange-teal" />;
  };

  const thClass = "group cursor-pointer border-b border-gray-border bg-gray-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-charcoal-light hover:bg-gray-200 transition-colors";
  
  return (
    <div className="rounded-lg border border-gray-border bg-white shadow-sm">
      <div className="flex flex-col items-center justify-between border-b border-gray-border p-4 sm:flex-row">
        <div className="mb-4 flex w-full max-w-sm items-center sm:mb-0">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau kota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border border-gray-border py-2 pl-10 pr-3 text-sm text-charcoal focus:border-pxchange-teal focus:outline-none focus:ring-1 focus:ring-pxchange-teal"
            />
          </div>
        </div>
        <button
          onClick={onExport}
          className="flex items-center rounded-md border border-gray-border bg-white px-4 py-2 text-sm font-medium text-charcoal transition-colors hover:bg-gray-50"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-sm">
          <thead>
            <tr>
              <th className={thClass} onClick={() => handleSort('created_at')}>
                <div className="flex items-center">Tanggal <SortIcon field="created_at" /></div>
              </th>
              <th className={thClass} onClick={() => handleSort('visitor_name')}>
                <div className="flex items-center">Nama <SortIcon field="visitor_name" /></div>
              </th>
              <th className={thClass} onClick={() => handleSort('age_group')}>
                <div className="flex items-center">Usia <SortIcon field="age_group" /></div>
              </th>
              <th className={thClass} onClick={() => handleSort('gender')}>
                <div className="flex items-center">Gender <SortIcon field="gender" /></div>
              </th>
              <th className={thClass} onClick={() => handleSort('city')}>
                <div className="flex items-center">Kota <SortIcon field="city" /></div>
              </th>
              <th className={thClass} onClick={() => handleSort('visit_purpose')}>
                <div className="flex items-center">Tujuan <SortIcon field="visit_purpose" /></div>
              </th>
              <th className={thClass} onClick={() => handleSort('satisfaction_level')}>
                <div className="flex items-center">Kepuasan <SortIcon field="satisfaction_level" /></div>
              </th>
              <th className={thClass} onClick={() => handleSort('revisit_intention')}>
                <div className="flex items-center">Kunjungan Ulang <SortIcon field="revisit_intention" /></div>
              </th>
              <th className="border-b border-gray-border bg-gray-50 px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="p-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-pxchange-teal"></div>
                  </div>
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((row, index) => (
                <tr 
                  key={row.id} 
                  className={`border-b border-gray-border transition-colors hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-4 py-3 text-charcoal">{new Date(row.created_at).toLocaleDateString('id-ID')}</td>
                  <td className="px-4 py-3 font-medium text-charcoal">{row.visitor_name}</td>
                  <td className="px-4 py-3 text-charcoal">{row.age_group}</td>
                  <td className="px-4 py-3 text-charcoal">{row.gender}</td>
                  <td className="px-4 py-3 text-charcoal">{row.city}</td>
                  <td className="px-4 py-3 text-charcoal truncate max-w-[150px]">{row.visit_purpose}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      row.satisfaction_level === 'Sangat Puas' ? 'bg-green-100 text-green-800' :
                      row.satisfaction_level === 'Puas' ? 'bg-blue-100 text-blue-800' :
                      row.satisfaction_level === 'Cukup' ? 'bg-yellow-100 text-yellow-800' :
                      row.satisfaction_level === 'Kurang Puas' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.satisfaction_level || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-charcoal">{row.revisit_intention || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => onRowClick(row.id)}
                      className="text-pxchange-teal hover:text-pxchange-teal-dark"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-8 text-center text-gray-500">
                  Tidak ada data yang ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between border-t border-gray-border p-4 sm:flex-row">
        <span className="mb-4 text-sm text-gray-500 sm:mb-0">
          Menampilkan <span className="font-medium text-charcoal">{count === 0 ? 0 : (page - 1) * pageSize + 1}</span> hingga{' '}
          <span className="font-medium text-charcoal">{Math.min(page * pageSize, count)}</span> dari{' '}
          <span className="font-medium text-charcoal">{count}</span> data
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-md border border-gray-border bg-white px-3 py-1 text-sm font-medium text-charcoal hover:bg-gray-50 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="rounded-md border border-gray-border bg-white px-3 py-1 text-sm font-medium text-charcoal hover:bg-gray-50 disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}
