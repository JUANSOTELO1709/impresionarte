// productos.js


// productos.js
document.addEventListener('DOMContentLoaded', function() {
    const productos = [


    ];

    const galeria = document.getElementById('galeria-productos');

    productos.forEach(producto => {
        const divProducto = document.createElement('div');
        divProducto.className = 'producto';
        
        const imgProducto = document.createElement('img');
        imgProducto.src = producto.imagen;
        imgProducto.alt = producto.nombre;
        
        const nombreProducto = document.createElement('h3');
        nombreProducto.textContent = producto.nombre;
        
        const precioProducto = document.createElement('p');
        precioProducto.textContent = `Precio: $${producto.precio}`;

        divProducto.appendChild(imgProducto);
        divProducto.appendChild(nombreProducto);
        divProducto.appendChild(precioProducto);

        galeria.appendChild(divProducto);
    });
});


// aparte








let esAdmin = false;

function mostrarLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function cerrarLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function autenticarAdmin(event) {
    event.preventDefault();
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    if (usuario === 'admin' && password === 'admin123') {
        esAdmin = true;
        alert('Bienvenido, administrador');
        cerrarLogin();
        document.getElementById('btn-agregar').style.display = 'block';
        cargarProductos();
        return false;
    } else {
        alert('Credenciales incorrectas');
        return false;
    }
}

function toggleMenu() {
    const navMenu = document.getElementById('nav-menu').querySelector('ul');
    if (navMenu) {
        navMenu.classList.toggle('show');
    }
}

window.onclick = function(event) {
    const modalLogin = document.getElementById('login-modal');
    if (event.target === modalLogin) {
        modalLogin.style.display = 'none';
    }
}
