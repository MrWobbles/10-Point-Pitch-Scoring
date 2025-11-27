// Firebase configuration
// To enable live spectator mode:
// 1. Create a Firebase project at https://console.firebase.google.com
// 2. Enable Realtime Database
// 3. Set database rules to:
//    {
//      "rules": {
//        "games": {
//          "$code": {
//            ".read": true,
//            ".write": "!data.exists() || data.child('hostId').val() === auth.uid || auth === null"
//          }
//        }
//      }
//    }
// 4. Replace the config below with your Firebase project keys

const firebaseConfig = {
  apiKey: "AIzaSyC4vvfNoU7_52ex--iWWGfffkiSprwUaTk",
  authDomain: "pitch-score-2977d.firebaseapp.com",
  databaseURL: "https://pitch-score-2977d-default-rtdb.firebaseio.com",
  projectId: "pitch-score-2977d",
  storageBucket: "pitch-score-2977d.firebasestorage.app",
  messagingSenderId: "335260902046",
  appId: "1:335260902046:web:25dd440c314f6360a3d18f",
  measurementId: "G-V9GRFDSEZD"
};

// Initialize Firebase only if configured
let database = null;
let isSpectatorModeAvailable = false;

if (typeof firebase !== 'undefined' && isFirebaseConfigured()) {
  try {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    isSpectatorModeAvailable = true;
    console.log('✅ Firebase initialized - Spectator mode available');
  } catch (error) {
    console.warn('⚠️ Firebase initialization failed:', error.message);
  }
} else if (!isFirebaseConfigured()) {
  console.log('ℹ️ Firebase not configured - Spectator mode disabled. See firebase-config.js for setup instructions.');
}
