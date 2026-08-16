import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Swal from "sweetalert2";

import {
  scholarshipRequestSchema,
  type ScholarshipRequestFormInput,
  type ScholarshipRequestFormValues,
} from "../lib/schemas/scholarship-request";
import {
  getFaculties,
  getPdpaConsents,
  getScholarshipTypes,
  getTitles,
  type FacultyOption,
  type PdpaConsentOption,
  type ScholarshipTypeOption,
  type TitleOption,
} from "../lib/api/lookups";
import { apiClient } from "../lib/api/client";

const defaultValues: ScholarshipRequestFormInput = {
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
  pdpaConsentVersion: "" as unknown as number,
};

interface LookupData {
  titles: TitleOption[];
  scholarshipTypes: ScholarshipTypeOption[];
  faculties: FacultyOption[];
  pdpaConsent: PdpaConsentOption | null;
}

export function ScholarshipRequestForm() {
  const [lookupData, setLookupData] = useState<LookupData | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ScholarshipRequestFormInput, unknown, ScholarshipRequestFormValues>({
    resolver: zodResolver(scholarshipRequestSchema),
    defaultValues,
  });

  const pdpaConsentVersion = watch("pdpaConsentVersion");

  useEffect(() => {
    let cancelled = false;

    async function loadLookups() {
      setLookupLoading(true);
      setLookupError(null);
      try {
        const [titles, scholarshipTypes, faculties, pdpaConsents] =
          await Promise.all([
            getTitles(),
            getScholarshipTypes(),
            getFaculties(),
            getPdpaConsents(),
          ]);
        if (cancelled) return;
        setLookupData({
          titles,
          scholarshipTypes,
          faculties,
          pdpaConsent: pdpaConsents[0] ?? null,
        });
      } catch {
        if (cancelled) return;
        setLookupError(
          "ไม่สามารถโหลดข้อมูลตัวเลือกได้ กรุณาลองใหม่อีกครั้ง",
        );
      } finally {
        if (!cancelled) setLookupLoading(false);
      }
    }

    loadLookups();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (data: ScholarshipRequestFormValues) => {
    // Request is conceptually saved with status "รอพิจารณา" (Pending).
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
      await apiClient.post("/api/scholar/request", payload);
      reset(defaultValues);
      Swal.fire({
        icon: "success",
        title: "ส่งคำขอทุนเรียบร้อยแล้ว",
        text: "สถานะ: รอพิจารณา",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "ส่งคำขอไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  if (lookupLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {lookupError && (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {lookupError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
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
                {(lookupData?.titles ?? []).map((title) => (
                  <MenuItem key={title.id} value={title.id}>
                    {title.titlename1}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

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
                {(lookupData?.faculties ?? []).map((faculty) => (
                  <MenuItem key={faculty.facId} value={faculty.facId}>
                    {faculty.facNameTh}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

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
                {(lookupData?.scholarshipTypes ?? []).map((type) => (
                  <MenuItem key={type.sholarshipId} value={type.sholarshipId}>
                    {type.sholarshipName}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

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

          <Controller
            name="pdpaConsentVersion"
            control={control}
            render={({ field }) => (
              <div>
                {lookupData?.pdpaConsent && (
                  <Box
                    sx={{
                      maxHeight: 240,
                      overflowY: "auto",
                      mb: 1,
                      p: 1.5,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      typography: "body2",
                      color: "text.secondary",
                      "& h2, & h3": { fontSize: "1rem", mt: 1.5, mb: 0.5 },
                      "& p, & ul": { mb: 1 },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: lookupData.pdpaConsent.pdpaText,
                    }}
                  />
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!field.value}
                      disabled={!lookupData?.pdpaConsent}
                      onChange={(e) =>
                        field.onChange(
                          e.target.checked
                            ? lookupData?.pdpaConsent?.versionId
                            : "",
                        )
                      }
                    />
                  }
                  label="ข้าพเจ้ายินยอมให้เก็บรวบรวมและใช้ข้อมูลส่วนบุคคลของข้าพเจ้าเพื่อการพิจารณาคำขอทุนการศึกษานี้ ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)"
                />
                {errors.pdpaConsentVersion && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.pdpaConsentVersion.message}
                  </Alert>
                )}
              </div>
            )}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<SendIcon />}
            disabled={isSubmitting || !pdpaConsentVersion}
            sx={{ borderRadius: 2, py: 1.25 }}
          >
            ส่งคำขอ
          </Button>
        </Stack>
      </form>
    </>
  );
}
