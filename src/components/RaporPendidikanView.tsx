import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Link2, 
  Coins, 
  Edit3, 
  Plus, 
  ExternalLink,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';
import { useSPMI } from '../context/SPMIContext';
import { SPMIIndicator, RaporStatus } from '../types/spmi';

interface RaporPendidikanViewProps {
  onOpenIndicatorModal: (indicatorId: string) => void;
  onOpenNewIndicatorModal: () => void;
  onNavigateToArkas: () => void;
}

export const RaporPendidikanView: React.FC<RaporPendidikanViewProps> = ({
  onOpenIndicatorModal,
  onOpenNewIndicatorModal,
  onNavigateToArkas,
}) => {
  const { 
    indicators, 
    users, 
    filterUser, 
    setFilterUser, 
    statusFilter, 
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    activeUser
  } = useSPMI();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Categories list
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    indicators.forEach((i) => set.add(i.category));
    return Array.from(set);
  }, [indicators]);

  // Filtered indicators
  const filteredIndicators = indicators.filter((ind) => {
    // 1. Status Filter
    if (statusFilter !== 'ALL' && ind.status !== statusFilter) return false;

    // 2. User Filter
    if (filterUser !== 'ALL' && ind.assignedUserId !== filterUser) return false;

    // 3. Category Filter
    if (categoryFilter !== 'ALL' && ind.category !== categoryFilter) return false;

    // 4. Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = ind.name.toLowerCase().includes(q);
      const matchCode = ind.code.toLowerCase().includes(q);
      const matchDesc = ind.description.toLowerCase().includes(q);
      const matchPIC = ind.assignedUserName.toLowerCase().includes(q);
      const matchCategory = ind.category.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchDesc && !matchPIC && !matchCategory) {
        return false;
      }
    }

    return true;
  });

  const getStatusBadge = (status: RaporStatus) => {
    switch (status) {
      case 'GREEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Capaian Baik
          </span>
        );
      case 'YELLOW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Capaian Sedang
          </span>
        );
      case 'RED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Capaian Kurang (Intervensi)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Panel Indikator Rapor Pendidikan & Standar SPMI
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluasi capaian 8 Standar Nasional Pendidikan (SNP) dan dimensi mutu SMK IT Ibnul Qayyim
          </p>
        </div>

        {/* View toggle & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100 dark:bg-slate-800 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Kartu Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tabel Detail
            </button>
          </div>

          {activeUser.permissions?.canEditIndicators && (
            <button
              onClick={onOpenNewIndicatorModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Indikator
            </button>
          )}
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Status filter button bar */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Status Rapor
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 px-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua Status (Hijau, Kuning, Merah)</option>
              <option value="GREEN">🟢 Capaian Baik (Hijau)</option>
              <option value="YELLOW">🟡 Capaian Sedang (Kuning)</option>
              <option value="RED">🔴 Capaian Kurang (Merah)</option>
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Kategori Standar SNP
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 px-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua 8 Standar SNP & Vokasi</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* TPM PIC Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Penanggung Jawab TPM (15 Anggota)
            </label>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 px-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua Pengguna TPM (15 Orang)</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.role} - {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick search */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Cari Cepat
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-2.5 pr-7 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>
            Menampilkan <strong>{filteredIndicators.length}</strong> dari {indicators.length} indikator
          </span>
          {(statusFilter !== 'ALL' || categoryFilter !== 'ALL' || filterUser !== 'ALL' || searchQuery !== '') && (
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
                setFilterUser('ALL');
                setSearchQuery('');
              }}
              className="text-emerald-600 hover:underline font-semibold"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIndicators.map((ind) => (
            <div
              key={ind.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Code */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {ind.code}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                      {ind.category}
                    </span>
                  </div>
                  {getStatusBadge(ind.status)}
                </div>

                {/* Name & Desc */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {ind.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {ind.description}
                </p>

                {/* Score vs Target Bar */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      Skor Capaian Riil:
                    </span>
                    <div className="flex items-baseline gap-1.5 font-mono">
                      <span className={`text-base font-bold ${
                        ind.status === 'GREEN' ? 'text-emerald-600' : ind.status === 'YELLOW' ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {ind.score}
                      </span>
                      <span className="text-slate-400 text-[10px]">/ Target: {ind.targetScore}</span>
                    </div>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full rounded-full ${
                        ind.status === 'GREEN' ? 'bg-emerald-500' : ind.status === 'YELLOW' ? 'bg-amber-400' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(ind.score, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Baseline Nasional: {ind.nationalBaseline}</span>
                    <span>Gap: {(ind.score - ind.targetScore).toFixed(1)} poin</span>
                  </div>
                </div>

                {/* Root Cause & Recommendation */}
                <div className="mt-3 text-xs space-y-2">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] block">
                      Akar Masalah (Root Cause):
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {ind.rootCause}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px] block">
                      Rekomendasi PBD (Perencanaan Berbasis Data):
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {ind.recommendationPBD}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Footer: PIC, Evidence Docs, ARKAS, and Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                    <span className="font-medium text-slate-700 dark:text-slate-300">PIC:</span>
                    <span className="truncate">{ind.assignedUserName}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {ind.arkasLinked ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                        <FileSpreadsheet className="w-3 h-3" />
                        Rp {(ind.estimatedBudget / 1000000).toFixed(1)}Jt
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Belum di ARKAS</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-slate-400">
                    {ind.evidenceDocs.length} Dokumen Bukti Fisik
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {ind.arkasLinked && (
                      <button
                        onClick={onNavigateToArkas}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg text-xs"
                        title="Buka detail kegiatan di Tabel ARKAS"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onOpenIndicatorModal(ind.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Edit3 className="w-3 h-3 text-slate-500" />
                      Detail & Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Kode</th>
                  <th className="px-4 py-3">Nama Indikator Mutu</th>
                  <th className="px-4 py-3">Kategori SNP</th>
                  <th className="px-4 py-3 text-center">Skor</th>
                  <th className="px-4 py-3 text-center">Target</th>
                  <th className="px-4 py-3">Status Rapor</th>
                  <th className="px-4 py-3">PIC TPM</th>
                  <th className="px-4 py-3">ARKAS (Rp)</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredIndicators.map((ind) => (
                  <tr key={ind.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                      {ind.code}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100 max-w-xs truncate">
                      {ind.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {ind.category}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                      {ind.score}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-500">
                      {ind.targetScore}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(ind.status)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 truncate max-w-[140px]">
                      {ind.assignedUserName}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {ind.arkasLinked ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Rp {(ind.estimatedBudget).toLocaleString('id-ID')}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onOpenIndicatorModal(ind.id)}
                        className="text-emerald-600 hover:text-emerald-800 font-semibold"
                      >
                        Kelola
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
