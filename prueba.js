// prueba.js

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

document.getElementById('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    if (file) {
        const storageRef = ref(storage, 'pruebas/' + file.name);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        document.getElementById('result').innerHTML = `<p>Imagen subida con éxito. URL: <a href="${downloadURL}" target="_blank">${downloadURL}</a></p>`;
    } else {
        document.getElementById('result').textContent = 'Por favor, seleccione un archivo para subir.';
    }
});
