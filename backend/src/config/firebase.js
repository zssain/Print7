const admin = require('firebase-admin');
const config = require('./index');

let db = null;
let auth = null;
let firebaseInitialized = false;

try {
  if (
    config.firebase.projectId &&
    config.firebase.privateKey &&
    config.firebase.clientEmail
  ) {
    const serviceAccount = {
      projectId: config.firebase.projectId,
      privateKey: config.firebase.privateKey.replace(/\\n/g, '\n'),
      clientEmail: config.firebase.clientEmail,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: config.firebase.databaseUrl,
    });

    db = admin.firestore();
    auth = admin.auth();
    firebaseInitialized = true;

    console.log('Firebase Admin SDK initialized successfully');
  } else {
    console.warn('Firebase credentials not fully configured. Using mock database.');
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error.message);
  console.warn('Using mock in-memory database as fallback.');
}

module.exports = {
  db,
  auth,
  admin,
  isFirebaseInitialized: firebaseInitialized,
};
