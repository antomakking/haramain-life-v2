import React, { useState, useMemo, useEffect } from 'react';
import {
  Clock,
  Compass,
  Footprints,
  Users,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ChevronRight,
  Copy,
  Sparkles,
  Share2,
  Flame,
  MapPin,
  Activity,
  Info,
  Navigation,
  Smile,
  RefreshCw,
} from 'lucide-react';
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
import {
  Language,
  reactTranslations,
  ThawafFloorItem,
  SaiModeItem,
  TahallulModeItem,
} from './translations';

/* =========================================================================
   1. LANGUAGE REACTIVE HOOK
   ========================================================================= */

export function useLanguage(): Language {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('haramain_lang');
      if (saved === 'en' || saved === 'id') return saved;
      if (typeof window !== 'undefined' && (window as unknown as { currentLang?: string }).currentLang) {
        return (window as unknown as { currentLang?: string }).currentLang === 'en' ? 'en' : 'id';
      }
    } catch (e) {}
    return 'id';
  });

  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ lang?: Language }>;
      const newLang = customEvent?.detail?.lang || (window as unknown as { currentLang?: Language }).currentLang;
      if (newLang === 'en' || newLang === 'id') {
        setLang(newLang);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'haramain_lang' && (e.newValue === 'id' || e.newValue === 'en')) {
        setLang(e.newValue as Language);
      }
    };

    window.addEventListener('languagechange', handleLangChange);
    window.addEventListener('haramain_language_change', handleLangChange);
    window.addEventListener('storage', handleStorage);

    // Backup polling check in case window.currentLang was changed directly
    const interval = setInterval(() => {
      const cur = (window as unknown as { currentLang?: string }).currentLang;
      if ((cur === 'en' || cur === 'id') && cur !== lang) {
        setLang(cur as Language);
      }
    }, 400);

    return () => {
      window.removeEventListener('languagechange', handleLangChange);
      window.removeEventListener('haramain_language_change', handleLangChange);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [lang]);

  return lang;
}

/* =========================================================================
   2. TYPES & DATA DEFINITIONS
   ========================================================================= */

type ThawafFloor = 'ground' | 'mezzanine' | 'roof' | 'scooter';
type SaiMode = 'walk_normal' | 'walk_elderly' | 'scooter' | 'wheelchair';
type TahallulMode = 'self_marwah' | 'barber_outside';

interface DayTrendData {
  dayKey: string;
  dayShort: { id: string; en: string };
  dayFull: { id: string; en: string };
  makkahAvg: number;
  madinahAvg: number;
  makkahPrayers: { fajr: number; dhuhr: number; asr: number; maghrib: number; isha: number };
  madinahPrayers: { fajr: number; dhuhr: number; asr: number; maghrib: number; isha: number };
  note: { id: string; en: string };
}

const WEEKLY_TREND_DATA: DayTrendData[] = [
  {
    dayKey: 'sun',
    dayShort: { id: 'Ahad', en: 'Sun' },
    dayFull: { id: 'Ahad (Sunday)', en: 'Sunday' },
    makkahAvg: 68,
    madinahAvg: 66,
    makkahPrayers: { fajr: 72, dhuhr: 65, asr: 62, maghrib: 75, isha: 70 },
    madinahPrayers: { fajr: 70, dhuhr: 62, asr: 60, maghrib: 73, isha: 68 },
    note: {
      id: 'Awal pekan kerja Arab Saudi. Kepadatan tergolong sedang.',
      en: 'Start of the Saudi work week. Crowd level is generally moderate.',
    },
  },
  {
    dayKey: 'mon',
    dayShort: { id: 'Senin', en: 'Mon' },
    dayFull: { id: 'Senin (Monday)', en: 'Monday' },
    makkahAvg: 72,
    madinahAvg: 70,
    makkahPrayers: { fajr: 78, dhuhr: 68, asr: 65, maghrib: 80, isha: 75 },
    madinahPrayers: { fajr: 75, dhuhr: 66, asr: 63, maghrib: 78, isha: 72 },
    note: {
      id: 'Hari puasa sunnah Senin. Ramai jamaah berbuka puasa di pelataran Maghrib.',
      en: 'Sunnah fasting day. Pilgrims gather for iftar around Maghrib prayer.',
    },
  },
  {
    dayKey: 'tue',
    dayShort: { id: 'Selasa', en: 'Tue' },
    dayFull: { id: 'Selasa (Tuesday)', en: 'Tuesday' },
    makkahAvg: 58,
    madinahAvg: 55,
    makkahPrayers: { fajr: 65, dhuhr: 54, asr: 52, maghrib: 68, isha: 62 },
    madinahPrayers: { fajr: 62, dhuhr: 52, asr: 50, maghrib: 65, isha: 58 },
    note: {
      id: 'Hari terlonggar dalam sepekan! Sangat ideal untuk Thawaf & Ziarah Raudhah.',
      en: 'Calmest day of the week! Very ideal for Tawaf and Rawdah visitation.',
    },
  },
  {
    dayKey: 'wed',
    dayShort: { id: 'Rabu', en: 'Wed' },
    dayFull: { id: 'Rabu (Wednesday)', en: 'Wednesday' },
    makkahAvg: 60,
    madinahAvg: 58,
    makkahPrayers: { fajr: 66, dhuhr: 56, asr: 54, maghrib: 70, isha: 64 },
    madinahPrayers: { fajr: 64, dhuhr: 54, asr: 52, maghrib: 68, isha: 60 },
    note: {
      id: 'Kepadatan tergolong rendah hingga sedang. Akses pintu utama sangat lancar.',
      en: 'Low to moderate crowd density. Main entrance gates are easily accessible.',
    },
  },
  {
    dayKey: 'thu',
    dayShort: { id: 'Kamis', en: 'Thu' },
    dayFull: { id: 'Kamis (Thursday)', en: 'Thursday' },
    makkahAvg: 82,
    madinahAvg: 84,
    makkahPrayers: { fajr: 75, dhuhr: 78, asr: 80, maghrib: 90, isha: 88 },
    madinahPrayers: { fajr: 72, dhuhr: 80, asr: 82, maghrib: 92, isha: 90 },
    note: {
      id: 'Malam Jumat (Friday Eve). Lonjakan jamaah lokal & ziarah Raudhah.',
      en: 'Eve of Friday. Notable influx of local visitors and Rawdah pilgrims.',
    },
  },
  {
    dayKey: 'fri',
    dayShort: { id: 'Jumat', en: 'Fri' },
    dayFull: { id: "Jumat (Friday - Jumu'ah)", en: 'Friday (Jumu\'ah)' },
    makkahAvg: 95,
    madinahAvg: 92,
    makkahPrayers: { fajr: 90, dhuhr: 98, asr: 92, maghrib: 96, isha: 94 },
    madinahPrayers: { fajr: 88, dhuhr: 96, asr: 88, maghrib: 94, isha: 92 },
    note: {
      id: 'PUNCAK KERAMAIAN MINGGUAN! Pelataran Shalat Jumat penuh sejak 10:00 AST.',
      en: 'WEEKLY CAPACITY PEAK! Friday congregational rows full from 10:00 AST.',
    },
  },
  {
    dayKey: 'sat',
    dayShort: { id: 'Sabtu', en: 'Sat' },
    dayFull: { id: 'Sabtu (Saturday)', en: 'Saturday' },
    makkahAvg: 78,
    madinahAvg: 75,
    makkahPrayers: { fajr: 80, dhuhr: 74, asr: 72, maghrib: 84, isha: 80 },
    madinahPrayers: { fajr: 78, dhuhr: 70, asr: 68, maghrib: 82, isha: 76 },
    note: {
      id: 'Akhir pekan lokal. Arus jamaah melandai kembali menjelang malam.',
      en: 'Local weekend. Pilgrim flows gradually ease into the night.',
    },
  },
];

