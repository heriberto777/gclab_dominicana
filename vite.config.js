import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 👈 permite conexiones externas (necesario para ngrok)
    port: 5173, // 👈 puerto de desarrollo
    strictPort: true, // opcional: evita que cambie el puerto automáticamente
  },
});
