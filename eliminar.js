// eliminar.js

function eliminarProducto(index) {
    if (!esAdmin) return;

    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos.splice(index, 1);
    localStorage.setItem('productos', JSON.stringify(productos));
    document.getElementById('galeria-productos').innerHTML = '';
    cargarProductos();
}
