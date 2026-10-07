import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Thermometer,
  Droplets,
  Sun,
  CloudSun,
  Wind,
  Calendar,
  TrendingUp,
  Info,
  Sparkles,
  Compass,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

/* =========================================================================
   TYPES & PRESET FORECAST DATA
   ========================================================================= */

export interface WeatherDayPoint {
  dayIndex: number;
  dateStr: string;        // "06/10"
  isoDate: string;        // "2026-10-06"
  dayName: string;        // "Hari Ini", "Besok", "Kamis", etc.
  fullDay: string;        // "Selasa, 6 Okt"
  maxTemp: number;        // °C
  minTemp: number;        // °C
  apparentTemp: number;   // °C (Feels like)
  humidity: number;       // %
  uvIndex: number;
  condition: string;
  comfortStatus: string;
  worshipAdvice: string;
}

const DEFAULT_MAKKAH_FORECAST: WeatherDayPoint[] = [
  {
    dayIndex: 0,
    dateStr: '06/10',
    isoDate: '2026-10-06',
    dayName: 'Hari Ini',
    fullDay: 'Selasa, 6 Okt',
    maxTemp: 39.2,
    minTemp: 27.4,
    apparentTemp: 41.5,
    humidity: 38,
    uvIndex: 9.2,
    condition: 'Cerah Terik',
    comfortStatus: 'Sangat Panas di Siang Hari',
    worshipAdvice: 'Pelataran Mataf sangat panas siang hari; prioritaskan Thawaf ba\'da Isya hingga Subuh.',
  },
  {
    dayIndex: 1,
    dateStr: '07/10',
    isoDate: '2026-10-07',
    dayName: 'Besok',
    fullDay: 'Rabu, 7 Okt',
    maxTemp: 38.5,
    minTemp: 28.0,
    apparentTemp: 40.8,
    humidity: 45,
    uvIndex: 8.8,
    condition: 'Cerah Berawan',
    comfortStatus: 'Panas & Agak Lembab',
    worshipAdvice: 'Sedia air Zamzam sebelum thawaf; lantai marmer Thassos tetap sejuk di area dasar.',
  },
  {
    dayIndex: 2,
    dateStr: '08/10',
    isoDate: '2026-10-08',
    dayName: 'Kamis',
    fullDay: 'Kamis, 8 Okt',
    maxTemp: 38.0,
    minTemp: 27.2,
    apparentTemp: 40.2,
    humidity: 48,
    uvIndex: 8.5,
    condition: 'Berawan Tipis',
    comfortStatus: 'Hangat Stabil',
    worshipAdvice: 'Waktu terbaik umroh sunnah: Pukul 01:00 - 04:00 AST saat angin berhembus nyaman.',
  },
  {
    dayIndex: 3,
    dateStr: '09/10',
    isoDate: '2026-10-09',
    dayName: 'Jumat',
    fullDay: 'Jumat, 9 Okt',
    maxTemp: 37.4,
    minTemp: 26.5,
    apparentTemp: 39.3,
    humidity: 42,
    uvIndex: 9.0,
    condition: 'Cerah Berkah',
    comfortStatus: 'Panas Sedang (Hari Jumat)',
    worshipAdvice: 'Datang 2-3 jam sebelum azan Dzuhur untuk shalat Jumat di dalam ruangan ber-AC.',
  },
  {
    dayIndex: 4,
    dateStr: '10/10',
    isoDate: '2026-10-10',
    dayName: 'Sabtu',
    fullDay: 'Sabtu, 10 Okt',
    maxTemp: 37.8,
    minTemp: 26.8,
    apparentTemp: 39.8,
    humidity: 40,
    uvIndex: 8.9,
    condition: 'Cerah Hangat',
    comfortStatus: 'Nyaman untuk Ziarah Pagi',
    worshipAdvice: 'Waktu ideal ziarah Jabal Tsur & Gua Hira sebelum pukul 09:00 pagi.',
  },
];

