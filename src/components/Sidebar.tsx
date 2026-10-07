import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  RotateCw, 
  ClipboardCheck, 
  FileSpreadsheet, 
  Users2, 
  BookOpenCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  School
} from 'lucide-react';
import { useSPMI } from '../context/SPMIContext';

export type TabType = 'overview' | 'rapor' | 'ppepp' | 'audit' | 'arkas' | 'tpm' | 'pedoman';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { stats, statusFilter, setStatusFilter } = useSPMI();

  const navigationItems = [
    {
      id: 'overview' as TabType,
      label: 'Dashboard Mutu',
      icon: LayoutDashboard,
      badge: `${stats.averageScore}`,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      id: 'rapor' as TabType,
      label: 'Rapor Pendidikan & SNP',
      icon: BarChart3,
      badge: `${stats.totalIndicators}`,
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      id: 'ppepp' as TabType,
      label: 'Siklus PPEPP',
      icon: RotateCw,
      badge: `${stats.completedPpeppStages}/5 Tahap`,
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    },
    {
      id: 'audit' as TabType,
      label: 'Audit Mutu (AMI)',
      icon: ClipboardCheck,
      badge: stats.openAuditFindings > 0 ? `${stats.openAuditFindings} Terbuka` : 'Nihil',
      badgeColor: stats.openAuditFindings > 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'arkas' as TabType,
      label: 'Tabel Ekspor ARKAS',
      icon: FileSpreadsheet,
      badge: `Rp ${(stats.totalArkasBudget / 1000000).toFixed(1)}Jt`,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      id: 'tpm' as TabType,
      label: '15 Pengguna TPM',
      icon: Users2,
      badge: '15 Tim',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
    },
    {
      id: 'pedoman' as TabType,
      label: 'Panduan & SOP Mutu',
      icon: BookOpenCheck,
      badge: 'V3.2',
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
      
      {/* Navigation menu */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Menu Penjaminan Mutu
        </div>
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Rapor Pendidikan Indicator Filter Panel (Hijau/Kuning/Merah) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Filter Rapor Pendidikan
          </span>
          {statusFilter !== 'ALL' && (
            <button
              onClick={() => setStatusFilter('ALL')}
              className="text-[11px] text-emerald-600 hover:underline"
            >
              Reset
            </button>
          )}
        </div>

        <div className="space-y-2">
          {/* Hijau: Capaian Baik */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'GREEN' ? 'ALL' : 'GREEN')}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
              statusFilter === 'GREEN'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40 hover:bg-emerald-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50"></div>
              <div>
                <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
                  Capaian Baik (Hijau)
                </p>
                <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
                  Melampaui Standar SNP
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono">
              {stats.greenCount}
            </span>
          </button>

          {/* Kuning: Capaian Sedang */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'YELLOW' ? 'ALL' : 'YELLOW')}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
              statusFilter === 'YELLOW'
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/40 hover:bg-amber-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs shadow-amber-500/50"></div>
              <div>
                <p className="text-xs font-semibold text-amber-950 dark:text-amber-200">
                  Capaian Sedang (Kuning)
                </p>
                <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                  Perlu Peningkatan
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 font-mono">
              {stats.yellowCount}
            </span>
          </button>

          {/* Merah: Capaian Kurang */}
          <button
            onClick={() => setStatusFilter(statusFilter === 'RED' ? 'ALL' : 'RED')}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
              statusFilter === 'RED'
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 ring-2 ring-rose-500/20'
                : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-800/40 hover:bg-rose-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs shadow-rose-500/50"></div>
              <div>
                <p className="text-xs font-semibold text-rose-950 dark:text-rose-200">
                  Capaian Kurang (Merah)
                </p>
                <p className="text-[10px] text-rose-700/80 dark:text-rose-400/80">
                  Intervensi Prioritas ARKAS
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300 font-mono">
              {stats.redCount}
            </span>
          </button>
        </div>
      </div>

      {/* School identity card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-md">
        <div className="flex items-center gap-2 text-emerald-400 mb-2">
          <School className="w-4 h-4" />
          <span className="text-[11px] font-bold tracking-wider uppercase">Info Satuan Pendidikan</span>
        </div>
        <h4 className="font-bold text-sm leading-tight text-white">
          SMK IT Ibnul Qayyim Makassar
        </h4>
        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
          NPSN: 69979314 · Konsentrasi Keahlian RPL & TKJ
        </p>
        <div className="mt-3 pt-3 border-t border-slate-700/60 text-[10px] text-slate-400">
          Sudiang, Kec. Biringkanaya, Kota Makassar, Sul-Sel
        </div>
      </div>

    </aside>
  );
};
