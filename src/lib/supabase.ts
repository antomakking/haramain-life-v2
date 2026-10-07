import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  TPMUser, 
  SPMIIndicator, 
  ArkasItem, 
  PPEPPCycleItem, 
  AuditFinding 
} from '../types/spmi';
import { 
  INITIAL_TPM_USERS, 
  INITIAL_SPMI_INDICATORS, 
  INITIAL_ARKAS_ITEMS, 
  INITIAL_PPEPP_CYCLES, 
  INITIAL_AUDIT_FINDINGS 
} from '../data/initialData';

// Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ibnulqayyim-spmi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key-mock-spmi';

export const isRealSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('mock')
);

// Instantiate Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Storage keys for reactive mock state
const STORAGE_KEYS = {
  USERS: 'spmi_smkit_tpm_users_v1',
  INDICATORS: 'spmi_smkit_indicators_v1',
  ARKAS: 'spmi_smkit_arkas_items_v1',
  PPEPP: 'spmi_smkit_ppepp_cycles_v1',
  AUDIT: 'spmi_smkit_audit_findings_v1',
  ACTIVE_USER: 'spmi_smkit_active_user_id_v1',
};

// Event emitter for reactive updates across components
type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const subscribeToSPMIChanges = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifySPMIChanges = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (err) {
      console.error('Error invoking SPMI listener', err);
    }
  });
};

// Safe LocalStorage helpers
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifySPMIChanges();
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

// Data access operations with Supabase Client synchronization
export const spmiService = {
  // TPM Users (15 Anggota)
  async getUsers(): Promise<TPMUser[]> {
    if (isRealSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('tpm_users').select('*');
        if (!error && data && data.length > 0) return data as TPMUser[];
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local store', e);
      }
    }
    return getFromStorage<TPMUser[]>(STORAGE_KEYS.USERS, INITIAL_TPM_USERS);
  },

  async updateUser(user: TPMUser): Promise<void> {
    const users = await this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    saveToStorage(STORAGE_KEYS.USERS, users);

    if (isRealSupabaseConfigured) {
      try {
        await supabase.from('tpm_users').upsert(user);
      } catch (err) {
        console.error('Supabase update failed:', err);
      }
    }
  },

  // Active User session (RBAC switcher)
  getActiveUserId(): string {
    return getFromStorage<string>(STORAGE_KEYS.ACTIVE_USER, 'user-02'); // Default to Ketua TPMPS
  },

  setActiveUserId(userId: string): void {
    saveToStorage(STORAGE_KEYS.ACTIVE_USER, userId);
  },

  // SPMI & Rapor Pendidikan Indicators
  async getIndicators(): Promise<SPMIIndicator[]> {
    if (isRealSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('spmi_indicators').select('*');
        if (!error && data && data.length > 0) return data as SPMIIndicator[];
      } catch (e) {
        console.warn('Supabase fetch indicators failed', e);
      }
    }
    return getFromStorage<SPMIIndicator[]>(STORAGE_KEYS.INDICATORS, INITIAL_SPMI_INDICATORS);
  },

  async updateIndicator(indicator: SPMIIndicator): Promise<void> {
    const indicators = await this.getIndicators();
    const idx = indicators.findIndex((i) => i.id === indicator.id);
    if (idx !== -1) {
      indicators[idx] = {
        ...indicator,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
    } else {
      indicators.push(indicator);
    }
    saveToStorage(STORAGE_KEYS.INDICATORS, indicators);

    if (isRealSupabaseConfigured) {
      try {
        await supabase.from('spmi_indicators').upsert(indicator);
      } catch (e) {
        console.warn('Supabase upsert failed', e);
      }
    }
  },

  // ARKAS Table Items
  async getArkasItems(): Promise<ArkasItem[]> {
    if (isRealSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('arkas_programs').select('*');
        if (!error && data && data.length > 0) return data as ArkasItem[];
      } catch (e) {
        console.warn('Supabase fetch arkas failed', e);
      }
    }
    return getFromStorage<ArkasItem[]>(STORAGE_KEYS.ARKAS, INITIAL_ARKAS_ITEMS);
  },

  async saveArkasItem(item: ArkasItem): Promise<void> {
    const items = await this.getArkasItems();
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx !== -1) {
      items[idx] = item;
    } else {
      items.unshift(item);
    }
    saveToStorage(STORAGE_KEYS.ARKAS, items);

    if (isRealSupabaseConfigured) {
      try {
        await supabase.from('arkas_programs').upsert(item);
      } catch (e) {
        console.warn('Supabase arkas upsert failed', e);
      }
    }
  },

  async deleteArkasItem(id: string): Promise<void> {
    const items = await this.getArkasItems();
    const updated = items.filter((i) => i.id !== id);
    saveToStorage(STORAGE_KEYS.ARKAS, updated);

    if (isRealSupabaseConfigured) {
      try {
        await supabase.from('arkas_programs').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase arkas delete failed', e);
      }
    }
  },

  // PPEPP Cycle Stages
  async getPpeppCycles(): Promise<PPEPPCycleItem[]> {
    if (isRealSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('ppepp_cycles').select('*');
        if (!error && data && data.length > 0) return data as PPEPPCycleItem[];
      } catch (e) {
        console.warn('Supabase fetch ppepp failed', e);
      }
    }
    return getFromStorage<PPEPPCycleItem[]>(STORAGE_KEYS.PPEPP, INITIAL_PPEPP_CYCLES);
  },

  async updatePpeppCycle(cycle: PPEPPCycleItem): Promise<void> {
    const cycles = await this.getPpeppCycles();
    const idx = cycles.findIndex((c) => c.id === cycle.id);
    if (idx !== -1) {
      cycles[idx] = cycle;
    }
    saveToStorage(STORAGE_KEYS.PPEPP, cycles);

    if (isRealSupabaseConfigured) {
      try {
        await supabase.from('ppepp_cycles').upsert(cycle);
      } catch (e) {
        console.warn('Supabase ppepp upsert failed', e);
      }
    }
  },

  // Audit Findings (AMI)
  async getAuditFindings(): Promise<AuditFinding[]> {
    if (isRealSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('audit_findings').select('*');
        if (!error && data && data.length > 0) return data as AuditFinding[];
      } catch (e) {
        console.warn('Supabase fetch audit failed', e);
      }
    }
    return getFromStorage<AuditFinding[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_FINDINGS);
  },

  async saveAuditFinding(finding: AuditFinding): Promise<void> {
    const findings = await this.getAuditFindings();
    const idx = findings.findIndex((f) => f.id === finding.id);
    if (idx !== -1) {
      findings[idx] = finding;
    } else {
      findings.unshift(finding);
    }
    saveToStorage(STORAGE_KEYS.AUDIT, findings);

    if (isRealSupabaseConfigured) {
      try {
        await supabase.from('audit_findings').upsert(finding);
      } catch (e) {
        console.warn('Supabase audit upsert failed', e);
      }
    }
  },

  // Reset to initial authentic data
  resetDatabase(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_TPM_USERS));
    localStorage.setItem(STORAGE_KEYS.INDICATORS, JSON.stringify(INITIAL_SPMI_INDICATORS));
    localStorage.setItem(STORAGE_KEYS.ARKAS, JSON.stringify(INITIAL_ARKAS_ITEMS));
    localStorage.setItem(STORAGE_KEYS.PPEPP, JSON.stringify(INITIAL_PPEPP_CYCLES));
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT_FINDINGS));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify('user-02'));
    notifySPMIChanges();
  },
};