/* =========================================================================
   3. UTILITY FUNCTIONS
   ========================================================================= */

function getSaudiNowDate(): Date {
  const now = new Date();
  const astString = now.toLocaleString('en-US', { timeZone: 'Asia/Riyadh' });
  return new Date(astString);
}

function formatMinutes(totalMins: number, lang: Language): string {
  const t = reactTranslations[lang];
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hours === 0) return `${mins} ${t.time_min_unit}`;
  if (mins === 0) return `${hours} ${t.time_hour_unit}`;
  return `${hours} ${t.time_hour_unit} ${mins} ${t.time_min_unit}`;
}

function addMinutesToTime(startHour: number, startMinute: number, addedMinutes: number): string {
  const total = startHour * 60 + startMinute + addedMinutes;
  const wrapped = total % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} AST`;
}

/* =========================================================================
   4. SECTION 1: KALKULATOR ESTIMASI WAKTU MANASIK UMROH
   ========================================================================= */

export function UmrahManasikEstimatorSection() {
  const lang = useLanguage();
  const t = reactTranslations[lang];

  // Saudi Real-Time Clock
  const [currentSaudiTime, setCurrentSaudiTime] = useState<Date>(() => getSaudiNowDate());
  const currentAstHour = currentSaudiTime.getHours();
  const currentAstMinute = currentSaudiTime.getMinutes();

  // Mode Jam: Apakah menggunakan Jam Live saat ini atau memilih Jam Tertentu
  const [useLiveTime, setUseLiveTime] = useState<boolean>(true);
  const [selectedHour, setSelectedHour] = useState<number>(() => currentAstHour);
  const [customStartMinute, setCustomStartMinute] = useState<number>(() => currentAstMinute);

  // Parameter Rangkaian Manasik
  const [thawafFloor, setThawafFloor] = useState<ThawafFloor>('ground');
  const [saiMode, setSaiMode] = useState<SaiMode>('walk_normal');
  const [tahallulMode, setTahallulMode] = useState<TahallulMode>('self_marwah');
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Interval pembaruan jam AST
  useEffect(() => {
    const timer = setInterval(() => {
      const nowAst = getSaudiNowDate();
      setCurrentSaudiTime(nowAst);
      if (useLiveTime) {
        setSelectedHour(nowAst.getHours());
        setCustomStartMinute(nowAst.getMinutes());
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [useLiveTime]);

  // Jam aktif yang digunakan untuk menghitung kepadatan
  const activeHour = useLiveTime ? currentAstHour : selectedHour;
  const activeMinute = useLiveTime ? currentAstMinute : customStartMinute;

  // Data Kepadatan pada jam aktif
  const currentCrowd = useMemo(() => {
    return t.hourly_crowd.find((item) => item.hour === activeHour) || t.hourly_crowd[0];
  }, [activeHour, t.hourly_crowd]);

  const densityPercent = currentCrowd.density;

  // Selected floor & modes
  const selectedThawafFloor = useMemo(() => {
    return t.thawaf_floors.find((f) => f.id === thawafFloor) || t.thawaf_floors[0];
  }, [thawafFloor, t.thawaf_floors]);

  const selectedSaiMode = useMemo(() => {
    return t.sai_modes.find((m) => m.id === saiMode) || t.sai_modes[0];
  }, [saiMode, t.sai_modes]);

  const selectedTahallul = useMemo(() => {
    return t.tahallul_modes.find((mode) => mode.id === tahallulMode) || t.tahallul_modes[0];
  }, [tahallulMode, t.tahallul_modes]);

  // Kalkulasi Waktu Tiap Etape
  const calculation = useMemo(() => {
    // 1. Thawaf 7 Putaran
    let thawafDuration = 0;
    if (thawafFloor === 'ground') {
      thawafDuration = Math.round(28 + (densityPercent / 100) * 45);
    } else if (thawafFloor === 'mezzanine') {
      thawafDuration = Math.round(50 + (densityPercent / 100) * 32);
    } else if (thawafFloor === 'roof') {
      thawafDuration = Math.round(70 + (densityPercent / 100) * 38);
    } else {
      thawafDuration = Math.round(22 + (densityPercent / 100) * 7);
    }

    // 2. Shalat Sunnah Thawaf & Minum Air Zamzam
    const prayerAndZamzamDuration = Math.round(10 + (densityPercent / 100) * 12);

    // 3. Transisi Berjalan dari Mataf ke Bukit Shafa
    const transitionDuration = Math.round(8 + (densityPercent / 100) * 8);

    // 4. Sa'i 7 Putaran (Shafa ⇆ Marwah, 3.15 km)
    let saiDuration = 0;
    if (saiMode === 'walk_normal') {
      saiDuration = Math.round(48 + (densityPercent / 100) * 28);
    } else if (saiMode === 'walk_elderly') {
      saiDuration = Math.round(70 + (densityPercent / 100) * 30);
    } else if (saiMode === 'scooter') {
      saiDuration = Math.round(26 + (densityPercent / 100) * 8);
    } else {
      saiDuration = Math.round(40 + (densityPercent / 100) * 16);
    }

    // 5. Tahallul
    let tahallulDuration = selectedTahallul.minutes;
    if (tahallulMode === 'barber_outside' && densityPercent > 75) {
      tahallulDuration += Math.round((densityPercent / 100) * 15);
    }

    // Total Waktu Tempuh
    const totalMinutes =
      thawafDuration +
      prayerAndZamzamDuration +
      transitionDuration +
      saiDuration +
      tahallulDuration;

    // Total Jarak Tempuh
    const totalDistanceKm = Number((selectedThawafFloor.distanceKm + 3.15 + 0.3).toFixed(2));

    // Perkiraan Kalori Terbakar
    const caloriesBurned = Math.round(totalDistanceKm * 65 * 0.95);

    // Timeline Jam Tiap Etape
    const tStart = addMinutesToTime(activeHour, activeMinute, 0);
    const tAfterThawaf = addMinutesToTime(activeHour, activeMinute, thawafDuration);
    const tAfterPrayerZamzam = addMinutesToTime(activeHour, activeMinute, thawafDuration + prayerAndZamzamDuration);
    const tStartSai = addMinutesToTime(activeHour, activeMinute, thawafDuration + prayerAndZamzamDuration + transitionDuration);
    const tAfterSai = addMinutesToTime(activeHour, activeMinute, thawafDuration + prayerAndZamzamDuration + transitionDuration + saiDuration);
    const tFinish = addMinutesToTime(activeHour, activeMinute, totalMinutes);

    return {
      thawafDuration,
      prayerAndZamzamDuration,
      transitionDuration,
      saiDuration,
      tahallulDuration,
      totalMinutes,
      totalDistanceKm,
      caloriesBurned,
      times: {
        start: tStart,
        afterThawaf: tAfterThawaf,
        afterPrayerZamzam: tAfterPrayerZamzam,
        startSai: tStartSai,
        afterSai: tAfterSai,
        finish: tFinish,
      },
    };
  }, [thawafFloor, saiMode, tahallulMode, densityPercent, activeHour, activeMinute, selectedThawafFloor, selectedTahallul]);

  // Evaluasi Kelayakan & Rekomendasi Waktu
  const comfortStatus = useMemo(() => {
    if (densityPercent < 50) {
      return {
        level: t.comfort_level_1,
        color: 'text-emerald-700 dark:text-emerald-300',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        dotColor: 'bg-emerald-500',
        icon: '🌿',
        note: t.comfort_note_1,
      };
    }
    if (densityPercent < 75) {
      return {
        level: t.comfort_level_2,
        color: 'text-amber-700 dark:text-amber-300',
        bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
        dotColor: 'bg-amber-500',
        icon: '🌙',
        note: t.comfort_note_2,
      };
    }
    if (densityPercent < 88) {
      return {
        level: t.comfort_level_3,
        color: 'text-orange-700 dark:text-orange-300',
        bgColor: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
        dotColor: 'bg-orange-500',
        icon: '⚠️',
        note: t.comfort_note_3,
      };
    }
    return {
      level: t.comfort_level_4,
      color: 'text-red-700 dark:text-red-300',
      bgColor: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',
      dotColor: 'bg-red-500',
      icon: '⛔',
      note: t.comfort_note_4,
    };
  }, [densityPercent, t]);

  // Handle Copy Itinerary
  const handleCopyItinerary = () => {
    const text = `${t.copy_header}
