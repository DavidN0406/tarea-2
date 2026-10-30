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

    // Crea el botón que abrirá el detalle del libro
    const botonDetalle = document.createElement("button");
    botonDetalle.type = "button";
    botonDetalle.className = "btn btn-outline-primary";
    botonDetalle.textContent = "Ver detalle";

    // Indica a Bootstrap qué componente debe abrir y cuál es su identificador
    botonDetalle.setAttribute("data-bs-toggle", "modal");
    botonDetalle.setAttribute("data-bs-target", "#modal-libro");

    // Actualiza los datos del modal con el libro de esta tarjeta
    botonDetalle.addEventListener("click", function () {
        mostrarDetalleLibro(libro);
    });

    // Coloca los datos y el botón dentro de la tarjeta
    cuerpo.append(titulo, autores, anio, botonDetalle);
    tarjeta.append(portada, cuerpo);
    columna.append(tarjeta);

    // Devuelve la columna completa para insertarla en los resultados
    return columna;
}

// Actualiza el modal con los datos del libro seleccionado
function mostrarDetalleLibro(libro) {
    // Localiza los espacios del modal donde se mostrarán los datos
    const titulo = document.getElementById("modal-titulo");
    const autores = document.getElementById("modal-autores");
    const anio = document.getElementById("modal-anio");
    const ediciones = document.getElementById("modal-ediciones");

    // Une los autores para mostrarlos en una sola línea
    const nombresAutores = (libro.author_name || []).join(", ");

    // Inserta los datos como texto y cubre los valores que puedan faltar
    titulo.textContent = libro.title || "Título no disponible";
    autores.textContent = nombresAutores || "No disponibles";
    anio.textContent = libro.first_publish_year ?? "No disponible";
    ediciones.textContent = libro.edition_count ?? "No disponible";
}