// Presentación de un libro y del miembro que lo propuso

function TarjetaLibro({ libro, nombreMiembro }) {
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
        </article>
    )
}

export default TarjetaLibro