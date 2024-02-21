import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

const env = loadEnv(process.cwd(), '');

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': `${env.VITE_API_BASE_PROXY_URL}`,
        },
    },
    plugins: [react()],
});
