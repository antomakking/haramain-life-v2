import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowUpRight, 
  Coins, 
  RotateCw, 
  ShieldAlert, 
  FileSpreadsheet,
  Filter,
  Users,
  Target
} from 'lucide-react';
import { useSPMI } from '../context/SPMIContext';
import { TabType } from './Sidebar';

interface DashboardOverviewProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenIndicatorModal: (indicatorId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ 
  onNavigateTab, 
  onOpenIndicatorModal 
}) => {
  const { 
    indicators, 
    stats, 
    users, 
    filterUser, 
    setFilterUser, 
    statusFilter, 
    setStatusFilter,
    arkasItems 
  } = useSPMI();

  // Chart data: Group indicators by Category
  const categoryScoreData = React.useMemo(() => {
    const map: Record<string, { totalScore: number; count: number; name: string }> = {};
    indicators.forEach((ind) => {
      // Short name for category
      let shortName = ind.category
        .replace('Standar ', '')
        .replace('Pendidik & Tenaga Kependidikan', 'PTK')
        .replace('Kompetensi Lulusan (SKL)', 'SKL')
        .replace('Sarana & Prasarana', 'Sarpras')
        .replace('Kemitraan DUDI & Link and Match', 'DUDI')
        .replace('Karakter & Nilai Islami Santri', 'Karakter');
      if (shortName.length > 12) shortName = shortName.substring(0, 12) + '...';

      if (!map[ind.category]) {
        map[ind.category] = { totalScore: 0, count: 0, name: shortName };
      }
      map[ind.category].totalScore += ind.score;
      map[ind.category].count += 1;
    });

    return Object.keys(map).map((cat) => ({
      category: map[cat].name,
      fullName: cat,
      skor: Number((map[cat].totalScore / map[cat].count).toFixed(1)),
      target: 85,
    }));
  }, [indicators]);

  // Urgent attention items (RED and YELLOW)
  const priorityItems = React.useMemo(() => {
    return indicators.filter((i) => i.status === 'RED' || i.status === 'YELLOW');
  }, [indicators]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Hero Welcome & Quality Index Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Rapor Pendidikan Kemendikbudristek 2024/2025
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Sistem Penjaminan Mutu Internal (SPMI)
            </h1>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              SMK IT Ibnul Qayyim Makassar · Konsentrasi Keahlian Rekayasa Perangkat Lunak (RPL) & Teknik Komputer Jaringan (TKJ). Siklus penjaminan mutu PPEPP terintegrasi Perencanaan Berbasis Data (PBD) menuju ARKAS.
            </p>
          </div>

          {/* School Quality Score Dial */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 shrink-0">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-300 font-mono tracking-tight">
                {stats.averageScore}
              </div>
              <div className="text-[11px] font-medium text-emerald-100 uppercase tracking-wider mt-0.5">
                Indeks SPMI / 100
              </div>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Akreditasi: Unggul (A)</span>
              </div>
              <p className="text-[11px] text-white/70">
                8 Standar SNP Terpantau
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Status Rapor Pendidikan */}
        <div 
          onClick={() => onNavigateTab('rapor')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Status Rapor Pendidikan</span>
            <Target className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {stats.totalIndicators}
            </span>
            <span className="text-xs text-slate-500">Total Indikator</span>
          </div>
          
          {/* Green / Yellow / Red Bar */}
          <div className="mt-3 space-y-1.5">
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                style={{ width: `${(stats.greenCount / stats.totalIndicators) * 100}%` }}
                className="bg-emerald-500" 
                title={`Hijau: ${stats.greenCount}`}
              />
              <div 
                style={{ width: `${(stats.yellowCount / stats.totalIndicators) * 100}%` }}
                className="bg-amber-400" 
                title={`Kuning: ${stats.yellowCount}`}
              />
              <div 
                style={{ width: `${(stats.redCount / stats.totalIndicators) * 100}%` }}
                className="bg-rose-500" 
                title={`Merah: ${stats.redCount}`}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="text-emerald-600 font-semibold">{stats.greenCount} Baik</span>
              <span className="text-amber-600 font-semibold">{stats.yellowCount} Sedang</span>
              <span className="text-rose-600 font-semibold">{stats.redCount} Perlu Intervensi</span>
            </div>
          </div>
        </div>

        {/* Card 2: Siklus PPEPP */}
        <div 
          onClick={() => onNavigateTab('ppepp')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Siklus SPMI (PPEPP)</span>
            <RotateCw className="w-4 h-4 text-blue-600 group-hover:rotate-45 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              Tahap 4
            </span>
            <span className="text-xs text-blue-600 font-semibold">Pengendalian (RTM)</span>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
              <span>Progres Tahunan</span>
              <span className="font-bold text-blue-600">85%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 truncate">
              Rapat Tinjauan Manajemen & Rekomendasi PBD
            </p>
          </div>
        </div>

        {/* Card 3: Anggaran Rekomendasi ARKAS */}
        <div 
          onClick={() => onNavigateTab('arkas')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Pemetaan ARKAS</span>
            <Coins className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              Rp {(stats.totalArkasBudget / 1000000).toFixed(1)}Jt
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{arkasItems.length} Program Belanja</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              Siap Ekspor <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Sumber Dana BOS Reguler, BOS Kinerja & Yayasan
          </p>
        </div>

        {/* Card 4: Audit AMI & Temuan */}
        <div 
          onClick={() => onNavigateTab('audit')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Audit Mutu Internal (AMI)</span>
            <ShieldAlert className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {stats.openAuditFindings}
            </span>
            <span className="text-xs text-amber-600 font-semibold">Temuan Dalam Penanganan</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>KTS Mayor (Sarpras Lab TKJ)</span>
              <span className="text-rose-600 font-bold">1</span>
            </div>
            <div className="flex justify-between">
              <span>KTS Minor (Tracer Study)</span>
              <span className="text-amber-600 font-bold">1</span>
            </div>
          </div>
        </div>

      </div>

      {/* RBAC 15 TPM User Quick Filter Carousel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Filter Cepat Indikator per Pengguna TPM (15 Personil)
            </h3>
          </div>
          {filterUser !== 'ALL' && (
            <button
              onClick={() => setFilterUser('ALL')}
              className="text-xs text-emerald-600 hover:underline font-medium"
            >
              Tampilkan Semua Indikator
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setFilterUser('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filterUser === 'ALL'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Semua Tim ({indicators.length})
          </button>
          {users.map((u) => {
            const count = indicators.filter((i) => i.assignedUserId === u.id).length;
            const isSelected = filterUser === u.id;
            return (
              <button
                key={u.id}
                onClick={() => setFilterUser(isSelected ? 'ALL' : u.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{u.role}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Chart & Priority Interventions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recharts Standard Fulfillment */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Capaian Mutu per Kategori Standar SNP
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Perbandingan skor evaluasi diri terhadap target minimal SPMI (85.0)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-3 h-3 rounded bg-emerald-500"></span> Capaian Riil
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-3 h-0.5 bg-rose-400"></span> Garis Target
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryScoreData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                />
                <Tooltip
                  formatter={(value: any) => [`${value} / 100`, 'Skor Rata-rata']}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) return payload[0].payload.fullName;
                    return label;
                  }}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px',
                    border: 'none',
                  }}
                />
                <Bar dataKey="skor" radius={[6, 6, 0, 0]}>
                  {categoryScoreData.map((entry, index) => {
                    const color = entry.skor >= 80 ? '#10b981' : entry.skor >= 65 ? '#f59e0b' : '#ef4444';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Urgent Attention & ARKAS Linked Items */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Prioritas Intervensi PBD
              </h3>
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                {priorityItems.length} Indikator
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Indikator Kuning & Merah yang memerlukan rencana tindak lanjut dan penganggaran ARKAS:
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {priorityItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenIndicatorModal(item.id)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      item.status === 'RED' 
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {item.code} · {item.score}
                    </span>
                    {item.arkasLinked && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <FileSpreadsheet className="w-3 h-3" /> ARKAS Terhubung
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-1.5 line-clamp-1 group-hover:text-emerald-600">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {item.recommendationPBD}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span>PIC: {item.assignedUserName.split(',')[0]}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Rp {(item.estimatedBudget / 1000000).toFixed(1)}Jt
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigateTab('arkas')}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Kelola & Ekspor ke Tabel ARKAS
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
