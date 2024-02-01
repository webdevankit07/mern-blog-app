import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log("localfilepath: ", localFilePath);
        if (!localFilePath) return null;

        // Upload the file on Cloudinary......
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            timeout: 5000,
        });

        // File has been successfully uploaded.....
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log(error);
        return null;
    }
};

export default uploadOnCloudinary;
