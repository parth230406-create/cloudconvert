// AWS S3 configuration - kept for future use
// Not actively used on Render free tier
const s3Client = null;
const bucketName = process.env.S3_BUCKET_NAME || 'cloudconvert-files';

module.exports = {
  s3Client,
  bucketName
};