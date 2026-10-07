export type Language = 'id' | 'en';

export interface HourlyCrowdItem {
  hour: number;
  label: string;
  density: number;
  status: string;
  isPrayerTime?: string;
  advice: string;
}

export interface ThawafFloorItem {
  id: 'ground' | 'mezzanine' | 'roof' | 'scooter';
  name: string;
  desc: string;
  distanceKm: number;
  baseMinutes: number;
  suitability: string;
}

export interface SaiModeItem {
  id: 'walk_normal' | 'walk_elderly' | 'scooter' | 'wheelchair';
  name: string;
  desc: string;
  speedLabel: string;
  baseMinutes: number;
}

export interface TahallulModeItem {
  id: 'self_marwah' | 'barber_outside';
  name: string;
  desc: string;
  minutes: number;
}

export interface PresetHourItem {
  h: number;
  label: string;
}

export interface TimelineStepItem {
  num: number;
  title: string;
  desc: string;
}

export interface GoldenTipItem {
  icon: string;
  title: string;
  desc: string;
}

export interface AppTranslations {
  // App top tabs
  app_tab_both: string;
  app_tab_estimator: string;
  app_tab_weekly: string;
  app_sync_portal: string;

  // Umrah Estimator
  estimator_badge: string;
  estimator_title: string;
  estimator_desc_intro: string;
  estimator_desc_thawaf: string;
  estimator_desc_prayer: string;
  estimator_desc_sai: string;
  estimator_desc_tahallul: string;
  estimator_desc_sync: string;
  saudi_time_label: string;
  btn_live_realtime: string;
  btn_pick_hour: string;
  density_at_label: string;
  simulate_other_hours: string;
  live_now_badge: string;
  preset_hour_label: string;
  slide_hour_label: string;

  // Step 1 Tawaf
  step1_heading: string;
  step1_sub: string;
  step1_badge: string;
  step1_title: string;
  step1_desc: string;
  step1_route_label: string;
  step1_pace_label: string;
  pace_normal: string;
  pace_relaxed: string;
  pace_brisk: string;

  // Step 2 Shalat & Zamzam
  step2_heading: string;
  step2_sub: string;
  step2_badge: string;
  step2_title: string;
  step2_desc: string;
  step2_standard_time: string;
  step2_zamzam_note: string;

  // Step 3 Sa'i
  step3_heading: string;
  step3_sub: string;
  step3_badge: string;
  step3_title: string;
  step3_desc: string;
  step3_route_label: string;
  tahallul_info_note: string;

  // Step 4 Tahallul
  step4_heading: string;
  step4_sub: string;
  step4_badge: string;
  step4_title: string;
  step4_desc: string;

  // Estimator Summary Card
  summary_total_badge: string;
  summary_card_title: string;
  summary_total_time: string;
  summary_crowd_condition: string;
  summary_advice_title: string;
  summary_breakdown_title: string;
  summary_resimulate_btn: string;
  summary_tips_title: string;
  summary_density_dependency: string;
  summary_smoothness: string;
  summary_start: string;
  summary_finish: string;
  summary_tips: string[];

  // Metrics
  metric_total_dist: string;
  metric_calories: string;
  metric_est_distance: string;
  metric_est_calories: string;
  timeline_heading: string;
  timeline_start_label: string;
  timeline_after_thawaf: string;
  timeline_after_prayer: string;
  timeline_start_sai: string;
  timeline_after_sai: string;
  timeline_finish: string;

  // Copy Itinerary
  copy_btn_text: string;
  copy_btn_copied: string;
  copy_header: string;
  copy_total_duration: string;
  copy_density_status: string;
  copy_start_time: string;
  copy_finish_time: string;
  copy_total_distance: string;
  copy_breakdown_title: string;
  copy_step1: string;
  copy_step2: string;
  copy_step3: string;
  copy_step4: string;
  copy_step5: string;
  copy_note: string;
  copy_source: string;

  // Formats
  time_hour_unit: string;
  time_min_unit: string;

  // Comfort Status
  comfort_level_1: string;
  comfort_note_1: string;
  comfort_level_2: string;
  comfort_note_2: string;
  comfort_level_3: string;
  comfort_note_3: string;
  comfort_level_4: string;
  comfort_note_4: string;

  // Weekly Trend Chart
  trend_badge: string;
  trend_heading: string;
  trend_subheading: string;
  trend_view_area: string;
  trend_view_bar: string;
  filter_mosque_label: string;
  filter_both: string;
  filter_makkah: string;
  filter_madinah: string;
  mosque_status_both: string;
  mosque_status_makkah: string;
  mosque_status_madinah: string;
  filter_time_label: string;
  filter_day_label: string;
  prayer_avg: string;
  prayer_fajr: string;
  prayer_dhuhr: string;
  prayer_asr: string;
  prayer_maghrib: string;
  prayer_isha: string;
  prayer_daily_avg_label: string;
  prayer_specific_label: string;

