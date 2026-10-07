import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  TPMUser, 
  SPMIIndicator, 
  ArkasItem, 
  PPEPPCycleItem, 
  AuditFinding,
  RaporStatus,
} from '../types/spmi';
import { spmiService, subscribeToSPMIChanges, isRealSupabaseConfigured } from '../lib/supabase';

interface SPMIContextType {
  activeUser: TPMUser;
  users: TPMUser[];
  indicators: SPMIIndicator[];
  arkasItems: ArkasItem[];
  ppeppCycles: PPEPPCycleItem[];
  auditFindings: AuditFinding[];
  isLoading: boolean;
  isRealSupabase: boolean;
  
  // Stats
  stats: {
    totalIndicators: number;
    greenCount: number;
    yellowCount: number;
    redCount: number;
    averageScore: number;
    totalArkasBudget: number;
    completedPpeppStages: number;
    openAuditFindings: number;
  };

  // Filters
  filterUser: string;
  setFilterUser: (userId: string) => void;
  statusFilter: 'ALL' | RaporStatus;
  setStatusFilter: (status: 'ALL' | RaporStatus) => void;
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Actions
  setActiveUserId: (id: string) => void;
  updateIndicator: (indicator: SPMIIndicator) => Promise<void>;
  saveArkasItem: (item: ArkasItem) => Promise<void>;
  deleteArkasItem: (id: string) => Promise<void>;
  updatePpeppCycle: (cycle: PPEPPCycleItem) => Promise<void>;
  saveAuditFinding: (finding: AuditFinding) => Promise<void>;
  resetDatabase: () => void;
}

const SPMIContext = createContext<SPMIContextType | undefined>(undefined);

export const SPMIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<TPMUser[]>([]);
  const [indicators, setIndicators] = useState<SPMIIndicator[]>([]);
  const [arkasItems, setArkasItems] = useState<ArkasItem[]>([]);
  const [ppeppCycles, setPpeppCycles] = useState<PPEPPCycleItem[]>([]);
  const [auditFindings, setAuditFindings] = useState<AuditFinding[]>([]);
  const [activeUserId, setActiveUserIdState] = useState<string>('user-02');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [filterUser, setFilterUser] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | RaporStatus>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      const [u, ind, ark, pp, aud] = await Promise.all([
        spmiService.getUsers(),
        spmiService.getIndicators(),
        spmiService.getArkasItems(),
        spmiService.getPpeppCycles(),
        spmiService.getAuditFindings(),
      ]);
      setUsers(u);
      setIndicators(ind);
      setArkasItems(ark);
      setPpeppCycles(pp);
      setAuditFindings(aud);
      setActiveUserIdState(spmiService.getActiveUserId());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToSPMIChanges(() => {
      loadData();
    });
    return () => {
      unsubscribe();
    };
  }, [loadData]);

  const activeUser = useMemo(() => {
    const found = users.find((u) => u.id === activeUserId);
    return found || users[0] || ({} as TPMUser);
  }, [users, activeUserId]);

  const setActiveUserId = (id: string) => {
    spmiService.setActiveUserId(id);
    setActiveUserIdState(id);
  };

  const updateIndicator = async (ind: SPMIIndicator) => {
    await spmiService.updateIndicator(ind);
    await loadData();
  };

  const saveArkasItem = async (item: ArkasItem) => {
    await spmiService.saveArkasItem(item);
    await loadData();
  };

  const deleteArkasItem = async (id: string) => {
    await spmiService.deleteArkasItem(id);
    await loadData();
  };

  const updatePpeppCycle = async (cycle: PPEPPCycleItem) => {
    await spmiService.updatePpeppCycle(cycle);
    await loadData();
  };

  const saveAuditFinding = async (finding: AuditFinding) => {
    await spmiService.saveAuditFinding(finding);
    await loadData();
  };

  const resetDatabase = () => {
    spmiService.resetDatabase();
    loadData();
  };

  const stats = useMemo(() => {
    const totalIndicators = indicators.length;
    const greenCount = indicators.filter((i) => i.status === 'GREEN').length;
    const yellowCount = indicators.filter((i) => i.status === 'YELLOW').length;
    const redCount = indicators.filter((i) => i.status === 'RED').length;
    const totalScore = indicators.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = totalIndicators > 0 ? Number((totalScore / totalIndicators).toFixed(1)) : 0;
    const totalArkasBudget = arkasItems.reduce((acc, curr) => acc + curr.total, 0);
    const completedPpeppStages = ppeppCycles.filter((p) => p.status === 'COMPLETED').length;
    const openAuditFindings = auditFindings.filter((a) => a.status !== 'RESOLVED').length;

    return {
      totalIndicators,
      greenCount,
      yellowCount,
      redCount,
      averageScore,
      totalArkasBudget,
      completedPpeppStages,
      openAuditFindings,
    };
  }, [indicators, arkasItems, ppeppCycles, auditFindings]);

  return (
    <SPMIContext.Provider
      value={{
        activeUser,
        users,
        indicators,
        arkasItems,
        ppeppCycles,
        auditFindings,
        isLoading,
        isRealSupabase: isRealSupabaseConfigured,
        stats,
        filterUser,
        setFilterUser,
        statusFilter,
        setStatusFilter,
        categoryFilter,
        setCategoryFilter,
        searchQuery,
        setSearchQuery,
        setActiveUserId,
        updateIndicator,
        saveArkasItem,
        deleteArkasItem,
        updatePpeppCycle,
        saveAuditFinding,
        resetDatabase,
      }}
    >
      {children}
    </SPMIContext.Provider>
  );
};

export const useSPMI = () => {
  const context = useContext(SPMIContext);
  if (!context) {
    throw new Error('useSPMI must be used within an SPMIProvider');
  }
  return context;
};
