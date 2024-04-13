// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu0L_qBw_Z6lUQhr5LtSp48Xr1tTMetNc",
  authDomain: "devopia-18b84.firebaseapp.com",
  projectId: "devopia-18b84",
  storageBucket: "devopia-18b84.appspot.com",
  messagingSenderId: "732586973685",
  appId: "1:732586973685:web:17f995d49573d4edf2e8bc"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
