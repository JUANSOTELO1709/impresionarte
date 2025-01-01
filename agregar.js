// agregar.js

document.addEventListener('DOMContentLoaded', cargarProductos);

function cargarProductos() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos.forEach((producto, index) => {
        agregarProductoDOM(producto.nombre, producto.precio, producto.imagen, index);
    });

    if (!esAdmin) {
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach(boton => boton.style.display = 'none');
    }
}

function agregarProducto(event) {
    event.preventDefault();
    if (!esAdmin) return false;

    const nombre = document.getElementById('producto-nombre').value;
    const precio = document.getElementById('producto-precio').value;
    const imagenInput = document.getElementById('producto-imagen');
    const reader = new FileReader();

    reader.onload = function(event) {
        const imagen = event.target.result;

        const producto = { nombre, precio, imagen };
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos));

        agregarProductoDOM(nombre, precio, imagen, productos.length - 1);
        cerrarFormularioProducto();
    };

    reader.readAsDataURL(imagenInput.files[0]);
    return false;
}

function agregarProductoDOM(nombre, precio, imagen, index) {
    const galeria = document.getElementById('galeria-productos');
    if (galeria) {
        const nuevoProducto = document.createElement('div');
        nuevoProducto.className = 'producto';
        nuevoProducto.innerHTML = `
            <img src="${imagen}" alt="${nombre}">
            <h3>${nombre}</h3>
            <p>Descripción del producto. Precio: $${precio}</p>
            <a href="https://wa.me/573026622715?text=Estoy%20interesado%20en%20el%20producto%20${nombre}" class="btn-cta">Comprar</a>
            ${esAdmin ? `<button class="btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>` : ''}
        `;
        galeria.appendChild(nuevoProducto);
    } else {
        console.error('No se encontró el elemento galeria-productos');
    }
}

function cerrarFormularioProducto() {
    const modal = document.getElementById('producto-modal');
    if (modal) modal.style.display = 'none';
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

document.addEventListener('DOMContentLoaded', cargarProductos);

function cargarProductos() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos.forEach((producto, index) => {
        agregarProductoDOM(producto.nombre, producto.precio, producto.imagen, index);
    });

    if (!esAdmin) {
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach(boton => boton.style.display = 'none');
    }
}

function agregarProducto(event) {
    event.preventDefault();
    if (!esAdmin) return false;

    const nombre = document.getElementById('producto-nombre').value;
    const precio = document.getElementById('producto-precio').value;
    const imagenInput = document.getElementById('producto-imagen');
    const reader = new FileReader();

    reader.onload = function(event) {
        const imagen = event.target.result;

        const producto = { nombre, precio, imagen };
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos));

        agregarProductoDOM(nombre, precio, imagen, productos.length - 1);
        cerrarFormularioProducto();
    };

    reader.readAsDataURL(imagenInput.files[0]);
    return false;
}

function agregarProductoDOM(nombre, precio, imagen, index) {
    const galeria = document.getElementById('galeria-productos');
    if (galeria) {
        const nuevoProducto = document.createElement('div');
        nuevoProducto.className = 'producto';
        nuevoProducto.innerHTML = `
            <img src="${imagen}" alt="${nombre}"><br>
            <h3>${nombre}</h3><br>
            <p>Descripción del producto. Precio: $${precio}</p><br>
            <a href="https://wa.me/573026622715?text=Estoy%20interesado%20en%20el%20producto%20${nombre}" class="btn-cta">Comprar</a>
            ${esAdmin ? `<button class="btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>` : ''}
        `;
        galeria.appendChild(nuevoProducto);
    } else {
        console.error('No se encontró el elemento galeria-productos');
    }
}
