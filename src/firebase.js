// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZos8_jECHCsBszYohtJaA0gN52_iygcw",
  authDomain: "diwa-jajanan-web-kuliner.firebaseapp.com",
  projectId: "diwa-jajanan-web-kuliner",
  storageBucket: "diwa-jajanan-web-kuliner.firebasestorage.app",
  messagingSenderId: "704574744525",
  appId: "1:704574744525:web:571709cc2b946763900684",
  measurementId: "G-2P9N9DFV9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
