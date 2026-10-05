import { registerSW } from 'virtual:pwa-register';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function initPWA() {
  // Register Service Worker via vite-plugin-pwa
  const updateSW = registerSW({
    onNeedRefresh() {
      showUpdateNotification();
    },
    onOfflineReady() {
      console.log('HaramainLife PWA: Content cached for offline travel in Saudi Arabia.');
      showOfflineReadyNotification();
    },
  });

  // Check if running in standalone mode
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  // Set up listeners for BeforeInstallPrompt
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    updateInstallUI(true);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    updateInstallUI(false);
    showToast('Aplikasi HaramainLife berhasil terinstal di perangkat Anda!');
  });

  // Monitor network status
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // Initialize UI on load
  document.addEventListener('DOMContentLoaded', () => {
    updateInstallUI(!isStandalone && deferredPrompt !== null);
    updateOnlineStatus();
    setupIOSInstallModal();
  });

  return { updateSW };
}

export async function triggerPWAInstall(): Promise<boolean> {
  if (!deferredPrompt) {
    // Check if iOS
    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    if (isIOS) {
      const iosModal = document.getElementById('pwa-ios-modal');
      if (iosModal) {
        iosModal.classList.remove('hidden');
        return false;
      }
    }
    showToast('Aplikasi sudah terinstal atau peramban tidak mendukung prompt otomatis.');
    return false;
  }

  await deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  if (choice.outcome === 'accepted') {
    deferredPrompt = null;
    updateInstallUI(false);
    return true;
  }
  return false;
}

function updateInstallUI(show: boolean) {
  const installBtn = document.getElementById('pwa-install-btn');
  const installBanner = document.getElementById('pwa-install-banner');
  
  const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;

  if (isStandalone) {
    if (installBtn) installBtn.classList.add('hidden');
    if (installBanner) installBanner.classList.add('hidden');
    return;
  }

  if (show || isIOS) {
    if (installBtn) installBtn.classList.remove('hidden');
    if (installBanner) installBanner.classList.remove('hidden');
  } else {
    if (installBtn) installBtn.classList.add('hidden');
    if (installBanner) installBanner.classList.add('hidden');
  }
}

function updateOnlineStatus() {
  const offlineBar = document.getElementById('pwa-offline-indicator');
  if (!offlineBar) return;

  if (!navigator.onLine) {
    offlineBar.classList.remove('translate-y-full', 'opacity-0');
    offlineBar.classList.add('translate-y-0', 'opacity-100');
  } else {
    offlineBar.classList.add('translate-y-full', 'opacity-0');
    offlineBar.classList.remove('translate-y-0', 'opacity-100');
  }
}

function showUpdateNotification() {
  showToast('Versi terbaru HaramainLife tersedia. Muat ulang untuk memperbarui.', 5000);
}

function showOfflineReadyNotification() {
  showToast('Jadwal sholat & peta masjid telah disimpan untuk akses luring selama di Arab Saudi.', 4000);
}

function showToast(msg: string, duration = 3000) {
  let toast = document.getElementById('pwa-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'pwa-toast';
    toast.className =
      'fixed top-20 right-4 z-[9999] max-w-md px-4 py-3 rounded-2xl bg-[#244C3B] text-white text-xs font-bold shadow-2xl border border-[#C5A059]/40 flex items-center gap-3 transition-all duration-300 transform translate-y-[-20px] opacity-0';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-[#C5A059] animate-ping shrink-0"></span>
    <span class="flex-1">${msg}</span>
  `;

  toast.classList.remove('translate-y-[-20px]', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    if (toast) {
      toast.classList.add('translate-y-[-20px]', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }
  }, duration);
}

function setupIOSInstallModal() {
  const iosModal = document.getElementById('pwa-ios-modal');
  const closeBtn = document.getElementById('pwa-ios-modal-close');
  if (closeBtn && iosModal) {
    closeBtn.addEventListener('click', () => {
      iosModal.classList.add('hidden');
    });
  }
}

// Auto initialize PWA service worker
if (typeof window !== 'undefined') {
  initPWA();
  (window as unknown as { triggerPWAInstall: typeof triggerPWAInstall }).triggerPWAInstall = triggerPWAInstall;
}
