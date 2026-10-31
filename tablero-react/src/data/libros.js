// Libros iniciales del club y el miembro que propuso cada uno
export const librosIniciales = [
    {
        id: "libro-1",
        titulo: "El principito",
        autor: "Antoine de Saint-Exupéry",
        estado: "Pendiente",
        miembroId: "miembro-1"
    },
    {
        id: "libro-2",
        titulo: "Cien años de soledad",
        autor: "Gabriel García Márquez",
        estado: "Leyendo",
        miembroId: "miembro-2"
    },
    {
        id: "libro-3",
        titulo: "Don Quijote de la Mancha",
        autor: "Miguel de Cervantes",
        estado: "Leído",
        miembroId: "miembro-3"
    }
]

// Orden en el que avanzan los estados de una lectura
export const estadosLectura = [
    "Pendiente",
    "Leyendo",
    "Leído"
]