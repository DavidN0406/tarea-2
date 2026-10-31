import { librosIniciales } from "./data/libros.js"
import { miembros } from "./data/miembros.js"

import Panel from "./componentes/comunes/Panel.jsx"
import ListaLibros from "./componentes/libros/ListaLibros.jsx"

// Componente principal: reúne los datos y las secciones del tablero

function App() {
    return (
        <main className="contenedor">
            {/* Presentación del tablero */}
            <header className="encabezado-tablero">
                <h1>Estantería Común</h1>

                <p>
                    Organizá las lecturas del club y revisá quién
                    propuso cada libro.
                </p>
            </header>

            {/* ListaLibros es el contenido children de Panel. */}
            <Panel titulo="Libros del club">
                <ListaLibros
                    libros={librosIniciales}
                    miembros={miembros}
                />
            </Panel>
        </main>
    )
}

export default App