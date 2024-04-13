// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_pfb7IGq8UocjiSnzjbx7RMfxXaRP7LU",
  authDomain: "portfolio-e3636.firebaseapp.com",
  projectId: "portfolio-e3636",
  storageBucket: "portfolio-e3636.appspot.com",
  messagingSenderId: "59226899671",
  appId: "1:59226899671:web:d9f76027ec9fddfdaa5c92",
  measurementId: "G-JNHJ4BL8LG"
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;