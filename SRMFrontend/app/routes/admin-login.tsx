import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  AppBar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LoginIcon from "@mui/icons-material/Login";
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
  const theme = useTheme();
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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            ระบบบริหารจัดการคำขอทุนการศึกษา
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          px: 2,
          background: `linear-gradient(180deg, ${theme.palette.primary.main}14 0%, ${theme.palette.background.default} 45%)`,
        }}
      >
        <Container maxWidth="xs">
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            กลับหน้าหลัก
          </Button>

          <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, textAlign: "center" }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />
            </Box>

            <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              เข้าสู่ระบบเจ้าหน้าที่
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
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
                  startIcon={<LoginIcon />}
                  disabled={submitting}
                  sx={{ borderRadius: 2, py: 1.25 }}
                >
                  เข้าสู่ระบบ
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
