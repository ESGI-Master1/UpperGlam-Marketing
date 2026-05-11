import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  preview: {
    allowedHosts: ['upperglam.fr', 'www.upperglam.fr'],
  },
  test: {
    environment: 'jsdom',
    clearMocks: true,
    restoreMocks: true,
  },
})
