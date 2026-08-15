import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import SyncIcon from "@mui/icons-material/Sync"
import Swal from "sweetalert2";

import type { Route } from "./+types/requests";
import {
  getFaculties,
  getPdpaConsents,
  getScholarshipStatuses,
  getScholarshipTypes,
  getTitles,
} from "../../lib/api/lookups";
import {
  deleteScholarRequest,
  getScholarRequests,
  type ScholarRequestListItem,
} from "../../lib/api/scholar-requests";
import {
  AdminRequestFormDialog,
  type AdminLookupData,
} from "../../components/AdminRequestFormDialog";
import { StatusUpdateDialog } from "../../components/StatusUpdateDialog";

export function meta({ }: Route.MetaArgs) {
  return [{ title: "คำขอทุนการศึกษา - ระบบผู้ดูแล" }];
}

export default function AdminRequests() {
  const [lookupData, setLookupData] = useState<AdminLookupData | null>(null);
  const [rows, setRows] = useState<ScholarRequestListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "">("");
  const [scholarshipTypeFilter, setScholarshipTypeFilter] = useState<
    number | ""
  >("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editingRequest, setEditingRequest] = useState<
    ScholarRequestListItem | undefined
  >(undefined);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusTargetRequest, setStatusTargetRequest] =
    useState<ScholarRequestListItem | null>(null);

  useEffect(() => {
    async function loadLookups() {
      const [titles, faculties, scholarshipTypes, statuses, pdpaConsents] =
        await Promise.all([
          getTitles(),
          getFaculties(),
          getScholarshipTypes(),
          getScholarshipStatuses(),
          getPdpaConsents(),
        ]);
      setLookupData({
        titles,
        faculties,
        scholarshipTypes,
        statuses,
        pdpaConsent: pdpaConsents[0] ?? null,
      });
    }
    loadLookups();
  }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getScholarRequests({
        pageIndex: pageIndex + 1,
        pageSize,
        searchTerm,
        isDescending: true,
        statusId: statusFilter === "" ? undefined : statusFilter,
        scholarshipTypeId:
          scholarshipTypeFilter === "" ? undefined : scholarshipTypeFilter,
      });
      setRows(data.items);
      setTotalCount(data.totalCount);
    } catch {
      Swal.fire({
        icon: "error",
        title: "โหลดข้อมูลไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setLoading(false);
    }
  }, [pageIndex, pageSize, searchTerm, statusFilter, scholarshipTypeFilter]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleSearch = () => {
    setPageIndex(0);
    setSearchTerm(searchInput);
  };

  const handleStatusFilterChange = (value: number | "") => {
    setPageIndex(0);
    setStatusFilter(value);
  };

  const handleScholarshipTypeFilterChange = (value: number | "") => {
    setPageIndex(0);
    setScholarshipTypeFilter(value);
  };

  const handleAdd = () => {
    setDialogMode("add");
    setEditingRequest(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (row: ScholarRequestListItem) => {
    setDialogMode("edit");
    setEditingRequest(row);
    setDialogOpen(true);
  };

  const handleChangeStatus = (row: ScholarRequestListItem) => {
    setStatusTargetRequest(row);
    setStatusDialogOpen(true);
  };

  const handleDelete = async (row: ScholarRequestListItem) => {
    if (getStatus(row.scholarshipStatusId)?.statusName !== "รอพิจารณา") {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถลบได้",
        text: "ลบได้เฉพาะคำขอที่อยู่ในสถานะรอพิจารณาเท่านั้น",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "ยืนยันการลบคำขอ?",
      text: `${row.studentName} ${row.studentLname}`,
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteScholarRequest(row.requestId);
      Swal.fire({ icon: "success", title: "ลบคำขอเรียบร้อยแล้ว" });
      fetchList();
    } catch {
      Swal.fire({
        icon: "error",
        title: "ลบไม่สำเร็จ",
        text: "กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  if (!lookupData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const getScholarshipTypeName = (id: number) =>
    lookupData.scholarshipTypes.find((t) => t.sholarshipId === id)
      ?.sholarshipName ?? "-";

  const getTitleName = (id: number) =>
    lookupData.titles.find((t) => t.id === id)?.titlename1 ?? "";

  const getFacultyName = (facId: string) =>
    lookupData.faculties.find((f) => f.facId === facId)?.facNameTh ?? "";

  const getStatus = (id: number) =>
    lookupData.statuses.find((s) => s.statusId === id);

  const statusColor = (
    statusId: number,
  ): "warning" | "success" | "error" | "default" => {
    const name = getStatus(statusId)?.statusName;
    if (name === "อนุมัติ") return "success";
    if (name === "ไม่อนุมัติ") return "error";
    if (name === "รอพิจารณา") return "warning";
    return "default";
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" component="h1">
          คำขอทุนการศึกษา
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          เพิ่มคำขอ
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="ค้นหา..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <Button variant="outlined" startIcon={<SearchIcon />} onClick={handleSearch}>
          ค้นหา
        </Button>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="status-filter-label">สถานะ</InputLabel>
          <Select
            labelId="status-filter-label"
            label="สถานะ"
            value={statusFilter}
            onChange={(e: SelectChangeEvent<number | "">) =>
              handleStatusFilterChange(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            {lookupData.statuses.map((status) => (
              <MenuItem key={status.statusId} value={status.statusId}>
                {status.statusName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="scholarship-type-filter-label">ประเภททุน</InputLabel>
          <Select
            labelId="scholarship-type-filter-label"
            label="ประเภททุน"
            value={scholarshipTypeFilter}
            onChange={(e: SelectChangeEvent<number | "">) =>
              handleScholarshipTypeFilterChange(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            {lookupData.scholarshipTypes.map((type) => (
              <MenuItem key={type.sholarshipId} value={type.sholarshipId}>
                {type.sholarshipName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>เลขที่คำขอ</TableCell>
              <TableCell>ชื่อ-นามสกุล</TableCell>
              <TableCell>รหัสนักศึกษา</TableCell>
              <TableCell>คณะ</TableCell>
              <TableCell>ประเภททุน</TableCell>
              <TableCell align="right">จำนวนเงิน</TableCell>
              <TableCell>สถานะ</TableCell>
              <TableCell>วันที่ยื่น</TableCell>
              <TableCell align="right">การจัดการ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const isPending =
                  getStatus(row.scholarshipStatusId)?.statusName === "รอพิจารณา";
                return (
                  <TableRow key={row.requestId}>
                    <TableCell>
                      {row.requestId}
                    </TableCell>
                    <TableCell>
                      {getTitleName(row.studentTitleId)}{row.studentName}{" "}
                      {row.studentLname}
                    </TableCell>
                    <TableCell>
                      {row.studentId}
                    </TableCell>
                    <TableCell>
                      {getFacultyName(row.facId)} {row.deptName}
                    </TableCell>
                    <TableCell>
                      {getScholarshipTypeName(row.scholarshipTypeId)}
                    </TableCell>
                    <TableCell align="right">
                      {row.requestedAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={getStatus(row.scholarshipStatusId)?.statusName ?? "-"}
                        color={statusColor(row.scholarshipStatusId)}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(row.requestDate).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(row)} title="แก้ไข">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleChangeStatus(row)}
                        title="เปลี่ยนสถานะ"
                      >
                        <SyncIcon fontSize="small" />
                      </IconButton>

                      {isPending &&
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(row)}
                          disabled={!isPending}
                          title="ลบ"
                          style={{ color: 'red' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalCount}
          page={pageIndex}
          onPageChange={(_, newPage) => setPageIndex(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPageIndex(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </TableContainer>

      <AdminRequestFormDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={editingRequest}
        lookupData={lookupData}
        onClose={() => setDialogOpen(false)}
        onSaved={fetchList}
      />

      <StatusUpdateDialog
        open={statusDialogOpen}
        requestId={statusTargetRequest?.requestId ?? null}
        currentStatusId={statusTargetRequest?.scholarshipStatusId ?? null}
        statuses={lookupData.statuses}
        onClose={() => setStatusDialogOpen(false)}
        onSaved={fetchList}
      />
    </Box >
  );
}
