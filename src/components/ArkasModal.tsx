import React, { useState } from 'react';
import { 
  X, 
  Save, 
  FileSpreadsheet, 
  Coins, 
  Building2, 
  HelpCircle 
} from 'lucide-react';
import { useSPMI } from '../context/SPMIContext';
import { ArkasItem, ArkasFundingSource } from '../types/spmi';

interface ArkasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArkasModal: React.FC<ArkasModalProps> = ({ isOpen, onClose }) => {
  const { saveArkasItem, indicators, users, activeUser } = useSPMI();

  const [form, setForm] = useState<Partial<ArkasItem>>({
    kodeStandar: '03',
    namaStandar: 'Pengembangan Standar Proses',
    kodeKegiatan: '03.02.01',
    namaKegiatan: 'Workshop Pengembangan Modul Ajar Kurikulum Merdeka IT',
    kodeRekening: '5.1.02.01.01.0024',
    uraianBelanja: '',
    volume: 1,
    satuan: 'Paket',
    tarif: 5000000,
    sumberDana: 'BOS_REGULER',
    triwulan: 'TW2',
    prioritas: 'TINGGI',
    statusApproval: 'DRAFT',
    indicatorId: indicators[0]?.id || 'ind-01',
    indicatorCode: indicators[0]?.code || 'A.1.1',
    penanggungJawabId: activeUser.id,
    penanggungJawabName: activeUser.name,
  });

  if (!isOpen) return null;

  const total = (form.volume || 1) * (form.tarif || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.uraianBelanja) {
      alert('Mohon isi uraian rincian belanja ARKAS.');
      return;
    }

    const newItem: ArkasItem = {
      id: `arkas-${Date.now()}`,
      indicatorId: form.indicatorId || 'ind-01',
      indicatorCode: form.indicatorCode || 'A.1.1',
      kodeStandar: form.kodeStandar || '03',
      namaStandar: form.namaStandar || 'Pengembangan Standar Proses',
      kodeKegiatan: form.kodeKegiatan || '03.02.01',
      namaKegiatan: form.namaKegiatan || 'Kegiatan PBD Sekolah',
      kodeRekening: form.kodeRekening || '5.1.02.01.01.0024',
      uraianBelanja: form.uraianBelanja || '',
      volume: form.volume || 1,
      satuan: form.satuan || 'Paket',
      tarif: form.tarif || 0,
      total,
      sumberDana: (form.sumberDana as ArkasFundingSource) || 'BOS_REGULER',
      statusApproval: 'DRAFT',
      triwulan: form.triwulan as any || 'TW2',
      penanggungJawabId: form.penanggungJawabId || activeUser.id,
      penanggungJawabName: form.penanggungJawabName || activeUser.name,
      prioritas: form.prioritas as any || 'TINGGI',
    };

    await saveArkasItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full shadow-2xl my-8 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tambah Belanja ke Tabel ARKAS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Indikator Rujukan SPMI */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Rujukan Indikator Rapor Pendidikan (PBD)
            </label>
            <select
              value={form.indicatorId}
              onChange={(e) => {
                const ind = indicators.find((i) => i.id === e.target.value);
                setForm({
                  ...form,
                  indicatorId: e.target.value,
                  indicatorCode: ind?.code || '',
                });
              }}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-medium"
            >
              {indicators.map((i) => (
                <option key={i.id} value={i.id}>
                  [{i.code}] {i.name} (Skor: {i.score} - {i.status})
                </option>
              ))}
            </select>
          </div>

