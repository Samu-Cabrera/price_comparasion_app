import { defineConfig } from 'vite';

// Vite configuration
export default defineConfig({
  // Development server settings (optional, can be extended later)
  server: {
    host: '0.0.0.0'
  },
  // Preview server settings (used by `vite preview` in production on Railway)
  preview: {
    host: '0.0.0.0',
    port: 4173, // default; overridden by CLI --port if provided
    allowedHosts: ['pricecomparasionapp-production.up.railway.app']
  }
}); 