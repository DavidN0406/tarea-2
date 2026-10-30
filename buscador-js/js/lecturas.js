// Guarda los libros agregados mientras la página permanece abierta
const lecturas = [];

// Agrega un libro y devuelve la lectura creada, o null si ya existe
export function agregarLectura(libro) {
    // Compara el identificador de Open Library para detectar duplicados
    const existe = lecturas.some(function (lectura) {
        return lectura.id === libro.key;
    });

    if (existe) {
        return null;
    }

    // Guarda los datos que necesita nuestra lista de lecturas
    const nuevaLectura = {
        id: libro.key,
        titulo: libro.title || "Título no disponible",
        autores: (libro.author_name || []).join(", ") || "No disponibles",
        estado: "Pendiente"
    };

    // Incorpora la lectura al arreglo en memoria
    lecturas.push(nuevaLectura);

    return nuevaLectura;
}

// Orden en que avanzan los estados de una lectura
const ESTADOS_LECTURA = ["Pendiente", "Leyendo", "Leído"];

// Cambia el estado del libro identificado y devuelve la lectura actualizada
export function cambiarEstadoLectura(id) {
    // Busca la lectura dentro del arreglo en memoria
    const lectura = lecturas.find(function (lectura) {
        return lectura.id === id;
    });

    // Evita continuar si no existe una lectura con ese identificador
    if (!lectura) {
        return null;
    }

    // Calcula la siguiente posición y vuelve al inicio después del último estado
    const posicionActual = ESTADOS_LECTURA.indexOf(lectura.estado);
    const siguientePosicion = (posicionActual + 1) % ESTADOS_LECTURA.length;

    lectura.estado = ESTADOS_LECTURA[siguientePosicion];

    return lectura;
}

// Quita el libro del arreglo y devuelve la lectura eliminada
export function quitarLectura(id) {
    // Encuentra la posición del libro que se desea quitar
    const posicion = lecturas.findIndex(function (lectura) {
        return lectura.id === id;
    });

    // findIndex devuelve -1 cuando no encuentra el libro
    if (posicion === -1) {
        return null;
    }

    // Conserva la lectura para poder informar cuál fue eliminada
    const lecturaEliminada = lecturas[posicion];

    // Elimina un elemento a partir de la posición encontrada
    lecturas.splice(posicion, 1);

    return lecturaEliminada;
}