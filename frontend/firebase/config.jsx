// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDu0L_qBw_Z6lUQhr5LtSp48Xr1tTMetNc",
  authDomain: "devopia-18b84.firebaseapp.com",
  projectId: "devopia-18b84",
  storageBucket: "devopia-18b84.appspot.com",
  messagingSenderId: "732586973685",
  appId: "1:732586973685:web:17f995d49573d4edf2e8bc"
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;