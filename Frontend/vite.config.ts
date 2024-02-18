import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            '/api': {
<<<<<<< HEAD
                // target: 'https://webdevankit-blog-app.vercel.app',
                target: 'http://localhost:8000',
=======
                target: 'https://webdevankit-blog-app.vercel.app',
>>>>>>> f2710479c31ac31382969410b8cf2e9dab0145bc
                secure: false,
            },
        },
    },
    plugins: [react()],
});
