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