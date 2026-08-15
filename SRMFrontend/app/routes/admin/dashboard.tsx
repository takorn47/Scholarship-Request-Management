import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Swal from "sweetalert2";

import type { Route } from "./+types/dashboard";
import {
  getDashboardSummary,
  type DashboardSummary,
} from "../../lib/api/dashboard";

export function meta({}: Route.MetaArgs) {
  return [{ title: "แดชบอร์ด - ระบบผู้ดูแล" }];
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Paper sx={{ p: 2, height: "100%" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </Paper>
  );
}

function ChartPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default function AdminDashboard() {
  const theme = useTheme();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      setLoading(true);
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch {
        Swal.fire({
          icon: "error",
          title: "โหลดข้อมูลไม่สำเร็จ",
          text: "กรุณาลองใหม่อีกครั้ง",
        });
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  if (loading || !summary) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const statusColor = (statusName: string) => {
    if (statusName === "อนุมัติ") return theme.palette.success.main;
    if (statusName === "ไม่อนุมัติ") return theme.palette.error.main;
    if (statusName === "รอพิจารณา") return theme.palette.warning.main;
    return theme.palette.grey[500];
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
        แดชบอร์ด
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatTile
            label="คำขอทั้งหมด"
            value={summary.totalRequests.toLocaleString() + ' รายการ'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatTile
            label="รอพิจารณา"
            value={(
              summary.byStatus.find((s) => s.statusName === "รอพิจารณา")
                ?.count ?? 0
            ).toLocaleString() + ' รายการ'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatTile
            label="ยอดเงินที่ขอทั้งหมด"
            value={summary.totalRequestedAmount.toLocaleString()+ ' บาท'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatTile
            label="ยอดเงินเฉลี่ยต่อคำขอ"
            value={summary.averageRequestedAmount.toLocaleString() + ' บาท'}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartPanel title="สัดส่วนตามสถานะ">
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={summary.byStatus}
                dataKey="count"
                nameKey="statusName"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {summary.byStatus.map((entry) => (
                  <Cell
                    key={entry.statusId}
                    fill={statusColor(entry.statusName)}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartPanel>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartPanel title="จำนวนคำขอตามประเภททุน">
            <BarChart data={summary.byScholarshipType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="sholarshipName"
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis tick={{ fill: theme.palette.text.secondary }} />
              <Tooltip />
              <Bar dataKey="count" fill={theme.palette.primary.main} />
            </BarChart>
          </ChartPanel>
        </Grid>

        <Grid size={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              สรุปจำนวนคำขอและยอดเงินรวมตามประเภททุน
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ประเภททุน</TableCell>
                    <TableCell align="right">จำนวนคำขอ</TableCell>
                    <TableCell align="right">ยอดเงินรวมที่ขอ (บาท)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {summary.byScholarshipType.map((row) => (
                    <TableRow key={row.sholarshipId}>
                      <TableCell>{row.sholarshipName}</TableCell>
                      <TableCell align="right">
                        {row.count.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {row.totalRequestedAmount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>รวม</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {summary.byScholarshipType
                        .reduce((sum, row) => sum + row.count, 0)
                        .toLocaleString()}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      {summary.byScholarshipType
                        .reduce((sum, row) => sum + row.totalRequestedAmount, 0)
                        .toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid size={12}>
          <ChartPanel title="จำนวนคำขอรายเดือน">
            <BarChart data={summary.byMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis tick={{ fill: theme.palette.text.secondary }} />
              <Tooltip />
              <Bar dataKey="count" fill={theme.palette.primary.main} />
            </BarChart>
          </ChartPanel>
        </Grid>
      </Grid>
    </Box>
  );
}