━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ ${t.copy_total_duration} : ${formatMinutes(calculation.totalMinutes, lang)}
📍 ${t.copy_density_status} : ${densityPercent}% (${currentCrowd.status})
🕒 ${t.copy_start_time}   : ${calculation.times.start}
🏁 ${t.copy_finish_time} : ${calculation.times.finish}
🚶 ${t.copy_total_distance}  : ~${calculation.totalDistanceKm} km (${calculation.caloriesBurned} kcal)

📌 ${t.copy_breakdown_title}
1. ${t.copy_step1} (${selectedThawafFloor.name}) : ~${calculation.thawafDuration} m (${calculation.times.start} - ${calculation.times.afterThawaf})
2. ${t.copy_step2} : ~${calculation.prayerAndZamzamDuration} m (${calculation.times.afterThawaf} - ${calculation.times.afterPrayerZamzam})
3. ${t.copy_step3} : ~${calculation.transitionDuration} m (${calculation.times.afterPrayerZamzam} - ${calculation.times.startSai})
4. ${t.copy_step4} : ~${calculation.saiDuration} m (${calculation.times.startSai} - ${calculation.times.afterSai})
5. ${t.copy_step5} : ~${calculation.tahallulDuration} m (${calculation.times.afterSai} - ${calculation.times.finish})

