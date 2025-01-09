// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "StockPredictor-b9481.firebaseapp.com",
  projectId: "StockPredictor-b9481",
  storageBucket: "StockPredictor-b9481.appspot.com",
  messagingSenderId: "1075961792038",
  appId: "1:1075961792038:web:727fa58fbe37c283f4c8e7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
