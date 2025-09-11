import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7FSRcr4C50hpUGkiOW-Z2Jf0cU_oaJMA",
  authDomain: "idol-site-342a5.firebaseapp.com",
  projectId: "idol-site-342a5",
  storageBucket: "idol-site-342a5.appspot.com",
  messagingSenderId: "1059997819271",
  appId: "1:1059997819271:web:b243576d9fe62d82f2f322"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get references to the services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };