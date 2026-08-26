import { useQuery } from '@tanstack/react-query';
import {
  getReportDashboard,
  getFinancialReport,
  getOperationalReport,
  getTechnicianReport,
  getGSTReport,
  getFinanceSummary,
  ReportFilters,
} from '../api/reports.api';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export const useReportDashboard = (filters?: ReportFilters) =>
  useQuery({
    queryKey: ['reports', 'dashboard', filters],
    queryFn: () => getReportDashboard(filters),
    staleTime: STALE_TIME,
  });

export const useFinancialReport = (filters?: ReportFilters) =>
  useQuery({
    queryKey: ['reports', 'financial', filters],
    queryFn: () => getFinancialReport(filters),
    staleTime: STALE_TIME,
  });

export const useOperationalReport = (filters?: ReportFilters) =>
  useQuery({
    queryKey: ['reports', 'operational', filters],
    queryFn: () => getOperationalReport(filters),
    staleTime: STALE_TIME,
  });

export const useTechnicianReport = (filters?: ReportFilters) =>
  useQuery({
    queryKey: ['reports', 'technician', filters],
    queryFn: () => getTechnicianReport(filters),
    staleTime: STALE_TIME,
  });

export const useGSTReport = (filters?: ReportFilters) =>
  useQuery({
    queryKey: ['reports', 'gst', filters],
    queryFn: () => getGSTReport(filters),
    staleTime: STALE_TIME,
  });

export const useFinanceSummary = (filters?: ReportFilters) =>
  useQuery({
    queryKey: ['reports', 'finance-summary', filters],
    queryFn: () => getFinanceSummary(filters),
    staleTime: STALE_TIME,
  });
