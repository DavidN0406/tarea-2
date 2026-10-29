// Elemento donde se muestran los mensajes de la búsqueda
const mensajeBusqueda = document.getElementById("mensaje-busqueda");

// Actualiza el mensaje de la página usando texto, sin insertar HTML
export function mostrarMensaje(texto) {
    mensajeBusqueda.textContent = texto;
}