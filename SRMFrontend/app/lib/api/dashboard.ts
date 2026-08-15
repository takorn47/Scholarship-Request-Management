import { apiClient } from "./client";

export interface DashboardSummary {
  totalRequests: number;
  totalRequestedAmount: number;
  averageRequestedAmount: number;
  byStatus: { statusId: number; statusName: string; count: number }[];
  byScholarshipType: {
    sholarshipId: number;
    sholarshipName: string;
    count: number;
    totalRequestedAmount: number;
  }[];
  byMonth: { month: string; count: number }[]; // "YYYY-MM"
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await apiClient.get<DashboardSummary>("/api/Scholar/summary");
  return res.data;
}
