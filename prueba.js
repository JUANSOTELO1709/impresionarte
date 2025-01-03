document.getElementById('login-btn').addEventListener('click', () => {
    auth.signInWithPopup(provider)
        .then((result) => {
            document.getElementById('upload-form').style.display = 'block';
            document.getElementById('login-btn').style.display = 'none';
        })
        .catch((error) => {
            console.error('Error al iniciar sesión:', error);
        });
});

document.getElementById('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    if (file) {
        const storageRef = storage.ref('pruebas/' + file.name);
        await storageRef.put(file);
        const downloadURL = await storageRef.getDownloadURL();

        // Guardar la información de la imagen en Firestore
        await db.collection('pruebas').add({
            nombre: file.name,
            url: downloadURL
        });

        document.getElementById('result').innerHTML = `<p>Imagen subida con éxito. URL: <a href="${downloadURL}" target="_blank">${downloadURL}</a></p>`;
    } else {
        document.getElementById('result').textContent = 'Por favor, seleccione un archivo para subir.';
    }
});
