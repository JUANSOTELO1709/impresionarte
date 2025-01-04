// Función para cargar productos dinámicamente desde el archivo JSON
async function cargarProductos() {
    const response = await fetch('productos.json');
    const productos = await response.json();

    const galeria = document.getElementById('galeria-productos');
    productos.forEach(producto => {
        const divProducto = document.createElement('div');
        divProducto.classList.add('producto');

        if (producto.imagenes) {
            // Crear un carrusel de imágenes
            const divCarrusel = document.createElement('div');
            divCarrusel.classList.add('carrusel');

            producto.imagenes.forEach((imagen, index) => {
                const imgProducto = document.createElement('img');
                imgProducto.src = imagen;
                imgProducto.alt = `Producto ${producto.nombre} ${index + 1}`;
                imgProducto.classList.add(index === 0 ? 'active' : 'inactive');
                divCarrusel.appendChild(imgProducto);
            });

            divProducto.appendChild(divCarrusel);
        } else {
            const imgProducto = document.createElement('img');
            imgProducto.src = producto.imagen;
            imgProducto.alt = `Producto ${producto.nombre}`;
            divProducto.appendChild(imgProducto);
        }

        const h3Producto = document.createElement('h3');
        h3Producto.textContent = producto.nombre;
        
        const pPrecio = document.createElement('p');
        pPrecio.textContent = `Precio: $${producto.precio}`;

        divProducto.appendChild(h3Producto);
        divProducto.appendChild(pPrecio);
        
        galeria.appendChild(divProducto);
    });

    // Añadir funcionalidad al carrusel
    iniciarCarrusel();
}

// Función para iniciar carruseles
function iniciarCarrusel() {
    const carruseles = document.querySelectorAll('.carrusel');
    
    carruseles.forEach(carrusel => {
        let currentIndex = 0;
        const images = carrusel.querySelectorAll('img');

        setInterval(() => {
            images[currentIndex].classList.remove('active');
            images[currentIndex].classList.add('inactive');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.remove('inactive');
            images[currentIndex].classList.add('active');
        }, 3000);
    });
}

// Cargar productos al cargar la página
window.onload = cargarProductos;
