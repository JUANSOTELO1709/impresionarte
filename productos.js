// productos.js

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
    }}

    window.onclick = function(event) {

const modalLogin = document.getElementById('login-modal');
if (event.target === modalLogin) {        modalLogin.style.display = 'none';
    }
}
