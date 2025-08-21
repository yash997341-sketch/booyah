// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBkgBOxzHW0hDMdu1qyJMfOreiMEaY1Eso",
    authDomain: "booyah-c30f6.firebaseapp.com",
    databaseURL: "https://booyah-c30f6-default-rtdb.firebaseio.com",
    projectId: "booyah-c30f6",
    storageBucket: "booyah-c30f6.firebasestorage.app",
    messagingSenderId: "695225975335",
    appId: "1:695225975335:web:3a2a9485f29c1001e28402",
    measurementId: ""
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
}