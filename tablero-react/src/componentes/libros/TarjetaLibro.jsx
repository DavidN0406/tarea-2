// Presentación del libro y botones para solicitar cambios a App
function TarjetaLibro({
    libro,
    nombreMiembro,
    alCambiarEstado,
    alQuitar
}) {
    return (
        <article className="tarjeta-libro">
            <h3 className="tarjeta-libro-titulo">
                {libro.titulo}
            </h3>

            <p>
                <strong>Autor:</strong> {libro.autor}
            </p>

            <p>
                <strong>Propuesto por:</strong> {nombreMiembro}
            </p>

            <p className="tarjeta-libro-estado">
                <strong>Estado:</strong> {libro.estado}
            </p>

            {/* Cada botón comunica el identificador del libro. */}
            <div className="acciones-libro">
                <button
                    type="button"
                    className="boton"
                    onClick={() => alCambiarEstado(libro.id)}
                >
                    Cambiar estado
                </button>

                <button
                    type="button"
                    className="boton boton-peligro"
                    onClick={() => alQuitar(libro.id)}
                >
                    Quitar
                </button>
            </div>
        </article>
    )
}

export default TarjetaLibro