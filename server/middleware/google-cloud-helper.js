const gcsHelpers = require('../helpers/google-cloud-storage')
// The ID of your GCS bucket
const bucketName = 'fitocity_images';
// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

const GOOGLE_CLOUD_PROJECT_ID = 'durable-isotope-364314 '; // Replace with your project ID

const GOOGLE_CLOUD_KEYFILE = './durable-isotope-364314-2aaf1b9ae228.json'; // Replace with the path to the downloaded private key

const storage = new Storage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: GOOGLE_CLOUD_KEYFILE,
});

exports.sendUploadToGCS = async (req, res, next) => {
      if (!req.file) {
    return next();
  }
  const bucket = await storage.bucket(bucketName);  
  const gcsFileName = `${Date.now()}-${req.file.originalname}`;
  const file = bucket.file(gcsFileName);
  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype,
    },
  });

  stream.on('error', (err) => {  
    req.file.cloudStorageError = err;
    next(err);
  });
  
  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsFileName;
    return file.makePublic()
      .then(() => {
        req.file.gcsUrl = gcsHelpers.getPublicUrl(bucketName, gcsFileName);
        next();
      });
  });
  stream.end(req.file.buffer);
}

