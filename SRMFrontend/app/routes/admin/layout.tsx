import { Link, Outlet, redirect, useLoaderData, useNavigate } from "react-router";
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";

import { getMe, logout as logoutApi, type MeResponse } from "../../lib/api/auth";
import { useAuthStore } from "../../lib/stores/auth-store";

const DRAWER_WIDTH = 240;

export async function clientLoader(): Promise<MeResponse> {
  try {
    const me = await getMe();
    useAuthStore.getState().setUser(me);
    return me;
  } catch {
    useAuthStore.getState().logout();
    throw redirect("/admin/login");
  }
}

export default function AdminLayout() {
  const me = useLoaderData<typeof clientLoader>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // fall through - still clear local state and navigate away
    }
    useAuthStore.getState().logout();
    navigate("/admin/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            ระบบบริหารจัดการคำขอทุนการศึกษา
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography variant="body2">
              {me.firstName} {me.lastName}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout} title="ออกจากระบบ">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItemButton component={Link} to="/admin/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="แดชบอร์ด" />
          </ListItemButton>
          <ListItemButton component={Link} to="/admin">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="รายการคำขอ" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
