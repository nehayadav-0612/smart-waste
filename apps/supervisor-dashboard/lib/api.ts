import axios from 'axios';
import { getAuthToken, removeAuthToken } from './utils';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({ baseURL: API_URL });

apiClient.interceptors.request.use(async (config: any) => {
  if (typeof window === 'undefined') return config;
  const token = getAuthToken();
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    const status = error.response?.status;
    const url: string | undefined = error.config?.url;
    const isAuthEndpoint = url?.includes('/auth/login') || url?.includes('/supervisor/bootstrap');
    if (status === 401 && !isAuthEndpoint) {
      removeAuthToken();
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function loginSupervisor(email: string, password: string) { return (await apiClient.post('/auth/login', { email, password })).data; }
export async function bootstrapSupervisor(email: string, password: string) { return (await apiClient.post('/supervisor/bootstrap', { email, password })).data; }
export async function getKPIDashboard() { return (await apiClient.get('/supervisor/kpi')).data; }
export async function getCollectors() { return (await apiClient.get('/supervisor/collectors')).data; }
export async function createCollector(email: string, password: string, name: string, phone: string) { return (await apiClient.post('/supervisor/collectors', { email, password, name, phone, assigned_wards: [] })).data; }
export async function assignWards(collectorId: string, assigned_wards: string[]) { return (await apiClient.patch('/supervisor/collectors/' + collectorId + '/assign-wards', { assigned_wards })).data; }
export async function uploadCSVPreview(file: File) { const formData = new FormData(); formData.append('file', file); return (await apiClient.post('/supervisor/residents/import-preview', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data; }
export async function confirmCSVImport(file: File) { const formData = new FormData(); formData.append('file', file); return (await apiClient.post('/supervisor/residents/import-confirm', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data; }
export async function getIssues(resolved?: boolean) { const params = resolved !== undefined ? { resolved: resolved ? 'true' : 'false' } : {}; return (await apiClient.get('/supervisor/issues', { params })).data; }
export async function resolveIssue(issueId: string) { return (await apiClient.patch('/supervisor/issues/' + issueId + '/resolve')).data; }
export async function generateMonthlyCharges(month: string) { return (await apiClient.post('/supervisor/generate-monthly-charges', { month })).data; }
export async function getBillingOverview(month: string) { return (await apiClient.get('/supervisor/billing/' + month)).data; }
export async function getResidents() { return (await apiClient.get('/supervisor/residents')).data; }
export async function createResident({ residentData }: { residentData: any }) { return (await apiClient.post('/supervisor/residents', residentData)).data; }
export async function updateResident({ prop_uid, residentData }: { prop_uid: string; residentData: any }) { return (await apiClient.patch('/supervisor/residents/' + prop_uid, residentData)).data; }
export async function deleteResident(prop_uid: string) { return (await apiClient.delete('/supervisor/residents/' + prop_uid)).data; }
export async function checkAPIHealth() { try { const r = await axios.get(API_URL.replace('/api', '/health'), { timeout: 5000 }); return { status: 'ok', data: r.data }; } catch (e: any) { return { status: 'error', message: e.message }; } }
export default apiClient;
