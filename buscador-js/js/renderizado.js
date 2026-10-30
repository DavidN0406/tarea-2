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
export function mostrarLibros(libros, alAgregar) {
    // Elimina los elementos de la búsqueda anterior
    contenedorResultados.replaceChildren();

    // Crea una tarjeta por cada libro y la agrega a la página
    libros.forEach(function (libro) {
        const tarjeta = crearTarjetaLibro(libro, alAgregar);
        contenedorResultados.append(tarjeta);
    });
}

// Construye los elementos HTML de una tarjeta y devuelve su columna
function crearTarjetaLibro(libro, alAgregar) {
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

    // Botón para agregar este libro a la lista de lecturas
    const botonAgregar = document.createElement("button");
    botonAgregar.type = "button";
    botonAgregar.className = "btn btn-primary";
    botonAgregar.textContent = "Agregar a lecturas";

    // Avisa a app.js cuál libro eligió el usuario
    botonAgregar.addEventListener("click", function () {
        alAgregar(libro);
    });

    // Agrupa los botones y permite que bajen de línea cuando falta espacio
    const acciones = document.createElement("div");
    acciones.className = "d-flex flex-wrap gap-2";
    acciones.append(botonDetalle, botonAgregar);

    // Coloca los datos y las acciones dentro de la tarjeta
    cuerpo.append(titulo, autores, anio, acciones);
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

// Informa el resultado de una acción sobre la lista de lecturas
export function mostrarMensajeLecturas(texto, tipo = "success") {
    const mensaje = document.getElementById("mensaje-lecturas");

    // Usa una alerta de Bootstrap y muestra el texto recibido
    mensaje.className = `alert alert-${tipo}`;
    mensaje.textContent = texto;
    mensaje.hidden = false;
}

// Agrega una fila sin reconstruir las lecturas que ya estaban en pantalla
export function agregarFilaLectura(lectura) {
    const lista = document.getElementById("lista-lecturas");
    const mensajeVacio = document.getElementById("lecturas-vacias");

    // Relaciona la fila con el libro guardado en memoria
    const fila = document.createElement("tr");
    fila.dataset.id = lectura.id;

    // Nombre del libro
    const titulo = document.createElement("td");
    titulo.textContent = lectura.titulo;

    // Nombres de los autores
    const autores = document.createElement("td");
    autores.textContent = lectura.autores;

    // Marca la celda para poder actualizar solamente el estado
    const estado = document.createElement("td");
    estado.dataset.campo = "estado";
    estado.textContent = lectura.estado;

    // Celda que contiene las acciones de esta lectura
    const acciones = document.createElement("td");

    const grupoBotones = document.createElement("div");
    grupoBotones.className = "d-flex flex-wrap gap-2";

    // Identifica la acción sin registrar un evento en cada botón
    const botonEstado = document.createElement("button");
    botonEstado.type = "button";
    botonEstado.className = "btn btn-outline-primary btn-sm";
    botonEstado.textContent = "Cambiar estado";
    botonEstado.dataset.accion = "cambiar";

    // Botón para quitar la lectura
    const botonQuitar = document.createElement("button");
    botonQuitar.type = "button";
    botonQuitar.className = "btn btn-outline-danger btn-sm";
    botonQuitar.textContent = "Quitar";
    botonQuitar.dataset.accion = "quitar";

    // Organiza los botones dentro de la celda de acciones
    grupoBotones.append(botonEstado, botonQuitar);
    acciones.append(grupoBotones);

    // Inserta únicamente la nueva fila
    fila.append(titulo, autores, estado, acciones);
    lista.append(fila);

    // Oculta el mensaje inicial porque la lista ya contiene un libro
    mensajeVacio.hidden = true;
}

// Actualiza solamente la celda del estado en la fila seleccionada
export function actualizarEstadoEnFila(fila, lectura) {
    const celdaEstado = fila.querySelector('[data-campo="estado"]');

    celdaEstado.textContent = lectura.estado;
}

// Retira la fila seleccionada y comprueba si la tabla quedó vacía
export function quitarFilaLectura(fila) {
    fila.remove();

    const lista = document.getElementById("lista-lecturas");
    const mensajeVacio = document.getElementById("lecturas-vacias");

    // Muestra el mensaje inicial cuando ya no quedan filas
    mensajeVacio.hidden = lista.children.length > 0;
}