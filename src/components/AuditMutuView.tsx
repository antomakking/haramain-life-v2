import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Plus, 
  Calendar, 
  User, 
  FileSpreadsheet,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useSPMI } from '../context/SPMIContext';
import { AuditFinding, FindingType } from '../types/spmi';

export const AuditMutuView: React.FC = () => {
  const { auditFindings, activeUser, saveAuditFinding, indicators } = useSPMI();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form state for adding audit finding
  const [formData, setFormData] = useState<Partial<AuditFinding>>({
    type: 'KTS_MINOR',
    status: 'OPEN',
    deadline: '2025-04-30',
  });

  const filteredFindings = auditFindings.filter((f) => {
    if (filterType !== 'ALL' && f.type !== filterType) return false;
    if (filterStatus !== 'ALL' && f.status !== filterStatus) return false;
    return true;
  });

  const handleCreateFinding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.indicatorId || !formData.findingDescription) {
      alert('Mohon pilih indikator rujukan dan isi deskripsi temuan audit.');
      return;
    }

    const ind = indicators.find((i) => i.id === formData.indicatorId);

    const newFinding: AuditFinding = {
      id: `audit-${Date.now()}`,
      indicatorId: formData.indicatorId,
      indicatorName: ind?.name || 'Indikator Mutu',
      category: ind?.category || 'Standar Proses',
      type: (formData.type as FindingType) || 'KTS_MINOR',
      typeLabel: formData.type === 'KTS_MAYOR' ? 'Ketidaksesuaian Mayor' : formData.type === 'KTS_MINOR' ? 'Ketidaksesuaian Minor' : 'Observasi',
      findingDescription: formData.findingDescription || '',
      standardCriteria: formData.standardCriteria || 'Standar Nasional Pendidikan SMK IT Ibnul Qayyim',
      rootCause: formData.rootCause || '',
      correctiveAction: formData.correctiveAction || '',
      auditorId: activeUser.id,
      auditorName: activeUser.name,
      auditeeId: ind?.assignedUserId || 'user-04',
      auditeeName: ind?.assignedUserName || 'Waka Terkait',
      deadline: formData.deadline || '2025-04-30',
      status: 'OPEN',
    };

    await saveAuditFinding(newFinding);
    setIsNewModalOpen(false);
  };

  const handleToggleFindingStatus = async (item: AuditFinding) => {
    const nextStatus = item.status === 'OPEN' ? 'IN_REVIEW' : item.status === 'IN_REVIEW' ? 'RESOLVED' : 'OPEN';
    await saveAuditFinding({ ...item, status: nextStatus });
  };

  const getTypeBadge = (type: FindingType) => {
    switch (type) {
      case 'KTS_MAYOR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" /> KTS Mayor
          </span>
        );
      case 'KTS_MINOR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> KTS Minor
          </span>
        );
      case 'OB':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300">
            <Info className="w-3.5 h-3.5 text-blue-600" /> Observasi (OB)
          </span>
        );
      case 'TS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terpenuhi (TS)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-600" />
            Audit Mutu Internal (AMI) & Temuan Ketidaksesuaian
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Satuan Pengawas Mutu (SPI) & Auditor Internal SPMI SMK IT Ibnul Qayyim Makassar
          </p>
        </div>

        {activeUser.permissions?.canAudit && (
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Input Temuan Audit Baru
          </button>
        )}
      </div>

      {/* Filter toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Klasifikasi Temuan:
            </span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 px-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua Jenis Temuan</option>
              <option value="KTS_MAYOR">KTS Mayor (Kritis)</option>
              <option value="KTS_MINOR">KTS Minor</option>
              <option value="OB">Observasi (OB)</option>
              <option value="TS">Terpenuhi Standar (TS)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Status Tindak Lanjut:
            </span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 px-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="OPEN">Belum Ditindaklanjuti (Open)</option>
              <option value="IN_REVIEW">Dalam Peninjauan (In Review)</option>
              <option value="RESOLVED">Selesai / Diverifikasi (Resolved)</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Menampilkan <strong>{filteredFindings.length}</strong> temuan audit
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.map((finding) => (
          <div
            key={finding.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                {getTypeBadge(finding.type)}
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {finding.indicatorName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                  finding.status === 'RESOLVED'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : finding.status === 'IN_REVIEW'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {finding.status === 'RESOLVED' ? 'Telah Ditindaklanjuti' : finding.status === 'IN_REVIEW' ? 'Sedang Ditinjau' : 'Menunggu Tindak Lanjut'}
                </span>

                {activeUser.permissions?.canAudit && (
                  <button
                    onClick={() => handleToggleFindingStatus(finding)}
                    className="text-xs px-2.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-600"
                  >
                    Ubah Status
                  </button>
                )}
              </div>
            </div>

            {/* Finding Description & Criteria */}
            <div className="mt-3 space-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                  Deskripsi Temuan Audit:
                </span>
                <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {finding.findingDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] block">
                    Kriteria Standar:
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {finding.standardCriteria}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] block">
                    Akar Penyebab:
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {finding.rootCause}
                  </p>
                </div>
              </div>

              {/* Corrective action / RTL */}
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 text-[11px] block">
                  Rencana Tindak Lanjut (RTL) / Tindakan Koreksi:
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-200 mt-0.5 font-medium">
                  {finding.correctiveAction}
                </p>
              </div>
            </div>

            {/* Footer: Auditor, Auditee, Deadline */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-3">
                <span>Auditor: <strong>{finding.auditorName}</strong></span>
                <span>·</span>
                <span>Auditee: <strong>{finding.auditeeName}</strong></span>
              </div>
              <div className="flex items-center gap-1 font-mono text-slate-600 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Batas Waktu: {finding.deadline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Finding */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Input Temuan Audit Mutu Internal (AMI)
            </h3>
            
            <form onSubmit={handleCreateFinding} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Indikator Mutu Terkait
                </label>
                <select
                  required
                  value={formData.indicatorId || ''}
                  onChange={(e) => setFormData({ ...formData, indicatorId: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-100"
                >
                  <option value="">-- Pilih Indikator --</option>
                  {indicators.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.code} - {i.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Klasifikasi Temuan
                </label>
                <select
                  value={formData.type || 'KTS_MINOR'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-100"
                >
                  <option value="KTS_MAYOR">KTS Mayor (Ketidaksesuaian Kritis)</option>
                  <option value="KTS_MINOR">KTS Minor (Ketidaksesuaian Ringan)</option>
                  <option value="OB">Observasi (OB - Peluang Peningkatan)</option>
                  <option value="TS">Terpenuhi Standar (TS)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Uraian Temuan / Fakta Lapangan
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.findingDescription || ''}
                  onChange={(e) => setFormData({ ...formData, findingDescription: e.target.value })}
                  placeholder="Jelaskan ketidaksesuaian kondisi faktual terhadap standar mutu..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kriteria Standar Rujukan
                </label>
                <input
                  type="text"
                  value={formData.standardCriteria || ''}
                  onChange={(e) => setFormData({ ...formData, standardCriteria: e.target.value })}
                  placeholder="Contoh: Standar Sarpras Permendikbud No. 47..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rencana Tindak Lanjut (Tindakan Koreksi)
                </label>
                <textarea
                  rows={2}
                  value={formData.correctiveAction || ''}
                  onChange={(e) => setFormData({ ...formData, correctiveAction: e.target.value })}
                  placeholder="Langkah perbaikan yang disepakati bersama auditee..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                >
                  Simpan Temuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
