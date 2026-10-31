// Dirección del servicio de búsqueda de Open Library
const URL_BUSQUEDA = "https://openlibrary.org/search.json";

// Búsqueda de libros solicitando solamente los datos necesarios

export async function buscarLibros(texto) {
    const consulta = encodeURIComponent(texto);

    // Campos utilizados en las tarjetas, el modal y la lista de lecturas.
    const campos = [
        "key",
        "title",
        "author_name",
        "first_publish_year",
        "cover_i",
        "edition_count"
    ].join(",");

    const respuesta = await fetch(
        `${URL_BUSQUEDA}?q=${consulta}&limit=12&fields=${campos}`
    );

    // Detiene la búsqueda si el servidor devuelve un estado de error.
    if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`);
    }

    // Extrae el arreglo de libros de la respuesta.
    const datos = await respuesta.json();

    return datos.docs;
}

// Envío de propuestas a la API de práctica

export async function enviarPropuesta(propuesta) {
    const respuesta = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(propuesta)
        }
    );

    // Una respuesta HTTP con error también debe detener el proceso.
    if (!respuesta.ok) {
        throw new Error(`Error al enviar la propuesta: ${respuesta.status}`);
    }

    // Convierte la respuesta JSON en un objeto de JavaScript.
    return respuesta.json();
}