const DEFAULT_MADINAH_FORECAST: WeatherDayPoint[] = [
  {
    dayIndex: 0,
    dateStr: '06/10',
    isoDate: '2026-10-06',
    dayName: 'Hari Ini',
    fullDay: 'Selasa, 6 Okt',
    maxTemp: 35.0,
    minTemp: 23.2,
    apparentTemp: 35.8,
    humidity: 28,
    uvIndex: 8.2,
    condition: 'Cerah Sejuk Pagi',
    comfortStatus: 'Teduh Berpayung',
    worshipAdvice: 'Payung raksasa Nabawi terbuka pukul 07:00; suasana sejuk dan nyaman di pelataran.',
  },
  {
    dayIndex: 1,
    dateStr: '07/10',
    isoDate: '2026-10-07',
    dayName: 'Besok',
    fullDay: 'Rabu, 7 Okt',
    maxTemp: 34.2,
    minTemp: 22.5,
    apparentTemp: 34.7,
    humidity: 26,
    uvIndex: 8.0,
    condition: 'Cerah Bersahabat',
    comfortStatus: 'Sejuk di Malam Hari',
    worshipAdvice: 'Bawalah jaket tipis untuk jamaah lansia saat shalat Subuh atau iktikaf malam.',
  },
  {
    dayIndex: 2,
    dateStr: '08/10',
    isoDate: '2026-10-08',
    dayName: 'Kamis',
    fullDay: 'Kamis, 8 Okt',
    maxTemp: 34.0,
    minTemp: 22.0,
    apparentTemp: 34.3,
    humidity: 30,
    uvIndex: 7.8,
    condition: 'Berawan Lembut',
    comfortStatus: 'Sangat Kondusif Ibadah',
    worshipAdvice: 'Sangat nyaman untuk antrean ziarah Raudhah Syarifah pada malam hari.',
  },
  {
    dayIndex: 3,
    dateStr: '09/10',
    isoDate: '2026-10-09',
    dayName: 'Jumat',
    fullDay: 'Jumat, 9 Okt',
    maxTemp: 35.2,
    minTemp: 23.0,
    apparentTemp: 35.6,
    humidity: 27,
    uvIndex: 8.1,
    condition: 'Cerah Berkah',
    comfortStatus: 'Sejuk dengan Kipas Embun',
    worshipAdvice: 'Kipas embun (misting fans) aktif di bawah payung Nabawi menjaga kelembaban.',
  },
  {
    dayIndex: 4,
    dateStr: '10/10',
    isoDate: '2026-10-10',
    dayName: 'Sabtu',
    fullDay: 'Sabtu, 10 Okt',
    maxTemp: 35.8,
    minTemp: 23.8,
    apparentTemp: 36.2,
    humidity: 25,
    uvIndex: 8.3,
    condition: 'Cerah Kering',
    comfortStatus: 'Kering & Segar',
    worshipAdvice: 'Gunakan pelembab bibir & minum air Zamzam rutin karena kelembaban udara rendah.',
  },
];

interface WeatherTrendChartProps {
  city?: 'makkah' | 'madinah' | 'all';
  mode?: 'master' | 'compact';
}

