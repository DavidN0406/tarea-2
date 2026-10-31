import TarjetaLibro from "./TarjetaLibro.jsx"

// Lista de tarjetas: recibe los datos y las acciones desde App
function ListaLibros({ libros, miembros, alCambiarEstado, alQuitar }) {
    // Muestra un mensaje cuando la lista no tiene elementos.
    if (libros.length === 0) {
        return (
            <p className="mensaje-vacio" role="status">
                No hay libros para mostrar.
            </p>
        )
    }

    return (
        <div className="lista-libros">
            {libros.map(function (libro) {
                // Encuentra al miembro que propuso el libro.
                const miembro = miembros.find(function (persona) {
                    return persona.id === libro.miembroId
                })

                const nombreMiembro = miembro
                    ? miembro.nombre
                    : "Miembro no disponible"

                return (
                    <TarjetaLibro
                        key={libro.id}
                        libro={libro}
                        nombreMiembro={nombreMiembro}
                        alCambiarEstado={alCambiarEstado}
                        alQuitar={alQuitar}
                    />
                )
            })}
        </div>
    )
}

export default ListaLibros