💡 ${t.copy_note}
${t.copy_source}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    });
  };

  return (
    <div id="umrah-estimator" className="p-5 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E5DAC8] shadow-sm text-[#1C2D24] relative overflow-hidden transition-all duration-300">
      {/* Background Subtle Watermark */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-emerald-500/5 pointer-events-none blur-2xl" />

      {/* HEADER UTAMA SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6 pb-6 border-b border-[#E5DAC8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] animate-pulse" />
            <span>{t.estimator_badge}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1C2D24] tracking-tight">
            {t.estimator_title}
          </h2>
          <p className="text-xs sm:text-sm text-[#2E4338] font-medium mt-1.5 max-w-3xl leading-relaxed">
            {t.estimator_desc_intro} <strong className="text-[#244C3B]">{t.estimator_desc_thawaf}</strong>,{' '}
            <strong className="text-[#244C3B]">{t.estimator_desc_prayer}</strong>,{' '}
            <strong className="text-[#244C3B]">{t.estimator_desc_sai}</strong>, {lang === 'en' ? 'and ' : 'hingga '}
            <strong className="text-[#244C3B]">{t.estimator_desc_tahallul}</strong> {t.estimator_desc_sync}
          </p>
        </div>

        {/* Live Status Badge & Sync Control */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-bold text-[#2E4338]">
              {t.saudi_time_label} <strong className="text-[#1C2D24] font-mono">{String(currentAstHour).padStart(2, '0')}:{String(currentAstMinute).padStart(2, '0')} AST</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setUseLiveTime(true)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                useLiveTime
                  ? 'bg-[#244C3B] text-white shadow-xs'
                  : 'bg-[#FAF6F0] text-[#2E4338] hover:text-[#1C2D24] border border-[#E5DAC8]'
              }`}
            >
              {t.btn_live_realtime}
            </button>
            <button
              onClick={() => setUseLiveTime(false)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                !useLiveTime
                  ? 'bg-[#244C3B] text-white shadow-xs'
                  : 'bg-[#FAF6F0] text-[#2E4338] hover:text-[#1C2D24] border border-[#E5DAC8]'
              }`}
            >
              {t.btn_pick_hour}
            </button>
          </div>
        </div>
      </div>

      {/* CONTROLS BAR: PILIHAN JAM & SIMULASI KEPADATAN */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#244C3B] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              {currentCrowd.density}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1C2D24]">
                  {t.density_at_label} {String(activeHour).padStart(2, '0')}:00 AST:
                </span>
                <span className="text-xs font-extrabold text-[#244C3B] px-2 py-0.5 rounded-lg bg-[#E4F4EC] border border-[#244C3B]/20">
                  {currentCrowd.status}
                </span>
                {currentCrowd.isPrayerTime && (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                    {currentCrowd.isPrayerTime}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#2E4338] mt-0.5 font-medium leading-tight">
                💡 {currentCrowd.advice}
              </p>
            </div>
          </div>

          {/* Quick Preset Hours */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-[#2E4338] font-bold mr-1">{t.preset_hour_label}</span>
            {t.preset_hours.map((p) => (
              <button
                key={p.h}
                onClick={() => {
                  setUseLiveTime(false);
                  setSelectedHour(p.h);
                  setCustomStartMinute(0);
                }}
                className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  !useLiveTime && selectedHour === p.h
                    ? 'bg-[#244C3B] text-white border-[#244C3B] font-bold'
                    : 'bg-white text-[#2E4338] border-[#E5DAC8] hover:border-[#C5A059]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hour Slider if manual mode */}
        {!useLiveTime && (
          <div className="mt-4 pt-3 border-t border-[#E5DAC8] flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-bold text-[#1C2D24] whitespace-nowrap">
              {t.slide_hour_label}
            </span>
            <input
              type="range"
              min="0"
              max="23"
              value={selectedHour}
              onChange={(e) => setSelectedHour(Number(e.target.value))}
              className="w-full accent-[#244C3B] cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-[#244C3B] bg-white px-2.5 py-1 rounded-lg border border-[#E5DAC8] shrink-0">
              {String(selectedHour).padStart(2, '0')}:00 AST
            </span>
          </div>
        )}
      </div>

      {/* PARAMETER SELEKSI (LANTAI THAWAF, MODA SA'I, TAHALLUL) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* 1. Pemilihan Jalur / Lantai Thawaf */}
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5DAC8] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#244C3B]">
                <Footprints className="w-4 h-4 text-[#C5A059]" />
                <span>{t.step1_heading}</span>
              </div>
              <span className="text-[10px] text-[#2E4338] font-mono">{t.step1_sub}</span>
            </div>
            <div className="space-y-2 mt-3">
              {t.thawaf_floors.map((f) => {
                const isSelected = thawafFloor === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setThawafFloor(f.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                      isSelected
                        ? 'bg-[#E4F4EC] border-[#244C3B] shadow-xs'
                        : 'bg-[#FAF6F0] border-[#E5DAC8] hover:border-[#C5A059]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#244C3B]' : 'text-[#1C2D24]'}`}>
                        {f.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#C5A059]">
                        ~{f.distanceKm} km
                      </span>
                    </div>
                    <span className="text-[10px] text-[#2E4338] line-clamp-1">{f.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Pemilihan Moda Sa'i */}
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5DAC8] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#244C3B]">
                <Compass className="w-4 h-4 text-[#C5A059]" />
                <span>{t.step2_heading}</span>
              </div>
              <span className="text-[10px] text-[#2E4338] font-mono">{t.step2_sub}</span>
            </div>
            <div className="space-y-2 mt-3">
              {t.sai_modes.map((m) => {
                const isSelected = saiMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSaiMode(m.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                      isSelected
                        ? 'bg-[#E4F4EC] border-[#244C3B] shadow-xs'
                        : 'bg-[#FAF6F0] border-[#E5DAC8] hover:border-[#C5A059]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#244C3B]' : 'text-[#1C2D24]'}`}>
                        {m.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#C5A059]">3.15 km</span>
                    </div>
                    <span className="text-[10px] text-[#2E4338] line-clamp-1">{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Pemilihan Cara Tahallul */}
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5DAC8] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#244C3B]">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <span>{t.step3_heading}</span>
              </div>
              <span className="text-[10px] text-[#2E4338] font-mono">{t.step3_sub}</span>
            </div>
            <div className="space-y-2 mt-3">
              {t.tahallul_modes.map((mode) => {
                const isSelected = tahallulMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setTahallulMode(mode.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                      isSelected
                        ? 'bg-[#E4F4EC] border-[#244C3B] shadow-xs'
                        : 'bg-[#FAF6F0] border-[#E5DAC8] hover:border-[#C5A059]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#244C3B]' : 'text-[#1C2D24]'}`}>
                        {mode.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#C5A059]">
                        ~{mode.minutes} m
                      </span>
                    </div>
                    <span className="text-[10px] text-[#2E4338] line-clamp-2">{mode.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-[#78350F] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <span>{t.tahallul_info_note}</span>
          </div>
        </div>

      </div>

      {/* HASIL UTAMA: STATISTIK TOTAL & WAKTU FINISH */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1E5E3D] via-[#17432F] to-[#0E3521] text-white shadow-lg mb-6 relative overflow-hidden">
        {/* Subtle gold decoration ring */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-44 h-44 rounded-full border-8 border-white/5 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#E4CB96] font-bold uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>{t.summary_total_badge}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans">
                {formatMinutes(calculation.totalMinutes, lang)}
              </span>
              <span className="text-xs sm:text-sm text-[#F5DF95] font-semibold">
                {t.summary_density_dependency}
              </span>
            </div>

            {/* Start -> Finish Timeline Tag */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs font-mono font-bold text-white">
                {t.summary_start}: {calculation.times.start}
              </span>
              <ChevronRight className="w-4 h-4 text-[#C5A059]" />
              <span className="px-3 py-1 rounded-xl bg-[#C5A059] font-mono font-black text-[#0E3521] shadow-xs">
                {t.summary_finish}: ~{calculation.times.finish}
              </span>
            </div>
          </div>

          {/* Quick Metrics (Jarak, Kalori, Rekomendasi) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs shrink-0">
            <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
              <div className="flex items-center gap-1 text-[11px] text-[#E4CB96] font-medium">
                <Navigation className="w-3.5 h-3.5" />
                <span>{t.metric_total_dist}</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                ~{calculation.totalDistanceKm} <span className="text-xs font-normal">km</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
              <div className="flex items-center gap-1 text-[11px] text-[#E4CB96] font-medium">
                <Flame className="w-3.5 h-3.5" />
                <span>{t.metric_calories}</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                ~{calculation.caloriesBurned} <span className="text-xs font-normal">kcal</span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs flex flex-col justify-center">
              <div className="text-[11px] text-[#E4CB96] font-medium">{t.summary_smoothness}</div>
              <div className="text-sm font-bold text-[#F5DF95] mt-0.5 truncate">
                {currentCrowd.status} ({densityPercent}%)
              </div>
            </div>
          </div>
        </div>

        {/* Status Evaluasi Kenyamanan Bar */}
        <div className="mt-4 pt-3 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">{comfortStatus.icon}</span>
            <span className="font-extrabold text-[#E4CB96]">{comfortStatus.level}:</span>
            <span className="text-white/90 text-[11px] font-medium leading-tight">{comfortStatus.note}</span>
          </div>

          <button
            onClick={handleCopyItinerary}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C5A059] hover:bg-[#F5DF95] text-[#0E3521] font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
          >
            {copiedToast ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                <span>{t.copy_btn_copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copy_btn_text}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* STEP-BY-STEP PROGRESS TIMELINE */}
      <div className="mb-6">
        <h4 className="text-xs font-extrabold text-[#244C3B] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#C5A059]" />
          <span>{t.timeline_heading}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {/* Etape 1 */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex flex-col justify-between relative group hover:border-[#244C3B] transition-all">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-6 h-6 rounded-full bg-[#244C3B] text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <span className="text-[11px] font-mono font-bold text-[#244C3B]">
                  ~{calculation.thawafDuration} {t.time_min_unit}
                </span>
              </div>
              <h5 className="font-extrabold text-[#1C2D24] text-xs">{t.timeline_steps[0]?.title}</h5>
              <p className="text-[10px] text-[#2E4338] mt-1 leading-relaxed">
                {t.timeline_steps[0]?.desc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5DAC8] text-[10px] font-mono text-[#C5A059] font-bold">
              {calculation.times.start} - {calculation.times.afterThawaf}
            </div>
          </div>

          {/* Etape 2 */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex flex-col justify-between relative group hover:border-[#244C3B] transition-all">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-6 h-6 rounded-full bg-[#244C3B] text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <span className="text-[11px] font-mono font-bold text-[#244C3B]">
                  ~{calculation.prayerAndZamzamDuration} {t.time_min_unit}
                </span>
              </div>
              <h5 className="font-extrabold text-[#1C2D24] text-xs">{t.timeline_steps[1]?.title}</h5>
              <p className="text-[10px] text-[#2E4338] mt-1 leading-relaxed">
                {t.timeline_steps[1]?.desc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5DAC8] text-[10px] font-mono text-[#C5A059] font-bold">
              {calculation.times.afterThawaf} - {calculation.times.afterPrayerZamzam}
            </div>
          </div>

          {/* Etape 3 */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex flex-col justify-between relative group hover:border-[#244C3B] transition-all">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-6 h-6 rounded-full bg-[#244C3B] text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <span className="text-[11px] font-mono font-bold text-[#244C3B]">
                  ~{calculation.transitionDuration} {t.time_min_unit}
                </span>
              </div>
              <h5 className="font-extrabold text-[#1C2D24] text-xs">{t.timeline_steps[2]?.title}</h5>
              <p className="text-[10px] text-[#2E4338] mt-1 leading-relaxed">
                {t.timeline_steps[2]?.desc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5DAC8] text-[10px] font-mono text-[#C5A059] font-bold">
              {calculation.times.afterPrayerZamzam} - {calculation.times.startSai}
            </div>
          </div>

          {/* Etape 4 */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex flex-col justify-between relative group hover:border-[#244C3B] transition-all">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-6 h-6 rounded-full bg-[#244C3B] text-white flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <span className="text-[11px] font-mono font-bold text-[#244C3B]">
                  ~{calculation.saiDuration} {t.time_min_unit}
                </span>
              </div>
              <h5 className="font-extrabold text-[#1C2D24] text-xs">{t.timeline_steps[3]?.title}</h5>
              <p className="text-[10px] text-[#2E4338] mt-1 leading-relaxed">
                {t.timeline_steps[3]?.desc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5DAC8] text-[10px] font-mono text-[#C5A059] font-bold">
              {calculation.times.startSai} - {calculation.times.afterSai}
            </div>
          </div>

          {/* Etape 5 */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex flex-col justify-between relative group hover:border-[#244C3B] transition-all">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-6 h-6 rounded-full bg-[#244C3B] text-white flex items-center justify-center font-bold text-xs">
                  5
                </span>
                <span className="text-[11px] font-mono font-bold text-[#244C3B]">
                  ~{calculation.tahallulDuration} {t.time_min_unit}
                </span>
              </div>
              <h5 className="font-extrabold text-[#1C2D24] text-xs">{t.timeline_steps[4]?.title}</h5>
              <p className="text-[10px] text-[#2E4338] mt-1 leading-relaxed">
                {t.timeline_steps[4]?.desc}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5DAC8] text-[10px] font-mono text-[#C5A059] font-bold">
              {calculation.times.afterSai} - {calculation.times.finish}
            </div>
          </div>
        </div>
      </div>

      {/* 3 TIPS PRAKTIS & WAKTU EMAS (GOLDEN HOURS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-[#E5DAC8] text-xs">
        {t.golden_tips.map((tip, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0 font-bold">
              {tip.icon}
            </div>
            <div>
              <h4 className="font-extrabold text-[#1C2D24] text-xs">{tip.title}</h4>
              <p className="text-[11px] text-[#2E4338] font-medium mt-0.5 leading-relaxed">
                {tip.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   5. SECTION 2: POLA HISTORIS KERAMAIAN MINGGUAN (RECHARTS)
   ========================================================================= */

type CityFilter = 'both' | 'makkah' | 'madinah';
type PrayerFilter = 'avg' | 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
type ViewMode = 'trend' | 'prayers';

export function WeeklyCrowdTrendSection() {
  const lang = useLanguage();
  const t = reactTranslations[lang];

  const [cityFilter, setCityFilter] = useState<CityFilter>('both');
  const [prayerFilter, setPrayerFilter] = useState<PrayerFilter>('avg');
  const [viewMode, setViewMode] = useState<ViewMode>('trend');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(5);

  const chartData = useMemo(() => {
    return WEEKLY_TREND_DATA.map((d) => {
      let makkahVal = d.makkahAvg;
      let madinahVal = d.madinahAvg;

      if (prayerFilter !== 'avg') {
        makkahVal = d.makkahPrayers[prayerFilter];
        madinahVal = d.madinahPrayers[prayerFilter];
      }

      return {
        name: d.dayShort[lang] || d.dayShort.id,
        dayFull: d.dayFull[lang] || d.dayFull.id,
        makkah: makkahVal,
        madinah: madinahVal,
        note: d.note[lang] || d.note.id,
      };
    });
  }, [prayerFilter, lang]);

  const selectedDay = WEEKLY_TREND_DATA[selectedDayIndex];
  const prayerBreakdownData = useMemo(() => {
    const isFri = selectedDay.dayKey === 'fri';
    return [
      {
        prayer: t.prayer_fajr,
        makkah: selectedDay.makkahPrayers.fajr,
        madinah: selectedDay.madinahPrayers.fajr,
      },
      {
        prayer: isFri ? (lang === 'en' ? 'Jumu\'ah' : 'Jumat') : t.prayer_dhuhr,
        makkah: selectedDay.makkahPrayers.dhuhr,
        madinah: selectedDay.madinahPrayers.dhuhr,
      },
      {
        prayer: t.prayer_asr,
        makkah: selectedDay.makkahPrayers.asr,
        madinah: selectedDay.madinahPrayers.asr,
      },
      {
        prayer: t.prayer_maghrib,
        makkah: selectedDay.makkahPrayers.maghrib,
        madinah: selectedDay.madinahPrayers.maghrib,
      },
      {
        prayer: t.prayer_isha,
        makkah: selectedDay.makkahPrayers.isha,
        madinah: selectedDay.madinahPrayers.isha,
      },
    ];
  }, [selectedDay, t, lang]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; color: string; value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      const dayData = WEEKLY_TREND_DATA.find((d) => (d.dayShort[lang] || d.dayShort.id) === label);
      return (
        <div className="p-3.5 bg-white border border-[#E5DAC8] rounded-2xl shadow-xl text-xs max-w-xs text-[#1C2D24]">
          <div className="font-extrabold text-sm border-b border-[#E5DAC8] pb-1.5 mb-2 text-[#244C3B]">
            {dayData ? (dayData.dayFull[lang] || dayData.dayFull.id) : label}
          </div>
          <div className="space-y-1.5">
            {payload.map((entry, index: number) => {
              const isMakkah = entry.dataKey === 'makkah';
              const name = isMakkah ? t.tooltip_makkah : t.tooltip_madinah;
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
              💡 {dayData.note[lang] || dayData.note.id}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="weekly-trend-chart" className="p-3.5 sm:p-6 lg:p-7 rounded-3xl bg-[#FFFFFF] border border-[#E5DAC8] shadow-sm text-[#1C2D24] relative overflow-x-hidden">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#E5DAC8] text-[#244C3B] text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase mb-2">
            <Activity className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.trend_badge}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#1C2D24]">
            {t.trend_heading}
          </h3>
          <p className="text-xs sm:text-sm text-[#2E4338] font-medium mt-0.5">
            {t.trend_subheading}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center p-1 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] shadow-2xs shrink-0 text-xs font-bold">
          <button
            onClick={() => setViewMode('trend')}
            className={`w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl transition-all duration-200 cursor-pointer text-center ${
              viewMode === 'trend'
                ? 'bg-gradient-to-r from-[#244C3B] to-[#1E4333] text-white shadow-xs font-extrabold'
                : 'text-[#2E4338] hover:text-[#1C2D24] hover:bg-white/50'
            }`}
          >
            {t.trend_view_area}
          </button>
          <button
            onClick={() => setViewMode('prayers')}
            className={`w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl transition-all duration-200 cursor-pointer text-center ${
              viewMode === 'prayers'
                ? 'bg-gradient-to-r from-[#244C3B] to-[#1E4333] text-white shadow-xs font-extrabold'
                : 'text-[#2E4338] hover:text-[#1C2D24] hover:bg-white/50'
            }`}
          >
            {t.trend_view_bar}
          </button>
        </div>
      </div>

      {/* Secondary Filter Row */}
      <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] shadow-2xs space-y-3.5">
        {/* Row 1: Pilihan Masjid */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <span className="flex items-center gap-1.5 font-extrabold text-[#2E4338] text-xs uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{t.filter_mosque_label}</span>
            </span>
            <span className="text-[10px] text-[#694F12] font-bold sm:hidden">
              {cityFilter === 'both' ? t.mosque_status_both : cityFilter === 'makkah' ? t.mosque_status_makkah : t.mosque_status_madinah}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white border border-[#E5DAC8] shadow-2xs w-full sm:w-auto sm:min-w-[320px]">
            <button
              type="button"
              onClick={() => setCityFilter('both')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                cityFilter === 'both'
                  ? 'bg-gradient-to-r from-[#244C3B] to-[#1E4333] text-white shadow-xs font-extrabold ring-1 ring-[#244C3B]'
                  : 'text-[#2E4338] hover:text-[#1C2D24] hover:bg-[#FAF6F0]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span>{t.filter_both}</span>
            </button>
            <button
              type="button"
              onClick={() => setCityFilter('makkah')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                cityFilter === 'makkah'
                  ? 'bg-gradient-to-r from-[#244C3B] to-[#1E4333] text-white shadow-xs font-extrabold ring-1 ring-[#244C3B]'
                  : 'text-[#2E4338] hover:text-[#1C2D24] hover:bg-[#FAF6F0]'
              }`}
            >
              <span className="text-xs shrink-0">🕋</span>
              <span>{t.filter_makkah}</span>
            </button>
            <button
              type="button"
              onClick={() => setCityFilter('madinah')}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-center ${
                cityFilter === 'madinah'
                  ? 'bg-gradient-to-r from-[#244C3B] to-[#1E4333] text-white shadow-xs font-extrabold ring-1 ring-[#244C3B]'
                  : 'text-[#2E4338] hover:text-[#1C2D24] hover:bg-[#FAF6F0]'
              }`}
            >
              <span className="text-xs shrink-0">🕌</span>
              <span>{t.filter_madinah}</span>
            </button>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-[#E5DAC8]/70" />

        {/* Row 2: Filter Waktu Shalat / Hari Observasi */}
        {viewMode === 'trend' ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="flex items-center gap-1.5 font-extrabold text-[#2E4338] text-xs uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{t.filter_time_label}</span>
              </span>
              <span className="text-[10px] text-[#694F12] font-bold sm:hidden">
                {prayerFilter === 'avg' ? t.prayer_daily_avg_label : `${t.prayer_specific_label} ${prayerFilter.toUpperCase()}`}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 w-full sm:w-auto">
              {(['avg', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as PrayerFilter[]).map((pf) => {
                const labelMap: Record<PrayerFilter, { name: string; icon: string }> = {
                  avg: { name: t.prayer_avg, icon: '📊' },
                  fajr: { name: t.prayer_fajr, icon: '🌙' },
                  dhuhr: { name: t.prayer_dhuhr, icon: '☀️' },
                  asr: { name: t.prayer_asr, icon: '🌤️' },
                  maghrib: { name: t.prayer_maghrib, icon: '🌅' },
                  isha: { name: t.prayer_isha, icon: '🌌' },
                };
                const isSelected = prayerFilter === pf;
                return (
                  <button
                    key={pf}
                    type="button"
                    onClick={() => setPrayerFilter(pf)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 shadow-2xs text-center ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#C5A059] to-[#B08A45] text-[#1C2D24] shadow-xs font-black ring-1 ring-[#C5A059]/60 scale-[1.02]'
                        : 'bg-white text-[#2E4338] border border-[#E5DAC8] hover:border-[#C5A059] hover:bg-white/90'
                    }`}
                  >
                    <span className="text-[11px] shrink-0">{labelMap[pf].icon}</span>
                    <span className="truncate">{labelMap[pf].name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="flex items-center gap-1.5 font-extrabold text-[#2E4338] text-xs uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{t.filter_day_label}</span>
              </span>
              <span className="text-[10px] text-[#694F12] font-bold">
                {WEEKLY_TREND_DATA[selectedDayIndex]?.dayFull[lang] || WEEKLY_TREND_DATA[selectedDayIndex]?.dayFull.id}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 w-full sm:w-auto">
              {WEEKLY_TREND_DATA.map((d, idx) => {
                const isSelected = selectedDayIndex === idx;
                const isJumat = d.dayKey === 'fri';
                const dayLabel = d.dayShort[lang] || d.dayShort.id;
                const dayTitle = d.dayFull[lang] || d.dayFull.id;
                return (
                  <button
                    key={d.dayKey}
                    type="button"
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`py-2 px-1 sm:px-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center shadow-2xs text-center ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#C5A059] to-[#B08A45] text-[#1C2D24] shadow-xs font-black ring-1 ring-[#C5A059]/60 scale-[1.02]'
                        : 'bg-white text-[#2E4338] border border-[#E5DAC8] hover:border-[#C5A059] hover:bg-white/90'
                    }`}
                    title={dayTitle}
                  >
                    <span className="text-[11px] sm:text-xs font-extrabold truncate">{dayLabel}</span>
                    {isJumat ? (
                      <span className="text-[9px] text-[#244C3B] font-black leading-none mt-0.5">
                        ⭐
                      </span>
                    ) : (
                      <span className="text-[8px] opacity-0 leading-none mt-0.5">•</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Chart Visualizer */}
      <div className="w-full h-80 pt-2 pb-4">
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
                  name={t.legend_makkah}
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
                  name={t.legend_madinah}
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
                <Bar dataKey="makkah" name={t.legend_makkah} fill="#244C3B" radius={[8, 8, 0, 0]} />
              )}
              {(cityFilter === 'both' || cityFilter === 'madinah') && (
                <Bar dataKey="madinah" name={t.legend_madinah} fill="#C5A059" radius={[8, 8, 0, 0]} />
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
            <h4 className="font-extrabold text-[#1C2D24] text-xs">{t.insight1_title}</h4>
            <p className="text-[11px] text-[#2E4338] font-medium mt-0.5 leading-relaxed">
              {t.insight1_desc}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0 font-bold">
            🌿
          </div>
          <div>
            <h4 className="font-extrabold text-[#1C2D24] text-xs">{t.insight2_title}</h4>
            <p className="text-[11px] text-[#2E4338] font-medium mt-0.5 leading-relaxed">
              {t.insight2_desc}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0 font-bold">
            🌙
          </div>
          <div>
            <h4 className="font-extrabold text-[#1C2D24] text-xs">{t.insight3_title}</h4>
            <p className="text-[11px] text-[#2E4338] font-medium mt-0.5 leading-relaxed">
              {t.insight3_desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. MAIN APP COMPONENT (UNIFIED CONTAINER)
   ========================================================================= */

type AppViewTab = 'all' | 'estimator' | 'weekly_trend';

export default function App() {
  const lang = useLanguage();
  const t = reactTranslations[lang];
  const [activeTab, setActiveTab] = useState<AppViewTab>('all');

  return (
    <div className="space-y-6">
      {/* Top Section View Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 sm:p-2 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] shadow-2xs">
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-1.5 text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl transition-all duration-200 cursor-pointer text-center ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-[#244C3B] to-[#1E4333] text-white shadow-xs font-extrabold'
                : 'text-[#2E4338] hover:text-[#1C2D24] hover:bg-white/60'
            }`}
          >
            {t.app_tab_both}
          </button>
          <button
            onClick={() => setActiveTab('estimator')}
            className={`w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-center ${
              activeTab === 'estimator'
                ? 'bg-gradient-to-r from-[#244C3B] to-[#1E4333] text-white shadow-xs font-extrabold'
                : 'text-[#2E4338] hover:text-[#1C2D24] hover:bg-white/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.app_tab_estimator}</span>
          </button>
          <button
            onClick={() => setActiveTab('weekly_trend')}
            className={`w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 text-center ${
              activeTab === 'weekly_trend'
                ? 'bg-gradient-to-r from-[#244C3B] to-[#1E4333] text-white shadow-xs font-extrabold'
                : 'text-[#2E4338] hover:text-[#1C2D24] hover:bg-white/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{t.app_tab_weekly}</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#2E4338] font-medium pr-2 shrink-0">
          <span>{t.app_sync_portal}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Render Component According to Tab */}
      {(activeTab === 'all' || activeTab === 'estimator') && (
        <UmrahManasikEstimatorSection />
      )}

      {(activeTab === 'all' || activeTab === 'weekly_trend') && (
        <WeeklyCrowdTrendSection />
      )}
    </div>
  );
}
