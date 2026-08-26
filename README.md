# EventoXpress-2.0

# Administracion de archivos
El proyecto estara dividido en 2 carpetas: Api y Client, la carpeta de api es el espacio donde se hara avances en el backend mientras que el client del frontend.

En api estaran las siguientes carpetas/archivos importantes:
- config: Se encarga de la configuracion y seed de la DB, ademas de la configuracion jwt.
- controllers: Aca estaran todos los archivos de las funciones correspondientes de una entidad. EJ: consumidor.js
- middlewares: Estaran todas las funciones de uso constante o intermediaras para los endpoints.
- models: Se encuentran todas las definicones sequelize de todas las entidades de la DB, asi como las relaciones entre ellas.
- routes: Estaran todas las rutas de los endpoints que juntarna todas las funciones de controllers y middlewares.
- Archivo app.js: Archivo principal para la funcionalidad del proyecto.

En client estaran las siguientes carpetas/archivos importantes:
- C src: Carpeta donde se almacenara todo lo relacionado al frontend.
- C components: Carpeta donde habra archivos y carpetas para armar y representar las distintas interfaces del frontend.
- A app.jsx: Archivo donde se almacenaran todas las rutas de nuestro proyecto
- A app.css: Archivo de configuracion de estilos central donde solo se pondran los estilos generales del proyecto.

Anotacion: Lo ideasl es que por cada interfaz haya un archivo css dedicado a ello, dando como resultado que cada interfaz tenga dos ccs el de app(general) y uno dedicado exclusivamente a el.

# Administracion de ramas
Tendremos dos ramas la main y desarrollo, la main sera la rama donde no se hara ninguna accion de desarrollo y solo se un merge(pull request) de desarrollo para su actualizacion. La de desarrollo sera el lugar donde estara todo el progreso del proyecto.

Ademas de estas dos habra una tercera que se creara en el momento en el que uno este hacienndo una tarea o progreso en el codigo, esta rama contara con el nombre de la tarea o progreso buscado. La funcion de esta rama es para evitar la perdida de avance de cada uno, una vez terminado lo buscado se hara un merge(pull request) de esta rama a la desarrollo y despues de eso se borra la tercera rama.
