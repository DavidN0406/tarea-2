// Elementos donde se muestran los mensajes y las tarjetas
const mensajeBusqueda = document.getElementById("mensaje-busqueda");
const contenedorResultados = document.getElementById("resultados");

// Imagen local para libros sin portada o imágenes que no carguen
const PORTADA_ALTERNATIVA = "img/sin-portada.svg";

// Actualiza el mensaje de búsqueda sin insertar HTML
export function mostrarMensaje(texto) {
    mensajeBusqueda.textContent = texto;
}

// Reemplaza los resultados anteriores por las tarjetas de la nueva búsqueda
export function mostrarLibros(libros) {
    // Elimina los elementos de la búsqueda anterior
    contenedorResultados.replaceChildren();

    // Crea una tarjeta por cada libro y la agrega a la página
    libros.forEach(function (libro) {
        const tarjeta = crearTarjetaLibro(libro);
        contenedorResultados.append(tarjeta);
    });
}

// Construye los elementos HTML de una tarjeta y devuelve su columna
function crearTarjetaLibro(libro) {
    // Organiza una tarjeta por fila en móvil, dos en md y tres en lg
    const columna = document.createElement("div");
    columna.className = "col-12 col-md-6 col-lg-4";

    // Agrupa la portada y los datos del libro
    const tarjeta = document.createElement("article");
    tarjeta.className = "card h-100";

    // Prepara la imagen y retrasa su carga hasta que se acerque a la pantalla
    const portada = document.createElement("img");
    portada.className = "card-img-top libro-portada";
    portada.loading = "lazy";

    // Sustituye una imagen que falle; el evento se atiende solo una vez
    portada.addEventListener("error", function () {
        portada.src = PORTADA_ALTERNATIVA;
        portada.alt = "Portada no disponible";
    }, { once: true });

    // Usa la portada de Open Library cuando existe su identificador
    if (libro.cover_i) {
        portada.src = `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg?default=false`;
        portada.alt = `Portada de ${libro.title || "libro sin título"}`;
    } else {
        portada.src = PORTADA_ALTERNATIVA;
        portada.alt = "Portada no disponible";
    }

    // Contenedor del texto dentro de la tarjeta
    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body";

    // Título del libro
    const titulo = document.createElement("h3");
    titulo.className = "card-title h5";
    titulo.textContent = libro.title || "Título no disponible";

    // Une los nombres del arreglo de autores en un solo texto
    const nombresAutores = (libro.author_name || []).join(", ");

    const autores = document.createElement("p");
    autores.className = "card-text";
    autores.textContent = `Autores: ${nombresAutores || "No disponibles"}`;

    // Muestra el año o un mensaje cuando el dato no viene en la respuesta
    const anio = document.createElement("p");
    anio.className = "card-text text-body-secondary";
    anio.textContent = `Primera publicación: ${libro.first_publish_year ?? "No disponible"}`;

    // Coloca cada elemento dentro de su contenedor
    cuerpo.append(titulo, autores, anio);
    tarjeta.append(portada, cuerpo);
    columna.append(tarjeta);

    // Devuelve la columna completa para insertarla en los resultados
    return columna;
}