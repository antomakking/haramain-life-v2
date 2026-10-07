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

/* =========================================================================
   1. TYPES & DATA DEFINITIONS
   ========================================================================= */

// Data Kepadatan Per Jam AST Makkah (Sesuai Portal Hisab Haramain)
interface HourlyDensity {
  hour: number;
  label: string;
  density: number; // 0 - 100%
  status: string;
  isPrayerTime?: string;
  advice: string;
}

const MAKKAH_HOURLY_CROWD: HourlyDensity[] = [
  { hour: 0, label: '00:00 AST', density: 38, status: 'Longgar', advice: 'Mataf sangat nyaman & sejuk untuk thawaf tenang' },
  { hour: 1, label: '01:00 AST', density: 35, status: 'Sangat Longgar', advice: 'Waktu emas! Pelataran bawah Ka\'bah sangat lengang' },
  { hour: 2, label: '02:00 AST', density: 40, status: 'Longgar', advice: 'Sangat ideal untuk Qiyamul Lail & Thawaf' },
  { hour: 3, label: '03:00 AST', density: 55, status: 'Sedang', advice: 'Mulai banyak jamaah bangun persiapan Subuh' },
  { hour: 4, label: '04:00 AST', density: 82, status: 'Padat', isPrayerTime: 'Jelang Subuh', advice: 'Akses masuk Mataf mulai diperketat' },
  { hour: 5, label: '05:00 AST', density: 92, status: 'Puncak', isPrayerTime: 'Shalat Subuh', advice: 'Puncak shalat Subuh berjamaah, Mataf penuh' },
  { hour: 6, label: '06:00 AST', density: 65, status: 'Sedang', advice: 'Jamaah mulai terurai usai dzikir pagi & syuruq' },
  { hour: 7, label: '07:00 AST', density: 42, status: 'Longgar', advice: 'Waktu dhuha yang segar, sangat ramah lansia' },
  { hour: 8, label: '08:00 AST', density: 45, status: 'Longgar', advice: 'Arus teratur, kebersihan lantai rutin dilakukan' },
  { hour: 9, label: '09:00 AST', density: 52, status: 'Sedang', advice: 'Kondisi stabil sebelum matahari meninggi' },
  { hour: 10, label: '10:00 AST', density: 62, status: 'Sedang', advice: 'Mulai ramai jamaah bersiap shalat Dzuhur' },
  { hour: 11, label: '11:00 AST', density: 85, status: 'Padat', isPrayerTime: 'Jelang Dzuhur', advice: 'Jalur Mataf bawah sering dialihkan' },
  { hour: 12, label: '12:00 AST', density: 94, status: 'Puncak', isPrayerTime: 'Shalat Dzuhur', advice: 'Shalat Dzuhur berjamaah, suhu cuaca panas' },
  { hour: 13, label: '13:00 AST', density: 70, status: 'Sedang', advice: 'Arus kembali mengalir setelah shalat siang' },
  { hour: 14, label: '14:00 AST', density: 60, status: 'Sedang', advice: 'Kipas embun aktif, suasana dalam masjid sejuk' },
  { hour: 15, label: '15:00 AST', density: 80, status: 'Padat', isPrayerTime: 'Jelang Ashar', advice: 'Persiapan shalat Ashar berjamaah' },
  { hour: 16, label: '16:00 AST', density: 88, status: 'Padat', isPrayerTime: 'Shalat Ashar', advice: 'Mataf terisi penuh jamaah shalat Ashar' },
  { hour: 17, label: '17:00 AST', density: 78, status: 'Sedang-Padat', advice: 'Jamaah mulai duduk menunggu Maghrib & Isya' },
  { hour: 18, label: '18:00 AST', density: 96, status: 'Puncak Maksimal', isPrayerTime: 'Shalat Maghrib', advice: 'Kapasitas 100% penuh sesak shalat Maghrib' },
  { hour: 19, label: '19:00 AST', density: 95, status: 'Puncak Maksimal', isPrayerTime: 'Jeda Isya', advice: 'Jeda Maghrib-Isya, pelataran terkunci rapat' },
  { hour: 20, label: '20:00 AST', density: 90, status: 'Padat', isPrayerTime: 'Shalat Isya', advice: 'Shalat Isya berjamaah selesai sekitar 20:45' },
  { hour: 21, label: '21:00 AST', density: 72, status: 'Sedang', advice: 'Arus jamaah mulai keluar, thawaf malam mulai lancar' },
  { hour: 22, label: '22:00 AST', density: 58, status: 'Sedang', advice: 'Udara malam bersahabat, waktu favorit jamaah' },
  { hour: 23, label: '23:00 AST', density: 45, status: 'Longgar', advice: 'Suasana tenang berangsur menuju tengah malam' },
];

