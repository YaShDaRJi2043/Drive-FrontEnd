import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCY6YVur5qr4FOYZVIVwydtcPCPsAHVjPE",
  authDomain: "drive-7596f.firebaseapp.com",
  projectId: "drive-7596f",
  storageBucket: "drive-7596f.appspot.com",
  messagingSenderId: "582565708700",
  appId: "1:582565708700:web:88a537251a6fd52d1a3e59",
  measurementId: "G-XTCM3BWPRL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const imageStorage = getStorage(app);

export { auth, provider, imageStorage };
