import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCfl7sqjQ2cRTYBlq1YajTgkFjJJw2sOe4",
  authDomain: "creator-3b3f3.firebaseapp.com",
  projectId: "creator-3b3f3",
  storageBucket: "creator-3b3f3.appspot.com",
  messagingSenderId: "918317979398",
  appId: "1:918317979398:web:4f76891509c700e7057087",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
