import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileSpreadsheet, 
  FileText, 
  Plus, 
  Trash2,
  HelpCircle
} from 'lucide-react';
import { useSPMI } from '../context/SPMIContext';
import { SPMIIndicator, RaporStatus } from '../types/spmi';

interface IndicatorModalProps {
  indicatorId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToArkas: () => void;
}

export const IndicatorModal: React.FC<IndicatorModalProps> = ({
  indicatorId,
  isOpen,
  onClose,
  onNavigateToArkas,
}) => {
  const { indicators, updateIndicator, users, activeUser } = useSPMI();

  const [form, setForm] = useState<SPMIIndicator | null>(null);
  const [newDocName, setNewDocName] = useState('');

  useEffect(() => {
    if (indicatorId) {
      const found = indicators.find((i) => i.id === indicatorId);
      if (found) {
        setForm({ ...found });
      }
    } else {
      // New indicator template
      setForm({
        id: `ind-${Date.now()}`,
        code: 'SNP-01.1',
        dimension: 'Dimensi A: Mutu Hasil Belajar',
        category: 'Standar Kompetensi Lulusan (SKL)',
        name: '',
        description: '',
        score: 75.0,
        targetScore: 85.0,
        nationalBaseline: 65.0,
        status: 'YELLOW',
        statusLabel: 'Capaian Sedang',
        assignedUserId: activeUser.id,
        assignedUserName: activeUser.name,
        rootCause: '',
        recommendationPBD: '',
        evidenceDocs: [],
        arkasLinked: false,
        estimatedBudget: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        academicYear: '2024/2025',
      });
    }
  }, [indicatorId, indicators, isOpen, activeUser]);

  if (!isOpen || !form) return null;

  // Auto calculate status color based on score
  const handleScoreChange = (newScore: number) => {
    let nextStatus: RaporStatus = 'YELLOW';
    let nextLabel = 'Capaian Sedang (Perlu Peningkatan)';
    if (newScore >= 80) {
      nextStatus = 'GREEN';
      nextLabel = 'Capaian Baik (Memenuhi/Melampaui Standar)';
    } else if (newScore < 65) {
      nextStatus = 'RED';
      nextLabel = 'Capaian Kurang (Intervensi Prioritas ARKAS)';
    }

    setForm({
      ...form,
      score: newScore,
      status: nextStatus,
      statusLabel: nextLabel,
    });
  };

  const handleAddEvidenceDoc = () => {
    if (!newDocName.trim()) return;
    setForm({
      ...form,
      evidenceDocs: [...form.evidenceDocs, { name: newDocName.trim(), verified: true }],
    });
    setNewDocName('');
  };

  const handleRemoveDoc = (index: number) => {
    const updated = form.evidenceDocs.filter((_, idx) => idx !== index);
    setForm({ ...form, evidenceDocs: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateIndicator(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full shadow-2xl my-8 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {form.code}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {indicatorId ? 'Kelola Indikator Rapor Pendidikan' : 'Tambah Indikator Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Code, Category & Dimension */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kode Indikator
              </label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Standar SNP
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2"
              >
                <option value="Standar Kompetensi Lulusan (SKL)">Standar Kompetensi Lulusan (SKL)</option>
                <option value="Standar Isi">Standar Isi</option>
                <option value="Standar Proses">Standar Proses</option>
                <option value="Standar Penilaian Pendidikan">Standar Penilaian Pendidikan</option>
                <option value="Standar Pendidik & Tenaga Kependidikan">Standar PTK</option>
                <option value="Standar Sarana & Prasarana">Standar Sarana & Prasarana</option>
                <option value="Standar Pengelolaan">Standar Pengelolaan</option>
                <option value="Standar Pembiayaan">Standar Pembiayaan</option>
                <option value="Kemitraan DUDI & Link and Match">Kemitraan DUDI & Link and Match</option>
                <option value="Karakter & Nilai Islami Santri">Karakter & Nilai Islami Santri</option>
              </select>
            </div>
          </div>

          {/* Name & Desc */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Indikator Mutu
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Deskripsi & Tolok Ukur
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2"
            />
          </div>

          {/* Score, Target & Dynamic Color Panel */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                Skor Capaian & Status Rapor Pendidikan
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                form.status === 'GREEN'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : form.status === 'YELLOW'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {form.status === 'GREEN' ? '🟢 Capaian Baik' : form.status === 'YELLOW' ? '🟡 Capaian Sedang' : '🔴 Capaian Kurang'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">
                  Skor Evaluasi (0 - 100)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={form.score}
                  onChange={(e) => handleScoreChange(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 font-mono font-extrabold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">
                  Target SPMI
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.targetScore}
                  onChange={(e) => setForm({ ...form, targetScore: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 font-mono font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">
                  Baseline Nasional
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.nationalBaseline}
                  onChange={(e) => setForm({ ...form, nationalBaseline: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Root Cause & Recommendation */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Analisis Akar Masalah (Root Cause):
            </label>
            <textarea
              rows={2}
              value={form.rootCause}
              onChange={(e) => setForm({ ...form, rootCause: e.target.value })}
              placeholder="Penyebab mendasar capaian indikator belum optimal..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2"
            />
          </div>

          <div>
            <label className="block font-bold text-emerald-700 dark:text-emerald-400 mb-1">
              Rekomendasi Perencanaan Berbasis Data (PBD):
            </label>
            <textarea
              rows={2}
              value={form.recommendationPBD}
              onChange={(e) => setForm({ ...form, recommendationPBD: e.target.value })}
              placeholder="Rencana program/intervensi yang direkomendasikan..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2"
            />
          </div>

          {/* PIC TPM Member */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Penanggung Jawab TPM (15 Anggota):
            </label>
            <select
              value={form.assignedUserId}
              onChange={(e) => {
                const u = users.find((usr) => usr.id === e.target.value);
                setForm({
                  ...form,
                  assignedUserId: e.target.value,
                  assignedUserName: u?.name || '',
                });
              }}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-medium"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.role} - {u.name} ({u.title})
                </option>
              ))}
            </select>
          </div>

          {/* Evidence Docs */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Portofolio Bukti Fisik / Dokumen Akreditasi:
            </label>
            <div className="space-y-1.5 mb-2">
              {form.evidenceDocs.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <span className="flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    {doc.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(idx)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nama dokumen bukti fisik (e.g. SK KBM, Portofolio Siswa)..."
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 p-1.5"
              />
              <button
                type="button"
                onClick={handleAddEvidenceDoc}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg font-semibold hover:bg-slate-300"
              >
                Tambah
              </button>
            </div>
          </div>

          {/* ARKAS Integration Link */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Keterhubungan dengan Tabel Anggaran ARKAS
              </span>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Hubungkan rekomendasi perbaikan indikator ini ke mata anggaran ARKAS BOSP
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.arkasLinked}
                onChange={(e) => setForm({ ...form, arkasLinked: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            {form.arkasLinked && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToArkas();
                }}
                className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1"
              >
                Buka di Tabel ARKAS →
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
