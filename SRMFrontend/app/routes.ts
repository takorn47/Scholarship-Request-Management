import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("scholarship-request", "routes/scholarship-request.tsx"),
  route("admin/login", "routes/admin-login.tsx"),
  route("admin", "routes/admin/layout.tsx", [
    index("routes/admin/requests.tsx"),
    route("dashboard", "routes/admin/dashboard.tsx"),
  ]),
] satisfies RouteConfig;
