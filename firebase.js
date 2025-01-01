// firebase.js

// Importar las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDv6TfUX8ISO0LVUpf-e33DBu3qaUgd9OQ",
  authDomain: "impresionarte-4e0eb.firebaseapp.com",
  projectId: "impresionarte-4e0eb",
  storageBucket: "impresionarte-4e0eb.firebasestorage.app",
  messagingSenderId: "1051211166495",
  appId: "1:1051211166495:web:7b0fd9d30ec2b14cb7b62a",
  measurementId: "G-YYQLSV5R7B"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