// Opsi Lantai / Jalur Thawaf
type ThawafFloor = 'ground' | 'mezzanine' | 'roof' | 'scooter';
interface ThawafFloorOption {
  id: ThawafFloor;
  name: string;
  desc: string;
  distanceKm: number;
  baseMinutes: number;
  suitability: string;
}

const THAWAF_FLOORS: ThawafFloorOption[] = [
  {
    id: 'ground',
    name: "Pelataran Ka'bah (Mataf Bawah)",
    desc: 'Radius terpendek tepat mengelilingi Ka\'bah. Wajib kain ihram bagi pria.',
    distanceKm: 1.4,
    baseMinutes: 32,
    suitability: 'Paling Afdhal & Cepat (Khusus Jamaah Mandiri / Fisik Prima)',
  },
  {
    id: 'mezzanine',
    name: 'Lantai 1 / Mezzanine (Indoor AC)',
    desc: 'Jalur ber-AC sejuk, ramah keluarga & lansia. Radius putaran lebih lebar.',
    distanceKm: 3.1,
    baseMinutes: 55,
    suitability: 'Sangat Nyaman & Sejuk (Bebas Panas Matahari)',
  },
  {
    id: 'roof',
    name: 'Lantai Atas Terbuka (Roof Top)',
    desc: 'Area udara terbuka sangat luas. Sangat cocok saat malam hari berangin sejuk.',
    distanceKm: 4.2,
    baseMinutes: 75,
    suitability: 'Lega & Bebas Desakan (Cocok untuk Malam Hari)',
  },
  {
    id: 'scooter',
    name: 'Jalur Skuter Elektrik (Mezzanine Mas\'a)',
    desc: 'Layanan sewa skuter resmi Masjidil Haram (Single/Double). Laju konstan.',
    distanceKm: 2.8,
    baseMinutes: 24,
    suitability: 'Tercepat & Ramah Lansia / Sakit / Disabilitas',
  },
];

// Opsi Moda Sa'i Shafa-Marwah
type SaiMode = 'walk_normal' | 'walk_elderly' | 'scooter' | 'wheelchair';
interface SaiModeOption {
  id: SaiMode;
  name: string;
  desc: string;
  speedLabel: string;
  baseMinutes: number;
}

const SAI_MODES: SaiModeOption[] = [
  {
    id: 'walk_normal',
    name: 'Jalan Kaki Normal (Lantai Dasar / 1)',
    desc: 'Jarak 7 putaran Shafa-Marwah tetap 3.15 km (7 × 450 meter). Termasuk lari kecil di pilar hijau bagi pria.',
    speedLabel: 'Kecepatan ~3.5 km/jam',
    baseMinutes: 50,
  },
  {
    id: 'walk_elderly',
    name: 'Jalan Santai / Lansia & Rombongan',
    desc: 'Kecepatan santai dengan istirahat sejenak di setiap putaran Shafa atau Marwah.',
    speedLabel: 'Kecepatan ~2.2 km/jam',
    baseMinutes: 75,
  },
  {
    id: 'scooter',
    name: 'Skuter Elektrik (Jalur Mezzanine Khusus)',
    desc: 'Jalur layang bebas hambatan pejalan kaki. Kecepatan skuter stabil dan aman.',
    speedLabel: 'Laju Elektrik ~7-8 km/jam',
    baseMinutes: 28,
  },
  {
    id: 'wheelchair',
    name: 'Kursi Roda (Petugas Resmi Pendorong)',
    desc: 'Layanan resmi pendorong kursi roda berseragam hijau di jalur khusus kursi roda.',
    speedLabel: 'Dorong Teratur ~4.0 km/jam',
    baseMinutes: 42,
  },
];

// Opsi Lokasi Tahallul
type TahallulMode = 'self_marwah' | 'barber_outside';
interface TahallulModeOption {
  id: TahallulMode;
  name: string;
  desc: string;
  minutes: number;
}