export default function WeatherTrendChart({
  city = 'all',
  mode = 'master',
}: WeatherTrendChartProps) {
  const [activeCity, setActiveCity] = useState<'makkah' | 'madinah'>(
    city === 'madinah' ? 'madinah' : 'makkah'
  );
  const [metricView, setMetricView] = useState<'dual' | 'temp' | 'humidity'>('dual');
  const [makkahData, setMakkahData] = useState<WeatherDayPoint[]>(DEFAULT_MAKKAH_FORECAST);
  const [madinahData, setMadinahData] = useState<WeatherDayPoint[]>(DEFAULT_MADINAH_FORECAST);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Sinkron Otomatis');

  // Fetch real-time 5-day weather data from Open-Meteo
  const fetchForecast = async () => {
    setLoading(true);
    try {
      const [mRes, nRes] = await Promise.all([
        fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=21.4225&longitude=39.8262&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,uv_index_max,relative_humidity_2m_max&timezone=Asia%2FRiyadh&forecast_days=5'
        ),
        fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=24.4672&longitude=39.6111&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,uv_index_max,relative_humidity_2m_max&timezone=Asia%2FRiyadh&forecast_days=5'
        ),
      ]);

      if (mRes.ok) {
        const json = await mRes.json();
        if (json?.daily?.time?.length) {
          const list: WeatherDayPoint[] = [];
          const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
          const fullNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
          for (let i = 0; i < Math.min(5, json.daily.time.length); i++) {
            const raw = json.daily.time[i];
            const parts = raw.split('-').map(Number);
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            const dayIdx = d.getDay();
            const dateStr = `${String(parts[2]).padStart(2, '0')}/${String(parts[1]).padStart(2, '0')}`;
            const max = json.daily.temperature_2m_max[i] ?? 38;
            const min = json.daily.temperature_2m_min[i] ?? 27;
            const app = json.daily.apparent_temperature_max?.[i] ?? max + 2;
            const hum = json.daily.relative_humidity_2m_max?.[i] ?? 40;
            const uv = json.daily.uv_index_max?.[i] ?? 8.5;
            list.push({
              dayIndex: i,
              dateStr,
              isoDate: raw,
              dayName: i === 0 ? 'Hari Ini' : i === 1 ? 'Besok' : dayNames[dayIdx],
              fullDay: `${fullNames[dayIdx]}, ${parts[2]} Okt`,
              maxTemp: Number(max.toFixed(1)),
              minTemp: Number(min.toFixed(1)),
              apparentTemp: Number(app.toFixed(1)),
              humidity: Math.round(hum),
              uvIndex: Number(uv.toFixed(1)),
              condition: max >= 38 ? 'Cerah Terik' : 'Cerah Berawan',
              comfortStatus: max >= 38 ? 'Sangat Panas di Siang Hari' : 'Hangat Stabil',
              worshipAdvice:
                i === 0
                  ? 'Gunakan alas kaki tebal di lantai atas dan utamakan Thawaf malam hari.'
                  : 'Sedia air Zamzam & pelindung panas sebelum memasuki pelataran masjid.',
            });
          }
          if (list.length >= 5) setMakkahData(list);
        }
      }

      if (nRes.ok) {
        const json = await nRes.json();
        if (json?.daily?.time?.length) {
          const list: WeatherDayPoint[] = [];
          const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
          const fullNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
          for (let i = 0; i < Math.min(5, json.daily.time.length); i++) {
            const raw = json.daily.time[i];
            const parts = raw.split('-').map(Number);
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            const dayIdx = d.getDay();
            const dateStr = `${String(parts[2]).padStart(2, '0')}/${String(parts[1]).padStart(2, '0')}`;
            const max = json.daily.temperature_2m_max[i] ?? 35;
            const min = json.daily.temperature_2m_min[i] ?? 23;
            const app = json.daily.apparent_temperature_max?.[i] ?? max + 1;
            const hum = json.daily.relative_humidity_2m_max?.[i] ?? 28;
            const uv = json.daily.uv_index_max?.[i] ?? 8.0;
            list.push({
              dayIndex: i,
              dateStr,
              isoDate: raw,
              dayName: i === 0 ? 'Hari Ini' : i === 1 ? 'Besok' : dayNames[dayIdx],
              fullDay: `${fullNames[dayIdx]}, ${parts[2]} Okt`,
              maxTemp: Number(max.toFixed(1)),
              minTemp: Number(min.toFixed(1)),
              apparentTemp: Number(app.toFixed(1)),
              humidity: Math.round(hum),
              uvIndex: Number(uv.toFixed(1)),
              condition: max >= 35 ? 'Cerah Hangat' : 'Sejuk Berawan',
              comfortStatus: 'Teduh Berpayung Nabawi',
              worshipAdvice:
                'Payung otomatis dan semprotan kabut menjaga kenyamanan jamaah di pelataran.',
            });
          }
          if (list.length >= 5) setMadinahData(list);
        }
      }

      setLastUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' AST');
    } catch {
      // Fallback already in place
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const currentDataset = useMemo(() => {
    return activeCity === 'makkah' ? makkahData : madinahData;
  }, [activeCity, makkahData, madinahData]);

  // Derived metrics
  const stats = useMemo(() => {
    const temps = currentDataset.map((d) => d.maxTemp);
    const mins = currentDataset.map((d) => d.minTemp);
    const hums = currentDataset.map((d) => d.humidity);

    const highest = Math.max(...temps);
    const lowest = Math.min(...mins);
    const avgHum = Math.round(hums.reduce((a, b) => a + b, 0) / hums.length);

    return { highest, lowest, avgHum };
  }, [currentDataset]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: WeatherDayPoint = payload[0].payload;
      return (
        <div className="rounded-2xl p-3.5 bg-[#173628] text-white border border-[#C5A059]/40 shadow-2xl max-w-xs text-xs backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 border-b border-[#C5A059]/30 pb-1.5 mb-2">
            <span className="font-bold text-[#F5E5C9] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#806532]" />
              {data.fullDay}
            </span>
            <span className="text-[10px] text-[#A3D9C0] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded">
              {data.condition}
            </span>
          </div>

          <div className="space-y-1.5 mb-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#C5E5D5] flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-[#E4CB96]" />
                Suhu Siang / Malam:
              </span>
              <span className="font-mono font-bold text-[#FDF2C7]">
                {data.maxTemp}°C / {data.minTemp}°C
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#C5E5D5] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E4CB96]" />
                Sensasi Panas (Feels):
              </span>
              <span className="font-mono font-semibold text-white">
                {data.apparentTemp}°C
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#C5E5D5] flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-[#4ade80]" />
                Kelembaban Relatif:
              </span>
              <span className="font-mono font-bold text-[#4ade80]">
                {data.humidity}%
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#C5E5D5] flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-[#facc15]" />
                Indeks UV Maksimal:
              </span>
              <span className="font-mono font-semibold text-[#facc15]">
                {data.uvIndex}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-[10.5px] text-[#E4F4EC] leading-relaxed flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#806532] shrink-0 mt-0.5" />
            <span>{data.worshipAdvice}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // -------------------------------------------------------------
  // COMPACT MODE: Designed to embed inside each city's forecast card
  // -------------------------------------------------------------
  if (mode === 'compact') {
    const isMakkah = activeCity === 'makkah';
    return (
      <div className="mt-2.5 rounded-2xl bg-[#FFFFFF] border border-[#E5DAC8] p-3 shadow-2xs transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#244C3B]" />
            <span className="text-xs font-bold text-[#1C2D24]">
              Tren Suhu (°C) & Kelembaban (%)
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#2E4338] font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
              Suhu
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
              Lembab
            </span>
          </div>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={currentDataset}
              margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`tempGrad-${activeCity}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5A059" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#C5A059" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id={`humGrad-${activeCity}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E5DAC8" vertical={false} opacity={0.6} />
              
              <XAxis
                dataKey="dayName"
                tick={{ fontSize: 10, fill: '#1C2D24', fontWeight: 600 }}
                axisLine={{ stroke: '#E5DAC8' }}
                tickLine={false}
              />
              
              <YAxis
                yAxisId="temp"
                domain={[isMakkah ? 22 : 18, isMakkah ? 44 : 40]}
                tick={{ fontSize: 9, fill: '#694F12', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}°`}
              />

              <YAxis
                yAxisId="hum"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: '#059669', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Temperature Area & Line */}
              <Area
                yAxisId="temp"
                type="monotone"
                dataKey="maxTemp"
                stroke="#C5A059"
                strokeWidth={2.5}
                fill={`url(#tempGrad-${activeCity})`}
                name="Suhu Maks (°C)"
              />

              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="minTemp"
                stroke="#B58738"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={{ r: 2.5, fill: '#B58738' }}
                name="Suhu Min (°C)"
              />

              {/* Humidity Line */}
              <Line
                yAxisId="hum"
                type="monotone"
                dataKey="humidity"
                stroke="#059669"
                strokeWidth={2}
                dot={{ r: 2.5, fill: '#059669' }}
                name="Kelembaban (%)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 pt-2 border-t border-[#E5DAC8] flex items-center justify-between text-[10px] text-[#2E4338]">
          <span className="font-medium text-[#244C3B] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#806532]" />
            Rentang Suhu 5 Hari: <strong>{stats.lowest}°C – {stats.highest}°C</strong>
          </span>
          <span className="font-mono text-[#047857] font-bold">
            Rata-rata Lembab: {stats.avgHum}%
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MASTER MODE: Full-featured visualization inside forecast section
  // -------------------------------------------------------------
  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-[#FFFFFF] border border-[#E5DAC8] shadow-[0_16px_40px_rgba(36,76,59,0.08)] relative overflow-hidden transition-all duration-300">
      {/* Subtle Golden Sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent"></div>
      <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 bg-[#C5A059]/[0.06] rounded-full blur-3xl"></div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5DAC8]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#244C3B] uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-[#806532]" />
            <span>Visualisasi Tren Cuaca Recharts • 5 Hari Ke Depan</span>
            <span className="text-[10px] text-[#3B5145] font-mono font-medium hidden sm:inline">
              · {lastUpdated}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#1C2D24] tracking-tight">
            Kurva Suhu (°C) & Tren Kelembaban Relatif (%)
          </h3>
          <p className="text-xs text-[#2E4338] mt-0.5 font-medium max-w-2xl">
            Pantau fluktuasi suhu puncak siang hari, suhu sejuk malam, dan kelembaban udara di pelataran Ka'bah & Masjid Nabawi untuk kenyamanan ibadah.
          </p>
        </div>

        {/* Controls: City Switcher & Metric Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* City Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#FAF6F0] border border-[#E5DAC8] text-xs font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveCity('makkah')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                activeCity === 'makkah'
                  ? 'bg-[#244C3B] text-white shadow-xs'
                  : 'text-[#2E4338] hover:text-[#1C2D24]'
              }`}
            >
              Makkah (Mataf)
            </button>
            <button
              type="button"
              onClick={() => setActiveCity('madinah')}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                activeCity === 'madinah'
                  ? 'bg-[#244C3B] text-white shadow-xs'
                  : 'text-[#2E4338] hover:text-[#1C2D24]'
              }`}
            >
              Madinah (Nabawi)
            </button>
          </div>

          {/* Metric Filter View */}
          <div className="flex items-center p-1 rounded-xl bg-[#FAF6F0] border border-[#E5DAC8] text-xs font-semibold shadow-2xs">
            <button
              type="button"
              onClick={() => setMetricView('dual')}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
                metricView === 'dual'
                  ? 'bg-[#FFFFFF] border border-[#C5A059] text-[#244C3B] font-bold shadow-2xs'
                  : 'text-[#2E4338] hover:text-[#1C2D24]'
              }`}
              title="Tampilkan Suhu dan Kelembaban bersamaan"
            >
              Dual Axis
            </button>
            <button
              type="button"
              onClick={() => setMetricView('temp')}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
                metricView === 'temp'
                  ? 'bg-[#FFFFFF] border border-[#C5A059] text-[#244C3B] font-bold shadow-2xs'
                  : 'text-[#2E4338] hover:text-[#1C2D24]'
              }`}
              title="Fokus Kurva Suhu Maksimal & Minimal"
            >
              Suhu Saja
            </button>
            <button
              type="button"
              onClick={() => setMetricView('humidity')}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer ${
                metricView === 'humidity'
                  ? 'bg-[#FFFFFF] border border-[#C5A059] text-[#244C3B] font-bold shadow-2xs'
                  : 'text-[#2E4338] hover:text-[#1C2D24]'
              }`}
              title="Fokus Tren Kelembaban Relatif"
            >
              Kelembaban
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchForecast}
            disabled={loading}
            className="p-2 rounded-xl bg-[#FAF6F0] hover:bg-[#F5EFE6] border border-[#E5DAC8] text-[#244C3B] transition cursor-pointer shadow-2xs"
            title="Perbarui Data Satelit Open-Meteo"
            aria-label="Perbarui Cuaca"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="mt-5 h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={currentDataset}
            margin={{ top: 16, right: metricView === 'temp' ? 10 : 20, left: 0, bottom: 6 }}
          >
            <defs>
              <linearGradient id="makkahGoldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C5A059" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#C5A059" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="makkahEmeraldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E5DAC8" vertical={false} opacity={0.65} />

            <XAxis
              dataKey="fullDay"
              tick={{ fontSize: 11, fill: '#1C2D24', fontWeight: 600 }}
              axisLine={{ stroke: '#E5DAC8' }}
              tickLine={false}
            />

            {/* Left Y Axis: Temperature */}
            {(metricView === 'dual' || metricView === 'temp') && (
              <YAxis
                yAxisId="leftTemp"
                domain={[
                  activeCity === 'makkah' ? 22 : 18,
                  activeCity === 'makkah' ? 44 : 40,
                ]}
                tick={{ fontSize: 10, fill: '#694F12', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}°C`}
                label={{
                  value: 'Suhu (°C)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#694F12',
                  fontSize: 10,
                  fontWeight: 700,
                  offset: 12,
                }}
              />
            )}

            {/* Right Y Axis: Humidity */}
            {(metricView === 'dual' || metricView === 'humidity') && (
              <YAxis
                yAxisId="rightHum"
                orientation="right"
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#059669', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                label={{
                  value: 'Kelembaban (%)',
                  angle: 90,
                  position: 'insideRight',
                  fill: '#059669',
                  fontSize: 10,
                  fontWeight: 700,
                  offset: 12,
                }}
              />
            )}

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
            />

            {/* Temperature Max (Area + Solid Line) */}
            {(metricView === 'dual' || metricView === 'temp') && (
              <Area
                yAxisId="leftTemp"
                type="monotone"
                dataKey="maxTemp"
                name="Suhu Siang Maksimal (°C)"
                stroke="#C5A059"
                strokeWidth={3}
                fill="url(#makkahGoldGradient)"
                dot={{ r: 4, fill: '#FFFFFF', stroke: '#C5A059', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#C5A059', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            )}

            {/* Temperature Min (Dashed Line) */}
            {(metricView === 'dual' || metricView === 'temp') && (
              <Line
                yAxisId="leftTemp"
                type="monotone"
                dataKey="minTemp"
                name="Suhu Malam / Subuh (°C)"
                stroke="#856404"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3.5, fill: '#FFFFFF', stroke: '#856404', strokeWidth: 1.5 }}
              />
            )}

            {/* Humidity Trend (Emerald Cyan Line / Area) */}
            {(metricView === 'dual' || metricView === 'humidity') && (
              <Line
                yAxisId="rightHum"
                type="monotone"
                dataKey="humidity"
                name="Kelembaban Udara (%)"
                stroke="#059669"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#FFFFFF', stroke: '#059669', strokeWidth: 2 }}
                activeDot={{ r: 5.5, fill: '#059669', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 5-Day Fast Stat Cards Strip */}
      <div className="mt-5 pt-4 border-t border-[#E5DAC8] grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8]">
          <span className="text-[10px] uppercase font-bold text-[#694F12] flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-[#806532]" />
            Suhu Puncak 5 Hari
          </span>
          <div className="flex items-baseline gap-1 mt-1 font-mono">
            <span className="text-xl sm:text-2xl font-black text-[#1C2D24]">{stats.highest}°C</span>
            <span className="text-[10px] text-[#2E4338] font-sans">Maks</span>
          </div>
          <p className="text-[10px] text-[#2E4338] mt-0.5">Waktu Dzuhur & Ashar</p>
        </div>

        <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8]">
          <span className="text-[10px] uppercase font-bold text-[#244C3B] flex items-center gap-1">
            <CloudSun className="w-3.5 h-3.5 text-[#244C3B]" />
            Suhu Terendah
          </span>
          <div className="flex items-baseline gap-1 mt-1 font-mono">
            <span className="text-xl sm:text-2xl font-black text-[#1C2D24]">{stats.lowest}°C</span>
            <span className="text-[10px] text-[#2E4338] font-sans">Min</span>
          </div>
          <p className="text-[10px] text-[#2E4338] mt-0.5">Waktu Sejuk Subuh</p>
        </div>

        <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8]">
          <span className="text-[10px] uppercase font-bold text-[#047857] flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-[#047857]" />
            Rata-rata Kelembaban
          </span>
          <div className="flex items-baseline gap-1 mt-1 font-mono">
            <span className="text-xl sm:text-2xl font-black text-[#047857]">{stats.avgHum}%</span>
            <span className="text-[10px] text-[#2E4338] font-sans">RH</span>
          </div>
          <p className="text-[10px] text-[#2E4338] mt-0.5">
            {activeCity === 'makkah' ? 'Kering ke Hangat' : 'Sejuk Kering'}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#E5DAC8]">
          <span className="text-[10px] uppercase font-bold text-[#694F12] flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#806532]" />
            Waktu Thawaf / Ibadah Terbaik
          </span>
          <div className="mt-1">
            <span className="text-xs font-bold text-[#244C3B] block">21:00 – 06:30 AST</span>
            <p className="text-[10px] text-[#2E4338] mt-0.5">Suhu lebih sejuk & angin tenang</p>
          </div>
        </div>
      </div>
    </div>
  );
}
