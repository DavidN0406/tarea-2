// Dirección del servicio de búsqueda de Open Library
const URL_BUSQUEDA = "https://openlibrary.org/search.json";

// Consulta libros por el texto ingresado y devuelve hasta 12 resultados
export async function buscarLibros(texto) {
    // Adapta espacios y caracteres especiales para incluirlos en la URL
    const consulta = encodeURIComponent(texto);
    const url = `${URL_BUSQUEDA}?q=${consulta}&limit=12`;

    // Envía la petición y espera la respuesta del servidor
    const respuesta = await fetch(url);

    // Convierte una respuesta HTTP fallida en un error
    if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`);
    }

    // Convierte la respuesta JSON en un objeto de JavaScript
    const datos = await respuesta.json();

    // Open Library entrega el arreglo de libros dentro de "docs"
    return datos.docs;
}