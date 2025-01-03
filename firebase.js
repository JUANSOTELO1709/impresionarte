import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDv6TfUX8ISO0LVUpf-e33DBu3qaUgd9OQ",
  authDomain: "impresionarte-4e0eb.firebaseapp.com",
  projectId: "impresionarte-4e0eb",
  storageBucket: "impresionarte-4e0eb.appspot.com",
  messagingSenderId: "1051211166495",
  appId: "1:1051211166495:web:7b0fd9d30ec2b14cb7b62a",
  measurementId: "G-YYQLSV5R7B",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

export function auth() {
    const auth = getAuth();
try {
    const result = signInWithPopup(auth, provider);

    const   credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    const token = credential.accessToken;

    }catch (error) {

    }

}



const db = getFirestore(app);

export { db };
