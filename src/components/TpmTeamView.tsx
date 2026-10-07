import React from 'react';
import { 
  Users2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Check, 
  X, 
  SlidersHorizontal,
  KeyRound,
  FileSpreadsheet
} from 'lucide-react';
import { useSPMI } from '../context/SPMIContext';
import { TPMUser } from '../types/spmi';

interface TpmTeamViewProps {
  onFilterUser: (userId: string) => void;
}

export const TpmTeamView: React.FC<TpmTeamViewProps> = ({ onFilterUser }) => {
  const { users, activeUser, setActiveUserId, indicators } = useSPMI();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <Users2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Struktur & Matriks RBAC 15 Pengguna TPM
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tim Penjaminan Mutu Pendidikan Sekolah (TPMPS) SMK IT Ibnul Qayyim Makassar berdasarkan SK Kepala Sekolah No. 042/SK-TPMPS/VII/2024
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <KeyRound className="w-4 h-4 text-emerald-600" />
          <span>Pengguna Aktif: <strong>{activeUser.name}</strong></span>
        </div>
      </div>

      {/* Grid of 15 TPM Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => {
          const isActive = user.id === activeUser.id;
          const assignedCount = indicators.filter((i) => i.assignedUserId === user.id).length;

          return (
            <div
              key={user.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header User Card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-sm ring-2 ring-emerald-500/20 shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {user.name}
                      </h3>
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 truncate">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 uppercase shrink-0">
                    {user.accessLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  NIP: {user.nip}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {user.title} · {user.department}
                </p>

                {/* Assigned Standards */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Standar SNP yang Diampu:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {user.assignedStandards.map((std, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {std}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Permission Badges Matrix */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Hak Akses Modul:
                  </span>
                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500">
                    <span className={`flex items-center gap-1 ${user.permissions.canEditIndicators ? 'text-emerald-600 font-semibold' : 'text-slate-400 line-through'}`}>
                      {user.permissions.canEditIndicators ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Edit Indikator
                    </span>
                    <span className={`flex items-center gap-1 ${user.permissions.canExportArkas ? 'text-emerald-600 font-semibold' : 'text-slate-400 line-through'}`}>
                      {user.permissions.canExportArkas ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Ekspor ARKAS
                    </span>
                    <span className={`flex items-center gap-1 ${user.permissions.canAudit ? 'text-emerald-600 font-semibold' : 'text-slate-400 line-through'}`}>
                      {user.permissions.canAudit ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Audit Mutu AMI
                    </span>
                    <span className={`flex items-center gap-1 ${user.permissions.canApprovePPEPP ? 'text-emerald-600 font-semibold' : 'text-slate-400 line-through'}`}>
                      {user.permissions.canApprovePPEPP ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Pengesahan Siklus
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onFilterUser(user.id)}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-600 font-medium"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  Lihat Indikator ({assignedCount})
                </button>

                <button
                  onClick={() => setActiveUserId(user.id)}
                  className={`text-xs px-3 py-1 rounded-lg font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {isActive ? 'Sedang Digunakan' : 'Simulasikan Peran'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
