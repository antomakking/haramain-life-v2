export type RaporStatus = 'GREEN' | 'YELLOW' | 'RED';

export type AccessLevel = 
  | 'SUPER_ADMIN' 
  | 'CHAIR_TPM' 
  | 'SECRETARY' 
  | 'WAKA' 
  | 'KAPROGLI' 
  | 'TREASURER' 
  | 'AUDITOR' 
  | 'COMMITTEE';

export interface TPMUser {
  id: string;
  name: string;
  nip: string;
  role: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  accessLevel: AccessLevel;
  avatar: string;
  assignedStandards: string[];
  permissions: {
    canEditIndicators: boolean;
    canAudit: boolean;
    canApprovePPEPP: boolean;
    canExportArkas: boolean;
    canManageUsers: boolean;
    canApproveBudget: boolean;
  };
}

export type SNPCategory =
  | 'Standar Kompetensi Lulusan (SKL)'
  | 'Standar Isi'
  | 'Standar Proses'
  | 'Standar Penilaian Pendidikan'
  | 'Standar Pendidik & Tenaga Kependidikan'
  | 'Standar Sarana & Prasarana'
  | 'Standar Pengelolaan'
  | 'Standar Pembiayaan'
  | 'Kemitraan DUDI & Link and Match'
  | 'Karakter & Nilai Islami Santri';

export interface SPMIIndicator {
  id: string;
  code: string; // e.g. A.1.1, B.2.3, SNP-06.1
  dimension: string; // Dimensi A: Mutu Hasil Belajar, Dimensi B: Kualitas Pembelajaran, etc.
  category: SNPCategory;
  name: string;
  description: string;
  score: number; // 0 - 100
  targetScore: number;
  nationalBaseline: number;
  status: RaporStatus; // GREEN, YELLOW, RED
  statusLabel: string;
  assignedUserId: string; // TPM user ID
  assignedUserName: string;
  rootCause: string;
  recommendationPBD: string;
  evidenceDocs: { name: string; url?: string; verified: boolean }[];
  arkasProgramId?: string;
  arkasLinked: boolean;
  estimatedBudget: number;
  lastUpdated: string;
  academicYear: string;
}

export type ArkasFundingSource = 'BOS_REGULER' | 'BOS_KINERJA' | 'YAYASAN_KOMITE';

export interface ArkasItem {
  id: string;
  indicatorId: string;
  indicatorCode: string;
  kodeStandar: string; // e.g. "03", "05", "07"
  namaStandar: string;
  kodeKegiatan: string; // e.g. "03.02.01"
  namaKegiatan: string;
  kodeRekening: string; // e.g. "5.1.02.01.01.0024"
  uraianBelanja: string;
  volume: number;
  satuan: string;
  tarif: number;
  total: number;
  sumberDana: ArkasFundingSource;
  statusApproval: 'DRAFT' | 'DISETUJUI_TPM' | 'FINAL_ARKAS';
  triwulan: 'TW1' | 'TW2' | 'TW3' | 'TW4' | 'TAHUNAN';
  penanggungJawabId: string;
  penanggungJawabName: string;
  prioritas: 'TINGGI' | 'SEDANG' | 'RENDAH';
}

export type PPEPPStage = 'PENETAPAN' | 'PELAKSANAAN' | 'EVALUASI' | 'PENGENDALIAN' | 'PENINGKATAN';

export interface PPEPPCycleItem {
  id: string;
  stage: PPEPPStage;
  stageNumber: number;
  title: string;
  description: string;
  academicYear: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  progressPercentage: number;
  targetDate: string;
  actualDate?: string;
  picUserId: string;
  picUserName: string;
  keyOutputs: string[];
  documents: string[];
}

export type FindingType = 'KTS_MAYOR' | 'KTS_MINOR' | 'OB' | 'TS';

export interface AuditFinding {
  id: string;
  indicatorId: string;
  indicatorName: string;
  category: SNPCategory;
  type: FindingType;
  typeLabel: string;
  findingDescription: string;
  standardCriteria: string;
  rootCause: string;
  correctiveAction: string;
  auditorId: string;
  auditorName: string;
  auditeeId: string;
  auditeeName: string;
  deadline: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED';
  evidenceUpload?: string;
}
