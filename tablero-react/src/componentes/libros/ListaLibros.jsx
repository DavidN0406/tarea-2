import TarjetaLibro from "./TarjetaLibro.jsx"

// Lista de tarjetas con un mensaje cuando no hay libros

function ListaLibros({ libros, miembros }) {
    // Evita mostrar una cuadrícula vacía.
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
                // Busca al miembro relacionado con este libro.
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
                    />
                )
            })}
        </div>
    )
}

export default ListaLibros