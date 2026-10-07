import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Plus, 
  FileSpreadsheet, 
  Trash2, 
  Filter, 
  Coins, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { useSPMI } from '../context/SPMIContext';
import { ArkasItem, ArkasFundingSource } from '../types/spmi';

interface ArkasExportViewProps {
  onOpenNewArkasModal: () => void;
}

export const ArkasExportView: React.FC<ArkasExportViewProps> = ({ onOpenNewArkasModal }) => {
  const { arkasItems, deleteArkasItem, activeUser, saveArkasItem } = useSPMI();

  const [fundingFilter, setFundingFilter] = useState<'ALL' | ArkasFundingSource>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'TINGGI' | 'SEDANG' | 'RENDAH'>('ALL');
  const [copied, setCopied] = useState(false);

  // Filtered items
  const filteredItems = useMemo(() => {
    return arkasItems.filter((item) => {
      if (fundingFilter !== 'ALL' && item.sumberDana !== fundingFilter) return false;
      if (priorityFilter !== 'ALL' && item.prioritas !== priorityFilter) return false;
      return true;
    });
  }, [arkasItems, fundingFilter, priorityFilter]);

  // Aggregate totals
  const totalAnggaran = useMemo(() => {
    return filteredItems.reduce((acc, curr) => acc + curr.total, 0);
  }, [filteredItems]);

  const totalBosReguler = useMemo(() => {
    return arkasItems.filter(i => i.sumberDana === 'BOS_REGULER').reduce((acc, curr) => acc + curr.total, 0);
  }, [arkasItems]);

  const totalBosKinerja = useMemo(() => {
    return arkasItems.filter(i => i.sumberDana === 'BOS_KINERJA').reduce((acc, curr) => acc + curr.total, 0);
  }, [arkasItems]);

  const totalYayasan = useMemo(() => {
    return arkasItems.filter(i => i.sumberDana === 'YAYASAN_KOMITE').reduce((acc, curr) => acc + curr.total, 0);
  }, [arkasItems]);

  // 1. Export CSV
  const handleExportCSV = () => {
    const headers = [
      'No',
      'Kode Standar',
      'Nama Standar SNP',
      'Kode Kegiatan ARKAS',
      'Nama Kegiatan',
      'Kode Rekening Belanja',
      'Uraian Rincian Belanja',
      'Volume',
      'Satuan',
      'Tarif (Rp)',
      'Total Jumlah (Rp)',
      'Sumber Dana',
      'Triwulan',
      'Status Approval',
      'Prioritas',
      'Penanggung Jawab',
      'Indikator Rujukan SPMI'
    ];

    const rows = filteredItems.map((item, idx) => [
      idx + 1,
      `"${item.kodeStandar}"`,
      `"${item.namaStandar}"`,
      `"${item.kodeKegiatan}"`,
      `"${item.namaKegiatan}"`,
      `"${item.kodeRekening}"`,
      `"${item.uraianBelanja.replace(/"/g, '""')}"`,
      item.volume,
      `"${item.satuan}"`,
      item.tarif,
      item.total,
      `"${item.sumberDana}"`,
      `"${item.triwulan}"`,
      `"${item.statusApproval}"`,
      `"${item.prioritas}"`,
      `"${item.penanggungJawabName}"`,
      `"${item.indicatorCode}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ARKAS_PBD_SMKIT_IBNUL_QAYYIM_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Print Worksheet
  const handlePrint = () => {
    window.print();
  };

  // 3. Copy JSON to Clipboard
  const handleCopyJSON = () => {
    const exportData = {
      sekolah: 'SMK IT Ibnul Qayyim Makassar',
      npsn: '69979314',
      tahunAnggaran: '2025',
      tanggalEkspor: new Date().toISOString(),
      totalAnggaran,
      rincianKegiatan: filteredItems,
    };
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick Approval Toggle
  const handleToggleApproval = async (item: ArkasItem) => {
    const nextStatus = item.statusApproval === 'FINAL_ARKAS' 
      ? 'DRAFT' 
      : item.statusApproval === 'DRAFT' 
      ? 'DISETUJUI_TPM' 
      : 'FINAL_ARKAS';
    await saveArkasItem({ ...item, statusApproval: nextStatus });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Non-Print Action Header */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tabel Ekspor ARKAS & Rencana Anggaran (PBD)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Integrasi rekomendasi SPMI Rapor Pendidikan ke dalam format kode rekening dan kegiatan ARKAS Kemendikbudristek
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
            title="Download file CSV format ARKAS siap pakai di Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh CSV ARKAS</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors shadow-xs"
            title="Cetak format lembar kerja resmi pengesahan Kepala Sekolah"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Lembar Kerja</span>
          </button>

          <button
            onClick={handleCopyJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors shadow-xs"
            title="Salin JSON struktur ARKAS"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin JSON'}</span>
          </button>

          {activeUser.permissions?.canExportArkas && (
            <button
              onClick={onOpenNewArkasModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Belanja</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="print:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Anggaran Terpetakan
          </p>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            Rp {totalAnggaran.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            {filteredItems.length} Rincian Kegiatan Terhubung
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Alokasi BOS Reguler
          </p>
          <p className="text-xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-1">
            Rp {totalBosReguler.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            Operasional Pembelajaran & USK Siswa
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Alokasi BOS Kinerja
          </p>
          <p className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-1">
            Rp {totalBosKinerja.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            Belanja Modal Sarpras Lab IT Workstation
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Alokasi Komite / Yayasan
          </p>
          <p className="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono mt-1">
            Rp {totalYayasan.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            Penguatan Karakter Santri & Tasmi Tahfidz
          </p>
        </div>

      </div>

      {/* Filter Toolbar */}
      <div className="print:hidden bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Sumber Dana:
            </span>
            <select
              value={fundingFilter}
              onChange={(e) => setFundingFilter(e.target.value as any)}
              className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 px-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua Sumber Dana</option>
              <option value="BOS_REGULER">BOS Reguler Kemendikbud</option>
              <option value="BOS_KINERJA">BOS Kinerja (SMK PK / Prestasi)</option>
              <option value="YAYASAN_KOMITE">Yayasan / Komite Sekolah</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Skala Prioritas:
            </span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 px-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="TINGGI">Prioritas Tinggi (Merah/Kuning)</option>
              <option value="SEDANG">Prioritas Sedang</option>
              <option value="RENDAH">Prioritas Pemeliharaan</option>
            </select>
          </div>

        </div>

        <div className="text-xs text-slate-500">
          Menampilkan <strong>{filteredItems.length}</strong> kegiatan
        </div>
      </div>

      {/* PRINT-ONLY HEADER (Official Institutional Kop Surat) */}
      <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-6">
        <h3 className="font-bold text-sm tracking-widest uppercase">
          YAYASAN WAHDAH ISLAMIYAH MAKASSAR
        </h3>
        <h1 className="font-extrabold text-lg uppercase tracking-wide">
          SMK IT IBNUL QAYYIM MAKASSAR
        </h1>
        <p className="text-xs italic text-gray-700">
          Konsentrasi Keahlian: Rekayasa Perangkat Lunak (RPL) & Teknik Komputer Jaringan (TKJ)
        </p>
        <p className="text-xs text-gray-600">
          Alamat: Jl. KH. Abdul Jabbar Asyiri, Kel. Sudiang, Kec. Biringkanaya, Kota Makassar · NPSN: 69979314
        </p>
        <div className="mt-3 pt-2 border-t border-gray-400">
          <h2 className="font-bold text-sm uppercase underline">
            LEMBAR KERJA PERENCANAAN BERBASIS DATA (PBD) & RENCANA KEGIATAN ANGGARAN SEKOLAH (ARKAS)
          </h2>
          <p className="text-xs text-gray-700">
            Tahun Anggaran: 2025 · Periode Perencanaan: Jan - Des 2025
          </p>
        </div>
      </div>

      {/* THE MAIN ARKAS DATA TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200 dark:border-slate-700 print:bg-gray-100 print:text-black">
              <tr>
                <th className="px-3 py-3 border print:border-black w-8 text-center">No</th>
                <th className="px-3 py-3 border print:border-black">Kd Standar</th>
                <th className="px-3 py-3 border print:border-black">Kd Kegiatan</th>
                <th className="px-3 py-3 border print:border-black">Kd Rekening Belanja</th>
                <th className="px-3 py-3 border print:border-black">Uraian Rincian Belanja</th>
                <th className="px-3 py-3 border print:border-black text-center">Vol</th>
                <th className="px-3 py-3 border print:border-black text-center">Satuan</th>
                <th className="px-3 py-3 border print:border-black text-right">Tarif (Rp)</th>
                <th className="px-3 py-3 border print:border-black text-right font-bold">Total (Rp)</th>
                <th className="px-3 py-3 border print:border-black text-center">Sumber Dana</th>
                <th className="px-3 py-3 border print:border-black text-center">TW</th>
                <th className="px-3 py-3 border print:border-black print:hidden text-center">Status</th>
                <th className="px-3 py-3 border print:border-black print:hidden text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredItems.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-3 py-2.5 border print:border-black text-center font-mono">
                    {idx + 1}
                  </td>
                  <td className="px-3 py-2.5 border print:border-black font-mono font-semibold" title={item.namaStandar}>
                    {item.kodeStandar}
                  </td>
                  <td className="px-3 py-2.5 border print:border-black font-mono" title={item.namaKegiatan}>
                    {item.kodeKegiatan}
                  </td>
                  <td className="px-3 py-2.5 border print:border-black font-mono text-slate-500 text-[11px]">
                    {item.kodeRekening}
                  </td>
                  <td className="px-3 py-2.5 border print:border-black max-w-sm">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                      {item.uraianBelanja}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                      <span>Rujukan: {item.indicatorCode}</span>
                      <span>·</span>
                      <span>PIC: {item.penanggungJawabName.split(',')[0]}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 border print:border-black text-center font-mono">
                    {item.volume}
                  </td>
                  <td className="px-3 py-2.5 border print:border-black text-center">
                    {item.satuan}
                  </td>
                  <td className="px-3 py-2.5 border print:border-black text-right font-mono">
                    {item.tarif.toLocaleString('id-ID')}
                  </td>
                  <td className="px-3 py-2.5 border print:border-black text-right font-mono font-bold text-slate-900 dark:text-white">
                    {item.total.toLocaleString('id-ID')}
                  </td>
                  <td className="px-3 py-2.5 border print:border-black text-center text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-semibold ${
                      item.sumberDana === 'BOS_KINERJA'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : item.sumberDana === 'YAYASAN_KOMITE'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {item.sumberDana.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 border print:border-black text-center font-mono font-semibold">
                    {item.triwulan}
                  </td>
                  <td className="px-3 py-2.5 border print:border-black print:hidden text-center">
                    <button
                      onClick={() => handleToggleApproval(item)}
                      title="Klik untuk ubah status approval"
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                        item.statusApproval === 'FINAL_ARKAS'
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : item.statusApproval === 'DISETUJUI_TPM'
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {item.statusApproval === 'FINAL_ARKAS' ? 'Final ARKAS' : item.statusApproval === 'DISETUJUI_TPM' ? 'Setuju TPM' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-3 py-2.5 border print:border-black print:hidden text-center">
                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus kegiatan "${item.uraianBelanja.substring(0, 30)}..." dari ARKAS?`)) {
                          deleteArkasItem(item.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      title="Hapus item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Grand Total Footer */}
            <tfoot className="bg-slate-100 dark:bg-slate-800/90 font-bold border-t-2 border-slate-300 dark:border-slate-700 print:bg-gray-200 print:border-black">
              <tr>
                <td colSpan={8} className="px-3 py-3 border print:border-black text-right uppercase text-xs">
                  Jumlah Total Alokasi Anggaran ARKAS (PBD 2025):
                </td>
                <td className="px-3 py-3 border print:border-black text-right font-mono text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
                  Rp {totalAnggaran.toLocaleString('id-ID')}
                </td>
                <td colSpan={4} className="px-3 py-3 border print:border-black text-slate-500 text-[11px] print:hidden">
                  Terdiri atas BOS Reguler, BOS Kinerja & Komite
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* PRINT-ONLY SIGNATURE SECTION (Pengesahan Kepala Sekolah & TPMPS) */}
      <div className="hidden print:grid grid-cols-3 gap-6 pt-10 text-center text-xs">
        <div>
          <p>Mengetahui,</p>
          <p className="font-bold">Ketua TPMPS</p>
          <div className="h-20"></div>
          <p className="font-bold underline">Ust. Ahmad Fauzan, S.Kom., M.T</p>
          <p className="text-[10px]">NIP. 19840915 201001 1 012</p>
        </div>

        <div>
          <p>Menyetujui,</p>
          <p className="font-bold">Bendahara BOSP / ARKAS</p>
          <div className="h-20"></div>
          <p className="font-bold underline">Mustafa Al-Baqir, S.E</p>
          <p className="text-[10px]">NIP. 19870125 201201 1 008</p>
        </div>

        <div>
          <p>Makassar, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="font-bold">Kepala SMK IT Ibnul Qayyim</p>
          <div className="h-20"></div>
          <p className="font-bold underline">Drs. H. Muhammad Ilyas, M.Pd.I</p>
          <p className="text-[10px]">NIP. 19680512 199403 1 004</p>
        </div>
      </div>

    </div>
  );
};
