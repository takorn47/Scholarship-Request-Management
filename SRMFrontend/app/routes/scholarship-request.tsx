import { Link } from "react-router";
import {
  AppBar,
  Box,
  Button,
  Container,
  Paper,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIcon from "@mui/icons-material/Assignment";

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
  const theme = useTheme();

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
          py: 6,
          px: 2,
          background: `linear-gradient(180deg, ${theme.palette.primary.main}14 0%, ${theme.palette.background.default} 45%)`,
        }}
      >
        <Container maxWidth="sm">
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            กลับหน้าหลัก
          </Button>

          <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3 }}>
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
                mb: 3,
              }}
            >
              <AssignmentIcon sx={{ fontSize: 32 }} />
            </Box>

            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              ยื่นคำขอทุนการศึกษา
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              หน้านี้เปิดให้นักศึกษายื่นคำขอทุนได้โดยไม่ต้องเข้าสู่ระบบ
              กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง
            </Typography>
            <ScholarshipRequestForm />
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
