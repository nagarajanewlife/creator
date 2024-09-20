import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword, // For sign-up
  signInWithEmailAndPassword, // For sign-in
  sendEmailVerification, // For sending verification emails
} from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfl7sqjQ2cRTYBlq1YajTgkFjJJw2sOe4",
  authDomain: "creator-3b3f3.firebaseapp.com",
  projectId: "creator-3b3f3",
  storageBucket: "creator-3b3f3.appspot.com",
  messagingSenderId: "918317979398",
  appId: "1:918317979398:web:4f76891509c700e7057087",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize authentication and provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export the necessary Firebase authentication methods
export {
  auth,
  provider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword, // For email/password sign-up
  signInWithEmailAndPassword, // For email/password sign-in
  sendEmailVerification, // To send a verification email
};
