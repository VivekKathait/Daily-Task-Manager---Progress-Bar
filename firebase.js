// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth ,GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUXup2t7fiSjWGG5tEWQ1KzGCGEfXYClU",
  authDomain: "sign-up-page-vivek-tools.firebaseapp.com",
  projectId: "sign-up-page-vivek-tools",
  storageBucket: "sign-up-page-vivek-tools.firebasestorage.app",
  messagingSenderId: "209931156356",
  appId: "1:209931156356:web:d2849a1b98b9cbdbf1bbd1",
  measurementId: "G-MKX6LFE4DL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();

