import { useState } from "react"

import { librosIniciales, estadosLectura } from "./data/libros.js"
import { miembros } from "./data/miembros.js"

import Panel from "./componentes/comunes/Panel.jsx"
import ListaLibros from "./componentes/libros/ListaLibros.jsx"
import FormularioLibro from "./componentes/libros/FormularioLibro.jsx"
import FiltrosLibros from "./componentes/libros/FiltrosLibros.jsx"
import ResumenLecturas from "./componentes/libros/ResumenLecturas.jsx"

// Componente principal y estado compartido del tablero

function App() {
    // Datos y selecciones que pueden cambiar.
    const [libros, setLibros] = useState(librosIniciales)
    const [filtroEstado, setFiltroEstado] = useState("")
    const [filtroMiembro, setFiltroMiembro] = useState("")

    // Calcula los libros que cumplen ambos filtros.
    const librosFiltrados = libros.filter(function (libro) {
        const coincideEstado =
            filtroEstado === "" || libro.estado === filtroEstado

        const coincideMiembro =
            filtroMiembro === "" || libro.miembroId === filtroMiembro

        return coincideEstado && coincideMiembro
    })

    // Calcula los conteos a partir de los resultados actuales.
    const conteos = estadosLectura.map(function (estado) {
        const cantidad = librosFiltrados.filter(function (libro) {
            return libro.estado === estado
        }).length

        return {
            estado,
            cantidad
        }
    })

    // Agrega un libro con identificador propio y estado inicial Pendiente.
    function agregarLibro(datos) {
        const nuevoLibro = {
            ...datos,
            id: crypto.randomUUID(),
            estado: "Pendiente"
        }

        setLibros(function (librosActuales) {
            return [...librosActuales, nuevoLibro]
        })
    }

    // Avanza el estado del libro sin modificar el objeto original.
    function cambiarEstadoLibro(id) {
        setLibros(function (librosActuales) {
            return librosActuales.map(function (libro) {
                if (libro.id !== id) {
                    return libro
                }

                const posicionActual = estadosLectura.indexOf(libro.estado)
                const siguientePosicion =
                    (posicionActual + 1) % estadosLectura.length

                return {
                    ...libro,
                    estado: estadosLectura[siguientePosicion]
                }
            })
        })
    }

    // Genera una lista nueva sin el libro seleccionado.
    function quitarLibro(id) {
        setLibros(function (librosActuales) {
            return librosActuales.filter(function (libro) {
                return libro.id !== id
            })
        })
    }

    // Presentación del tablero a partir del estado actual.
    return (
        <main className="contenedor">
            <header className="encabezado-tablero">
                <h1>Estantería Común</h1>

                <p>
                    Organizá las lecturas del club y revisá quién
                    propuso cada libro.
                </p>
            </header>

            {/* Formulario para registrar nuevas lecturas */}
            <Panel titulo="Agregar una lectura">
                <FormularioLibro
                    miembros={miembros}
                    alAgregar={agregarLibro}
                />
            </Panel>

            {/* Filtros, resumen y lista comparten los datos de App. */}
            <Panel titulo={`Libros del club (${libros.length})`}>
                <FiltrosLibros
                    estados={estadosLectura}
                    miembros={miembros}
                    estadoSeleccionado={filtroEstado}
                    miembroSeleccionado={filtroMiembro}
                    alCambiarEstado={setFiltroEstado}
                    alCambiarMiembro={setFiltroMiembro}
                />

                <ResumenLecturas conteos={conteos} />

                <p className="cantidad-resultados" role="status">
                    Mostrando {librosFiltrados.length} de {libros.length} libros.
                </p>

                <ListaLibros
                    libros={librosFiltrados}
                    miembros={miembros}
                    alCambiarEstado={cambiarEstadoLibro}
                    alQuitar={quitarLibro}
                />
            </Panel>
        </main>
    )
}

export default App