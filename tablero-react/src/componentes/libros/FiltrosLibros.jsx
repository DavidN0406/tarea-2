// Controles para filtrar los libros por estado y miembro

function FiltrosLibros({
    estados,
    miembros,
    estadoSeleccionado,
    miembroSeleccionado,
    alCambiarEstado,
    alCambiarMiembro
}) {
    return (
        <div className="filtros-libros">
            {/* Filtro por estado de lectura */}
            <div className="campo-formulario">
                <label htmlFor="filtro-estado">Estado</label>

                <select
                    id="filtro-estado"
                    value={estadoSeleccionado}
                    onChange={(evento) => alCambiarEstado(evento.target.value)}
                >
                    <option value="">Todos los estados</option>

                    {estados.map(function (estado) {
                        return (
                            <option key={estado} value={estado}>
                                {estado}
                            </option>
                        )
                    })}
                </select>
            </div>

            {/* Filtro por miembro que propuso el libro */}
            <div className="campo-formulario">
                <label htmlFor="filtro-miembro">Miembro</label>

                <select
                    id="filtro-miembro"
                    value={miembroSeleccionado}
                    onChange={(evento) => alCambiarMiembro(evento.target.value)}
                >
                    <option value="">Todos los miembros</option>

                    {miembros.map(function (miembro) {
                        return (
                            <option key={miembro.id} value={miembro.id}>
                                {miembro.nombre}
                            </option>
                        )
                    })}
                </select>
            </div>
        </div>
    )
}

export default FiltrosLibros