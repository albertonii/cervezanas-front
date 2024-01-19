# Listado de tareas:

- Planificación de reunión workshop. Crear un mapa de funcionalidades. Crear comunidad de testeo para la aplicación. Contar con ellos para la parte de testeo y los canales de comunicación para reportar el feedback. Ventas reales -> Los problemas reportarlos a una dirección de correo electrónico. Fechas para empezar a probar de verdad la aplicación

Para el viernes: Objetivos con presentación de Marketing y entusiasta. Demo técnica -> Tiene que ser rápida y sencilla. No más de 10 minutos. No más de 5 diapositivas. No más de 5 minutos de demo técnica.

- Hay que redactar el acuerdo de colaboración CERVEZANAS - PRODUCTOR - MIGUEL
- Securizar creación de un Productor, se mostrará un mensaje indicando que se ha realizado la petición, los admins deben de aceptar el registro del usuario
- Securizar creación de un Distribuidor, se mostrará un mensaje indicando que se ha realizado la petición, los admins deben de aceptar el registro del usuario
- Mostrar en el pedido de evento cual es el punto de consumo al que has comprado
- Para que un producto sea público debe de ser revisado antes por un administrador
- Comprobar que sign in con Google sea igual que por usuario y contraseña
- Modificar el precio de un producto asociado a un PC
- Calcula el peso del pedido en base a todos los productos que se tienen que enviar. Con esto sacamos el coste de envío
- Comprobar: si la app está en Dark Mode se pueda leer el QR
- Al entrar por primera vez con un usuario nuevo, recomendar que rellene la información básica de usuario
- Implementar Dark Mode -> Gustavo
- CRUD para una review de un producto comprado
- Historial de ventas en un punto de consumo
- Al borrar una review, confirmar la acción con un modal
- Componente para recuperar contraseña de usuario
- Comprobar que funcione SMTP para configuración de usuarios
- Sistema básico de gamificación -> al realizar compra, review, etc
- QR ID único para producto, fábrica, pc móvil, pc fijo, evento, usuario
- Sistema de stock para controlar las cantidades de cada producto/pack
- CRUD imágenes en productos
- CRUD imágenes en eventos
- Contratar servicios RESEND - SMTP
- Contratar servicios FV0 - API REST Servicios Sistema de Distribución
- Contratar plan de pago Supabase
- Editar una campaña
- Vincular productos a la campaña
- [] Hacer que las vistas en profile consumer sean homogéneas
- [] Hacer que las vistas en profile distributor sean homogéneas
- Al querer compartir un producto, crear la url con el id del producto que se desea enviar y configurar la autenticación necesaria para transmitir la cerveza a otro usuario
- Al guardar un evento con puntos de consumo, a veces no se guardan los PC -> Comprobar

# Tareas realizadas

- [x] Comprobar realización de compra de pedido y creación de business order
- [x] Visualizar pedido para el consumidor
- [x] Visualizar pedido y permitir actualización del estado del pedido para el productor
- [x] CRUD para indicar coste de distribución por parte del distribuidor
- [x] Mostrar coste de distribución al consumidor antes de hacer la compra
- [x] Cuando un usuario realiza su compra, debe de visualizarse todos los productos y todos los packs asociados a ello. Ahora mismo solo se está mostrando el primer producto comprado de la orden de compra.
- [x] Agrupar los pedidos de distribuidor si comparten mismo order Id. De esta forma sabrán que son de un mismo pedido.
- [x] Agrupar los pedidos de productos si comparten mismo order Id. De esta forma sabrán que son de un mismo pedido.
- [x] Asociar peso a cada pack de producto
- [x] Componente para visualizar las notificaciones recibidas -> Tanto leídas como no - en todos los roles: admin, productor, consumidor y distribuidor
- [x] Confirmar contraseña en el registro de usuario
- [x] Toggle mayoría de edad cuando se presiona el botón de crear cuenta
- [x] Crear campañas en formato listas
- [x] Comprobar que los buscadores estén funcionando para eventos, pc móviles y fijos
- [x] Configurar eventos
- [x] Hacer que las vistas en profile producer sean homogéneas
- [x] Reducir el código usado con componente InputLabel, InputTextarea, etc
- [x] Crear un carrito de la compra diferente por cada evento
- [x] Realizar compra de cerveza en un evento
- [x] Mostrar productos comprados en el checkout - pedido de compra
- [x] Componente para compartir en redes sociales
- [x] Insertar punto de consumo fijo sin errores -> Hay un glitch al escribir en el buscador del mapa. En los PC móviles no pasa
- [x] Vista de Puntos Fijos en evento
- [x] Configurar PC móviles
- [x] Configurar PC fijos
- [x] Al pulsar en editar evento -> Mostrar los PC Móviles asociados
- [x] Securizar vista de Barman al leer código QR
- [x] Componente para reportar problemas en la aplicación
- [x] En un producto dentro de un evento, hay que añadir el punto de consumo al que pertenece, si no hacemos esto -> se repetirán productos en el carrito de la compra si el pack es el mismo

# 29 de noviembre 23

La aplicación de Cervezanas se encuentra en un punto crítica para la salida en producción. En diciembre habrá un workshop para presentar el proyecto.
La documentación que existe es escasa y para el desarrollo de la aplicación se ha usado mucho “tirar de cabeza” debido al desarrollo individual del código, para tener un completo conocimiento de la misma, sus puntos flojos y mejoras debo de crear una documentación acorde a la calidad del código y proyecto.

