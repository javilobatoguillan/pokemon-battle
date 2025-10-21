import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './'  // 🔹 hace que los assets se carguen correctamente en Firebase Hosting
})
