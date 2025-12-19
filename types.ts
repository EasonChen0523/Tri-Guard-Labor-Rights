
export interface CaseDetails {
  companyName: string;
  companyId?: string; // 統一編號
  incidentDate: string;
  employmentStartDate: string;
  monthlySalary: string;
  isDangerousEnvironment: boolean; // 是否涉及危險工作環境
  violations: string[];
  description: string;
  targetAgencies: string[]; // 新增：目標檢舉單位 (laborInsurance, laborInspection, taxBureau)
  evidenceSelected: string[]; // Selected evidence codes
  evidenceImages: Record<string, string[]>; // Map code (A, B...) to array of base64 image strings
  evidenceLinks: Record<string, string[]>; // Map code to array of URLs (Google Drive links)
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface GeneratedReport {
  subject: string;
  body: string;
  requiredDocuments: string[]; // AI suggested text list
  submissionGuide: string;
}

export interface EvidenceCover {
  code: string; // A, B, C, D, E, F, G
  title: string;
  description: string; // The generated text for the cover sheet
}

export interface ReportResult {
  laborInsurance: GeneratedReport | null; // 勞保局 (可為空)
  laborInspection: GeneratedReport | null; // 勞檢處 (可為空)
  taxBureau: GeneratedReport | null; // 國稅局 (可為空)
  evidenceCovers: EvidenceCover[]; // Generated cover texts for attachments
  evidenceImages: Record<string, string[]>; // Pass through images to viewer
  evidenceLinks: Record<string, string[]>; // Pass through links to viewer
}

// 檢舉專案介面
export interface ReportProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  data: CaseDetails;
  reports: ReportResult | null;
  chatHistory: Message[]; // 綁定此專案的對話紀錄
}

export enum ReportStatus {
  IDLE,
  GENERATING,
  COMPLETED,
  ERROR
}

export const VIOLATION_OPTIONS = [
  "高薪低報 (勞保/健保/勞退)",
  "未投保 (勞保/健保/就保)",
  "未給付加班費",
  "工資未全額給付/預扣工資",
  "超時工作/違反七休一",
  "未給予例假/國定假日/特休",
  "違法解僱/未給付資遣費",
  "職安衛設施不足/危險工作環境",
  "薪資所得扣繳憑單不實 (逃漏稅)"
];

export const EVIDENCE_OPTIONS = [
  { code: 'A', label: '排班證據 (出勤紀錄/打卡單)' },
  { code: 'B', label: '薪資證據 (轉帳紀錄/薪資條)' },
  { code: 'C', label: '指揮監督 (Line對話/派工單)' },
  { code: 'D', label: '危險作業 (現場照片/職安缺失)' },
  { code: 'E', label: '勞務報酬 (勞務報酬單/合約)' },
  { code: 'F', label: '通信紀錄 (Email/存證信函)' },
  { code: 'G', label: '所得性質 (所得性質確認申請書)' }
];

export const AGENCY_ATTACHMENTS = {
  laborInsurance: ['A', 'B', 'C', 'F'],
  laborInspection: ['A', 'B', 'C', 'D', 'E', 'F'],
  taxBureau: ['G']
};
