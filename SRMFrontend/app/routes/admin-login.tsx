import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";

import type { Route } from "./+types/admin-login";
import { getMe, login } from "../lib/api/auth";
import { useAuthStore } from "../lib/stores/auth-store";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "เข้าสู่ระบบเจ้าหน้าที่" },
    { name: "description", content: "หน้าเข้าสู่ระบบสำหรับเจ้าหน้าที่ทุนการศึกษา" },
  ];
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(username, password);
      const me = await getMe();
      useAuthStore.getState().setUser(me);
      navigate("/admin");
    } catch {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: "กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 6 }}>
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
          เข้าสู่ระบบเจ้าหน้าที่
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          สำหรับเจ้าหน้าที่ผู้ดูแลระบบบริหารจัดการคำขอทุนการศึกษา
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>
            <TextField
              label="ชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label="รหัสผ่าน"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
            >
              เข้าสู่ระบบ
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
