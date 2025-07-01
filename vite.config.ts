import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // base: '/react-redux-quiz-dent/',
  plugins: [react()],
  base: "/react-redux-quiz-dent/"
})
