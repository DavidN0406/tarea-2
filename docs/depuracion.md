# Depuración del buscador

## Problema encontrado

Al intentar buscar un libro, no aparecían resultados y parecía que
la página se recargaba.

En la consola se observó un error 404 al intentar cargar el archivo
`js/lecturas.js`.

## Causa

El archivo se llamaba `lectura.js`, pero la importación en `app.js`
utilizaba el nombre `lecturas.js`.

Esta diferencia impedía cargar el módulo y ejecutar la inicialización
de `app.js`. Por eso no se registraba el manejador del evento submit
que controla la búsqueda y evita el envío tradicional del formulario.

## Solución aplicada

Se corrigió el nombre del archivo para que coincidiera con la
importación: `lecturas.js`.

Después de corregirlo, la búsqueda pudo ejecutarse sin recargar
la página.

## Verificación con un punto de interrupción

El error original se identificó mediante la consola. Después de
corregirlo, se utilizó un breakpoint para revisar el funcionamiento
de la búsqueda.

1. Se abrió `app.js` en el panel Sources de DevTools.
2. Se colocó un breakpoint en la llamada a
   `mostrarLibros(libros, manejarAgregarLectura)`.
3. Se realizó una búsqueda con el texto `harry potter`.
4. La ejecución se detuvo antes de mostrar las tarjetas.
5. En Scope se comprobó que `libros` era un arreglo con 12 elementos.
6. Se retiró el breakpoint y se continuó la ejecución para comprobar
   que los resultados aparecían en la página.

Mientras la ejecución estaba pausada, el mensaje “Buscando libros...”
seguía visible porque todavía no se habían ejecutado las instrucciones
que muestran los resultados y actualizan el mensaje.

![Inspección de los resultados mediante un breakpoint](capturas/breakpoint-busqueda.png)

## Revisión de la consola

También se detectó una solicitud fallida a `favicon.ico`. Se agregó
un enlace al archivo `img/sin-portada.svg` dentro del head del HTML
para utilizarlo como ícono de la pestaña.

Los mensajes relacionados con extensiones se revisaron en una ventana
privada con las extensiones deshabilitadas. Tras la comprobación,
la búsqueda funcionó sin los errores anteriores.