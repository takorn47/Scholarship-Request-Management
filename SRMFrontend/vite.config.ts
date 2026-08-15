import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

const useSsl = process.env.VITE_SSL === "true";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), ...(useSsl ? [basicSsl()] : [])],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    https: useSsl ? {} : undefined,
  },
});