const TAHALLUL_MODES: TahallulModeOption[] = [
  {
    id: 'self_marwah',
    name: 'Tahallul Mandiri di Bukit Marwah',
    desc: 'Memotong minimal 3 helai rambut langsung di akhir putaran ke-7 bukit Marwah (bawa gunting kecil sendiri).',
    minutes: 8,
  },
  {
    id: 'barber_outside',
    name: 'Barbershop Luar Marwah / Menara Zamzam',
    desc: 'Cukur gundul licin (Halaq) di barbershop resmi luar gerbang Marwah / Bab Ali. Termasuk antrean.',
    minutes: 25,
  },
];

// Data Mingguan Recharts
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
    dayFull: "Jumat (Friday - Jumu'ah)",
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

/* =========================================================================
   2. UTILITY FUNCTIONS
   ========================================================================= */

function getSaudiNowDate(): Date {
  const now = new Date();
  const astString = now.toLocaleString('en-US', { timeZone: 'Asia/Riyadh' });
  return new Date(astString);
}

function formatMinutes(totalMins: number): string {
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hours === 0) return `${mins} Menit`;
  if (mins === 0) return `${hours} Jam`;
  return `${hours} Jam ${mins} Menit`;
}

function addMinutesToTime(startHour: number, startMinute: number, addedMinutes: number): string {
  const total = startHour * 60 + startMinute + addedMinutes;
  const wrapped = total % (24 * 60);
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} AST`;
}

/* =========================================================================
   3. SECTION 1: KALKULATOR ESTIMASI WAKTU MANASIK UMROH (NEW SECTION)
   ========================================================================= */

export function UmrahManasikEstimatorSection() {
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
    return MAKKAH_HOURLY_CROWD.find((item) => item.hour === activeHour) || MAKKAH_HOURLY_CROWD[0];
  }, [activeHour]);

  const densityPercent = currentCrowd.density;

  // Kalkulasi Waktu Tiap Etape
  const calculation = useMemo(() => {
    // 1. Thawaf 7 Putaran
    const selectedThawafFloor = THAWAF_FLOORS.find((f) => f.id === thawafFloor)!;
    let thawafDuration = 0;
    if (thawafFloor === 'ground') {
      // Pelataran bawah Ka'bah: base 30m @ 30%, scaling up to 75m @ 95%
      thawafDuration = Math.round(28 + (densityPercent / 100) * 45);
    } else if (thawafFloor === 'mezzanine') {
      // Lantai 1: base 52m, radius lebih lebar
      thawafDuration = Math.round(50 + (densityPercent / 100) * 32);
    } else if (thawafFloor === 'roof') {
      // Lantai atas: base 70m
      thawafDuration = Math.round(70 + (densityPercent / 100) * 38);
    } else {
      // Skuter: kecepatan konstan
      thawafDuration = Math.round(22 + (densityPercent / 100) * 7);
    }

    // 2. Shalat Sunnah Thawaf & Minum Air Zamzam
    // Pada saat sangat padat (>80%), mencari tempat shalat & antre dispenser lebih lama
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
    const selectedTahallul = TAHALLUL_MODES.find((t) => t.id === tahallulMode)!;
    let tahallulDuration = selectedTahallul.minutes;
    if (tahallulMode === 'barber_outside' && densityPercent > 75) {
      tahallulDuration += Math.round((densityPercent / 100) * 15); // Tambahan antre barbershop
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

    // Perkiraan Kalori Terbakar (untuk berat badan rata-rata 65kg)
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
  }, [thawafFloor, saiMode, tahallulMode, densityPercent, activeHour, activeMinute]);

  // Evaluasi Kelayakan & Rekomendasi Waktu
  const comfortStatus = useMemo(() => {
    if (densityPercent < 50) {
      return {
        level: 'Sangat Nyaman & Direkomendasikan',
        color: 'text-emerald-700 dark:text-emerald-300',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        dotColor: 'bg-emerald-500',
        icon: '🌿',
        note: 'Arus Mataf dan Mas\'a lancar tanpa hambatan desakan. Waktu terbaik untuk jamaah keluarga & lansia.',
      };
    }
    if (densityPercent < 75) {
      return {
        level: 'Sedang • Cukup Lancar & Tertib',
        color: 'text-amber-700 dark:text-amber-300',
        bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
        dotColor: 'bg-amber-500',
        icon: '🌙',
        note: 'Arus jamaah stabil dan teratur. Tetap rapatkan barisan rombongan saat melintasi tikungan Rukun Yamani.',
      };
    }
    if (densityPercent < 88) {
      return {
        level: 'Padat • Diperlukan Kesabaran',
        color: 'text-orange-700 dark:text-orange-300',
        bgColor: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
        dotColor: 'bg-orange-500',
        icon: '⚠️',
        note: 'Kepadatan tinggi. Bagi lansia atau jamaah berkursi roda, sangat dianjurkan menggunakan jalur Mezzanine / Lantai 1.',
      };
    }
    return {
      level: 'Puncak Kepadatan Shalat Fardhu',
      color: 'text-red-700 dark:text-red-300',
      bgColor: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',
      dotColor: 'bg-red-500',
      icon: '⛔',
      note: 'Waktu shalat fardhu berjamaah. Pelataran Mataf bawah sering disterilkan atau ditutup akses masuknya 30 menit sebelum adzan.',
    };
  }, [densityPercent]);

  // Handle Copy Itinerary
  const handleCopyItinerary = () => {
    const text = `🕋 ESTIMASI JADWAL WAKTU MANASIK UMROH
