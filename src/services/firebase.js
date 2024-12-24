// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEGwLG2J_Z0LUpaTM7ACB_eW6hE49V-2c",
  authDomain: "folos-baa36.firebaseapp.com",
  projectId: "folos-baa36",
  storageBucket: "folos-baa36.firebasestorage.app",
  messagingSenderId: "330531438367",
  appId: "1:330531438367:web:43726ea82b5886f358fa2a",
  measurementId: "G-1T6YKGLVZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, analytics };