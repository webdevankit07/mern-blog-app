import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.DATABASE_URL}/${DB_NAME}?retryWrites=true&w=majority`
        );
        console.log(`\n MongoDB Connected !! DB: ${process.env.DATABASE_URL}`);
        console.log(` MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`\n MongoDB Connection Failed !!! `, error);
        process.exit(1);
    }
};

export default connectDB;
