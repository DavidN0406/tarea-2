// Contenedor reutilizable para las secciones del tablero

function Panel({ titulo, children }) {
    return (
        <section className="panel">
            <h2 className="panel-titulo">{titulo}</h2>

            {/* Muestra el contenido colocado dentro de Panel. */}
            {children}
        </section>
    )
}

export default Panel