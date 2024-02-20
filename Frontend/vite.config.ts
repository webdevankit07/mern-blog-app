import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': `${process.env.VITE_API_BASE_SERVER_URL}`,
        },
    },
    plugins: [react()],
});
