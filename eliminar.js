// eliminar.js

import { db } from './firebase.js';
import { deleteDoc, doc } from "firebase/firestore";

async function eliminarProducto(id) {
    if (!esAdmin) return;

    await deleteDoc(doc(db, "productos", id));
    document.getElementById('galeria-productos').innerHTML = '';
    cargarProductos();
}
