import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

const env = loadEnv(process.cwd(), '');

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: `${env.VITE_API_BASE_PROXY_URL}`,
                changeOrigin: true,
            },
        },
    },
    plugins: [react()],
});
