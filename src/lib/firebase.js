// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlUSqfrhS4yeob6ux3iV1hU2BDy9q4B5o",
  authDomain: "instagram-downloader-eac70.firebaseapp.com",
  projectId: "instagram-downloader-eac70",
  storageBucket: "instagram-downloader-eac70.firebasestorage.app",
  messagingSenderId: "443855950143",
  appId: "1:443855950143:web:d37324ee28889b9370038a",
  measurementId: "G-73P1LKJTRR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };
export default app;
