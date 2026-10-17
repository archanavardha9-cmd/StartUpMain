
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const adminDirectory = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  server: {
    port: 5174,
    strictPort: true,
  },

  publicDir: path.resolve(adminDirectory, '../client/public'),

  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: path.resolve(adminDirectory, 'node_modules/react'),
      'react-dom': path.resolve(adminDirectory, 'node_modules/react-dom'),
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
})