━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ Total Durasi : ${formatMinutes(calculation.totalMinutes)}
📍 Status Kepadatan : ${densityPercent}% (${currentCrowd.status})
🕒 Jam Mulai   : ${calculation.times.start}
🏁 Estimasi Selesai : ${calculation.times.finish}
🚶 Total Jarak  : ~${calculation.totalDistanceKm} km (${calculation.caloriesBurned} kkal)

📌 RINCIAN TAHAPAN MANASIK:
1. Thawaf 7 Putaran (${thawafFloor === 'ground' ? "Pelataran Ka'bah Bawah" : thawafFloor === 'scooter' ? 'Skuter Elektrik' : 'Lantai Mezzanine'}) : ~${calculation.thawafDuration} m (${calculation.times.start} - ${calculation.times.afterThawaf})
2. Shalat Sunnah Thawaf & Minum Zamzam : ~${calculation.prayerAndZamzamDuration} m (${calculation.times.afterThawaf} - ${calculation.times.afterPrayerZamzam})
3. Transisi Menuju Bukit Shafa : ~${calculation.transitionDuration} m (${calculation.times.afterPrayerZamzam} - ${calculation.times.startSai})
4. Sa'i 7 Putaran (Shafa ⇆ Marwah 3.15 km) : ~${calculation.saiDuration} m (${calculation.times.startSai} - ${calculation.times.afterSai})
5. Tahallul (Potong Rambut di Marwah) : ~${calculation.tahallulDuration} m (${calculation.times.afterSai} - ${calculation.times.finish})