  // Day names
  day_sun: string;
  day_mon: string;
  day_tue: string;
  day_wed: string;
  day_thu: string;
  day_fri: string;
  day_sat: string;

  // Chart Tooltips & Legends
  legend_makkah: string;
  legend_madinah: string;
  tooltip_makkah: string;
  tooltip_madinah: string;
  chart_density_y_label: string;

  // Insights 3 Cards
  insight1_title: string;
  insight1_desc: string;
  insight2_title: string;
  insight2_desc: string;
  insight3_title: string;
  insight3_desc: string;

  // Data collections
  preset_hours: PresetHourItem[];
  timeline_steps: TimelineStepItem[];
  golden_tips: GoldenTipItem[];
  hourly_crowd: HourlyCrowdItem[];
  thawaf_floors: ThawafFloorItem[];
  sai_modes: SaiModeItem[];
  tahallul_modes: TahallulModeItem[];
}

export const reactTranslations: Record<Language, AppTranslations> = {
  id: {
    app_tab_both: '📋 Tampilkan Keduanya',
    app_tab_estimator: 'Estimator Waktu Manasik Umroh',
    app_tab_weekly: 'Pola Keramaian 7 Hari',
    app_sync_portal: 'Sinkronisasi Portal Real-Time',

    estimator_badge: 'FITUR BARU · ESTIMATOR WAKTU MANASIK REAL-TIME',
    estimator_title: 'Estimasi Waktu Tempuh Rangkaian Manasik Umroh',
    estimator_desc_intro: 'Kalkulator durasi pelaksanaan',
    estimator_desc_thawaf: 'Thawaf 7 Putaran',
    estimator_desc_prayer: 'Shalat Sunnah & Zamzam',
    estimator_desc_sai: 'Sa\'i Shafa-Marwah',
    estimator_desc_tahallul: 'Tahallul',
    estimator_desc_sync: 'yang disinkronkan langsung dengan persentase kepadatan Masjidil Haram Makkah saat ini.',
    saudi_time_label: 'Waktu Arab Saudi:',
    btn_live_realtime: '🔄 Live Real-Time',
    btn_pick_hour: '⏱️ Pilih Jam Lain',
    density_at_label: 'Kepadatan Makkah Jam',
    simulate_other_hours: 'Simulasi Jam Kepadatan Lain:',
    live_now_badge: 'Live',
    preset_hour_label: 'Preset Jam:',
    slide_hour_label: 'Geser Jam Rencana Mulai Manasik:',

    step1_heading: '1. Lokasi / Lantai Thawaf',
    step1_sub: "7 Putaran Ka'bah",
    step1_badge: 'Langkah 1',
    step1_title: 'Thawaf 7 Putaran Mengelilingi Ka\'bah',
    step1_desc: 'Mengelilingi Ka\'bah 7 putaran dimulai dan diakhiri sejajar Hajar Aswad.',
    step1_route_label: 'Pilih Jalur & Moda Thawaf:',
    step1_pace_label: 'Kecepatan Jalan:',
    pace_normal: 'Normal (Rata-Rata)',
    pace_relaxed: 'Santai / Lansia',
    pace_brisk: 'Cepat / Gesit',

    step2_heading: '2. Moda Perjalanan Sa\'i',
    step2_sub: 'Shafa ⇆ Marwah 3.15 km',
    step2_badge: 'Langkah 2',
    step2_title: 'Shalat Sunnah Tawaf & Air Zamzam',
    step2_desc: '2 rakaat di belakang Maqam Ibrahim (atau area pelataran) dilanjutkan minum Zamzam.',
    step2_standard_time: 'Waktu Istirahat & Doa Standar',
    step2_zamzam_note: 'Termasuk waktu wudhu/istirahat jika antrean galon Zamzam padat.',

    step3_heading: '3. Lokasi & Cara Tahallul',
    step3_sub: 'Penyempurna Umroh',
    step3_badge: 'Langkah 3',
    step3_title: 'Sa\'i 7 Putaran (Shafa ke Marwah)',
    step3_desc: 'Perjalanan 7 putaran dari bukit Shafa ke Marwah sejauh ~3,15 km.',
    step3_route_label: 'Jalur Sa\'i:',
    tahallul_info_note: 'Tahallul di ujung bukit Marwah sah cukup dengan menggunting sedikitnya 3 helai rambut bagi pria & wanita.',

    step4_heading: 'Tahallul',
    step4_sub: 'Cukur Rambut',
    step4_badge: 'Langkah 4',
    step4_title: 'Tahallul (Cukur Rambut)',
    step4_desc: 'Mencukur gundul (pria) atau memotong sebagian rambut (wanita) sebagai penutup Umroh.',

    summary_total_badge: 'TOTAL ESTIMASI DURASI MANASIK UMROH LENGKAP',
    summary_card_title: 'Total Estimasi Rangkaian Umroh',
    summary_total_time: 'Estimasi Total Waktu:',
    summary_crowd_condition: 'Kondisi Kepadatan:',
    summary_advice_title: 'Saran Waktu Pelaksanaan:',
    summary_breakdown_title: 'Rincian Durasi Per Rangkaian:',
    summary_resimulate_btn: 'Simulasi Ulang Pilihan Lain',
    summary_tips_title: 'Tips Praktis Pelaksanaan:',
    summary_density_dependency: '(Tergantung Kepadatan Mataf)',
    summary_smoothness: 'Kelancaran',
    summary_start: 'Mulai',
    summary_finish: 'Selesai',
    summary_tips: [
      'Bawa kantong sandal bertali agar alas kaki dapat selalu dibawa saat Thawaf & Sa\'i.',
      'Gunakan jalur Thawaf Lantai 1 atau Mezanin jika mendampingi jamaah lansia / kursi roda.',
      'Waktu paling nyaman untuk Thawaf adalah 1-2 jam sebelum Subuh atau antara jam 09:00 - 11:00 AST.',
      'Setelah selesai Sa\'i di bukit Marwah, gunakan pintu keluar Marwah menuju area pangkas rambut resmi.'
    ],

    metric_total_dist: 'Total Jarak',
    metric_calories: 'Kalori Fisik',
    metric_est_distance: 'Total Jarak Tempuh:',
    metric_est_calories: 'Estimasi Kalori Terbakar:',
    timeline_heading: 'Timeline Rincian 5 Tahapan Ibadah Umroh:',
    timeline_start_label: 'Mulai',
    timeline_after_thawaf: 'Selesai Thawaf',
    timeline_after_prayer: 'Selesai Shalat & Zamzam',
    timeline_start_sai: 'Mulai Sa\'i di Shafa',
    timeline_after_sai: 'Selesai Sa\'i di Marwah',
    timeline_finish: 'Tahallul & Selesai',

    copy_btn_text: 'Salin Jadwal ke WhatsApp',
    copy_btn_copied: 'Itinerary Tersalin!',
    copy_header: '🕋 ESTIMASI JADWAL WAKTU MANASIK UMROH',
    copy_total_duration: 'Total Durasi',
    copy_density_status: 'Status Kepadatan',
    copy_start_time: 'Jam Mulai',
    copy_finish_time: 'Estimasi Selesai',
    copy_total_distance: 'Total Jarak',
    copy_breakdown_title: 'RINCIAN TAHAPAN MANASIK:',
    copy_step1: 'Thawaf 7 Putaran',
    copy_step2: 'Shalat Sunnah Thawaf & Minum Zamzam',
    copy_step3: 'Transisi Menuju Bukit Shafa',
    copy_step4: 'Sa\'i 7 Putaran (Shafa ⇆ Marwah 3.15 km)',
    copy_step5: 'Tahallul (Potong Rambut di Marwah)',
    copy_note: 'Catatan: Estimasi dihitung berdasarkan pantauan kepadatan real-time Masjidil Haram Makkah portal Haramain Life.',
    copy_source: 'Sumber: https://haramainlife.com/',

    time_hour_unit: 'Jam',
    time_min_unit: 'Menit',

    comfort_level_1: 'Sangat Nyaman & Direkomendasikan',
    comfort_note_1: 'Arus Mataf dan Mas\'a lancar tanpa hambatan desakan. Waktu terbaik untuk jamaah keluarga & lansia.',
    comfort_level_2: 'Sedang • Cukup Lancar & Tertib',
    comfort_note_2: 'Arus jamaah stabil dan teratur. Tetap rapatkan barisan rombongan saat melintasi tikungan Rukun Yamani.',
    comfort_level_3: 'Padat • Diperlukan Kesabaran',
    comfort_note_3: 'Kepadatan tinggi. Bagi lansia atau jamaah berkursi roda, sangat dianjurkan menggunakan jalur Mezzanine / Lantai 1.',
    comfort_level_4: 'Puncak Kepadatan Shalat Fardhu',
    comfort_note_4: 'Waktu shalat fardhu berjamaah. Pelataran Mataf bawah sering disterilkan atau ditutup akses masuknya 30 menit sebelum adzan.',

    trend_badge: 'POLA HISTORIS KERAMAIAN MINGGUAN (RECHARTS)',
    trend_heading: 'Trend Kepadatan Jamaah 7 Hari dalam Seminggu',
    trend_subheading: 'Analisis grafik historis untuk membantu merencanakan hari terbaik kunjungan ibadah, thawaf, dan ziarah Raudhah.',
    trend_view_area: '📈 Trend 7 Hari (Area)',
    trend_view_bar: '📊 Per Waktu Shalat (Bar)',
    filter_mosque_label: 'Pilihan Masjid:',
    filter_both: 'Keduanya',
    filter_makkah: 'Makkah',
    filter_madinah: 'Madinah',
    mosque_status_both: 'Dua Masjid Suci',
    mosque_status_makkah: 'Masjidil Haram Makkah',
    mosque_status_madinah: 'Masjid Nabawi Madinah',
    filter_time_label: 'Filter Waktu:',
    filter_day_label: 'Pilih Hari:',
    prayer_avg: 'Rata-Rata',
    prayer_fajr: 'Subuh',
    prayer_dhuhr: 'Dzuhur',
    prayer_asr: 'Ashar',
    prayer_maghrib: 'Maghrib',
    prayer_isha: 'Isya',
    prayer_daily_avg_label: 'Rata-Rata Harian',
    prayer_specific_label: 'Shalat',

    day_sun: 'Ahad',
    day_mon: 'Senin',
    day_tue: 'Selasa',
    day_wed: 'Rabu',
    day_thu: 'Kamis',
    day_fri: 'Jumat',
    day_sat: 'Sabtu',

    legend_makkah: 'Makkah Al-Mukarramah',
    legend_madinah: 'Madinah Al-Munawwarah',
    tooltip_makkah: '🕋 Makkah (Masjidil Haram)',
    tooltip_madinah: '🕌 Madinah (Masjid Nabawi)',
    chart_density_y_label: 'Kepadatan (%)',

    insight1_title: 'Hari Jumat (Puncak Jumu\'ah)',
    insight1_desc: 'Shalat Jumat mencapai 98% kapasitas di Makkah & 95% di Madinah. Datang pukul 10:00 AST untuk barisan awal.',
    insight2_title: 'Selasa & Rabu (Paling Longgar)',
    insight2_desc: 'Kepadatan terendah mingguan (55-60%). Waktu terbaik untuk Thawaf dekat Ka\'bah & Ziarah Raudhah Syarifah.',
    insight3_title: 'Kamis Malam (Malam Jumat)',
    insight3_desc: 'Lonjakan jamaah lokal & peziarah antar-kota. Area pelataran Isya & Maghrib memadat hingga 88-92%.',

    preset_hours: [
      { h: 1, label: '01:00 (Malam)' },
      { h: 8, label: '08:00 (Dhuha)' },
      { h: 14, label: '14:00 (Siang)' },
      { h: 18, label: '18:00 (Maghrib)' },
      { h: 22, label: '22:00 (Isya)' },
    ],

    timeline_steps: [
      {
        num: 1,
        title: 'Thawaf 7 Putaran',
        desc: "Mulai dari Hajar Aswad berlawanan arah jarum jam. Ka'bah selalu di sisi kiri.",
      },
      {
        num: 2,
        title: 'Shalat Sunnah & Zamzam',
        desc: '2 Rakaat di belakang Maqam Ibrahim, doa di Multazam, dan minum air Zamzam segar.',
      },
      {
        num: 3,
        title: 'Menuju Bukit Shafa',
        desc: 'Berjalan dari pelataran Mataf melalui koridor penghubung menuju bukit Shafa.',
      },
      {
        num: 4,
        title: 'Sa\'i 7 Putaran (3.15 km)',
        desc: 'Shafa ke Marwah dihitung 1 putaran. Selesai putaran ke-7 di bukit Marwah.',
      },
      {
        num: 5,
        title: 'Tahallul & Syukur',
        desc: 'Memotong rambut, doa syukur selesai umroh. Seluruh larangan ihram gugur.',
      },
    ],

    golden_tips: [
      {
        icon: '🌟',
        title: 'Waktu Emas Thawaf Paling Cepat',
        desc: 'Pukul 01:00 - 03:00 AST dini hari atau 07:30 - 09:30 AST pagi setelah Dhuha. Pelataran Mataf bawah longgar dan tidak terdesak.',
      },
      {
        icon: '💧',
        title: 'Manajemen Wudhu & Hidrasi',
        desc: 'Wudhu wajib sah saat Thawaf. Minum air Zamzam secukupnya dan gunakan toilet pelataran luar sebelum masuk pintu gerbang utama.',
      },
      {
        icon: '🛵',
        title: 'Layanan Skuter Ramah Lansia',
        desc: 'Tersedia tiket sewa skuter resmi di lantai Mezzanine untuk jamaah lansia atau yang memiliki kendala fisik kaki/lutut.',
      },
    ],

    hourly_crowd: [
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
    ],

    thawaf_floors: [
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
    ],

    sai_modes: [
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
    ],

    tahallul_modes: [
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
    ],
  },

  en: {
    app_tab_both: '📋 Show Both Features',
    app_tab_estimator: 'Umrah Ritual Time Estimator',
    app_tab_weekly: '7-Day Crowd Pattern',
    app_sync_portal: 'Real-Time Portal Sync',

    estimator_badge: 'NEW FEATURE · REAL-TIME UMRAH ESTIMATOR',
    estimator_title: 'Umrah Ritual Duration & Journey Time Estimator',
    estimator_desc_intro: 'Calculates the duration of',
    estimator_desc_thawaf: '7-Lap Tawaf',
    estimator_desc_prayer: 'Sunnah Prayer & Zamzam',
    estimator_desc_sai: 'Safa-Marwah Sa\'i',
    estimator_desc_tahallul: 'Tahallul',
    estimator_desc_sync: 'synchronized live with the current crowd density percentage of Masjidil Haram Makkah.',
    saudi_time_label: 'Saudi Arabia Time:',
    btn_live_realtime: '🔄 Live Real-Time',
    btn_pick_hour: '⏱️ Pick Another Hour',
    density_at_label: 'Makkah Crowd Density at',
    simulate_other_hours: 'Simulate Another Density Hour:',
    live_now_badge: 'Live',
    preset_hour_label: 'Preset Hours:',
    slide_hour_label: 'Slide to Select Planned Start Hour:',

    step1_heading: '1. Tawaf Floor & Track Location',
    step1_sub: '7 Laps Around Kaaba',
    step1_badge: 'Step 1',
    step1_title: '7-Lap Tawaf Around the Holy Kaaba',
    step1_desc: 'Circling the Holy Kaaba 7 times starting and ending parallel to the Black Stone.',
    step1_route_label: 'Select Tawaf Floor & Mode:',
    step1_pace_label: 'Walking Pace:',
    pace_normal: 'Normal (Average Pace)',
    pace_relaxed: 'Relaxed / Elderly',
    pace_brisk: 'Brisk / Fast Walk',

    step2_heading: '2. Sa\'i Travel Mode',
    step2_sub: 'Safa ⇆ Marwah 3.15 km',
    step2_badge: 'Step 2',
    step2_title: 'Sunnah Tawaf Prayer & Zamzam Drinking',
    step2_desc: '2 rak\'ahs behind Maqam Ibrahim (or any courtyard area) followed by drinking cold Zamzam water.',
    step2_standard_time: 'Standard Rest & Supplication Time',
    step2_zamzam_note: 'Includes ablution/rest buffer if Zamzam drinking stations are bustling.',

    step3_heading: '3. Tahallul Location & Method',
    step3_sub: 'Umrah Completion',
    step3_badge: 'Step 3',
    step3_title: '7-Lap Sa\'i (Between Safa & Marwah)',
    step3_desc: 'A 7-lap journey from Mount Safa to Mount Marwah totaling ~3.15 km.',
    step3_route_label: 'Sa\'i Track Route:',
    tahallul_info_note: 'Tahallul at the summit of Mount Marwah is fulfilled by cutting at least 3 hairs for both men and women.',

    step4_heading: 'Tahallul',
    step4_sub: 'Hair Trimming',
    step4_badge: 'Step 4',
    step4_title: 'Tahallul (Hair Trimming / Shaving)',
    step4_desc: 'Shaving head (men) or clipping a fingertip length of hair (women) concluding the Umrah pilgrimage.',

    summary_total_badge: 'TOTAL ESTIMATED COMPLETE UMRAH DURATION',
    summary_card_title: 'Total Estimated Umrah Journey',
    summary_total_time: 'Estimated Total Time:',
    summary_crowd_condition: 'Crowd Level:',
    summary_advice_title: 'Recommended Worship Timing:',
    summary_breakdown_title: 'Duration Breakdown Per Ritual:',
    summary_resimulate_btn: 'Re-Simulate Another Option',
    summary_tips_title: 'Practical Pilgrim Tips:',
    summary_density_dependency: '(Subject to Mataf Crowd Density)',
    summary_smoothness: 'Crowd Flow',
    summary_start: 'Start',
    summary_finish: 'Finish',
    summary_tips: [
      'Carry a drawstring shoe bag so you can keep your footwear with you during Tawaf & Sa\'i.',
      'Use 1st Floor Tawaf or the Mezzanine scooter level when assisting elderly pilgrims or wheelchairs.',
      'The most comfortable Tawaf hours are 1-2 hours before Fajr or between 09:00 - 11:00 AST.',
      'After completing Sa\'i at Mount Marwah, use the Marwah exit gates leading to official barber shops.'
    ],

    metric_total_dist: 'Total Distance',
    metric_calories: 'Physical Calories',
    metric_est_distance: 'Total Distance:',
    metric_est_calories: 'Estimated Burned Calories:',
    timeline_heading: 'Timeline Breakdown of 5 Umrah Ritual Stages:',
    timeline_start_label: 'Start',
    timeline_after_thawaf: 'After Tawaf',
    timeline_after_prayer: 'After Prayer & Zamzam',
    timeline_start_sai: 'Start Sa\'i at Safa',
    timeline_after_sai: 'Finish Sa\'i at Marwah',
    timeline_finish: 'Tahallul & Complete',

    copy_btn_text: 'Copy Timeline Itinerary',
    copy_btn_copied: 'Copied to Clipboard!',
    copy_header: '🕋 ESTIMATED UMRAH RITUAL TIMELINE',
    copy_total_duration: 'Total Duration',
    copy_density_status: 'Crowd Status',
    copy_start_time: 'Start Time',
    copy_finish_time: 'Estimated Finish',
    copy_total_distance: 'Total Distance',
    copy_breakdown_title: 'RITUAL STAGES BREAKDOWN:',
    copy_step1: '7-Lap Tawaf',
    copy_step2: 'Sunnah Tawaf Prayer & Drinking Zamzam',
    copy_step3: 'Transition Walk to Mount Safa',
    copy_step4: '7-Lap Sa\'i (Safa ⇆ Marwah 3.15 km)',
    copy_step5: 'Tahallul (Hair Trimming / Shaving at Marwah)',
    copy_note: 'Note: Estimate calculated based on real-time crowd monitoring of Masjidil Haram Makkah via Haramain Life portal.',
    copy_source: 'Source: https://haramainlife.com/',

    time_hour_unit: 'hrs',
    time_min_unit: 'mins',

    comfort_level_1: 'Very Comfortable & Recommended',
    comfort_note_1: 'Mataf and Mas\'a flow smoothly without crowd pressure. Best time for families and elderly pilgrims.',
    comfort_level_2: 'Moderate • Smooth & Orderly',
    comfort_note_2: 'Pilgrim flow is steady and orderly. Keep group members close when passing the Yamani Corner.',
    comfort_level_3: 'Crowded • Patience Required',
    comfort_note_3: 'High crowd density. For seniors or wheelchair pilgrims, the Mezzanine / 1st Floor is strongly recommended.',
    comfort_level_4: 'Peak Capacity at Obligatory Prayer',
    comfort_note_4: 'Congregational prayer time. Ground Mataf is cordoned off or restricted 30 minutes before Adhan.',

    trend_badge: 'WEEKLY HISTORICAL CROWD PATTERNS (RECHARTS)',
    trend_heading: '7-Day Weekly Pilgrim Crowd Trends',
    trend_subheading: 'Historical pattern analysis to help plan the optimal day for worship, Tawaf, and Rawdah ziyarah.',
    trend_view_area: '📈 7-Day Trend (Area)',
    trend_view_bar: '📊 By Prayer Time (Bar)',
    filter_mosque_label: 'Mosque Filter:',
    filter_both: 'Both Mosques',
    filter_makkah: 'Makkah',
    filter_madinah: 'Madinah',
    mosque_status_both: 'Two Holy Mosques',
    mosque_status_makkah: 'Masjidil Haram Makkah',
    mosque_status_madinah: 'Al-Masjid An-Nabawi Madinah',
    filter_time_label: 'Time Filter:',
    filter_day_label: 'Select Day:',
    prayer_avg: 'Average',
    prayer_fajr: 'Fajr',
    prayer_dhuhr: 'Dhuhr',
    prayer_asr: 'Asr',
    prayer_maghrib: 'Maghrib',
    prayer_isha: 'Isha',
    prayer_daily_avg_label: 'Daily Average',
    prayer_specific_label: 'Prayer',

    day_sun: 'Sunday',
    day_mon: 'Monday',
    day_tue: 'Tuesday',
    day_wed: 'Wednesday',
    day_thu: 'Thursday',
    day_fri: 'Friday',
    day_sat: 'Saturday',

    legend_makkah: 'Makkah Al-Mukarramah',
    legend_madinah: 'Madinah Al-Munawwarah',
    tooltip_makkah: '🕋 Makkah (Masjidil Haram)',
    tooltip_madinah: '🕌 Madinah (Prophet\'s Mosque)',
    chart_density_y_label: 'Crowd Density (%)',

    insight1_title: 'Friday (Peak Jumu\'ah)',
    insight1_desc: 'Friday prayers reach 98% capacity in Makkah & 95% in Madinah. Arrive by 10:00 AST for early rows.',
    insight2_title: 'Tuesday & Wednesday (Calmest Days)',
    insight2_desc: 'Lowest weekly crowd (55-60%). Prime time for ground Tawaf near the Kaaba & Rawdah visits.',
    insight3_title: 'Thursday Night (Eve of Friday)',
    insight3_desc: 'Surge of local pilgrims and intercity visitors. Maghrib and Isha courtyards fill to 88-92%.',

    preset_hours: [
      { h: 1, label: '01:00 (Night)' },
      { h: 8, label: '08:00 (Duha)' },
      { h: 14, label: '14:00 (Afternoon)' },
      { h: 18, label: '18:00 (Maghrib)' },
      { h: 22, label: '22:00 (Isha)' },
    ],

    timeline_steps: [
      {
        num: 1,
        title: '7-Lap Tawaf',
        desc: 'Starting from the Black Stone counter-clockwise. The Kaaba remains on your left.',
      },
      {
        num: 2,
        title: 'Sunnah Prayer & Zamzam',
        desc: '2 Rak\'ahs behind Maqam Ibrahim, supplication at Multazam, and drinking fresh Zamzam.',
      },
      {
        num: 3,
        title: 'Walk to Mount Safa',
        desc: 'Walking from the Mataf courtyard via connecting corridors towards Mount Safa.',
      },
      {
        num: 4,
        title: '7-Lap Sa\'i (3.15 km)',
        desc: 'Safa to Marwah counts as 1 lap. Conclude the 7th lap at Mount Marwah.',
      },
      {
        num: 5,
        title: 'Tahallul & Completion',
        desc: 'Trimming hair, supplication of gratitude. All Ihram prohibitions lifted.',
      },
    ],

    golden_tips: [
      {
        icon: '🌟',
        title: 'Golden Hours for Fastest Tawaf',
        desc: 'Between 01:00 - 03:00 AST pre-dawn or 07:30 - 09:30 AST mid-morning. Ground Mataf is open and uncrowded.',
      },
      {
        icon: '💧',
        title: 'Ablution & Hydration Planning',
        desc: 'Ablution is mandatory for Tawaf. Drink moderate Zamzam and use courtyard restrooms before entering the main gates.',
      },
      {
        icon: '🛵',
        title: 'Senior-Friendly Scooter Facilities',
        desc: 'Official scooter rentals are available on the Mezzanine floor for elderly pilgrims or those with mobility challenges.',
      },
    ],

    hourly_crowd: [
      { hour: 0, label: '00:00 AST', density: 38, status: 'Spacious', advice: 'Mataf is serene & pleasantly cool for peaceful Tawaf' },
      { hour: 1, label: '01:00 AST', density: 35, status: 'Very Spacious', advice: 'Golden hour! Ground Kaaba courtyard is remarkably open' },
      { hour: 2, label: '02:00 AST', density: 40, status: 'Spacious', advice: 'Ideal time for Qiyam al-Layl & peaceful Tawaf' },
      { hour: 3, label: '03:00 AST', density: 55, status: 'Moderate', advice: 'Pilgrims start arriving in preparation for Fajr prayer' },
      { hour: 4, label: '04:00 AST', density: 82, status: 'Crowded', isPrayerTime: 'Before Fajr', advice: 'Ground Mataf access gates begin to be cordoned' },
      { hour: 5, label: '05:00 AST', density: 92, status: 'Peak Capacity', isPrayerTime: 'Fajr Prayer', advice: 'Fajr congregation peak, Mataf completely full' },
      { hour: 6, label: '06:00 AST', density: 65, status: 'Moderate', advice: 'Crowds disperse after morning dhikr & sunrise' },
      { hour: 7, label: '07:00 AST', density: 42, status: 'Spacious', advice: 'Crisp morning Duha hours, very friendly for seniors' },
      { hour: 8, label: '08:00 AST', density: 45, status: 'Spacious', advice: 'Orderly flow, routine marble floor cleaning in progress' },
      { hour: 9, label: '09:00 AST', density: 52, status: 'Moderate', advice: 'Stable conditions before the midday desert sun rises' },
      { hour: 10, label: '10:00 AST', density: 62, status: 'Moderate', advice: 'Congregation builds ahead of Dhuhr prayer' },
      { hour: 11, label: '11:00 AST', density: 85, status: 'Crowded', isPrayerTime: 'Before Dhuhr', advice: 'Ground Mataf entry often redirected to upper floors' },
      { hour: 12, label: '12:00 AST', density: 94, status: 'Peak Capacity', isPrayerTime: 'Dhuhr Prayer', advice: 'Dhuhr congregational prayer with intense midday heat' },
      { hour: 13, label: '13:00 AST', density: 70, status: 'Moderate', advice: 'Flow resumes smoothly following afternoon prayer' },
      { hour: 14, label: '14:00 AST', density: 60, status: 'Moderate', advice: 'Misting fans active, mosque interior pleasantly air-conditioned' },
      { hour: 15, label: '15:00 AST', density: 80, status: 'Crowded', isPrayerTime: 'Before Asr', advice: 'Pilgrims gather for congregational Asr prayer' },
      { hour: 16, label: '16:00 AST', density: 88, status: 'Crowded', isPrayerTime: 'Asr Prayer', advice: 'Mataf filled with Asr prayer worshippers' },
      { hour: 17, label: '17:00 AST', density: 78, status: 'Moderate-High', advice: 'Pilgrims sit down awaiting sunset & Maghrib' },
      { hour: 18, label: '18:00 AST', density: 96, status: 'Peak Capacity', isPrayerTime: 'Maghrib Prayer', advice: 'Maximum 100% capacity filled for Maghrib prayer' },
      { hour: 19, label: '19:00 AST', density: 95, status: 'Peak Capacity', isPrayerTime: 'Isha Buffer', advice: 'Maghrib-Isha interval, courtyards closely packed' },
      { hour: 20, label: '20:00 AST', density: 90, status: 'Crowded', isPrayerTime: 'Isha Prayer', advice: 'Congregational Isha prayer completes around 20:45' },
      { hour: 21, label: '21:00 AST', density: 72, status: 'Moderate', advice: 'Crowds gradually exit, evening Tawaf flows nicely' },
      { hour: 22, label: '22:00 AST', density: 58, status: 'Moderate', advice: 'Pleasant evening air, highly favored by pilgrims' },
      { hour: 23, label: '23:00 AST', density: 45, status: 'Spacious', advice: 'Peaceful ambience descending toward midnight' },
    ],

    thawaf_floors: [
      {
        id: 'ground',
        name: 'Ground Mataf Courtyard',
        desc: 'Shortest radius directly circling the Kaaba. Ihram attire mandatory for men.',
        distanceKm: 1.4,
        baseMinutes: 32,
        suitability: 'Most Virtuous & Fastest (For independent/able-bodied pilgrims)',
      },
      {
        id: 'mezzanine',
        name: '1st Floor / Mezzanine (Indoor A/C)',
        desc: 'Air-conditioned cool track, ideal for families & seniors. Wider turning radius.',
        distanceKm: 3.1,
        baseMinutes: 55,
        suitability: 'Very Comfortable & Cool (Protected from direct sun)',
      },
      {
        id: 'roof',
        name: 'Open-Air Roof Courtyard',
        desc: 'Expansive open sky track. Beautiful and breezy during night hours.',
        distanceKm: 4.2,
        baseMinutes: 75,
        suitability: 'Spacious & Uncrowded (Ideal for pleasant nights)',
      },
      {
        id: 'scooter',
        name: 'Electric Scooter Track (Mezzanine Mas\'a)',
        desc: 'Official Haram scooter rental service (Single/Double). Constant steady pace.',
        distanceKm: 2.8,
        baseMinutes: 24,
        suitability: 'Fastest & Senior / Mobility Friendly',
      },
    ],

    sai_modes: [
      {
        id: 'walk_normal',
        name: 'Normal Walking (Ground / 1st Floor)',
        desc: 'Fixed 7 laps Shafa-Marwah totaling 3.15 km (7 × 450 m). Includes brisk pace at green lights for men.',
        speedLabel: 'Pace ~3.5 km/h',
        baseMinutes: 50,
      },
      {
        id: 'walk_elderly',
        name: 'Relaxed Walk / Seniors & Groups',
        desc: 'Comfortable pace with brief rests at Shafa and Marwah summits on each lap.',
        speedLabel: 'Pace ~2.2 km/h',
        baseMinutes: 75,
      },
      {
        id: 'scooter',
        name: 'Electric Scooter (Dedicated Mezzanine)',
        desc: 'Elevated dedicated track free from pedestrian friction. Safe & constant speed.',
        speedLabel: 'Electric Speed ~7-8 km/h',
        baseMinutes: 28,
      },
      {
        id: 'wheelchair',
        name: 'Wheelchair (Official Attendant)',
        desc: 'Official uniformed attendant service in designated wheelchair lanes.',
        speedLabel: 'Steady Push ~4.0 km/h',
        baseMinutes: 42,
      },
    ],

    tahallul_modes: [
      {
        id: 'self_marwah',
        name: 'Self-Clipping at Mount Marwah',
        desc: 'Clipping at least 3 hairs directly upon completing the 7th lap at Marwah (bring small scissors).',
        minutes: 8,
      },
      {
        id: 'barber_outside',
        name: 'Licensed Barber Outside Marwah / Clock Tower',
        desc: 'Complete head shaving (Halaq) at licensed barber shops outside Marwah / Bab Ali. Includes queue.',
        minutes: 25,
      },
    ],
  },
};
