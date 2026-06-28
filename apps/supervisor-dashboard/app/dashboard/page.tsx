'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { getKPIDashboard, getResidents } from '@/lib/api';
import { BarGraph } from '../charts/infographics';

export default function DashboardPage() {
  const [kpi, setKpi] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [wardCount, setWardCount] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    async function fetchKPI() {
      try {
        const data = await getKPIDashboard();
        setKpi(data);
      } catch (error) {
        console.error('Failed to fetch KPI:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchKPI();
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    let active = true;
    async function fetchWardCount() {
      try {
        const data = await getResidents();
        const residents = data?.residents || [];
        const set = new Set<string>();
        residents.forEach((r: any) => set.add(r.ward_no + '::' + (r.ward_name || '')));
        if (active) setWardCount(set.size);
      } catch (err) {
        console.error('Failed to fetch residents:', err);
      }
    }
    fetchWardCount();
    return () => { active = false; };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <div style={{ padding: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', color: '#1a1a1a' }}>KPI Dashboard</h1>
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>Total Residents</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1E7F5C' }}>{kpi?.total_residents || 0}</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>Total Wards</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1E7F5C' }}>{wardCount > 0 ? wardCount : (kpi?.total_wards || 0)}</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>Active Collectors</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1E7F5C' }}>{kpi?.total_collectors || 0}</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>Collections Today</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2ECC71' }}>{kpi?.collections_today || 0}</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '14px', color: '#999', marginBottom: '8px' }}>Pending Issues</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#F39C12' }}>{kpi?.pending_issues || 0}</p>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: '30px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', color: '#1a1a1a' }}>Statistics</h2>
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px', height: '400px', width: '600px' }}>
              <p style={{ fontSize: '18px', color: '#030303', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold', fontStyle: 'italic' }}>Ward wise Residents Distribution</p>
              <div style={{ backgroundColor: '#fff', padding: '10px', marginBottom: '30px', height: '95%' }}><BarGraph /></div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
