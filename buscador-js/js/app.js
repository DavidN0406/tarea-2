// Función del módulo encargado de actualizar la pantalla
import { mostrarMensaje } from "./renderizado.js";

// Elementos del formulario de búsqueda
const formularioBusqueda = document.getElementById("formulario-busqueda");
const textoBusqueda = document.getElementById("texto-busqueda");

// Procesa el envío del formulario
function manejarBusqueda(evento) {
    // Evita que el navegador envíe el formulario y recargue la página
    evento.preventDefault();

    // Lee el campo y elimina los espacios al inicio y al final
    const texto = textoBusqueda.value.trim();

    // Rechaza una entrada formada solamente por espacios
    if (texto === "") {
        mostrarMensaje("Escribí un título o autor para buscar.");
        textoBusqueda.focus();
        return;
    }

    // Confirma el texto recibido; la conexión con la API viene después
    mostrarMensaje(`Texto recibido: ${texto}`);
}

// Escucha el envío mediante el botón Buscar o la tecla Enter
formularioBusqueda.addEventListener("submit", manejarBusqueda);