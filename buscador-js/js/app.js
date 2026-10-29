// Funciones para consultar la API y actualizar los mensajes
import { buscarLibros } from "./api.js";
import { mostrarMensaje } from "./renderizado.js";

// Elementos del formulario de búsqueda
const formularioBusqueda = document.getElementById("formulario-busqueda");
const textoBusqueda = document.getElementById("texto-busqueda");
const botonBusqueda = formularioBusqueda.querySelector('button[type="submit"]');

// Procesa el envío del formulario y espera los resultados de la API
async function manejarBusqueda(evento) {
    // Evita que el formulario recargue la página
    evento.preventDefault();

    // Evita iniciar otra petición mientras hay una búsqueda en curso
    if (botonBusqueda.disabled) {
        return;
    }

    // Lee el texto y elimina espacios al inicio y al final
    const texto = textoBusqueda.value.trim();

    // Rechaza una entrada formada solamente por espacios
    if (texto === "") {
        mostrarMensaje("Escribí un título o autor para buscar.");
        textoBusqueda.focus();
        return;
    }

    // Informa que comenzó la búsqueda y desactiva el botón
    mostrarMensaje("Buscando libros...");
    botonBusqueda.disabled = true;

    try {
        // Solicita los libros y espera hasta recibirlos
        const libros = await buscarLibros(texto);

        // Informa cuando la consulta no devuelve coincidencias
        if (libros.length === 0) {
            mostrarMensaje("No se encontraron libros para esa búsqueda.");
            return;
        }

        // Confirma cuántos libros llegaron en esta petición
        mostrarMensaje(`Se recibieron ${libros.length} libros.`);

    } catch (error) {
        // Muestra un mensaje si falla la petición o la lectura de la respuesta
        mostrarMensaje(
            "No se pudo completar la búsqueda. Intentá nuevamente en unos momentos."
        );

    } finally {
        // Reactiva el botón tanto si la búsqueda funciona como si falla
        botonBusqueda.disabled = false;
    }
}

// Ejecuta la búsqueda al enviar el formulario con el botón o con Enter
formularioBusqueda.addEventListener("submit", manejarBusqueda);