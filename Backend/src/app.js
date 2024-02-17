import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import path from 'path';
// import { fileURLToPath } from 'url';
import { authRoutes } from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';
import { postRoutes } from './routes/post.routes.js';
import { commentRoutes } from './routes/comment.routes.js';
import globalErrorHandler from './middlewares/globalErrorHandler.middleware.js';
import customError from './utils/customErrorHandler.js';

const app = express();

const corsConfig = {
    origin: 'https://webdev-ankit-blog-app.vercel.app/',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
};
app.use(cors());
app.options('', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, '../../Frontend/dist')));

// Routes declaration...
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/comment', commentRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to mern blog api');
});

// error handling for unhandled routes....
app.all('*', (req, _, next) => {
    return next(new customError(404, `can't find ${req.originalUrl} on the server`));
});

// global error handler middleware...
app.use(globalErrorHandler);

export default app;
