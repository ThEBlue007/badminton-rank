// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5QIQud-_aR4FQMj6UeGP-boOtdFFWECA",
  authDomain: "badminton-rank-78121.firebaseapp.com",
  projectId: "badminton-rank-78121",
  storageBucket: "badminton-rank-78121.firebasestorage.app",
  messagingSenderId: "157073280950",
  appId: "1:157073280950:web:6870d4767f1f73fb50bb17",
  measurementId: "G-4C3Y2EXYXN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
