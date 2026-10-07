# Portal para Autoridades de Mesa

TP universitario de Ingeniería de Software. Incluye la base del proyecto y
CU2: listado de charlas precargadas y consulta de su detalle; CU3: ubicación
de la sede en un mapa a partir de una consulta a USIG; y CU4: inscripción como
postulante con validaciones y persistencia local.

## Ejecutar en Windows / PowerShell

Con Node.js 22.19 o una versión compatible con Vite:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abrir la dirección que indique Vite en la terminal (normalmente
http://localhost:5173). Para detenerlo, presionar Ctrl+C.

```powershell
npm.cmd run build
npm.cmd run preview
```

`build` genera la compilación en `dist/`; `preview` permite probarla localmente.
En terminales que lo permitan, también se puede usar `npm` en lugar de `npm.cmd`.

## Estructura

- `src/components/`: componentes compartidos, como la barra de navegación.
- `src/pages/`: inicio, listado de charlas, detalle y formulario de inscripción.
- `src/data/charlas.js`: única fuente de las charlas y sus sedes precargadas.
- `src/services/usigService.js`: consulta a USIG y validación de su respuesta.
- `src/data/distritos.js`: lista predefinida de distritos electorales.
- `src/utils/`: formato de fechas y validaciones del formulario.
- `src/storage/solicitudesStorage.js`: acceso centralizado a localStorage y control de DNI duplicado.

Rutas: `/`, `/charlas`, `/charlas/:id` y `/inscripcion`.

React Router gestiona la navegación y Bootstrap aporta los estilos.
Leaflet y React-Leaflet muestran la ubicación con una capa base de OpenStreetMap.
CU4 usa localStorage. No hay backend ni base de datos externa.

## Datos de ejemplo de CU2

Las tres charlas y sus fechas son ficticias. Las sedes están en CABA y las
direcciones se verificaron con las siguientes fuentes oficiales:

- [Casa de la Cultura: Avenida de Mayo 575](https://buenosaires.gob.ar/gcaba_historico/casa-de-la-cultura-0).
- [Centro Cultural Recoleta: Junín 1930](https://turismo.buenosaires.gob.ar/es/otros-establecimientos/centro-cultural-recoleta).
- [Usina del Arte: Agustín R. Caffarena 1](https://buenosaires.gob.ar/descubrir/terror-sinfonico-en-la-usina).

No se almacenan coordenadas. Un identificador inexistente en `/charlas/:id`
muestra un mensaje y permite volver al listado.

## Ubicación de las sedes (CU3)

`DetalleCharla` consulta la dirección al cargar y cada vez que cambia. Cancela
la solicitud anterior al cambiar de dirección o abandonar la página, y muestra
estados de carga y error sin ocultar los datos de la charla.

El servicio usa el [normalizador oficial de USIG](https://servicios.usig.buenosaires.gob.ar/normalizar):

`https://servicios.usig.buenosaires.gob.ar/normalizar/`

Parámetros: `direccion`, `geocodificar=TRUE`, `srid=4326` y `maxOptions=2`.
Se requieren una sola coincidencia y coordenadas WGS84 válidas. De
`direccionesNormalizadas[0].coordenadas` se convierten `y` en latitud y `x`
en longitud; `srid` debe ser 4326. No se precargan ni guardan coordenadas.

`MapaSede` recibe esa ubicación y el nombre de la sede. Muestra un marcador
y los mosaicos de OpenStreetMap, que aportan la imagen del mapa y no geocodifican.
El CSS y las imágenes de los marcadores se importan desde Leaflet.

La consulta tiene un límite de 15 segundos. Si hay problemas de red, una
respuesta inválida, ninguna coincidencia o una dirección ambigua, se informa
que el mapa no está disponible. El mapa requiere conexión a USIG y OpenStreetMap.

## Inscripción de postulantes (CU4)

El formulario exige distrito electoral, datos personales y de contacto y respuestas
explícitas sobre antecedentes y afiliación. La agrupación política se exige solo
cuando se declara afiliación. Las charlas son opcionales y provienen exclusivamente
de `charlas.js`; se guardan sus IDs, sin copiar nombres, fechas ni sedes.

`validaciones.js` comprueba campos vacíos, DNI de 6 a 8 dígitos significativos,
formato de correo, fecha de nacimiento real y no futura, distrito de la lista y
respuestas Sí/No. No aplica una edad mínima ni restricciones sobre caracteres
del nombre. Los errores aparecen junto al campo y bloquean el guardado.

`solicitudesStorage.js` vuelve a validar antes de guardar y compara el DNI
normalizado (sin puntos, espacios ni ceros iniciales) contra las solicitudes
existentes. Todas pertenecen a una única convocatoria actual y se almacenan como
un arreglo JSON bajo `portal-autoridades-mesa:solicitudes:convocatoria-actual`.
Los fallos de acceso o escritura se informan; los datos corruptos no se sobrescriben.

Cada Solicitud contiene:

- `id`, `fechaRegistro`, `estado: "Pendiente"` y `distritoElectoral`.
- `postulante`: nombre, apellido, DNI, fecha de nacimiento, domicilio, teléfono y correo electrónico.
- `antecedentes`: `fueAutoridadMesa` y `cumplioCapacitaciones`, como booleanos.
- `afiliacionPolitica`: `afiliado` y, solo cuando corresponde, `agrupacion`.
- `charlasInteres`: arreglo de IDs, que puede estar vacío.

Al guardar se muestra la confirmación, se limpia el formulario y se deshabilita
el envío hasta que se comience una nueva carga. Recargar la página conserva las
solicitudes. El alcance de esta persistencia es el mismo navegador y origen
(protocolo, host y puerto); por ejemplo, `localhost` y `127.0.0.1` tienen
almacenamientos distintos. No se envían emails ni se aprueban o rechazan solicitudes.
