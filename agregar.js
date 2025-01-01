// agregar.js

import { storage, db } from './firebase.js';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

document.addEventListener('DOMContentLoaded', cargarProductos);

async function cargarProductos() {
    const productosSnapshot = await getDocs(collection(db, "productos"));
    const productos = productosSnapshot.docs.map(doc => doc.data());

    productos.forEach((producto, index) => {
        agregarProductoDOM(producto.nombre, producto.precio, producto.imagenURL, doc.id);
    });

    if (!esAdmin) {
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach(boton => boton.style.display = 'none');
    }
}

async function agregarProducto(event) {
    event.preventDefault();
    if (!esAdmin) return false;

    const nombre = document.getElementById('producto-nombre').value;
    const precio = document.getElementById('producto-precio').value;
    const imagenInput = document.getElementById('producto-imagen').files[0];

    // Subir la imagen a Firebase Storage
    const storageRef = ref(storage, 'productos/' + imagenInput.name);
    await uploadBytes(storageRef, imagenInput);
    const imagenURL = await getDownloadURL(storageRef);

    // Guardar el producto en Firestore
    await addDoc(collection(db, "productos"), {
        nombre,
        precio,
        imagenURL
    });

    cargarProductos();
    cerrarFormularioProducto();
}

function agregarProductoDOM(nombre, precio, imagenURL, id) {
    const galeria = document.getElementById('galeria-productos');
    if (galeria) {
        const nuevoProducto = document.createElement('div');
        nuevoProducto.className = 'producto';
        nuevoProducto.innerHTML = `
            <img src="${imagenURL}" alt="${nombre}">
            <h3>${nombre}</h3>
            <p>Descripción del producto. Precio: $${precio}</p>
            <a href="https://wa.me/573026622715?text=Estoy%20interesado%20en%20el%20producto%20${nombre}" class="btn-cta">Comprar</a>
            ${esAdmin ? `<button class="btn-eliminar" onclick="eliminarProducto('${id}')">Eliminar</button>` : ''}
        `;
        galeria.appendChild(nuevoProducto);
    } else {
        console.error('No se encontró el elemento galeria-productos');
    }
}

function mostrarFormularioProducto() {
    const modal = document.getElementById('producto-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function cerrarFormularioProducto() {
    const modal = document.getElementById('producto-modal');
    if (modal) modal.style.display = 'none';
}
