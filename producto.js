// Impresionarte - Visualización dinámica de productos
async function cargarProductos() {
    const response = await fetch('productos.json');
    const productos = await response.json();
    const galeria = document.getElementById('galeria-productos');
    galeria.innerHTML = '';
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        // Imagen o carrusel
        if (producto.imagenes) {
            const carrusel = document.createElement('div');
            carrusel.classList.add('carrusel');
            producto.imagenes.forEach((imagen, idx) => {
                const img = document.createElement('img');
                img.src = imagen;
                img.alt = `${producto.nombre} ${idx + 1}`;
                img.classList.add(idx === 0 ? 'active' : 'inactive');
                carrusel.appendChild(img);
            });
            card.appendChild(carrusel);
        } else if (producto.imagen) {
            const img = document.createElement('img');
            img.src = producto.imagen;
            img.alt = producto.nombre;
            card.appendChild(img);
        }
        // Nombre
        const nombre = document.createElement('h2');
        nombre.textContent = producto.nombre;
        card.appendChild(nombre);
        // Precio
        const precio = document.createElement('div');
        precio.classList.add('price');
        precio.textContent = `$${producto.precio.toLocaleString()}`;
        card.appendChild(precio);
        // Botón de compra
        const btn = document.createElement('a');
        btn.href = `https://wa.me/573026622715?text=Hola,%20me%20interesa%20el%20producto%20${encodeURIComponent(producto.nombre)}`;
        btn.textContent = 'Comprar';
        btn.classList.add('btn');
        btn.target = '_blank';
        card.appendChild(btn);
        galeria.appendChild(card);
    });
    iniciarCarrusel();
}
// Carrusel automático para productos con varias imágenes
function iniciarCarrusel() {
    const carruseles = document.querySelectorAll('.carrusel');
    carruseles.forEach(carrusel => {
        let currentIndex = 0;
        const images = carrusel.querySelectorAll('img');
        if (images.length <= 1) return;
        setInterval(() => {
            images[currentIndex].classList.remove('active');
            images[currentIndex].classList.add('inactive');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.remove('inactive');
            images[currentIndex].classList.add('active');
        }, 2500);
    });
}
window.onload = cargarProductos;
