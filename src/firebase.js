import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBEbppeTJgTbYinM7bI0rNuoITlMM4yWPM",
  authDomain: "cineflix-79be6.firebaseapp.com",
  projectId: "cineflix-79be6",
  storageBucket: "cineflix-79be6.appspot.com",
  messagingSenderId: "308642066021",
  appId: "1:308642066021:web:6cf376a793bc3bc038208c",
  measurementId: "G-F1GVDSW0JZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export default storage;
