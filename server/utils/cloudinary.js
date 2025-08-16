// import { v2 as cloudinary } from 'cloudinary';
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config({});

cloudinary.config({
    cloud_name: process.env.Cloudinary_CLOUD_NAME,
    api_key: process.env.Cloudinary_API_KEY,
    api_secret: process.env.Cloudinary_API_SECRET,
});
 const uploadMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {       //uploadMedia function me file argument actually file ka path hota hai, jo multer ne diya.
            resource_type: "auto"// Automatically detect the resource type (image, video, etc.)
        });
        return uploadResponse;
    } catch (error) {
        console.log(error);
         return null; // Return null in case of error
    }
};

 const deleteMediafromcloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId)
    }
    catch (error) {
        console.log(error);
    };

}

 const deletevideofromcloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { uploadMedia, deleteMediafromcloudinary, deletevideofromcloudinary };