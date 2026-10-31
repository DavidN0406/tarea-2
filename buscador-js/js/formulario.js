// Elementos del formulario de propuestas
const formularioPropuesta = document.getElementById("formulario-propuesta");
const campoAnio = document.getElementById("propuesta-anio");
const campoFecha = document.getElementById("propuesta-fecha");
const mensajePropuesta = document.getElementById("mensaje-propuesta");

// Establece los límites del año y de la fecha usando el día actual
function actualizarLimitesFecha() {
    const hoy = new Date();

    // Obtiene los valores según la fecha local de la computadora
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    // El libro no puede tener un año de publicación futuro
    campoAnio.max = String(anio);

    // El campo de fecha necesita el formato año-mes-día
    campoFecha.min = `${anio}-${mes}-${dia}`;
}

// Comprueba la propuesta sin enviar datos ni recargar la página
function revisarPropuesta(evento) {
    evento.preventDefault();

    // Actualiza los límites por si cambió el día con la página abierta
    actualizarLimitesFecha();

    // Comprueba nuevamente las restricciones después de actualizar las fechas
    if (!formularioPropuesta.reportValidity()) {
        mensajePropuesta.hidden = true;
        return;
    }

    // Confirma la revisión; todavía no se realiza una petición a la API
    mensajePropuesta.textContent =
        "Los datos cumplen la validación inicial. La propuesta todavía no se ha enviado.";

    mensajePropuesta.hidden = false;
}

// Configura los límites y registra los eventos una sola vez
export function iniciarFormulario() {
    actualizarLimitesFecha();

    // Actualiza las fechas cuando el usuario comienza a utilizar el formulario
    formularioPropuesta.addEventListener("focusin", actualizarLimitesFecha);

    // Evita conservar una confirmación si el usuario modifica los datos
    formularioPropuesta.addEventListener("input", function () {
        mensajePropuesta.hidden = true;
    });

    formularioPropuesta.addEventListener("submit", revisarPropuesta);
}