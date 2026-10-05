import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface DayTrendData {
  dayKey: string;
  dayShort: string;
  dayFull: string;
  makkahAvg: number;
  madinahAvg: number;
  makkahPrayers: { fajr: number; dhuhr: number; asr: number; maghrib: number; isha: number };
  madinahPrayers: { fajr: number; dhuhr: number; asr: number; maghrib: number; isha: number };
  note: string;
}

const WEEKLY_TREND_DATA: DayTrendData[] = [
  {
    dayKey: 'sun',
    dayShort: 'Ahad',
    dayFull: 'Minggu (Sunday)',
    makkahAvg: 68,
    madinahAvg: 66,
    makkahPrayers: { fajr: 72, dhuhr: 65, asr: 62, maghrib: 75, isha: 70 },
    madinahPrayers: { fajr: 70, dhuhr: 62, asr: 60, maghrib: 73, isha: 68 },
    note: 'Awal pekan kerja Arab Saudi. Kepadatan tergolong sedang.',
  },
  {
    dayKey: 'mon',
    dayShort: 'Senin',
    dayFull: 'Senin (Monday)',
    makkahAvg: 72,
    madinahAvg: 70,
    makkahPrayers: { fajr: 78, dhuhr: 68, asr: 65, maghrib: 80, isha: 75 },
    madinahPrayers: { fajr: 75, dhuhr: 66, asr: 63, maghrib: 78, isha: 72 },
    note: 'Hari puasa sunnah Senin. Ramai jamaah berbuka puasa di pelataran Maghrib.',
  },
  {
    dayKey: 'tue',
    dayShort: 'Selasa',
    dayFull: 'Selasa (Tuesday)',
    makkahAvg: 58,
    madinahAvg: 55,
    makkahPrayers: { fajr: 65, dhuhr: 54, asr: 52, maghrib: 68, isha: 62 },
    madinahPrayers: { fajr: 62, dhuhr: 52, asr: 50, maghrib: 65, isha: 58 },
    note: 'Hari terlonggar dalam sepekan! Sangat ideal untuk Thawaf & Ziarah Raudhah.',
  },
  {
    dayKey: 'wed',
    dayShort: 'Rabu',
    dayFull: 'Rabu (Wednesday)',
    makkahAvg: 60,
    madinahAvg: 58,
    makkahPrayers: { fajr: 66, dhuhr: 56, asr: 54, maghrib: 70, isha: 64 },
    madinahPrayers: { fajr: 64, dhuhr: 54, asr: 52, maghrib: 68, isha: 60 },
    note: 'Kepadatan tergolong rendah hingga sedang. Akses pintu utama sangat lancar.',
  },
  {
    dayKey: 'thu',
    dayShort: 'Kamis',
    dayFull: 'Kamis (Thursday)',
    makkahAvg: 82,
    madinahAvg: 84,
    makkahPrayers: { fajr: 75, dhuhr: 78, asr: 80, maghrib: 90, isha: 88 },
    madinahPrayers: { fajr: 72, dhuhr: 80, asr: 82, maghrib: 92, isha: 90 },
    note: 'Malam Jumat (Friday Eve). Lonjakan jamaah lokal & ziarah Raudhah.',
  },
  {
    dayKey: 'fri',
    dayShort: 'Jumat',
    dayFull: 'Jumat (Friday - Jumu\'ah)',
    makkahAvg: 95,
    madinahAvg: 92,
    makkahPrayers: { fajr: 90, dhuhr: 98, asr: 92, maghrib: 96, isha: 94 },
    madinahPrayers: { fajr: 88, dhuhr: 96, asr: 88, maghrib: 94, isha: 92 },
    note: 'PUNCAK KERAMAIAN MINGGUAN! Pelataran Shalat Jumat penuh sejak 10:00 AST.',
  },
  {
    dayKey: 'sat',
    dayShort: 'Sabtu',
    dayFull: 'Sabtu (Saturday)',
    makkahAvg: 78,
    madinahAvg: 75,
    makkahPrayers: { fajr: 80, dhuhr: 74, asr: 72, maghrib: 84, isha: 80 },
    madinahPrayers: { fajr: 78, dhuhr: 70, asr: 68, maghrib: 82, isha: 76 },
    note: 'Akhir pekan lokal. Arus jamaah melandai kembali menjelang malam.',
  },
];

type CityFilter = 'both' | 'makkah' | 'madinah';
type PrayerFilter = 'avg' | 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
type ViewMode = 'trend' | 'prayers';