          {/* Standar & Kode Kegiatan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kode Standar SNP
              </label>
              <select
                value={form.kodeStandar}
                onChange={(e) => {
                  const val = e.target.value;
                  const names: Record<string, string> = {
                    '01': 'Pengembangan Standar Kompetensi Lulusan',
                    '02': 'Pengembangan Standar Isi',
                    '03': 'Pengembangan Standar Proses',
                    '04': 'Pengembangan Pendidik dan Tenaga Kependidikan',
                    '05': 'Pengembangan Sarana dan Prasarana Sekolah',
                    '06': 'Pengembangan Standar Penilaian',
                    '07': 'Pengembangan Standar Pengelolaan',
                    '08': 'Pengembangan Standar Pembiayaan',
                  };
                  setForm({ ...form, kodeStandar: val, namaStandar: names[val] || '' });
                }}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono"
              >
                <option value="01">01 - Standar Kelulusan</option>
                <option value="02">02 - Standar Isi</option>
                <option value="03">03 - Standar Proses</option>
                <option value="04">04 - Standar PTK</option>
                <option value="05">05 - Standar Sarpras</option>
                <option value="06">06 - Standar Penilaian</option>
                <option value="07">07 - Standar Pengelolaan</option>
                <option value="08">08 - Standar Pembiayaan</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kode Kegiatan ARKAS
              </label>
              <input
                type="text"
                required
                value={form.kodeKegiatan}
                onChange={(e) => setForm({ ...form, kodeKegiatan: e.target.value })}
                placeholder="03.02.01"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Kegiatan
            </label>
            <input
              type="text"
              required
              value={form.namaKegiatan}
              onChange={(e) => setForm({ ...form, namaKegiatan: e.target.value })}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-medium"
            />
          </div>

          {/* Kode Rekening Belanja */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Kode Rekening Belanja ARKAS
            </label>
            <input
              type="text"
              required
              value={form.kodeRekening}
              onChange={(e) => setForm({ ...form, kodeRekening: e.target.value })}
              placeholder="5.1.02.01.01.0024"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono"
            />
          </div>

          {/* Uraian Rincian Belanja */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Uraian Rincian Belanja (Spesifikasi Riil)
            </label>
            <textarea
              required
              rows={2}
              value={form.uraianBelanja}
              onChange={(e) => setForm({ ...form, uraianBelanja: e.target.value })}
              placeholder="Deskripsi spesifikasi barang/jasa atau honorarium yang dibelanjakan..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2"
            />
          </div>

          {/* Volume, Satuan & Tarif -> Total */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Volume
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.volume}
                onChange={(e) => setForm({ ...form, volume: parseInt(e.target.value) || 1 })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Satuan
              </label>
              <input
                type="text"
                required
                value={form.satuan}
                onChange={(e) => setForm({ ...form, satuan: e.target.value })}
                placeholder="Unit / Siswa / Orang"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Tarif / Satuan (Rp)
              </label>
              <input
                type="number"
                step="1000"
                required
                value={form.tarif}
                onChange={(e) => setForm({ ...form, tarif: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 font-mono font-bold"
              />
            </div>
          </div>

          {/* Total Calculation Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
            <span className="font-bold text-emerald-900 dark:text-emerald-200">
              Total Jumlah Anggaran:
            </span>
            <span className="font-mono font-extrabold text-base text-emerald-700 dark:text-emerald-300">
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Sumber Dana & Triwulan */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sumber Dana
              </label>
              <select
                value={form.sumberDana}
                onChange={(e) => setForm({ ...form, sumberDana: e.target.value as any })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2"
              >
                <option value="BOS_REGULER">BOS Reguler Kemendikbud</option>
                <option value="BOS_KINERJA">BOS Kinerja (SMK PK/Prestasi)</option>
                <option value="YAYASAN_KOMITE">Yayasan / Komite Sekolah</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jadwal Realisasi Triwulan
              </label>
              <select
                value={form.triwulan}
                onChange={(e) => setForm({ ...form, triwulan: e.target.value as any })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 font-mono"
              >
                <option value="TW1">Triwulan 1 (Jan - Mar)</option>
                <option value="TW2">Triwulan 2 (Apr - Jun)</option>
                <option value="TW3">Triwulan 3 (Jul - Sep)</option>
                <option value="TW4">Triwulan 4 (Okt - Des)</option>
                <option value="TAHUNAN">Sepanjang Tahun</option>
              </select>
            </div>
          </div>

          {/* Penanggung Jawab */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Penanggung Jawab Kegiatan (TPM)
            </label>
            <select
              value={form.penanggungJawabId}
              onChange={(e) => {
                const u = users.find((usr) => usr.id === e.target.value);
                setForm({
                  ...form,
                  penanggungJawabId: e.target.value,
                  penanggungJawabName: u?.name || '',
                });
              }}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.role} - {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Footer Submit */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
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
              Simpan ke ARKAS
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
