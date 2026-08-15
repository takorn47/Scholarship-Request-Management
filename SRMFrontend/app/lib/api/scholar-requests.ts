import { apiClient } from "./client";

export interface ScholarRequestListItem {
  requestId: number;
  studentId: string;
  studentName: string;
  studentLname: string;
  gradeLevel: number;
  gpax: number;
  studentEmail: string;
  scholarshipTypeId: number;
  bankAccountNumber: string;
  requestReason: string;
  facId: string;
  deptName: string;
  pdpaConsentVersion: number;
  requestDate: string;
  isDelete: boolean;
  studentTitleId: number;
  requestedAmount: number;
  scholarshipStatusId: number;
}

export interface PagedScholarRequests {
  items: ScholarRequestListItem[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface GetScholarRequestsParams {
  pageIndex: number;
  pageSize: number;
  searchTerm?: string;
  sortBy?: string;
  isDescending?: boolean;
  statusId?: number;
  scholarshipTypeId?: number;
}

export async function getScholarRequests(
  params: GetScholarRequestsParams,
): Promise<PagedScholarRequests> {
  const res = await apiClient.get<PagedScholarRequests>(
    "/api/Scholar/requests",
    {
      params: {
        PageIndex: params.pageIndex,
        PageSize: params.pageSize,
        SearchTerm: params.searchTerm ?? "",
        SortBy: params.sortBy ?? "",
        IsDescending: params.isDescending ?? true,
        StatusId: params.statusId,
        ScholarshipTypeId: params.scholarshipTypeId,
      },
    },
  );
  return res.data;
}

export interface ScholarRequestPayload {
  StudentId: string;
  StudentTitleId: number;
  StudentName: string;
  StudentLname: string;
  GradeLevel: number;
  Gpax: number;
  StudentEmail: string;
  ScholarshipTypeId: number;
  RequestedAmount: number;
  BankAccountNumber: string;
  RequestReason: string;
  FacId: string;
  DeptName: string;
  PdpaConsentVersion: number;
}

export interface ScholarRequestUpdatePayload extends ScholarRequestPayload {
  ScholarshipStatusId: number;
}

export async function createScholarRequest(
  payload: ScholarRequestPayload,
): Promise<void> {
  await apiClient.post("/api/scholar/request", payload);
}

export async function updateScholarRequest(
  id: number,
  payload: ScholarRequestUpdatePayload,
): Promise<void> {
  await apiClient.put(`/api/scholar/request/${id}`, payload);
}

export async function deleteScholarRequest(id: number): Promise<void> {
  await apiClient.delete(`/api/scholar/request/${id}`);
}

export interface ScholarRequestStatusPayload {
  statusId: number;
  remake: string;
}

export async function updateScholarRequestStatus(
  id: number,
  payload: ScholarRequestStatusPayload,
): Promise<void> {
  await apiClient.post(`/api/Scholar/request/${id}/status`, payload);
}
