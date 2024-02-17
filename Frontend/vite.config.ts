import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: `https://webdev-ankit-blog-api.up.railway.app`,
                // target: `http://localhost:8000`,
                secure: false,
            },
        },
    },
    plugins: [react()],
});
