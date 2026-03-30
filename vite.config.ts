import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // your dev server port
    proxy: {
      // proxy API calls starting with /api to the Django backend
      '/api': {
        target: 'http://localhost:8000', // Django backend URL
        changeOrigin: true,
        secure: false,
      },
      // if you have media or static files
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/static': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});