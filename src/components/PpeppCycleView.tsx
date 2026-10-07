import React from 'react';
import { 
  RotateCw, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  FileText, 
  User, 
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useSPMI } from '../context/SPMIContext';
import { PPEPPCycleItem } from '../types/spmi';

export const PpeppCycleView: React.FC = () => {
  const { ppeppCycles, activeUser, updatePpeppCycle } = useSPMI();

  const handleToggleStatus = async (item: PPEPPCycleItem) => {
    if (!activeUser.permissions?.canApprovePPEPP) {
      alert('Hanya Kepala Sekolah atau Ketua TPMPS yang berwenang mengubah status siklus PPEPP.');
      return;
    }
    const nextStatus = item.status === 'COMPLETED' ? 'IN_PROGRESS' : item.status === 'IN_PROGRESS' ? 'SCHEDULED' : 'COMPLETED';
    const nextProg = nextStatus === 'COMPLETED' ? 100 : nextStatus === 'IN_PROGRESS' ? 65 : 20;
    await updatePpeppCycle({
      ...item,
      status: nextStatus,
      progressPercentage: nextProg,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <RotateCw className="w-5 h-5 text-blue-600" />
            Siklus PPEPP Penjaminan Mutu Internal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Alur berkelanjutan 5 tahapan mutu: Penetapan, Pelaksanaan, Evaluasi, Pengendalian, dan Peningkatan (T.A. 2024/2025)
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
          <Award className="w-4 h-4 text-blue-600" />
          <span>Siklus Aktif: Semester Genap 2024/2025</span>
        </div>
      </div>

      {/* PPEPP 5 Stages Flowcard Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {ppeppCycles.map((stage) => {
          const isDone = stage.status === 'COMPLETED';
          const isCurrent = stage.status === 'IN_PROGRESS';
          return (
            <div
              key={stage.id}
              className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden ${
                isDone
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                  : isCurrent
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isDone ? 'bg-emerald-200 text-emerald-900' : isCurrent ? 'bg-blue-200 text-blue-900' : 'bg-slate-200 text-slate-700'
                }`}>
                  Tahap 0{stage.stageNumber}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {stage.stage}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                {stage.title}
              </p>

              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                  <span>Progres</span>
                  <span>{stage.progressPercentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isDone ? 'bg-emerald-500' : isCurrent ? 'bg-blue-600' : 'bg-slate-400'}`}
                    style={{ width: `${stage.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Stage Cards */}
      <div className="space-y-4">
        {ppeppCycles.map((stage) => (
          <div
            key={stage.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-xl font-mono font-bold flex items-center justify-center text-xs ${
                  stage.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : stage.status === 'IN_PROGRESS'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {stage.stageNumber}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {stage.stage}: {stage.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> PIC: {stage.picUserName}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Target: {stage.targetDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  stage.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : stage.status === 'IN_PROGRESS'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {stage.status === 'COMPLETED' ? 'Selesai' : stage.status === 'IN_PROGRESS' ? 'Sedang Berjalan' : 'Terjadwal'}
                </span>

                {activeUser.permissions?.canApprovePPEPP && (
                  <button
                    onClick={() => handleToggleStatus(stage)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    Ubah Status
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              {stage.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Output Utama Kegiatan:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {stage.keyOutputs.map((out, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Dokumen Pendukung:
                </span>
                <div className="flex flex-wrap gap-2">
                  {stage.documents.map((doc, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
