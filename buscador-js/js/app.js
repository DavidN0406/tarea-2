// Consulta de libros en Open Library
import { buscarLibros } from "./api.js";

// Operaciones sobre la lista de lecturas en memoria
import {
    agregarLectura,
    cambiarEstadoLectura,
    quitarLectura
} from "./lecturas.js";

// Funciones que actualizan la pantalla
import {
    mostrarMensaje,
    mostrarLibros,
    mostrarMensajeLecturas,
    agregarFilaLectura,
    actualizarEstadoEnFila,
    quitarFilaLectura
} from "./renderizado.js";

// Elementos del formulario de búsqueda
const formularioBusqueda = document.getElementById("formulario-busqueda");
const textoBusqueda = document.getElementById("texto-busqueda");
const botonBusqueda = formularioBusqueda.querySelector('button[type="submit"]');

// Contenedor que recibirá los clics de todos los botones de la lista
const listaLecturas = document.getElementById("lista-lecturas");

// Coordina el registro del libro y su aparición en la tabla
function manejarAgregarLectura(libro) {
    // Intenta guardar el libro en el arreglo de lecturas
    const lectura = agregarLectura(libro);

    // Si devuelve null, el libro ya estaba registrado
    if (lectura === null) {
        mostrarMensajeLecturas("Ese libro ya está en tu lista.", "warning");
        return;
    }

    // Agrega únicamente la fila nueva y confirma la acción
    agregarFilaLectura(lectura);
    mostrarMensajeLecturas(`Se agregó "${lectura.titulo}" a tu lista.`);
}

// Procesa el formulario y espera los resultados de la API
async function manejarBusqueda(evento) {
    // Evita que el formulario recargue la página
    evento.preventDefault();

    // Impide iniciar otra petición mientras hay una búsqueda en curso
    if (botonBusqueda.disabled) {
        return;
    }

    // Lee el campo y elimina espacios al inicio y al final
    const texto = textoBusqueda.value.trim();

    // Rechaza una entrada formada solamente por espacios
    if (texto === "") {
        mostrarMensaje("Escribí un título o autor para buscar.");
        textoBusqueda.focus();
        return;
    }

    // Limpia las tarjetas anteriores; la lista de lecturas se conserva
    mostrarLibros([]);

    // Informa que comenzó la búsqueda y desactiva el botón
    mostrarMensaje("Buscando libros...");
    botonBusqueda.disabled = true;

    try {
        // Consulta los libros en Open Library
        const libros = await buscarLibros(texto);

        // Informa cuando no hay coincidencias
        if (libros.length === 0) {
            mostrarMensaje("No se encontraron libros para esa búsqueda.");
            return;
        }

        // Entrega los libros y la función que atenderá el botón Agregar
        mostrarLibros(libros, manejarAgregarLectura);

        mostrarMensaje(`Se muestran ${libros.length} libros.`);

    } catch (error) {
        // Informa que la búsqueda no pudo completarse
        mostrarMensaje(
            "No se pudo completar la búsqueda. Intentá nuevamente en unos momentos."
        );

    } finally {
        // Reactiva el botón al terminar, incluso si hubo un error
        botonBusqueda.disabled = false;
    }
}

// Atiende el envío mediante el botón Buscar o la tecla Enter
formularioBusqueda.addEventListener("submit", manejarBusqueda);

// Atiende las acciones de la lista desde un único contenedor
async function manejarAccionLectura(evento) {
    // Identifica el botón que originó la acción
    const boton = evento.target.closest("button[data-accion]");

    // Ignora clics que no correspondan a los botones de esta lista
    if (!boton || !listaLecturas.contains(boton)) {
        return;
    }

    // Localiza la fila correspondiente al botón
    const fila = boton.closest("tr[data-id]");

    // Evita actuar sobre una fila que ya está saliendo
    if (!fila || fila.dataset.eliminando === "true") {
        return;
    }

    const id = fila.dataset.id;
    const accion = boton.dataset.accion;

    // Actualiza el estado en memoria y después su representación visual
    if (accion === "cambiar") {
        const lectura = cambiarEstadoLectura(id);

        if (!lectura) {
            return;
        }

        actualizarEstadoEnFila(fila, lectura);

        mostrarMensajeLecturas(
            `"${lectura.titulo}" ahora está en estado ${lectura.estado}.`
        );

        return;
    }

    // Espera la salida visual antes de quitar el libro del arreglo
    if (accion === "quitar") {
        await quitarFilaLectura(fila);

        const lecturaEliminada = quitarLectura(id);

        if (!lecturaEliminada) {
            return;
        }

        mostrarMensajeLecturas(
            `Se quitó "${lecturaEliminada.titulo}" de tu lista.`,
            "info"
        );
    }
}

// Una sola escucha controla las acciones de todas las lecturas
listaLecturas.addEventListener("click", manejarAccionLectura);