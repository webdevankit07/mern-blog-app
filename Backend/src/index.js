import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./db/connectDB.js";
import customError, { ApiError } from "./utils/customErrorHandler.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.middleware.js";

// error handling for unhandled routes....
app.all("*", (req, res, next) => {
    ApiError(next, true, 404, `can't find ${req.originalUrl} on the server`);
});

// global error handler middleware...
app.use(globalErrorHandler);

(async () => {
    try {
        await connectDB();

        // server running...
        app.listen(process.env.PORT || 8000, () => {
            console.log(` Server running on PORT ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(`Something error happened while connecting to server: \n ${error}`);
    }
})();
