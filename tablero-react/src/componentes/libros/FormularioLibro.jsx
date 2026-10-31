import { useState } from "react"

// Valores con los que comienza el formulario
const camposIniciales = {
    titulo: "",
    autor: "",
    miembroId: ""
}

// Formulario controlado para agregar libros al tablero
function FormularioLibro({ miembros, alAgregar }) {
    const [campos, setCampos] = useState(camposIniciales)
    const [errores, setErrores] = useState({})
    const [mensaje, setMensaje] = useState("")

    // Actualiza el campo cuyo nombre coincide con el atributo name.
    function actualizarCampo(evento) {
        const { name, value } = evento.target

        setCampos(function (camposActuales) {
            return {
                ...camposActuales,
                [name]: value
            }
        })

        // Retira el error anterior del campo que se está editando.
        setErrores(function (erroresActuales) {
            return {
                ...erroresActuales,
                [name]: ""
            }
        })

        setMensaje("")
    }

    // Revisa los datos y devuelve los mensajes de los campos incorrectos.
    function validarCampos() {
        const nuevosErrores = {}

        if (campos.titulo.trim().length < 2) {
            nuevosErrores.titulo =
                "Escribí un título de al menos 2 caracteres."
        } else if (campos.titulo.trim().length > 150) {
            nuevosErrores.titulo =
                "El título no puede superar los 150 caracteres."
        }

        if (campos.autor.trim().length < 2) {
            nuevosErrores.autor =
                "Escribí un autor de al menos 2 caracteres."
        } else if (campos.autor.trim().length > 100) {
            nuevosErrores.autor =
                "El autor no puede superar los 100 caracteres."
        }

        const miembroExiste = miembros.some(function (miembro) {
            return miembro.id === campos.miembroId
        })

        if (!miembroExiste) {
            nuevosErrores.miembroId = "Seleccioná un miembro del club."
        }

        return nuevosErrores
    }

    // Valida y comunica los datos a App sin recargar la página.
    function manejarEnvio(evento) {
        evento.preventDefault()
        setMensaje("")

        const nuevosErrores = validarCampos()
        setErrores(nuevosErrores)

        if (Object.keys(nuevosErrores).length > 0) {
            return
        }

        alAgregar({
            titulo: campos.titulo.trim(),
            autor: campos.autor.trim(),
            miembroId: campos.miembroId
        })

        // Limpia los controles cambiando el estado.
        setCampos({ ...camposIniciales })
        setMensaje("El libro se agregó al tablero.")
    }

    return (
        <form
            className="formulario-libro"
            onSubmit={manejarEnvio}
            noValidate
        >
            {/* Título del libro */}
            <div className="campo-formulario">
                <label htmlFor="libro-titulo">Título</label>

                <input
                    id="libro-titulo"
                    name="titulo"
                    type="text"
                    value={campos.titulo}
                    onChange={actualizarCampo}
                    required
                    minLength={2}
                    maxLength={150}
                    aria-invalid={Boolean(errores.titulo)}
                    aria-describedby="error-libro-titulo"
                />

                <span
                    id="error-libro-titulo"
                    className="error-campo"
                    aria-live="polite"
                >
                    {errores.titulo}
                </span>
            </div>

            {/* Autor del libro */}
            <div className="campo-formulario">
                <label htmlFor="libro-autor">Autor</label>

                <input
                    id="libro-autor"
                    name="autor"
                    type="text"
                    value={campos.autor}
                    onChange={actualizarCampo}
                    required
                    minLength={2}
                    maxLength={100}
                    aria-invalid={Boolean(errores.autor)}
                    aria-describedby="error-libro-autor"
                />

                <span
                    id="error-libro-autor"
                    className="error-campo"
                    aria-live="polite"
                >
                    {errores.autor}
                </span>
            </div>

            {/* Miembro que propone la lectura */}
            <div className="campo-formulario">
                <label htmlFor="libro-miembro">Propuesto por</label>

                <select
                    id="libro-miembro"
                    name="miembroId"
                    value={campos.miembroId}
                    onChange={actualizarCampo}
                    required
                    aria-invalid={Boolean(errores.miembroId)}
                    aria-describedby="error-libro-miembro"
                >
                    <option value="">Seleccioná un miembro</option>

                    {miembros.map(function (miembro) {
                        return (
                            <option key={miembro.id} value={miembro.id}>
                                {miembro.nombre}
                            </option>
                        )
                    })}
                </select>

                <span
                    id="error-libro-miembro"
                    className="error-campo"
                    aria-live="polite"
                >
                    {errores.miembroId}
                </span>
            </div>

            {/* Envío y confirmación */}
            <button type="submit" className="boton">
                Agregar libro
            </button>

            <p className="mensaje-formulario" role="status">
                {mensaje}
            </p>
        </form>
    )
}

export default FormularioLibro