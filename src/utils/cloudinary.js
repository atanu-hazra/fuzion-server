import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, resourceType = 'auto') => {
    try {
        if (!localFilePath) return null;
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: resourceType
        })
        // console.log("File has been uploaded successfully on cloudinary.", uploadResult.url);
        fs.unlinkSync(localFilePath)
        return uploadResult
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed.
        console.log("File upload Error on Cloudinary || ", error)
        return null
    }
}

const deleteFromCloudinary = async (cloudinaryUrl) => {

    if (!cloudinaryUrl.includes('cloudinary.com')) {
        console.log('Invalid Cloudinary URL.');
        return null;
    }

    const arr = cloudinaryUrl.split('/')
    const publicId = arr[arr.length - 1].split('.')[0];
    
    // console.log(publicId)
    
    if (!publicId) return null;
    
    try {
        const deleteResult = await cloudinary.uploader.destroy(publicId);
        console.log("File has been deleted successfully from Cloudinary.", deleteResult);
        return deleteResult;
    } catch (error) {
        console.log("Error deleting file from Cloudinary || ", error);
        return null;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary }