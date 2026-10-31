import { validarCampo, validarFormulario } from "./validacion.js";
import { enviarPropuesta } from "./api.js";

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

// Botón que inicia el envío de la propuesta    

const botonEnviarPropuesta = formularioPropuesta.querySelector(
    'button[type="submit"]'
);

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

// Obtención de los datos del formulario

function obtenerPropuesta() {
    const datos = new FormData(formularioPropuesta);

    return {
        titulo: datos.get("titulo").trim(),

        // getAll obtiene todos los autores, porque comparten el mismo name.
        autores: datos.getAll("autores").map(function (autor) {
            return autor.trim();
        }),

        // Los valores del formulario se convierten a números.
        anio: Number(datos.get("anio")),
        paginas: Number(datos.get("paginas")),

        genero: datos.get("genero"),
        correo: datos.get("correo").trim(),
        fecha: datos.get("fecha"),
        motivo: datos.get("motivo").trim()
    };
}

// Mensajes sobre el estado del envío

function mostrarMensajePropuesta(texto, tipo = "info") {
    mensajePropuesta.textContent = texto;
    mensajePropuesta.className = `alert alert-${tipo} mt-3`;
    mensajePropuesta.hidden = false;
}

// Validación y envío de la propuesta

async function revisarPropuesta(evento) {
    evento.preventDefault();

    // Evita iniciar otra solicitud mientras hay un envío en proceso.
    if (botonEnviarPropuesta.disabled) {
        return;
    }

    actualizarLimitesFecha();

    // Solo permite enviar si todos los campos son válidos.
    if (!validarFormulario(formularioPropuesta)) {
        mensajePropuesta.hidden = true;
        return;
    }

    const propuesta = obtenerPropuesta();

    // Guarda el estado de los controles antes de bloquear el formulario.
    const controles = Array.from(
        formularioPropuesta.querySelectorAll(
            "input, select, textarea, button"
        )
    );

    const estadosAnteriores = controles.map(function (control) {
        return control.disabled;
    });

    // Evita cambios en los datos mientras se están enviando.
    controles.forEach(function (control) {
        control.disabled = true;
    });

    botonEnviarPropuesta.textContent = "Enviando...";
    formularioPropuesta.setAttribute("aria-busy", "true");

    mostrarMensajePropuesta("Enviando la propuesta...");

    try {
        const respuesta = await enviarPropuesta(propuesta);

        mostrarMensajePropuesta(
            `Propuesta enviada correctamente. Identificador de prueba: ${respuesta.id}. Este registro es simulado.`,
            "success"
        );
    } catch {
        mostrarMensajePropuesta(
            "No se pudo enviar la propuesta. Revisá tu conexión e intentá nuevamente.",
            "danger"
        );
    } finally {
        // Restaura los controles tanto si el envío funciona como si falla.
        controles.forEach(function (control, indice) {
            control.disabled = estadosAnteriores[indice];
        });

        botonEnviarPropuesta.textContent = "Enviar propuesta";
        formularioPropuesta.setAttribute("aria-busy", "false");
    }
}

// Preparación del formulario y sus eventos
export function iniciarFormulario() {
    // Permite que nuestro evento submit controle cómo se muestran los errores.
    formularioPropuesta.noValidate = true;

    actualizarLimitesFecha();

    // Prepara el primer autor y los botones para agregar o quitar.
    contenedorAutores.replaceChildren(crearCampoAutor());
    actualizarControlesAutores();

    botonAgregarAutor.addEventListener("click", agregarAutor);
    contenedorAutores.addEventListener("click", manejarQuitarAutor);

    // Mantiene actualizados el año máximo y la fecha mínima.
    formularioPropuesta.addEventListener(
        "focusin",
        actualizarLimitesFecha
    );

    // Revisa el campo cuando el usuario termina de editarlo y sale de él.
    formularioPropuesta.addEventListener("focusout", function (evento) {
        const campo = evento.target;

        if (campo.matches("input, select, textarea")) {
            validarCampo(campo);
        }
    });

    // Actualiza los errores mientras el usuario corrige un campo.
    formularioPropuesta.addEventListener("input", function (evento) {
        mensajePropuesta.hidden = true;

        const campo = evento.target;

        if (
            campo.matches("input, select, textarea") &&
            campo.classList.contains("is-invalid")
        ) {
            validarCampo(campo);
        }
    });

    // Revisa todos los campos al presionar el botón del formulario.
    formularioPropuesta.addEventListener("submit", revisarPropuesta);
}