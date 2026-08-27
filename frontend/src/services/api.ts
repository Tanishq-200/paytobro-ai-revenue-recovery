import {
  AnalyticsData,
  AuditLog,
  CaseStatus,
  CopilotMessage,
  GuardrailsConfig,
  KpiData,
  RecoveryCase,
  SimulationResult,
} from '../types/index.js';

const BASE_URL = '/api';

export async function fetchKpi(): Promise<KpiData> {
  const res = await fetch(`${BASE_URL}/kpi`);
  if (!res.ok) throw new Error('Failed to fetch KPI data');
  return res.json();
}

export async function fetchHighValueCases(): Promise<RecoveryCase[]> {
  const res = await fetch(`${BASE_URL}/high-value`);
  if (!res.ok) throw new Error('Failed to fetch high-value cases');
  return res.json();
}

export interface FetchCasesParams {
  search?: string;
  status?: string;
  failure_category?: string;
  priority?: string;
  sort_by?: string;
  sort_dir?: string;
  page?: number;
  limit?: number;
}

export interface CasesResponse {
  cases: RecoveryCase[];
  total: number;
  page: number;
  totalPages: number;
}

export async function fetchCases(params: FetchCasesParams = {}): Promise<CasesResponse> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.failure_category) searchParams.set('failure_category', params.failure_category);
  if (params.priority) searchParams.set('priority', params.priority);
  if (params.sort_by) searchParams.set('sort_by', params.sort_by);
  if (params.sort_dir) searchParams.set('sort_dir', params.sort_dir);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const res = await fetch(`${BASE_URL}/cases?${searchParams.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch recovery cases');
  return res.json();
}

export async function fetchCaseById(id: string): Promise<RecoveryCase> {
  const res = await fetch(`${BASE_URL}/cases/${id}`);
  if (!res.ok) throw new Error(`Case ${id} not found`);
  return res.json();
}

export async function executeCaseRecovery(id: string): Promise<{ success: boolean; message: string; recovered_amount: number }> {
  const res = await fetch(`${BASE_URL}/cases/${id}/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Recovery execution simulation failed');
  return res.json();
}

export async function rejectCaseRecovery(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/cases/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to reject recovery recommendation');
  return res.json();
}

export async function fetchActivityFeed(): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/activity`);
  if (!res.ok) throw new Error('Failed to fetch activity feed');
  return res.json();
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${BASE_URL}/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function fetchAuditLogs(params: { case_id?: string; event_type?: string } = {}): Promise<AuditLog[]> {
  const searchParams = new URLSearchParams();
  if (params.case_id) searchParams.set('case_id', params.case_id);
  if (params.event_type) searchParams.set('event_type', params.event_type);

  const res = await fetch(`${BASE_URL}/audit-logs?${searchParams.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function sendCopilotChat(message: string): Promise<CopilotMessage> {
  const res = await fetch(`${BASE_URL}/copilot/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Copilot response error');
  return res.json();
}

export async function generateSimulationDataset(transactionCount: number, averageAmount: number): Promise<any> {
  const res = await fetch(`${BASE_URL}/simulation/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionCount, averageAmount }),
  });
  if (!res.ok) throw new Error('Failed to generate simulation dataset');
  return res.json();
}

export async function executeSimulation(): Promise<SimulationResult> {
  const res = await fetch(`${BASE_URL}/simulation/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Simulation execution failed');
  return res.json();
}

export async function resetDemoData(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/demo/reset`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reset demo dataset');
  return res.json();
}

export async function fetchSettings(): Promise<{ guardrails: GuardrailsConfig; ai_config: any }> {
  const res = await fetch(`${BASE_URL}/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function saveSettings(data: { guardrails?: Partial<GuardrailsConfig>; ai_config?: any }): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save settings');
  return res.json();
}
