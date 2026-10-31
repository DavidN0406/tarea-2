import { useState } from "react"

import { librosIniciales, estadosLectura } from "./data/libros.js"
import { miembros } from "./data/miembros.js"

import Panel from "./componentes/comunes/Panel.jsx"
import ListaLibros from "./componentes/libros/ListaLibros.jsx"
import FormularioLibro from "./componentes/libros/FormularioLibro.jsx"

// Componente principal y estado compartido del tablero

function App() {
    const [libros, setLibros] = useState(librosIniciales)

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
                // Conserva los libros que no corresponden al seleccionado.
                if (libro.id !== id) {
                    return libro
                }

                const posicionActual = estadosLectura.indexOf(libro.estado)
                const siguientePosicion =
                    (posicionActual + 1) % estadosLectura.length

                // Crea una copia del libro con el nuevo estado.
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

            {/* Formulario que comunica los nuevos libros a App */}
            <Panel titulo="Agregar una lectura">
                <FormularioLibro
                    miembros={miembros}
                    alAgregar={agregarLibro}
                />
            </Panel>

            <Panel titulo={`Libros del club (${libros.length})`}>
                <ListaLibros
                    libros={libros}
                    miembros={miembros}
                    alCambiarEstado={cambiarEstadoLibro}
                    alQuitar={quitarLibro}
                />
            </Panel>
        </main>
    )
}

export default App