# Estantería Común

Estudiante: David Navarro Shing
Tarea 2 / Programación Web Avanzada
Universidad CENFOTEC

El proyecto contiene dos aplicaciones para un club de lectura:

- Buscador público de libros, desarrollado con JavaScript, Bootstrap y Sass.
- Tablero interno de lecturas, desarrollado con React y Vite.

## Requisitos

- Node.js compatible con la versión de Vite instalada.
- npm.
- Un navegador moderno.
- Conexión a Internet para instalar dependencias y utilizar las APIs del buscador.

Cada aplicación tiene su propio package.json y sus propias dependencias.

## Parte A: buscador de libros

Desde la raíz del repositorio:

    cd buscador-js
    npm install
    npm run sass
    npm run dev

Abrir la dirección indicada por el servidor, normalmente:

    http://127.0.0.1:5500

El comando npm run sass compila scss/estilos.scss y genera
css/estilos.css. Debe ejecutarse nuevamente después de modificar
los archivos de Sass.

### Funcionalidades

- Buscar libros por título o autor mediante Open Library.
- Mostrar título, autores, año y portada.
- Mostrar una imagen alternativa cuando no hay portada disponible.
- Consultar detalles en un modal de Bootstrap.
- Agregar libros a una lista de lecturas sin duplicados.
- Cambiar entre Pendiente, Leyendo y Leído.
- Quitar libros de la lista.
- Mostrar animaciones al agregar, cambiar de estado y quitar.
- Proponer una lectura mediante un formulario validado.
- Agregar y quitar campos de autor, con un mínimo de uno y un máximo de cinco.
- Enviar propuestas mediante POST a JSONPlaceholder.

La lista de lecturas se mantiene en memoria. Al recargar la página,
los cambios se pierden.

JSONPlaceholder simula el registro de las propuestas; no las guarda
permanentemente.

### Organización del JavaScript

- js/api.js: consultas y envíos a los servicios externos.
- js/renderizado.js: creación y actualización de elementos del DOM.
- js/lecturas.js: datos y operaciones de la lista de lecturas.
- js/formulario.js: campos dinámicos y envío de propuestas.
- js/validacion.js: validación y mensajes por campo.
- js/app.js: coordinación de la búsqueda y los eventos de la lista.

Los estilos utilizan Bootstrap instalado localmente y personalizado
mediante Sass. Los resultados emplean una cuadrícula propia adaptable.

## Parte B: tablero de lecturas

Desde la raíz del repositorio:

    cd tablero-react
    npm install
    npm run dev

Abrir la dirección indicada por Vite, normalmente:

    http://localhost:5173

Si el puerto está ocupado, debe utilizarse la dirección que indique
la terminal.

### Funcionalidades

- Mostrar los libros del club y el miembro que los propuso.
- Agregar libros mediante un formulario controlado y validado.
- Cambiar el estado de una lectura.
- Quitar libros.
- Filtrar simultáneamente por estado y miembro.
- Mostrar un resumen por estado de los resultados filtrados.
- Mostrar un mensaje cuando no hay coincidencias.

Los datos iniciales se encuentran en src/data/libros.js y
src/data/miembros.js. Esta aplicación no consume APIs.

Los cambios se mantienen en memoria y se pierden al recargar.

### Organización de React

- src/App.jsx: estado compartido, acciones, filtros y cálculos derivados.
- src/data/: libros iniciales, estados de lectura y miembros.
- src/componentes/comunes/Panel.jsx: contenedor reutilizable con children.
- src/componentes/libros/: tarjetas, lista, formulario, filtros y resumen.
- src/index.css: estilos adaptables del tablero.

### Comprobaciones y compilación

Revisar el código con el analizador configurado:

    npm run lint

Generar la versión de producción:

    npm run build

Previsualizar la versión compilada:

    npm run preview

Abrir la dirección indicada por el comando de previsualización.

## Del DOM manual a React

En la Parte A, cambiar el estado de un libro requiere actualizar
los datos y la interfaz de forma explícita. El contenedor de la lista
tiene una escucha delegada de clics en js/app.js. El manejador
identifica la acción y el libro, llama a cambiarEstadoLectura()
de js/lecturas.js y después a actualizarEstadoEnFila()
de js/renderizado.js.

La función de renderizado busca la celda correspondiente, cambia
su textContent y aplica la clase de animación. Actualizar solamente
el objeto de la lista no cambia por sí solo lo que muestra la tabla.

En la Parte B, src/App.jsx guarda los libros mediante useState.
TarjetaLibro recibe la función alCambiarEstado a través de
ListaLibros y la llama con el identificador del libro.

La función cambiarEstadoLibro() utiliza setLibros y map para
crear un arreglo nuevo. Para el libro seleccionado devuelve una
copia con spread y el nuevo estado, conservando las demás propiedades.

React vuelve a renderizar los componentes y actualiza el DOM
según los nuevos datos. Ya no es necesario localizar una celda
ni modificar su textContent manualmente.

Los filtros también se guardan en App. La lista filtrada y los
conteos se calculan durante cada renderizado, sin almacenarlos
en estados adicionales. Por eso, al cambiar el estado de un libro,
la tarjeta, los resultados y el resumen se mantienen sincronizados.

## Depuración y rendimiento

El proceso de depuración y las mediciones de Network se documentan
en [docs/depuracion.md](docs/depuracion.md).

Las evidencias se encuentran en docs/capturas.

La consulta a Open Library se optimizó mediante el parámetro fields,
solicitando únicamente los campos utilizados. En la prueba documentada,
el JSON descomprimido pasó de 22,4 kB a 2,2 kB, aproximadamente un
90,2 % menos. La cantidad total de solicitudes se mantuvo en 41.