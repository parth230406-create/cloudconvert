// S3 Service - kept for future use
// Not actively used on Render free tier
class S3Service {
  async uploadFile(filePath, key) {
    throw new Error('S3 not configured on free tier');
  }

  async getSignedDownloadUrl(key, expiresIn = 3600) {
    throw new Error('S3 not configured on free tier');
  }

  async deleteFile(key) {
    throw new Error('S3 not configured on free tier');
  }
}

module.exports = new S3Service();