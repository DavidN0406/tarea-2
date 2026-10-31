// Elementos principales del formulario de propuestas
const formularioPropuesta = document.getElementById("formulario-propuesta");
const campoAnio = document.getElementById("propuesta-anio");
const campoFecha = document.getElementById("propuesta-fecha");
const mensajePropuesta = document.getElementById("mensaje-propuesta");

// Elementos del grupo de autores
const contenedorAutores = document.getElementById("contenedor-autores");
const botonAgregarAutor = document.getElementById("agregar-autor");
const contadorAutores = document.getElementById("contador-autores");

// Límites de campos permitidos
const MIN_AUTORES = 1;
const MAX_AUTORES = 5;

// Genera identificadores únicos aunque se eliminen campos intermedios
let siguienteIdAutor = 1;

// Establece los límites del año y de la fecha usando el día actual
function actualizarLimitesFecha() {
    const hoy = new Date();

    // Obtiene los valores según la fecha local de la computadora
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    campoAnio.max = String(anio);
    campoFecha.min = `${anio}-${mes}-${dia}`;
}

// Construye un campo de autor con su etiqueta y botón para quitarlo
function crearCampoAutor() {
    const id = `autor-${siguienteIdAutor}`;
    siguienteIdAutor++;

    // Agrupa todos los elementos de un autor
    const grupo = document.createElement("div");
    grupo.className = "mb-3";
    grupo.dataset.campoAutor = "";

    // Relaciona la etiqueta con el campo mediante su identificador
    const etiqueta = document.createElement("label");
    etiqueta.className = "form-label";
    etiqueta.htmlFor = id;
    etiqueta.textContent = "Autor";

    // Mantiene el campo y el botón juntos
    const controles = document.createElement("div");
    controles.className = "input-group";

    // Aplica las mismas restricciones a todos los autores
    const campo = document.createElement("input");
    campo.type = "text";
    campo.id = id;
    campo.name = "autores";
    campo.className = "form-control";
    campo.required = true;
    campo.minLength = 2;
    campo.maxLength = 100;
    campo.pattern = ".*\\S.*";

    // Identifica la acción sin registrar una escucha por cada botón
    const botonQuitar = document.createElement("button");
    botonQuitar.type = "button";
    botonQuitar.className = "btn btn-outline-danger";
    botonQuitar.textContent = "Quitar";
    botonQuitar.dataset.accion = "quitar-autor";

    controles.append(campo, botonQuitar);
    grupo.append(etiqueta, controles);

    return grupo;
}

// Actualiza la numeración, el contador y los botones disponibles
function actualizarControlesAutores() {
    const grupos = contenedorAutores.querySelectorAll("[data-campo-autor]");
    const cantidad = grupos.length;

    // Impide agregar más de cinco autores
    botonAgregarAutor.disabled = cantidad >= MAX_AUTORES;

    contadorAutores.textContent =
        `Autores: ${cantidad} de ${MAX_AUTORES}. Debe permanecer al menos uno.`;

    grupos.forEach(function (grupo, indice) {
        const etiqueta = grupo.querySelector("label");
        const botonQuitar = grupo.querySelector("button");
        const numero = indice + 1;

        // Mantiene las etiquetas consecutivas sin cambiar los identificadores
        etiqueta.textContent = `Autor ${numero}`;

        // Identifica el botón para quienes usan lectores de pantalla
        botonQuitar.setAttribute("aria-label", `Quitar autor ${numero}`);

        // No permite quitar el único autor que queda
        botonQuitar.disabled = cantidad <= MIN_AUTORES;
    });
}

// Agrega un autor cuando todavía no se ha alcanzado el máximo
function agregarAutor() {
    const cantidad = contenedorAutores.querySelectorAll(
        "[data-campo-autor]"
    ).length;

    // Comprueba el límite también desde la lógica
    if (cantidad >= MAX_AUTORES) {
        return;
    }

    const grupo = crearCampoAutor();
    contenedorAutores.append(grupo);

    actualizarControlesAutores();
    mensajePropuesta.hidden = true;

    // Permite comenzar a escribir en el nuevo campo inmediatamente
    grupo.querySelector("input").focus();
}

// Atiende los botones Quitar mediante una sola escucha en el contenedor
function manejarQuitarAutor(evento) {
    const boton = evento.target.closest(
        'button[data-accion="quitar-autor"]'
    );

    if (!boton || !contenedorAutores.contains(boton)) {
        return;
    }

    const cantidad = contenedorAutores.querySelectorAll(
        "[data-campo-autor]"
    ).length;

    // Protege el mínimo aunque se intente ejecutar la acción nuevamente
    if (cantidad <= MIN_AUTORES) {
        return;
    }

    const grupo = boton.closest("[data-campo-autor]");

    // Guarda un campo vecino para mover el foco después de quitar este
    const vecino = grupo.nextElementSibling || grupo.previousElementSibling;

    grupo.remove();

    actualizarControlesAutores();
    mensajePropuesta.hidden = true;

    vecino.querySelector("input").focus();
}

// Comprueba la propuesta sin enviarla ni recargar la página
function revisarPropuesta(evento) {
    evento.preventDefault();

    // Revisa los límites por si cambió el día con la página abierta
    actualizarLimitesFecha();

    // Incluye automáticamente los campos de autor agregados al formulario
    if (!formularioPropuesta.reportValidity()) {
        mensajePropuesta.hidden = true;
        return;
    }

    mensajePropuesta.textContent =
        "Los datos cumplen la validación inicial. La propuesta todavía no se ha enviado.";

    mensajePropuesta.hidden = false;
}

// Prepara el formulario y registra sus eventos una sola vez
export function iniciarFormulario() {
    actualizarLimitesFecha();

    // Crea el autor inicial usando las mismas reglas que los demás
    contenedorAutores.replaceChildren(crearCampoAutor());
    actualizarControlesAutores();

    // Acciones para agregar y quitar campos de autor
    botonAgregarAutor.addEventListener("click", agregarAutor);
    contenedorAutores.addEventListener("click", manejarQuitarAutor);

    // Mantiene los límites de fecha actualizados al utilizar el formulario
    formularioPropuesta.addEventListener("focusin", actualizarLimitesFecha);

    // Oculta la confirmación cuando se modifican los datos
    formularioPropuesta.addEventListener("input", function () {
        mensajePropuesta.hidden = true;
    });

    formularioPropuesta.addEventListener("submit", revisarPropuesta);
}