import { apiClient } from "./client";

export interface TitleOption {
  id: number;
  titlename1: string;
}

export interface ScholarshipTypeOption {
  sholarshipId: number;
  sholarshipName: string;
  isActive: boolean;
}

export interface FacultyOption {
  facId: string;
  facNameTh: string;
  campusId: string;
  isActive: boolean;
}

export interface PdpaConsentOption {
  versionId: number;
  pdpaText: string;
  createdDate: string;
}

export interface ScholarshipStatusOption {
  statusId: number;
  statusName: string;
  isActive: boolean;
}

export async function getTitles(): Promise<TitleOption[]> {
  const res = await apiClient.get<TitleOption[]>("/api/lookup/title");
  return res.data;
}

export async function getScholarshipTypes(): Promise<ScholarshipTypeOption[]> {
  const res = await apiClient.get<ScholarshipTypeOption[]>(
    "/api/lookup/scholarshipTypes",
  );
  return res.data.filter((type) => type.isActive);
}

export async function getFaculties(): Promise<FacultyOption[]> {
  const res = await apiClient.get<FacultyOption[]>("/api/lookup/faculty");
  return res.data.filter((faculty) => faculty.isActive);
}

export async function getPdpaConsents(): Promise<PdpaConsentOption[]> {
  const res = await apiClient.get<PdpaConsentOption[]>(
    "/api/lookup/pdpaConsents",
  );
  return [...res.data].sort(
    (a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime(),
  );
}

export async function getScholarshipStatuses(): Promise<
  ScholarshipStatusOption[]
> {
  const res = await apiClient.get<ScholarshipStatusOption[]>(
    "/api/Lookup/scholarshipStatus",
  );
  return res.data.filter((status) => status.isActive);
}
