let esAdmin = false;

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

function agregarProducto() {
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
            <a href="#" class="btn-cta">Comprar</a>
            ${esAdmin ? `<button class="btn-eliminar" onclick="eliminarProducto(${index})">Eliminar</button>` : ''}
        `;
        galeria.appendChild(nuevoProducto);
    } else {
        console.error('No se encontró el elemento galeria-productos');
    }
}

function eliminarProducto(index) {
    if (!esAdmin) return;

    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos.splice(index, 1);
    localStorage.setItem('productos', JSON.stringify(productos));
    document.getElementById('galeria-productos').innerHTML = '';
    cargarProductos();
}

function mostrarLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'block';
}

function cerrarLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
}

function autenticarAdmin() {
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    if (usuario === 'admin' && password === 'admin123') {
        esAdmin = true;
        alert('Bienvenido, administrador');
        cerrarLogin();
        document.getElementById('btn-agregar').style.display = 'block';
        const botonesEliminar = document.querySelectorAll('.btn-eliminar');
        botonesEliminar.forEach(boton => boton.style.display = 'block');
        return false;
    } else {
        alert('Credenciales incorrectas');
        return false;
    }
}

function mostrarFormularioProducto() {
    const modal = document.getElementById('producto-modal');
    if (modal) modal.style.display = 'block';
}

function cerrarFormularioProducto() {
    const modal = document.getElementById('producto-modal');
    if (modal) modal.style.display = 'none';
}

window.onclick = function(event) {
    const modalLogin = document.getElementById('login-modal');
    const modalProducto = document.getElementById('producto-modal');
    if (event.target === modalLogin) {
        modalLogin.style.display = 'none';
    }
    if (event.target === modalProducto) {
        modalProducto.style.display = 'none';
    }
}
