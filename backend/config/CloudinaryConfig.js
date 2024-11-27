const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Add to .env
  api_key: process.env.CLOUDINARY_API_KEY,      // Add to .env
  api_secret: process.env.CLOUDINARY_API_SECRET // Add to .env
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "employees", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png"], // Restrict file types
  },
});

module.exports = { cloudinary, storage };
