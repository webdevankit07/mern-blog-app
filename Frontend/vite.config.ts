import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': {
                // target: 'https://webdev-ankit-mern-blog-api.vercel.app',
                target: 'http://localhost:8000',
                secure: false,
            },
        },
    },
    plugins: [react()],
});
