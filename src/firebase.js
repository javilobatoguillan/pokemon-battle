// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyALkHQpsq46ubvgcT9_yqFbOyzZYbr_F4c",
  authDomain: "pokemon-battle-234bb.firebaseapp.com",
  projectId: "pokemon-battle-234bb",
  storageBucket: "pokemon-battle-234bb.firebasestorage.app",
  messagingSenderId: "1089895144667",
  appId: "1:1089895144667:web:3b0e3961c846a4b69d40fe"
};

const app = initializeApp(firebaseConfig);

// Exportamos Firestore y Auth para usarlos en tu app
export const db = getFirestore(app);
export const auth = getAuth(app);
