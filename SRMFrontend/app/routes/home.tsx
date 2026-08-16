import { Link } from "react-router";
import {
  AppBar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ระบบบริหารจัดการคำขอทุนการศึกษา" },
    {
      name: "description",
      content: "ระบบบริหารจัดการคำขอทุนการศึกษาสำหรับนักศึกษาและเจ้าหน้าที่",
    },
  ];
}

export default function Home() {
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
          px: 2,
          background: `linear-gradient(180deg, ${theme.palette.primary.main}14 0%, ${theme.palette.background.default} 45%)`,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
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
              <SchoolIcon sx={{ fontSize: 36 }} />
            </Box>

            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              ระบบบริหารจัดการคำขอทุนการศึกษา
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Scholarship Request Management System
            </Typography>

            <Stack spacing={2} sx={{ width: "100%", maxWidth: 320, mx: "auto" }}>
              <Button
                component={Link}
                to="/scholarship-request"
                variant="contained"
                size="large"
                startIcon={<SchoolIcon />}
                sx={{ borderRadius: 2, py: 1.25 }}
              >
                ยื่นคำขอทุนการศึกษา
              </Button>
              <Button
                component={Link}
                to="/admin/login"
                variant="outlined"
                size="large"
                startIcon={<AdminPanelSettingsIcon />}
                sx={{ borderRadius: 2, py: 1.25 }}
              >
                เจ้าหน้าที่เข้าสู่ระบบ
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
