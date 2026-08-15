import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";

import {
  scholarshipRequestSchema,
  type ScholarshipRequestFormInput,
  type ScholarshipRequestFormValues,
} from "../lib/schemas/scholarship-request";
import {
  createScholarRequest,
  updateScholarRequest,
  type ScholarRequestListItem,
} from "../lib/api/scholar-requests";
import type {
  FacultyOption,
  PdpaConsentOption,
  ScholarshipStatusOption,
  ScholarshipTypeOption,
  TitleOption,
} from "../lib/api/lookups";

export interface AdminLookupData {
  titles: TitleOption[];
  faculties: FacultyOption[];
  scholarshipTypes: ScholarshipTypeOption[];
  statuses: ScholarshipStatusOption[];
  pdpaConsent: PdpaConsentOption | null;
}

interface AdminRequestFormDialogProps {
  open: boolean;
  mode: "add" | "edit";
  initialData?: ScholarRequestListItem;
  lookupData: AdminLookupData;
  onClose: () => void;
  onSaved: () => void;
}

function buildDefaultValues(
  mode: "add" | "edit",
  lookupData: AdminLookupData,
  initialData?: ScholarRequestListItem,
): ScholarshipRequestFormInput {
  if (mode === "edit" && initialData) {
    return {
      studentId: initialData.studentId,
      studentTitleId: initialData.studentTitleId,
      studentName: initialData.studentName,
      studentLname: initialData.studentLname,
      gradeLevel: initialData.gradeLevel,
      gpax: initialData.gpax,
      studentEmail: initialData.studentEmail,
      scholarshipTypeId: initialData.scholarshipTypeId,
      requestedAmount: initialData.requestedAmount,
      bankAccountNumber: initialData.bankAccountNumber,
      requestReason: initialData.requestReason,
      facId: initialData.facId,
      deptName: initialData.deptName,
      pdpaConsentVersion: initialData.pdpaConsentVersion,
    };
  }

  return {
    studentId: "",
    studentTitleId: "" as unknown as number,
    studentName: "",
    studentLname: "",
    gradeLevel: "" as unknown as number,
    gpax: "" as unknown as number,
    studentEmail: "",
    scholarshipTypeId: "" as unknown as number,
    requestedAmount: "" as unknown as number,
    bankAccountNumber: "",
    requestReason: "",
    facId: "",
    deptName: "",
    pdpaConsentVersion:
      lookupData.pdpaConsent?.versionId ?? ("" as unknown as number),
  };
}

export function AdminRequestFormDialog({
  open,
  mode,
  initialData,
  lookupData,
  onClose,
  onSaved,
}: AdminRequestFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<
    ScholarshipRequestFormInput,
    unknown,
    ScholarshipRequestFormValues
  >({
    resolver: zodResolver(scholarshipRequestSchema),
    defaultValues: buildDefaultValues(mode, lookupData, initialData),
  });

  useEffect(() => {
    if (open) {
      reset(buildDefaultValues(mode, lookupData, initialData));
    }
  }, [open, mode, initialData, lookupData, reset]);

  const onSubmit = async (data: ScholarshipRequestFormValues) => {
    const payload = {
      StudentId: data.studentId,
      StudentTitleId: data.studentTitleId,
      StudentName: data.studentName,
      StudentLname: data.studentLname,
      GradeLevel: data.gradeLevel,
      Gpax: data.gpax,
      StudentEmail: data.studentEmail,
      ScholarshipTypeId: data.scholarshipTypeId,
      RequestedAmount: data.requestedAmount,
      BankAccountNumber: data.bankAccountNumber,
      RequestReason: data.requestReason,
      FacId: data.facId,
      DeptName: data.deptName,
      PdpaConsentVersion: data.pdpaConsentVersion,
    };

    try {
      if (mode === "add") {
        await createScholarRequest(payload);
      } else {
        await updateScholarRequest(initialData!.requestId, {
          ...payload,
          ScholarshipStatusId: initialData!.scholarshipStatusId,
        });
      }
      Swal.fire({
        icon: "success",
        title: mode === "add" ? "เพิ่มคำขอเรียบร้อยแล้ว" : "บันทึกการแก้ไขเรียบร้อยแล้ว",
      });
      onSaved();
      onClose();
    } catch {
      Swal.fire({
        icon: "error",
        title: "บันทึกไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === "add" ? "เพิ่มคำขอทุนการศึกษา" : "แก้ไขคำขอทุนการศึกษา"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="studentId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="รหัสนักศึกษา"
                    error={!!errors.studentId}
                    helperText={errors.studentId?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="studentTitleId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="คำนำหน้าชื่อ"
                    error={!!errors.studentTitleId}
                    helperText={errors.studentTitleId?.message}
                    fullWidth
                  >
                    {lookupData.titles.map((title) => (
                      <MenuItem key={title.id} value={title.id}>
                        {title.titlename1}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="studentName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ชื่อ"
                    error={!!errors.studentName}
                    helperText={errors.studentName?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="studentLname"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="นามสกุล"
                    error={!!errors.studentLname}
                    helperText={errors.studentLname?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="facId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="คณะ"
                    error={!!errors.facId}
                    helperText={errors.facId?.message}
                    fullWidth
                  >
                    {lookupData.faculties.map((faculty) => (
                      <MenuItem key={faculty.facId} value={faculty.facId}>
                        {faculty.facNameTh}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="deptName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="สาขา"
                    error={!!errors.deptName}
                    helperText={errors.deptName?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="gradeLevel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ชั้นปี"
                    type="number"
                    error={!!errors.gradeLevel}
                    helperText={errors.gradeLevel?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="gpax"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="เกรดเฉลี่ย (GPAX)"
                    type="number"
                    slotProps={{ htmlInput: { step: "0.01" } }}
                    error={!!errors.gpax}
                    helperText={errors.gpax?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="studentEmail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="อีเมล"
                    type="email"
                    error={!!errors.studentEmail}
                    helperText={errors.studentEmail?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="scholarshipTypeId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="ประเภททุน"
                    error={!!errors.scholarshipTypeId}
                    helperText={errors.scholarshipTypeId?.message}
                    fullWidth
                  >
                    {lookupData.scholarshipTypes.map((type) => (
                      <MenuItem key={type.sholarshipId} value={type.sholarshipId}>
                        {type.sholarshipName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="requestedAmount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="จำนวนเงินที่ขอ"
                    type="number"
                    error={!!errors.requestedAmount}
                    helperText={errors.requestedAmount?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="bankAccountNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="เลขที่บัญชีธนาคาร"
                    error={!!errors.bankAccountNumber}
                    helperText={errors.bankAccountNumber?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="requestReason"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="เหตุผลการขอทุน"
                    multiline
                    minRows={3}
                    error={!!errors.requestReason}
                    helperText={errors.requestReason?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            บันทึก
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
