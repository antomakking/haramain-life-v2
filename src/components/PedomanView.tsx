import React from 'react';
import { 
  BookOpenCheck, 
  FileText, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2,
  Bookmark
} from 'lucide-react';

export const PedomanView: React.FC = () => {
  const documents = [
    {
      title: 'Manual Mutu SPMI SMK IT Ibnul Qayyim Makassar Edisi 2024',
      code: 'DOK-SPMI-01',
      version: 'Rev. 3.2',
      pages: '48 Halaman',
      desc: 'Kebijakan mutu, struktur organisasi TPMPS, dan alur siklus PPEPP terpadu pesantren vokasi.',
    },
    {
      title: 'Standar Operasional Prosedur (SOP) Audit Mutu Internal (AMI)',
      code: 'SOP-AMI-02',
      version: 'Rev. 2.0',
      pages: '18 Halaman',
      desc: 'Tata cara pelaksanaan audit kepatuhan standar, instrumen tilik, dan format penerbitan PTK.',
    },
    {
      title: 'Pedoman Perencanaan Berbasis Data (PBD) Menuju RKAS / ARKAS',
      code: 'PED-PBD-03',
      version: 'Rev. 1.4',
      pages: '32 Halaman',
      desc: 'Panduan transformasi rekomendasi Rapor Pendidikan Kemendikbud ke kode belanja ARKAS BOSP.',
    },
    {
      title: 'SOP Penyelenggaraan Teaching Factory (TeFa) Konsentrasi RPL & TKJ',
      code: 'SOP-TEFA-04',
      version: 'Rev. 1.1',
      pages: '24 Halaman',
      desc: 'Standar pesanan software klien, pembagian royalti siswa pengembang, dan kontrol mutu produk.',
    },
    {
      title: 'Pedoman Penguatan Karakter & Adab Santri Vokasi Terpadu',
      code: 'PED-ADAB-05',
      version: 'Rev. 2.1',
      pages: '22 Halaman',
      desc: 'Integrasi kurikulum keagamaan, tasmi tahfidz Al-Qur\'an 3 juz, dan etika profesional dunia kerja.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <BookOpenCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Pedoman & Dokumen Mutu SPMI
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Arsip regulasi, manual mutu, SOP, dan instrumen penjaminan mutu SMK IT Ibnul Qayyim Makassar
          </p>
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-500 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {doc.code}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  {doc.version}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {doc.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">
                {doc.pages} · PDF Resmi
              </span>
              <button
                onClick={() => alert(`Mengunduh dokumen: ${doc.title}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Legal & Regulatory Framework */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Landasan Hukum Penjaminan Mutu Pendidikan
        </h4>
        <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Permendikbudristek Nomor 47 Tahun 2023 tentang Standar Pengelolaan pada PAUD, Dikdas, dan Dikmen.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Permendikbudristek Nomor 63 Tahun 2023 tentang Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan (BOSP/ARKAS).</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Surat Keputusan Kepala SMK IT Ibnul Qayyim Makassar No. 042/SK-TPMPS/VII/2024 tentang Pembentukan Tim Penjaminan Mutu Pendidikan Sekolah (TPMPS).</span>
          </li>
        </ul>
      </div>

    </div>
  );
};
