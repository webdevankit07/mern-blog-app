import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRoutes } from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';

const app = express();

app.use(
    cors({
        origin: process.env.CORS_OROGIN,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../../Client/dist')));

// Routes declaration...
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

export default app;
