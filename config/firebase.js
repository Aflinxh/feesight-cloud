const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Inisialisasi Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Dapatkan akses ke Firestore
const firestore = admin.firestore();

// Ekspor objek firestore
module.exports = { firestore };
