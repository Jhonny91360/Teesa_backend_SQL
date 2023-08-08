const cloudinary = require('cloudinary').v2;
const { CLOUDY_API_SECRET, CLOUDY_API_KEY, CLOUD_NAME} = process.env;

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUDY_API_KEY,
    api_secret: CLOUDY_API_SECRET
  });
  module.exports=cloudinary