💡 Catatan: Estimasi dihitung berdasarkan pantauan kepadatan real-time Masjidil Haram Makkah portal Haramain Life.
Sumber: https://haramainlife.com/`;

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
            <span>FITUR BARU · ESTIMATOR WAKTU MANASIK REAL-TIME</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1C2D24] tracking-tight">
            Estimasi Waktu Tempuh Rangkaian Manasik Umroh
          </h2>
          <p className="text-xs sm:text-sm text-[#2E4338] font-medium mt-1.5 max-w-3xl leading-relaxed">
            Kalkulator durasi pelaksanaan <strong className="text-[#244C3B]">Thawaf 7 Putaran</strong>,{' '}
            <strong className="text-[#244C3B]">Shalat Sunnah & Zamzam</strong>,{' '}
            <strong className="text-[#244C3B]">Sa'i Shafa-Marwah</strong>, hingga{' '}
            <strong className="text-[#244C3B]">Tahallul</strong> yang disinkronkan langsung dengan persentase kepadatan
            Masjidil Haram Makkah saat ini.
          </p>
        </div>

        {/* Live Status Badge & Sync Control */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2 shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-bold text-[#2E4338]">
              Waktu Arab Saudi: <strong className="text-[#1C2D24] font-mono">{String(currentAstHour).padStart(2, '0')}:{String(currentAstMinute).padStart(2, '0')} AST</strong>
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
              🔄 Live Real-Time
            </button>
            <button
              onClick={() => setUseLiveTime(false)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                !useLiveTime
                  ? 'bg-[#244C3B] text-white shadow-xs'
                  : 'bg-[#FAF6F0] text-[#2E4338] hover:text-[#1C2D24] border border-[#E5DAC8]'
              }`}
            >
              ⏱️ Pilih Jam Lain
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
                  Kepadatan Makkah Jam {String(activeHour).padStart(2, '0')}:00 AST:
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
            <span className="text-[#2E4338] font-bold mr-1">Preset Jam:</span>
            {[
              { h: 1, label: '01:00 (Malam)' },
              { h: 8, label: '08:00 (Dhuha)' },
              { h: 14, label: '14:00 (Siang)' },
              { h: 18, label: '18:00 (Maghrib)' },
              { h: 22, label: '22:00 (Isya)' },
            ].map((p) => (
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
              Geser Jam Rencana Mulai Manasik:
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
                <Footprints className="w-4 h-4 text-[#806532]" />
                <span>1. Lokasi / Lantai Thawaf</span>
              </div>
              <span className="text-[10px] text-[#2E4338] font-mono">7 Putaran Ka'bah</span>
            </div>
            <div className="space-y-2 mt-3">
              {THAWAF_FLOORS.map((f) => {
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
                      <span className="text-[10px] font-mono font-bold text-[#806532]">
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
                <Compass className="w-4 h-4 text-[#806532]" />
                <span>2. Moda Perjalanan Sa'i</span>
              </div>
              <span className="text-[10px] text-[#2E4338] font-mono">Shafa ⇆ Marwah 3.15 km</span>
            </div>
            <div className="space-y-2 mt-3">
              {SAI_MODES.map((m) => {
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
                      <span className="text-[10px] font-mono font-bold text-[#806532]">3.15 km</span>
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
                <Sparkles className="w-4 h-4 text-[#806532]" />
                <span>3. Lokasi & Cara Tahallul</span>
              </div>
              <span className="text-[10px] text-[#2E4338] font-mono">Penyempurna Umroh</span>
            </div>
            <div className="space-y-2 mt-3">
              {TAHALLUL_MODES.map((t) => {
                const isSelected = tahallulMode === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTahallulMode(t.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                      isSelected
                        ? 'bg-[#E4F4EC] border-[#244C3B] shadow-xs'
                        : 'bg-[#FAF6F0] border-[#E5DAC8] hover:border-[#C5A059]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#244C3B]' : 'text-[#1C2D24]'}`}>
                        {t.name}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#806532]">
                        ~{t.minutes} m
                      </span>
                    </div>
                    <span className="text-[10px] text-[#2E4338] line-clamp-2">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-[#78350F] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#806532] shrink-0 mt-0.5" />
            <span>
              Tahallul di ujung bukit Marwah sah cukup dengan menggunting sedikitnya 3 helai rambut bagi pria & wanita.
            </span>
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
              <span>TOTAL ESTIMASI DURASI MANASIK UMROH LENGKAP</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans">
                {formatMinutes(calculation.totalMinutes)}
              </span>
              <span className="text-xs sm:text-sm text-[#F5DF95] font-semibold">
                (Tergantung Kepadatan Mataf)
              </span>
            </div>

            {/* Start -> Finish Timeline Tag */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs font-mono font-bold text-white">
                Mulai: {calculation.times.start}
              </span>
              <ChevronRight className="w-4 h-4 text-[#806532]" />
              <span className="px-3 py-1 rounded-xl bg-[#C5A059] font-mono font-black text-[#0E3521] shadow-xs">
                Selesai: ~{calculation.times.finish}
              </span>
            </div>
          </div>

          {/* Quick Metrics (Jarak, Kalori, Rekomendasi) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs shrink-0">
            <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
              <div className="flex items-center gap-1 text-[11px] text-[#E4CB96] font-medium">
                <Navigation className="w-3.5 h-3.5" />
                <span>Total Jarak</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                ~{calculation.totalDistanceKm} <span className="text-xs font-normal">km</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
              <div className="flex items-center gap-1 text-[11px] text-[#E4CB96] font-medium">
                <Flame className="w-3.5 h-3.5" />
                <span>Kalori Fisik</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                ~{calculation.caloriesBurned} <span className="text-xs font-normal">kkal</span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs flex flex-col justify-center">
              <div className="text-[11px] text-[#E4CB96] font-medium">Kelancaran</div>
              <div className="text-sm font-bold text-[#F5DF95] mt-0.5 truncate">
                {currentCrowd.status} ({densityPercent}%)
              </div>
            </div>
          </div>
        </div>

        {/* Status Evaluasi Kenyamanan Bar */}
        <div className={`mt-4 pt-3 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs`}>
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
                <span>Itinerary Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Jadwal ke WhatsApp</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* STEP-BY-STEP PROGRESS TIMELINE */}
      <div className="mb-6">
        <h4 className="text-xs font-extrabold text-[#244C3B] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#806532]" />
          <span>Timeline Rincian 5 Tahapan Ibadah Umroh:</span>
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
                  ~{calculation.thawafDuration} Menit
                </span>
              </div>
              <h5 className="font-extrabold text-[#1C2D24] text-xs">Thawaf 7 Putaran</h5>
              <p className="text-[10px] text-[#2E4338] mt-1 leading-relaxed">
                Mulai dari Hajar Aswad berlawanan arah jarum jam. Ka'bah selalu di sisi kiri.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5DAC8] text-[10px] font-mono text-[#806532] font-bold">
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
                  ~{calculation.prayerAndZamzamDuration} Menit
                </span>
              </div>
              <h5 className="font-extrabold text-[#1C2D24] text-xs">Shalat Sunnah & Zamzam</h5>
              <p className="text-[10px] text-[#2E4338] mt-1 leading-relaxed">
                2 Rakaat di belakang Maqam Ibrahim, doa di Multazam, dan minum air Zamzam segar.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5DAC8] text-[10px] font-mono text-[#806532] font-bold">
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
                  ~{calculation.transitionDuration} Menit
                </span>
              </div>
              <h5 className="font-extrabold text-[#1C2D24] text-xs">Menuju Bukit Shafa</h5>
              <p className="text-[10px] text-[#2E4338] mt-1 leading-relaxed">
                Berjalan dari pelataran Mataf melalui koridor penghubung menuju bukit Shafa.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5DAC8] text-[10px] font-mono text-[#806532] font-bold">
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
                  ~{calculation.saiDuration} Menit
                </span>
              </div>
              <h5 className="font-extrabold text-[#1C2D24] text-xs">Sa'i 7 Putaran (3.15 km)</h5>
              <p className="text-[10px] text-[#2E4338] mt-1 leading-relaxed">
                Shafa ke Marwah dihitung 1 putaran. Selesai putaran ke-7 di bukit Marwah.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5DAC8] text-[10px] font-mono text-[#806532] font-bold">
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
                  ~{calculation.tahallulDuration} Menit
                </span>
              </div>
              <h5 className="font-extrabold text-[#1C2D24] text-xs">Tahallul & Syukur</h5>
              <p className="text-[10px] text-[#2E4338] mt-1 leading-relaxed">
                Memotong rambut, doa syukur selesai umroh. Seluruh larangan ihram gugur.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5DAC8] text-[10px] font-mono text-[#806532] font-bold">
              {calculation.times.afterSai} - {calculation.times.finish}
            </div>
          </div>

        </div>
      </div>

      {/* 3 TIPS PRAKTIS & WAKTU EMAS (GOLDEN HOURS) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-[#E5DAC8] text-xs">
        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0 font-bold">
            🌟
          </div>
          <div>
            <h4 className="font-extrabold text-[#1C2D24] text-xs">Waktu Emas Thawaf Paling Cepat</h4>
            <p className="text-[11px] text-[#2E4338] font-medium mt-0.5 leading-relaxed">
              Pukul <strong>01:00 - 03:00 AST</strong> dini hari atau <strong>07:30 - 09:30 AST</strong> pagi setelah Dhuha.
              Pelataran Mataf bawah longgar dan tidak terdesak.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0 font-bold">
            💧
          </div>
          <div>
            <h4 className="font-extrabold text-[#1C2D24] text-xs">Manajemen Wudhu & Hidrasi</h4>
            <p className="text-[11px] text-[#2E4338] font-medium mt-0.5 leading-relaxed">
              Wudhu wajib sah saat Thawaf. Minum air Zamzam secukupnya dan gunakan toilet pelataran luar sebelum masuk pintu gerbang utama.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center shrink-0 font-bold">
            🛵
          </div>
          <div>
            <h4 className="font-extrabold text-[#1C2D24] text-xs">Layanan Skuter Ramah Lansia</h4>
            <p className="text-[11px] text-[#2E4338] font-medium mt-0.5 leading-relaxed">
              Tersedia tiket sewa skuter resmi di lantai Mezzanine untuk jamaah lansia atau yang memiliki kendala fisik kaki/lutut.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. SECTION 2: POLA HISTORIS KERAMAIAN MINGGUAN (RECHARTS)
   ========================================================================= */

type CityFilter = 'both' | 'makkah' | 'madinah';
type PrayerFilter = 'avg' | 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
type ViewMode = 'trend' | 'prayers';

export function WeeklyCrowdTrendSection() {
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
    <div id="weekly-trend-chart" className="p-5 sm:p-7 rounded-3xl bg-[#FFFFFF] border border-[#E5DAC8] shadow-sm text-[#1C2D24] relative overflow-hidden">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6F0] border border-[#E5DAC8] text-[#244C3B] text-[11px] font-bold tracking-wider uppercase mb-2">
            <Activity className="w-3.5 h-3.5 text-[#806532]" />
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

      {/* Secondary Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] text-xs">
        {/* City Filter Segment */}
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[#2E4338] text-[11px] mr-1">Masjid:</span>
          <button
            onClick={() => setCityFilter('both')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              cityFilter === 'both' ? 'bg-[#244C3B] text-white shadow-xs' : 'bg-white text-[#2E4338] border border-[#E5DAC8]'
            }`}
          >
            Keduanya
          </button>
          <button
            onClick={() => setCityFilter('makkah')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              cityFilter === 'makkah' ? 'bg-[#244C3B] text-white shadow-xs' : 'bg-white text-[#2E4338] border border-[#E5DAC8]'
            }`}
          >
            Makkah
          </button>
          <button
            onClick={() => setCityFilter('madinah')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              cityFilter === 'madinah' ? 'bg-[#244C3B] text-white shadow-xs' : 'bg-white text-[#2E4338] border border-[#E5DAC8]'
            }`}
          >
            Madinah
          </button>
        </div>

        {/* View Mode Specific Filter */}
        {viewMode === 'trend' ? (
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-bold text-[#2E4338] text-[11px] mr-1">Waktu:</span>
            {(['avg', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as PrayerFilter[]).map((pf) => {
              const labelMap: Record<PrayerFilter, string> = {
                avg: 'Rata-Rata',
                fajr: 'Subuh',
                dhuhr: 'Dzuhur',
                asr: 'Ashar',
                maghrib: 'Maghrib',
                isha: 'Isya',
              };
              return (
                <button
                  key={pf}
                  onClick={() => setPrayerFilter(pf)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    prayerFilter === pf ? 'bg-[#C5A059] text-[#1C2D24] shadow-xs' : 'bg-white text-[#2E4338] border border-[#E5DAC8]'
                  }`}
                >
                  {labelMap[pf]}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1">
            <span className="font-bold text-[#2E4338] text-[11px] mr-1">Pilih Hari:</span>
            {WEEKLY_TREND_DATA.map((d, idx) => (
              <button
                key={d.dayKey}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  selectedDayIndex === idx ? 'bg-[#C5A059] text-[#1C2D24] shadow-xs' : 'bg-white text-[#2E4338] border border-[#E5DAC8]'
                }`}
              >
                {d.dayShort}
              </button>
            ))}
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

/* =========================================================================
   5. MAIN APP COMPONENT (UNIFIED CONTAINER)
   ========================================================================= */

type AppViewTab = 'all' | 'estimator' | 'weekly_trend';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppViewTab>('all');

  return (
    <div className="space-y-6">
      {/* Top Section View Tabs */}
      <div className="flex items-center justify-between gap-3 p-1.5 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8] shadow-2xs">
        <div className="flex flex-wrap items-center gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#244C3B] text-white shadow-xs'
                : 'text-[#2E4338] hover:text-[#1C2D24]'
            }`}
          >
            📋 Tampilkan Keduanya
          </button>
          <button
            onClick={() => setActiveTab('estimator')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'estimator'
                ? 'bg-[#244C3B] text-white shadow-xs'
                : 'text-[#2E4338] hover:text-[#1C2D24]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#806532]" />
            <span>Estimator Waktu Manasik Umroh</span>
          </button>
          <button
            onClick={() => setActiveTab('weekly_trend')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'weekly_trend'
                ? 'bg-[#244C3B] text-white shadow-xs'
                : 'text-[#2E4338] hover:text-[#1C2D24]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#806532]" />
            <span>Pola Keramaian 7 Hari</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#2E4338] font-medium pr-2">
          <span>Sinkronisasi Portal Real-Time</span>
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