export default function App() {
  const [cityFilter, setCityFilter] = useState<CityFilter>('both');
  const [prayerFilter, setPrayerFilter] = useState<PrayerFilter>('avg');
  const [viewMode, setViewMode] = useState<ViewMode>('trend');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(5);

  const chartData = WEEKLY_TREND_DATA.map((d) => {
    let makkahVal = d.makkahAvg;
    let madinahVal = d.madinahAvg;

    if (prayerFilter !== 'avg') {
      makkahVal = d.makkahPrayers[prayerFilter];
      madinahVal = d.madinahPrayers[prayerFilter];
    }

    return {
      name: d.dayShort,
      dayFull: d.dayFull,
      makkah: makkahVal,
      madinah: madinahVal,
      note: d.note,
    };
  });

  const selectedDay = WEEKLY_TREND_DATA[selectedDayIndex];
  const prayerBreakdownData = [
    {
      prayer: 'Subuh',
      makkah: selectedDay.makkahPrayers.fajr,
      madinah: selectedDay.madinahPrayers.fajr,
    },
    {
      prayer: selectedDay.dayKey === 'fri' ? 'Jumat' : 'Dzuhur',
      makkah: selectedDay.makkahPrayers.dhuhr,
      madinah: selectedDay.madinahPrayers.dhuhr,
    },
    {
      prayer: 'Ashar',
      makkah: selectedDay.makkahPrayers.asr,
      madinah: selectedDay.madinahPrayers.asr,
    },
    {
      prayer: 'Maghrib',
      makkah: selectedDay.makkahPrayers.maghrib,
      madinah: selectedDay.madinahPrayers.maghrib,
    },
    {
      prayer: 'Isya',
      makkah: selectedDay.makkahPrayers.isha,
      madinah: selectedDay.madinahPrayers.isha,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dayData = WEEKLY_TREND_DATA.find((d) => d.dayShort === label);
      return (
        <div className="p-3.5 bg-white border border-[#E5DAC8] rounded-2xl shadow-xl text-xs max-w-xs text-[#1C2D24]">
          <div className="font-extrabold text-sm border-b border-[#E5DAC8] pb-1.5 mb-2 text-[#244C3B]">
            {dayData ? dayData.dayFull : label}
          </div>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => {
              const isMakkah = entry.dataKey === 'makkah';
              const name = isMakkah ? '🕋 Makkah (Masjidil Haram)' : '🕌 Madinah (Masjid Nabawi)';
              return (
                <div key={`item-${index}`} className="flex items-center justify-between gap-3">
                  <span className="font-bold flex items-center gap-1.5" style={{ color: entry.color }}>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    {name}:
                  </span>
                  <span className="font-mono font-black text-sm">{entry.value}%</span>
                </div>
              );
            })}
          </div>
          {dayData && (
            <div className="mt-2.5 pt-2 border-t border-[#E5DAC8]/60 text-[11px] text-[#2E4338] font-medium leading-relaxed bg-[#FAF6F0] p-2 rounded-xl">
              💡 {dayData.note}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-[#FFFFFF] border border-[#E5DAC8] shadow-sm text-[#1C2D24] relative overflow-hidden">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6F0] border border-[#E5DAC8] text-[#244C3B] text-[11px] font-bold tracking-wider uppercase mb-2">
            <svg className="w-3.5 h-3.5 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>POLA HISTORIS KERAMAIAN MINGGUAN (RECHARTS)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#1C2D24]">
            Trend Kepadatan Jamaah 7 Hari dalam Seminggu
          </h3>
          <p className="text-xs sm:text-sm text-[#2E4338] font-medium mt-0.5">
            Analisis grafik historis untuk membantu merencanakan hari terbaik kunjungan ibadah, thawaf, dan ziarah Raudhah.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] shadow-2xs self-start lg:self-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setViewMode('trend')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === 'trend'
                ? 'bg-[#244C3B] text-white shadow-xs'
                : 'text-[#2E4338] hover:text-[#1C2D24]'
            }`}
          >
            📈 Trend 7 Hari (Area)
          </button>
          <button
            onClick={() => setViewMode('prayers')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === 'prayers'
                ? 'bg-[#244C3B] text-white shadow-xs'
                : 'text-[#2E4338] hover:text-[#1C2D24]'
            }`}
          >
            📊 Per Waktu Shalat (Bar)
          </button>
        </div>
      </div>

      {/* Control Bar Filters */}
      <div className="bg-[#FAF6F0] border border-[#E5DAC8] p-3.5 sm:p-4 rounded-2xl mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* City Selector Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-[#3B5145] uppercase tracking-wider mr-1.5 shrink-0">Kota:</span>
          <button
            onClick={() => setCityFilter('both')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
              cityFilter === 'both' ? 'bg-[#244C3B] text-white shadow-2xs' : 'bg-white border border-[#E5DAC8] text-[#2E4338]'
            }`}
          >
            Dua Tanah Suci
          </button>
          <button
            onClick={() => setCityFilter('makkah')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
              cityFilter === 'makkah' ? 'bg-[#244C3B] text-white shadow-2xs' : 'bg-white border border-[#E5DAC8] text-[#2E4338]'
            }`}
          >
            🕋 Makkah
          </button>
          <button
            onClick={() => setCityFilter('madinah')}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer shrink-0 ${
              cityFilter === 'madinah' ? 'bg-[#244C3B] text-white shadow-2xs' : 'bg-white border border-[#E5DAC8] text-[#2E4338]'
            }`}
          >
            🕌 Madinah
          </button>
        </div>

        {/* Prayer Selector or Day Selector */}
        {viewMode === 'trend' ? (
          <div className="flex items-center gap-1 overflow-x-auto pt-1 md:pt-0 border-t md:border-t-0 border-[#E5DAC8]">
            <span className="text-[11px] font-bold text-[#3B5145] uppercase tracking-wider mr-1.5 shrink-0">Shalat:</span>
            {[
              { key: 'avg', label: 'Rata-Rata' },
              { key: 'fajr', label: 'Subuh' },
              { key: 'dhuhr', label: 'Dzuhur/Jumat' },
              { key: 'asr', label: 'Ashar' },
              { key: 'maghrib', label: 'Maghrib' },
              { key: 'isha', label: 'Isya' },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setPrayerFilter(p.key as PrayerFilter)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition text-[11px] cursor-pointer shrink-0 ${
                  prayerFilter === p.key
                    ? 'bg-[#C5A059] text-white font-bold'
                    : 'bg-white border border-[#E5DAC8] text-[#2E4338]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1 overflow-x-auto pt-1 md:pt-0 border-t md:border-t-0 border-[#E5DAC8]">
            <span className="text-[11px] font-bold text-[#3B5145] uppercase tracking-wider mr-1.5 shrink-0">Pilih Hari:</span>
            {WEEKLY_TREND_DATA.map((d, idx) => (
              <button
                key={d.dayKey}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-2.5 py-1 rounded-lg font-bold transition text-[11px] cursor-pointer shrink-0 ${
                  selectedDayIndex === idx
                    ? 'bg-[#244C3B] text-white'
                    : 'bg-white border border-[#E5DAC8] text-[#2E4338]'
                }`}
              >
                {d.dayShort}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Chart Area (Recharts) */}
      <div className="h-72 sm:h-80 w-full mb-6 relative">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'trend' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMakkah" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#244C3B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#244C3B" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorMadinah" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5A059" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#C5A059" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DAC8" vertical={false} />
              <XAxis dataKey="name" stroke="#3B5145" tick={{ fontSize: 11, fontWeight: 700 }} />
              <YAxis domain={[40, 100]} stroke="#3B5145" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 700 }}
              />
              {(cityFilter === 'both' || cityFilter === 'makkah') && (
                <Area
                  type="monotone"
                  dataKey="makkah"
                  name="Makkah Al-Mukarramah"
                  stroke="#244C3B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMakkah)"
                />
              )}
              {(cityFilter === 'both' || cityFilter === 'madinah') && (
                <Area
                  type="monotone"
                  dataKey="madinah"
                  name="Madinah Al-Munawwarah"
                  stroke="#C5A059"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorMadinah)"
                />
              )}
            </AreaChart>
          ) : (
            <BarChart data={prayerBreakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DAC8" vertical={false} />
              <XAxis dataKey="prayer" stroke="#3B5145" tick={{ fontSize: 11, fontWeight: 700 }} />
              <YAxis domain={[40, 100]} stroke="#3B5145" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5DAC8', borderRadius: '1rem', fontSize: '12px', fontWeight: 700 }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 700 }}
              />
              {(cityFilter === 'both' || cityFilter === 'makkah') && (
                <Bar dataKey="makkah" name="Makkah Al-Mukarramah" fill="#244C3B" radius={[8, 8, 0, 0]} />
              )}
              {(cityFilter === 'both' || cityFilter === 'madinah') && (
                <Bar dataKey="madinah" name="Madinah Al-Munawwarah" fill="#C5A059" radius={[8, 8, 0, 0]} />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* 3 Key Pattern Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-[#E5DAC8] text-xs">
        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-800 border border-red-200 flex items-center justify-center shrink-0 font-bold">
            🕌
          </div>
          <div>
            <h4 className="font-extrabold text-[#1C2D24] text-xs">Hari Jumat (Puncak Jumu'ah)</h4>
            <p className="text-[11px] text-[#2E4338] font-medium mt-0.5 leading-relaxed">
              Shalat Jumat mencapai 98% kapasitas di Makkah & 95% di Madinah. Datang pukul 10:00 AST untuk barisan awal.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0 font-bold">
            🌿
          </div>
          <div>
            <h4 className="font-extrabold text-[#1C2D24] text-xs">Selasa & Rabu (Paling Longgar)</h4>
            <p className="text-[11px] text-[#2E4338] font-medium mt-0.5 leading-relaxed">
              Kepadatan terendah mingguan (55-60%). Waktu terbaik untuk Thawaf dekat Ka'bah & Ziarah Raudhah Syarifah.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0 font-bold">
            🌙
          </div>
          <div>
            <h4 className="font-extrabold text-[#1C2D24] text-xs">Kamis Malam (Malam Jumat)</h4>
            <p className="text-[11px] text-[#2E4338] font-medium mt-0.5 leading-relaxed">
              Lonjakan jamaah lokal & peziarah antar-kota. Area pelataran Isya & Maghrib memadat hingga 88-92%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