Por ello, me pongo manos a la obra para la documentación del proyecto.

# 4 de diciembre 23

Documentación creada.

- Explicación y contexto de la aplicación
- Definición roles de usuario
- Casos de uso
- Diagrama de actividades
- Diagramas de relación de entidades

## Diagrama de Entidades - Sistema de Distribución

**https://app.diagrams.net/#G1q9oP0KnGLhab83OiCl2jmiIsUGwDaeu7**

Me encuentro en un punto donde la reutilización del conocimiento es primordial para no generar technical debt.
Para poder realizar una distribución efectiva, hay que tener en cuenta los factores que afectan al coste de distribución:

- Tamaño y peso del paquete
- Distancia
- Modo de transporte
- Tipo de envío

Hay que designar las áreas de cobertura de un distribuidor a partir de otra nueva tabla que tendrá en cuenta:

- Listado de sitios a los que da cobertura - string[]
- Listado de precios con un rango dependiendo del peso total del pedido que se va a realizar. Antes de generar el pedido se calcula el peso de todos los productos y sus packs para obtener el total. Se mostrará el precio según el rango configurado.
- Coste total del envío

Entonces, si el distribuidor configura que de 1 - 5kg de paquete cobra 10e por distribución y a partir de 5kg cobrará 15e.
Si tengo una orden de compra de 2 packs de cervezas Jaira donde cada una pesa 3KG, el coste de envío será --> 15e

---

18 de diciembre

# Sistema de distribución

- [x] Comprobar realización de compra de pedido y creación de business order
- [x] Visualizar pedido para el consumidor
- [x] Visualizar pedido y permitir actualización del estado del pedido para el productor
- [x] CRUD para indicar coste de distribución por parte del distribuidor
- [x] Mostrar coste de distribución al consumidor antes de hacer la compra
- Cuando un usuario realiza su compra, debe de visualizarse todos los productos y todos los packs asociados a ello. Ahora mismo solo se está mostrando el primer producto comprado de la orden de compra.

---

20 de diciembre

Seguimos con el sistema de distribución. Ahora mismo me interesa avanzar y, aunque se puedan calcular diferentes tipos de costes según la distribución, vamos a centrarnos en la tarifa plana diferenciando por área de cobertura: local, nacional, europea e internacional.

Se ha creado en BBDD el modelo flatrate_cost para asociar un precio a cada tipo de coste de distribución. Además, solo se comprobará si están sus booleanos a true.

Diagrama relacional Sistema de Distribución:
https://app.diagrams.net/#G1q9oP0KnGLhab83OiCl2jmiIsUGwDaeu7

---

26 de diciembre

Aunque ya se pueda asociar un coste de distribución a un pedido, es muy rústico y simplón. Debemos de saber cómo hacer la fórmula que indique los costes adecuados de envío.
Una buena alternativa es tener en cuenta el peso y dimensiones de cada producto comprado.
Quizás asociar una tarifa básica + suma de pesos de los productos.

--

8 de enero
InputLabel y InputTextarea creados, con ellos reduciré el código usado en toda la aplicación

12 enero

Subir imágenes de Cervezanas en el drive: vista de la homepage de Gustavo, imágenes de IA, fotografías del Hendrix, etc
Enfocarnos en los diseños para el webminar
Crear vídeo
Nos vamos al BBF a finales de marzo

---

17 de enero

Planificación de reunión workshop

Crear un mapa de funcionalidades

Crear comunidad de testeo para la aplicación. Contar con ellos para la parte de testeo y los canales de comunicación para reportar el feedback.

Ventas reales -> Los problemas reportarlos a una dirección de correo electrónico

Fechas para empezar a probar de verdad la aplicación

Para el viernes: Objetivos con presentación de Marketing y entusiasta. Demo técnica -> Tiene que ser rápida y sencilla. No más de 10 minutos. No más de 5 diapositivas. No más de 5 minutos de demo técnica.

Dar de alta cervezas y consumir Cervezas. Sin meternos en detalles de distribución.

Planificación de Cervezanas -> Pruebas y Feedback.

Crear componente dentro de la aplicación para reportar los errores que detecten los usuarios.

PARA EVENTOS - proximas iteraciones:
En los PC con o sin eventos -> Dejarles que ellos puedan meter su menú o carta de productos: cervezas que no sean nuestras, comida, etc.

Hay que redactar el acuerdo de colaboración CERVEZANAS - PRODUCTOR

Cada vez que se dé de alta un productor que se reciba un correo.

Solo mostrar productos de productores que sean supervisados por nosotros: estado de standby hasta aprobar al productor. Un correo para indicar que está en revisión su petición.

NOTIFICACIOón para dar de alta productor y distribuidor

--

19 de enero

- Securizar creación de un Productor, se mostrará un mensaje indicando que se ha realizado la petición, los admins deben de aceptar el registro del usuario

1. Crear un nuevo campo en la tabla de usuarios -> is_authorized: boolean
2. Lógica al iniciar sesión, si el usuario no está autorizado, se mostrará un mensaje indicando que está en revisión su petición
3. Vista en el panel de administración para autorizar a un usuario
4. Vista en el panel de administración para rechazar a un usuario
5. Vista en el panel de administración para ver todos los usuarios que están en revisión
6. Vista en el panel de administración para ver todos los usuarios que están autorizados
7. Vista en el panel de administración para ver todos los usuarios que están rechazados
