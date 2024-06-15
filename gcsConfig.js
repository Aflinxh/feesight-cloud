const { Storage } = require('@google-cloud/storage');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');

// Inisialisasi klien storage dengan kredensial Anda
const storage = new Storage({
  keyFilename: './serviceaccount.json', // Sesuaikan path dengan file key Anda
  projectId: 'feesight-426316', // Ganti dengan project ID Anda
});

const bucketName = 'feesight'; // Ganti dengan nama bucket Anda

module.exports = {
  storage,
  bucketName,
};

// Fungsi untuk memuat model dari GCS
async function loadModelFromGCS(modelName) {
  const destFilename = `./models/${modelName}`;
  const options = {
    destination: destFilename,
  };

  try {
    await storage.bucket(bucketName).file(modelName).download(options);
    console.log(`${modelName} downloaded to ${destFilename}.`);

    const modelPath = path.join(__dirname, 'models', modelName);

    // Muat model menggunakan TensorFlow.js
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log('Model loaded successfully.');

    return model;
  } catch (err) {
    
    throw new Error(err);
  }
}

module.exports.loadModelFromGCS = loadModelFromGCS;
