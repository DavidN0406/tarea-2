// Mensajes de error junto a cada campo

function mostrarErrorCampo(campo, mensaje) {
    const idError = `error-${campo.id}`;
    let error = document.getElementById(idError);

    // Crea el espacio del mensaje solamente la primera vez.
    if (!error) {
        error = document.createElement("div");
        error.id = idError;
        error.className = "invalid-feedback";

        const grupoAutor = campo.closest("[data-campo-autor]");

        // En los autores, coloca el mensaje debajo del input y su botón.
        if (grupoAutor) {
            grupoAutor.append(error);
        } else {
            campo.insertAdjacentElement("afterend", error);
        }

        // Relaciona el campo con su mensaje para lectores de pantalla.
        const descripciones = campo.getAttribute("aria-describedby");

        campo.setAttribute(
            "aria-describedby",
            descripciones ? `${descripciones} ${idError}` : idError
        );
    }

    const tieneError = mensaje !== "";

    error.textContent = mensaje;
    error.classList.toggle("d-block", tieneError);

    campo.classList.toggle("is-invalid", tieneError);
    campo.setAttribute("aria-invalid", String(tieneError));
}

// Revisión individual de un campo

export function validarCampo(campo) {
    // Borra el error personalizado anterior antes de volver a revisar.
    campo.setCustomValidity("");

    const valor = campo.value.trim();
    const estado = campo.validity;
    let mensaje = "";

    if (estado.badInput) {
        mensaje = "Ingresá un valor válido para este campo.";
    } else if (estado.valueMissing || (campo.required && valor === "")) {
        mensaje = "Completá este campo.";
    } else if (estado.typeMismatch) {
        mensaje = "Ingresá un correo válido, por ejemplo: nombre@correo.com.";
    } else if (estado.rangeOverflow) {
        if (campo.id === "propuesta-anio") {
            mensaje = `El año de publicación no puede ser posterior a ${campo.max}.`;
        } else {
            mensaje = `El valor máximo permitido es ${campo.max}.`;
        }
    } else if (estado.rangeUnderflow) {
        if (campo.id === "propuesta-fecha") {
            mensaje = "La sesión debe ser hoy o una fecha posterior.";
        } else {
            mensaje = `El valor mínimo permitido es ${campo.min}.`;
        }
    } else if (estado.stepMismatch) {
        mensaje = "Ingresá un número entero, sin decimales.";
    } else if (campo.minLength > 0 && valor.length < campo.minLength) {
        mensaje = `Escribí al menos ${campo.minLength} caracteres.`;
    } else if (campo.maxLength >= 0 && valor.length > campo.maxLength) {
        mensaje = `Escribí como máximo ${campo.maxLength} caracteres.`;
    } else if (estado.patternMismatch) {
        mensaje = "Ingresá un texto válido; no usés solamente espacios.";
    } else if (!estado.valid) {
        mensaje = "Revisá el valor de este campo.";
    }

    // Un mensaje distinto de vacío hace que el campo sea inválido.
    campo.setCustomValidity(mensaje);

    mostrarErrorCampo(campo, mensaje);

    return campo.validity.valid;
}

// Revisión completa del formulario

export function validarFormulario(formulario) {
    // Busca los campos actuales para incluir los autores agregados.
    const campos = formulario.querySelectorAll("input, select, textarea");
    let primerCampoInvalido = null;

    campos.forEach(function (campo) {
        const esValido = validarCampo(campo);

        if (!esValido && primerCampoInvalido === null) {
            primerCampoInvalido = campo;
        }
    });

    // Lleva al usuario al primer campo que necesita corregir.
    if (primerCampoInvalido !== null) {
        primerCampoInvalido.focus();
        return false;
    }

    return true;
}