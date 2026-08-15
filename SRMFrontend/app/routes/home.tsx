import { Link } from "react-router";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

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
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          py: 6,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          ระบบบริหารจัดการคำขอทุนการศึกษา
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Scholarship Request Management System
        </Typography>

        <Stack spacing={2} sx={{ width: "100%", maxWidth: 320 }}>
          <Button
            component={Link}
            to="/scholarship-request"
            variant="contained"
            size="large"
          >
            ยื่นคำขอทุนการศึกษา
          </Button>
          <Button
            component={Link}
            to="/admin/login"
            variant="outlined"
            size="large"
          >
            เจ้าหน้าที่เข้าสู่ระบบ
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
