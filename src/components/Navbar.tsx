import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  FileSpreadsheet, 
  RotateCcw, 
  ChevronDown, 
  Search, 
  SlidersHorizontal,
  GraduationCap
} from 'lucide-react';
import { useSPMI } from '../context/SPMIContext';

interface NavbarProps {
  onOpenArkasExport: () => void;
  onOpenUserModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenArkasExport, onOpenUserModal }) => {
  const { 
    activeUser, 
    users, 
    setActiveUserId, 
    searchQuery, 
    setSearchQuery,
    isRealSupabase,
    resetDatabase,
    filterUser,
    setFilterUser,
  } = useSPMI();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & School Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-500/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight truncate">
                  SPMI SMK IT Ibnul Qayyim
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50">
                  TPMPS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden md:block">
                Sistem Penjaminan Mutu Internal · Kota Makassar
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari indikator, standar SNP, kode ARKAS, atau penanggung jawab..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Actions & RBAC User Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Supabase status badge */}
            <div 
              title={isRealSupabase ? "Terhubung ke database Cloud Supabase" : "Sinkronisasi aktif: Supabase Client SDK dengan offline cache"}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-mono">@supabase/client</span>
            </div>

            {/* Quick Export to ARKAS Table */}
            <button
              onClick={onOpenArkasExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Tabel ARKAS</span>
            </button>

            {/* Reset mock data button */}
            <button
              onClick={() => {
                if (window.confirm('Reset database lokal ke data autentik awal SMK IT Ibnul Qayyim?')) {
                  resetDatabase();
                }
              }}
              title="Reset data awal"
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* RBAC 15 TPM User Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-white dark:bg-slate-800 transition-all text-left group shadow-xs"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs ring-1 ring-emerald-500/30 shrink-0">
                  {activeUser.name ? activeUser.name.charAt(0) : 'U'}
                </div>
                <div className="hidden md:block max-w-[150px]">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight">
                    {activeUser.name}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate">
                    {activeUser.role}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform" />
              </button>

              {/* Dropdown Menu (15 TPM Users) */}
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          Simulasi Peran RBAC TPMPS
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Pilih dari 15 pengguna Tim Penjamin Mutu
                        </p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        15 Anggota
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                      {users.map((user) => {
                        const isActive = user.id === activeUser.id;
                        return (
                          <button
                            key={user.id}
                            onClick={() => {
                              setActiveUserId(user.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${
                              isActive ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-l-4 border-emerald-600' : ''
                            }`}
                          >
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0 mt-0.5">
                              {user.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <p className={`text-xs font-medium truncate ${isActive ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-slate-800 dark:text-slate-200'}`}>
                                  {user.name}
                                </p>
                                <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                                  {user.accessLevel}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                {user.role} · {user.department}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                NIP: {user.nip}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenUserModal();
                        }}
                        className="w-full text-center py-1.5 px-3 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
                      >
                        Lihat Matriks Lengkap 15 Anggota TPM
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Sub-bar for active filter indicator if filtered */}
      {filterUser !== 'ALL' && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border-t border-emerald-200 dark:border-emerald-800/60 px-4 py-1.5 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Menampilkan indikator khusus penanggung jawab: <strong>{users.find(u => u.id === filterUser)?.name}</strong>
            </span>
          </div>
          <button
            onClick={() => setFilterUser('ALL')}
            className="text-[11px] font-semibold underline hover:text-emerald-950"
          >
            Hapus Filter
          </button>
        </div>
      )}
    </header>
  );
};
