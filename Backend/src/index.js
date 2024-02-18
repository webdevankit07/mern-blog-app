import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import connectDB from './db/connectDB.js';
import customError from './utils/customErrorHandler.js';
import globalErrorHandler from './middlewares/globalErrorHandler.middleware.js';

// error handling for unhandled routes....
app.all('*', (req, res, next) => {
    return next(new customError(404, `can't find ${req.originalUrl} on the server`));
});

// global error handler middleware...
app.use(globalErrorHandler);

(async () => {
    try {
        await connectDB();

        // server running...
        app.listen(process.env.PORT || 8000, () => {
            console.log(` Server running on PORT ${process.env.PORT || 8000}`);
        });
    } catch (error) {
        console.log(`Something error happened while connecting to server: \n ${error}`);
    }
})();
