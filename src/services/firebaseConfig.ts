// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // <-- 1. IMPORTAR FIRESTORE
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcJYsevr2q1YtY6qBchfUxyd7jv3UNQ5g",
  authDomain: "dmeloapp-4cc49.firebaseapp.com",
  projectId: "dmeloapp-4cc49",
  storageBucket: "dmeloapp-4cc49.firebasestorage.app",
  messagingSenderId: "1023923877644",
  appId: "1:1023923877644:web:7e40e29b99a03c60d2bb29",
  measurementId: "G-24B76MC3QK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app); // <-- 3. EXPORTAR A INSTÂNCIA DO BANCO DE DADOS
export default app;
export const auth = getAuth(app);