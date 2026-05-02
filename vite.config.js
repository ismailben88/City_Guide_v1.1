import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // URL du backend actif (json-server ou Express)
  const apiTarget = env.VITE_API_URL ?? "http://localhost:3001";

  // Détermine si on cible le vrai backend (préfixe /api/v1)
  const isBackend = apiTarget.includes("/api/v1");

  return {
    plugins: [react()],

    server: {
      proxy: isBackend
        ? {
            // Proxy /api/v1/* → Express backend (évite CORS en dev)
            "/api/v1": {
              target: apiTarget.replace("/api/v1", ""),
              changeOrigin: true,
              secure: false,
            },
          }
        : {
            // Proxy /* → json-server
            "^/(users|cities|categories|places|events|guideProfiles|scores|comments|favorites|media|reports|notifications|pendingRequests|adminLogs|businesses)": {
              target: "http://localhost:3001",
              changeOrigin: true,
            },
          },
    },
  };
});
