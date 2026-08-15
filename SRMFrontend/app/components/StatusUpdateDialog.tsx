import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import Swal from "sweetalert2";

import {
  statusUpdateSchema,
  type StatusUpdateFormInput,
  type StatusUpdateFormValues,
} from "../lib/schemas/status-update";
import { updateScholarRequestStatus } from "../lib/api/scholar-requests";
import type { ScholarshipStatusOption } from "../lib/api/lookups";

interface StatusUpdateDialogProps {
  open: boolean;
  requestId: number | null;
  currentStatusId: number | null;
  statuses: ScholarshipStatusOption[];
  onClose: () => void;
  onSaved: () => void;
}

export function StatusUpdateDialog({
  open,
  requestId,
  currentStatusId,
  statuses,
  onClose,
  onSaved,
}: StatusUpdateDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StatusUpdateFormInput, unknown, StatusUpdateFormValues>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: {
      statusId: currentStatusId ?? ("" as unknown as number),
      remake: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        statusId: currentStatusId ?? ("" as unknown as number),
        remake: "",
      });
    }
  }, [open, currentStatusId, reset]);

  const onSubmit = async (data: StatusUpdateFormValues) => {
    if (requestId === null) return;
    try {
      await updateScholarRequestStatus(requestId, {
        statusId: data.statusId,
        remake: data.remake ?? "",
      });
      Swal.fire({ icon: "success", title: "อัปเดตสถานะเรียบร้อยแล้ว" });
      onSaved();
      onClose();
    } catch {
      Swal.fire({
        icon: "error",
        title: "อัปเดตสถานะไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>เปลี่ยนสถานะคำขอ</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            <Controller
              name="statusId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="สถานะ"
                  error={!!errors.statusId}
                  helperText={errors.statusId?.message}
                  fullWidth
                >
                  {statuses.map((status) => (
                    <MenuItem key={status.statusId} value={status.statusId}>
                      {status.statusName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="remake"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="เหตุผล"
                  multiline
                  minRows={3}
                  error={!!errors.remake}
                  helperText={errors.remake?.message}
                  fullWidth
                />
              )}
            />
          </Stack>
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
