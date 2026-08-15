import { Link } from "react-router";
import { Button, Container, Paper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import type { Route } from "./+types/scholarship-request";
import { ScholarshipRequestForm } from "../components/ScholarshipRequestForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ยื่นคำขอทุนการศึกษา" },
    {
      name: "description",
      content: "แบบฟอร์มยื่นคำขอทุนการศึกษาสำหรับนักศึกษา",
    },
  ];
}

export default function ScholarshipRequest() {
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        กลับหน้าหลัก
      </Button>

      <Paper elevation={2} sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h5" component="h1" gutterBottom>
          ยื่นคำขอทุนการศึกษา
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          หน้านี้เปิดให้นักศึกษายื่นคำขอทุนได้โดยไม่ต้องเข้าสู่ระบบ
          กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง
        </Typography>
        <ScholarshipRequestForm />
      </Paper>
    </Container>
  );
}
