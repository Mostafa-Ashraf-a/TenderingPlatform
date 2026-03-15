/**
 * firebase-config.js
 * Project: TenderingPlatform
 * Description: Firebase configuration and initialization.
 */

// Your web app's Firebase configuration
// REPLACE WITH YOUR OWN CONFIG FROM FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyAB2GUARXW3qshNH2jWyYtZvuASgac7qqM",
    authDomain: "tendering-platform-smart.firebaseapp.com",
    projectId: "tendering-platform-smart",
    storageBucket: "tendering-platform-smart.firebasestorage.app",
    messagingSenderId: "513440627561",
    appId: "1:513440627561:web:d1e65176256939012d1bf8",
    measurementId: "G-TD5GTTF3NS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Force Long Polling (Critical for file:// protocol compatibility)
db.settings({ experimentalForceLongPolling: true });

console.log("Firebase Initialized and Firestore running in long-polling mode.");

// Export (Global access since we are not using modules for simplicity in this project)
window.db = db;
