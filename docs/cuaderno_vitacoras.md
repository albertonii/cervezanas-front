# Listado de tareas:

- [ ] Añadir el IBU al crear producto
- [ ] Eliminar imágenes de la BBDD si los productos son eliminados
- Sistema para automatizar el stock de un producto (pack)
- Añadir awards de cerveza del mes para: comité de expertos, experimentales y de la comunidad
- Mostrar en el pedido de evento cual es el punto de consumo al que has comprado
- Modificar el precio de un producto asociado a un PC
- Calcula el peso del pedido en base a todos los productos que se tienen que enviar. Con esto sacamos el coste de envío
- Al entrar por primera vez con un usuario nuevo, recomendar que rellene la información básica de usuario
- Historial de ventas en un punto de consumo
- Componente para recuperar contraseña de usuario
- [ ] Comprobar que funcione SMTP para configuración de usuarios
- QR ID único para producto, fábrica, pc móvil, pc fijo, evento, usuario
- Sistema de stock para controlar las cantidades de cada producto/pack
- CRUD imágenes en productos
- CRUD imágenes en eventos
- Al querer compartir un producto, crear la url con el id del producto que se desea enviar y configurar la autenticación necesaria para transmitir la cerveza a otro usuario
- Al guardar un evento con puntos de consumo, a veces no se guardan los PC -> Comprobar
- Añadir en vista de eventos para admin los PC asociados a los eventos
- Para que un producto sea público debe de ser revisado antes por un administrador
- Indicar la relación de aspecto de todas las imágenes para reducir layout shift (cls - Cumulative Layout Shift): https://www.youtube.com/watch?v=RhZPNVshYWI

# WIP

- [ ] Historial de ventas en un punto de consumo
- [ ] Mostrar en el pedido de evento cual es el punto de consumo al que has comprado
- [ ] Implementar Dark Mode -> Gustavo
- [ ] En eventos, permitir pago en físico -> Saltar la pasarela de pago, indicar en la orden del pedido que se ha pagado en físico. El barman debe de dar el OK
- Conectar los servicios nuevos de Miguel con la aplicación
- Cervezanas en Producción

- REVIEWS
  Se ha deshabilitado la función de borrado en Reviews hasta que no exista una referencia a order_items y review para manejar si el objeto ha sido o no "criticado" por el usuario. Si se borra una review, se debe de cambiar el estado de order item is_reviewed a false. Si el producto ya ha sido criticado por el usuario, no permitir que se cree una nueva review si se compró otro pack del mismo producto.

  a. [x] CRUD para una review de un producto comprado
  b. Al borrar una review, confirmar la acción con un modal
  c. Al borrar review, cambiar el estado de order item is_reviewed a false
  d. Si el producto ya ha sido criticado por el usuario, no permitir que se cree una nueva review si se compró otro pack del mismo producto
  e. [x] Sistema básico de gamificación -> al realizar compra, review, etc
  f. Si creamos una review, añadir la experiencia a su sistema de gamificación
  g. Si borra una review, restar la experiencia a su sistema de gamificación
  h. Ver las reviews realizadas por un usuario

# FUTURE

- Editar una campaña
- Vincular productos a la campaña
- Vídeo de presentación de Cervezanas -> Código QR en eventos, etc.
- [ ] En los productos que se venden en el evento, administrar si está activo o no desde el panel de administración del productor
- [ ] Popup Modal con SignIn

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
- [x] Securizar creación de un Productor, se mostrará un mensaje indicando que se ha realizado la petición, los admins deben de aceptar el registro del usuario
- [x] Securizar creación de un Distribuidor, se mostrará un mensaje indicando que se ha realizado la petición, los admins deben de aceptar el registro del usuario
- [x] Mostrar imágenes de perfil y background en perfil
- [x] Contratar servicios RESEND - SMTP - MIGUEL
- [x] Contratar servicios FV0 - API REST Servicios Sistema de Distribución - MIGUEL
- [x] Contratar plan de pago Supabase - MIGUEL
- [x] Enviar correo a Miguel para contratar servicios
- [x] PDF acuerdo de colaboración Cervezanas - Productor
- [x] PDF acuerdo de colaboración Cervezanas - Distribuidor - miguel
- [x] Planificación de reunión workshop. Crear un mapa de funcionalidades. Crear comunidad de testeo para la aplicación. Contar con ellos para la parte de testeo y los canales de comunicación para reportar el feedback. Ventas reales -> Los problemas reportarlos a una dirección de correo electrónico. Fechas para empezar a probar de verdad la aplicación

Para el lunes: Objetivos con presentación de Marketing y entusiasta. Demo técnica -> Tiene que ser rápida y sencilla. No más de 10 minutos. No más de 5 diapositivas. No más de 5 minutos de demo técnica.

- [x] Crear presentación de workshop para el lunes
- [x] Crear cuenta de soporte de correos que termine en Cervezanas.eu
- [x] Comprobar porque no se ven los productos bien al estar creando los packs, product_multimedia y awards
- [x] Crear un onboarding a modo de tutorial para usuarios nuevos. Quizás redes sociales y youtube
- [x] ERROR AL Signup Distributor
- [x] Mandar email a los productores registrados en el evento, seguimiento
- [x] Hacer que las vistas en profile consumer sean homogéneas
- [x] Hacer que las vistas en profile distributor sean homogéneas
- [x] Comprobar qué sucede al acceder a eventos en producción.

## 29 de noviembre 23

La aplicación de Cervezanas se encuentra en un punto crítica para la salida en producción. En diciembre habrá un workshop para presentar el proyecto.
La documentación que existe es escasa y para el desarrollo de la aplicación se ha usado mucho “tirar de cabeza” debido al desarrollo individual del código, para tener un completo conocimiento de la misma, sus puntos flojos y mejoras debo de crear una documentación acorde a la calidad del código y proyecto.

Por ello, me pongo manos a la obra para la documentación del proyecto.

## 4 de diciembre 23

Documentación creada.

- Explicación y contexto de la aplicación
- Definición roles de usuario
- Casos de uso
- Diagrama de actividades
- Diagramas de relación de entidades

### Diagrama de Entidades - Sistema de Distribución

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

## 18 de diciembre

### Sistema de distribución

- [x] Comprobar realización de compra de pedido y creación de business order
- [x] Visualizar pedido para el consumidor
- [x] Visualizar pedido y permitir actualización del estado del pedido para el productor
- [x] CRUD para indicar coste de distribución por parte del distribuidor
- [x] Mostrar coste de distribución al consumidor antes de hacer la compra
- [ ] Cuando un usuario realiza su compra, debe de visualizarse todos los productos y todos los packs asociados a ello. Ahora mismo solo se está mostrando el primer producto comprado de la orden de compra.

---

## 20 de diciembre

Seguimos con el sistema de distribución. Ahora mismo me interesa avanzar y, aunque se puedan calcular diferentes tipos de costes según la distribución, vamos a centrarnos en la tarifa plana diferenciando por área de cobertura: local, nacional, europea e internacional.

Se ha creado en BBDD el modelo flatrate_cost para asociar un precio a cada tipo de coste de distribución. Además, solo se comprobará si están sus booleanos a true.

Diagrama relacional Sistema de Distribución:
https://app.diagrams.net/#G1q9oP0KnGLhab83OiCl2jmiIsUGwDaeu7

---

## 26 de diciembre

Aunque ya se pueda asociar un coste de distribución a un pedido, es muy rústico y simplón. Debemos de saber cómo hacer la fórmula que indique los costes adecuados de envío.
Una buena alternativa es tener en cuenta el peso y dimensiones de cada producto comprado.
Quizás asociar una tarifa básica + suma de pesos de los productos.

--

## 8 de enero

InputLabel y InputTextarea creados, con ellos reduciré el código usado en toda la aplicación

## 12 enero

Subir imágenes de Cervezanas en el drive: vista de la homepage de Gustavo, imágenes de IA, fotografías del Hendrix, etc
Enfocarnos en los diseños para el webminar
Crear vídeo
Nos vamos al BBF a finales de marzo

---

## 17 de enero

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

NOTIFICACIÓN para dar de alta productor y distribuidor

--

## 19 de enero

- Securizar creación de un Productor, se mostrará un mensaje indicando que se ha realizado la petición, los admins deben de aceptar el registro del usuario

1. [x] Crear un nuevo campo en la tabla de usuarios -> is_authorized: boolean
2. [x] Lógica al iniciar sesión, si el usuario no está autorizado, se mostrará un mensaje indicando que está en revisión su petición
3. [x] Notificar al administrador que hay un nuevo usuario que está en revisión
4. [x] Vista en el panel de administración para autorizar a un usuario
5. [x] Vista en el panel de administración para rechazar a un usuario

---

- Comprobar que sign in con Google sea igual que por usuario y contraseña
  No está funcionando... ¿puede que haya que verificar APP con Google?

---

Reunión -> Qué tiempo tienen para ir haciendo pruebas. Buscar unas fechas para empezar a probar de verdad la aplicación.
Que estaremos en BBF a finales de marzo.
Planificación de este año.

1. Comunidad y experiencias (itinerarios, etc) Queremos fomentar mucho las experiencias.
2. Producto online
3. Eventos

-- CREDENCIALES PARA SERVICIOS DE CONTRATACIONES -- LUNES

## 23 de enero

--

- [x] Merge de cambios en DESIGN
- [x] Eliminar todas las funcionalidades que no están terminadas:
  - [x] Campañas - Producer
  - [x] Reviews - Producer
  - [x] Lista de deseos - Consumer
  - [x] Feedback - Distributor
  - [x] Costes de distribución - Rango - Distributor
  - [x] Costes de distribución - Volumen y peso - Distributor
  - [x] Costes de distribución - Distancia - Distributor
  - [x] Área de cobertura - Ciudad - Distributor
  - [x] Área de cobertura - Provincia - Distributor
  - [x] Área de cobertura - Región - Distributor
  - [x] Área de cobertura - Europa - Distributor
- [x] Crear lista dinámica de productos del mes
- [x] Mostrar productos del mes en la homepage
- [ ] Comprobar que funciona Puntos Cervezanas -> MAPA
- [x] Lista de Puntos de Consumo para el ADMIN

--

## 24 de enero

- [x] Disclaimer para productor
- [x] Disclaimer para distribuidor
- [ ] Comprobar que funciona Puntos Cervezanas -> MAPA
- [x] Comprobar porque no se ven los productos bien al estar creando los packs, product_multimedia y awards
- [x] No está funcionado dentro de crear producto el estado de la sección de packs.
- [x] ESCONDER TODAS LAS FUNCIONALIDADES QUE ESTÉN A MEDIAS: Campaña, Lista de deseos, etc
- [x] Esconder login google
- [x] Grabar demo
- [x] Mirar error en checkbox para crear productor y distribuidor
- [x] Error al incrementar packs en el carrito de la compra -> Vista de producto en detalle y al finalizar la compra

---

## 25 de enero

- [x] Disclaimer modal al crear productor
- [x] Disclaimer modal al crear distribuidor
- [x] Error al incrementar packs en el carrito de la compra -> al finalizar la compra
- [x] Eroror vista de producto en detalle
- [ ] Comprobar que funciona Puntos Cervezanas -> MAPA
- [ ] Crear nueva entrada en tabla Gamification cada vez que se crea un usuario. Ya sea consumer, producer o distributor, todos tendrán gamificación -> Es extraño, con Customize_settings no da error
- [x] ESCONDER TODAS LAS FUNCIONALIDADES QUE ESTÉN A MEDIAS: Campaña, Lista de deseos, etc
- [x] Desplegar cambios
- [x] Preparar presentación

## 29 de enero

- [x] Convertir en single las relaciones entre tablas únicas desde Supabase: Product_multimedia -> https://github.com/supabase/postgrest-js/issues/223
- [ ] Comprobar que funciona Puntos Cervezanas -> MAPA
- [ ] Crear nueva entrada en tabla Gamification cada vez que se crea un usuario. Ya sea consumer, producer o distributor, todos tendrán gamificación -> Es extraño, con Customize_settings no da error
- [ ] ERROR AL CREAR DISTRIBUIDOR:
      Cuando insertamos un nuevo distribuidor a través de los triggers-function de supabase hay que asegurarse que existan todas las relaciones anteriores, es decir.
      Además de insertar en la tabla public.user insertaremos: public.distributor_user, public.coverage_areas, public.distribution_costs. Esto lo debemos de hacer así, PERO estamos usando una palabra reservada en distributor_user -> El identificador "user" está reservado, por lo que da error. Hay que cambiarlo por "user_id", luego realizar todas las modificaciones en la aplicación (types, llamadas api, etc) y luego podremos comprobar si está funcionando con el cambio.
- [ ] Distribution tiene una relación a origin_distributor que está apuntando a awards - ? - Arreglar esto.

### Convertir en single todas las relaciones necesarias - One to One Relation:

- [x] Beers -> Product
- [x] Reviews -> Product
- [x] Reviews -> User
- [x] Awards -> Product
- [x] Billing Info -> User
- [ ] Business Orders -> Order
- [ ] Business Orders -> Producer
- [ ] Business Orders -> Distributor
- [x] Campaign Items -> Product
- [x] Campaign Items -> Campaign
- [x] Campaign -> User
- [ ] Consumption Points -> User
- [x] Coverage Areas -> Distributor
- [x] CP Fixed -> Consumption Point
- [x] CP Mobile -> Consumption Point
- [x] CPF Events -> CP Fixed
- [x] CPF Events -> Event
- [x] CPM Events -> CP Mobile
- [x] CPM Events -> Event
- [x] CPF Products -> Product Pack
- [x] CPM Products -> Product Pack
- [x] Customize Settings -> User
- [x] Distribution -> Origin Distributor
- [x] Distribution -> Business Order
- [ ] Distribution Contract -> Producer
- [ ] Distribution Contract -> Distributor
- [x] Distribution Cost -> Distributor
- [x] Distributor -> User
- [x] Producer -> User
- [x] Event Order Items -> Event Order
- [x] Event Order Items -> Product Packs
- [x] Event Orders -> User
- [x] Event Orders -> Event
- [x] Events -> User
- [x] Fixed Event Order Items -> Product
- [x] Fixed Event Order Items -> Order
- [x] Fixed Event Order -> User
- [x] Fixed Event Order -> CP Fixed Owner
- [x] Flatrate cost -> Distribution Cost
- [x] Gamification -> User
- [x] Likes -> User
- [x] Local Distribution -> Coverage Area
- [x] Monthly Products -> Product
- [x] Notifications -> User Source
- [x] Notifications -> User Destination
- [x] Order Items -> Product Pack
- [x] Order Items -> Business Order
- [x] Orders -> User
- [x] Orders -> Shipping
- [x] Orders -> Billing
- [x] Orders -> Payment
- [ ] Product Inventory -> Product
- [ ] Product Lots -> User
- [ ] Product Lots -> Product
- [ ] Product Multimedia -> Product
- [ ] Product Pack -> Product
- [ ] Product -> User
- [ ] Profile Location -> User
- [ ] User Reports -> User

### 30 de enero

- [ ] Errores de supabase con los tipos de BBDD y Typescript
- [x] Pair programming con Gustavo. Hemos hablado de: semántica HTML, cómo funciona react y JSX, componentes de Nextjs como Image, estructura de carpetas de Nextjs, etc.

### 31 de enero

- [x] Errores de supabase con los tipos de BBDD y Typescript

### 2 de febrero

- [x] Nóminas firmadas
- [ ] Comprobar que funciona Puntos Cervezanas -> MAPA
- [ ] Crear nueva entrada en tabla Gamification cada vez que se crea un usuario. Ya sea consumer, producer o distributor, todos tendrán gamificación -> Es extraño, con Customize_settings no da error
- [ ] ERROR AL CREAR DISTRIBUIDOR:
      Cuando insertamos un nuevo distribuidor a través de los triggers-function de supabase hay que asegurarse que existan todas las relaciones anteriores, es decir.
      Además de insertar en la tabla public.user insertaremos: public.distributor_user, public.coverage_areas, public.distribution_costs. Esto lo debemos de hacer así, PERO estamos usando una palabra reservada en distributor_user -> El identificador "user" está reservado, por lo que da error. Hay que cambiarlo por "user_id", luego realizar todas las modificaciones en la aplicación (types, llamadas api, etc) y luego podremos comprobar si está funcionando con el cambio.
- [ ] Distribution tiene una relación a origin_distributor que está apuntando a awards - ? - Arreglar esto.
- [ ] Crear un onboarding Consumidor
- [ ] Crear un onboarding Productor
- [ ] Crear un onboarding Distribuidor

- REUNIÓN con Mariano y Miguel - Viernes 2
  Preparar el BBF, funcionalidades que haremos: crear un vídeo promocional, habrá una cata a ciegas, monografías por roles/onboarding, etc.

- Para el stand: necesitamos tener registradas las cervezas que vamos a llevar, los productores, los distribuidores, etc.
- Dossier: debe tener la parte comercial (la parte que engancha) y la parte de onboarding (guía de como se usa)
- Cata a ciegas: se regala la cerveza si se han dado de alta en la aplicación -> La parte de producción debe de estar dada de alta.
- Plan de testeo con productos reales.
- Necesitamos una política de precios para los productores y distribuidores. Cervezanas se lleva el X% de la venta.
  Arrancar con un porcentaje a producción y otro a la distribución.

EXPERIENCIAS EN EVENTOS:
Podemos vincular experiencias a los eventos. Para el tema de cata a ciegas, cuando se crea un evento, podemos indicar si se va a añadir la experiencia de cata a ciegas. Si fuera así, se indica la cantidad de productos que se van a exponer.

Vamos a escoger 3 cervezas, sin escoger fabricantes y diremos los tipos de cerveza o algo del tipo de cerveza que es. Será una cata a ciegas donde tendrán que adivinar el tipo de cerveza que están bebiendo. Pueden adivinar qué estilo de cerveza es o que cerveza es.

HAY QUE DISEÑAR LAS EXPERIENCIAS

Tenemos que crear un documento para especificar al máximo detalle qué experiencia ofreceremos en el BBF: el miércoles hablaremos de ello.

Hay que hacer los dossiers y demás con Gustavo.

---

### 5 de febrero

- [x] Actualizar funcionalidades en la documentación de Cervezanas
- [ ] Onboarding de los roles de usuario: añadir todas las funcionalidades, revisar con Gustavo para que pueda crear el Dossier.
- [x] Redactar la experiencia de cata a ciegas que realizaremos en el BBF
- [x] Crear vídeo presentación Cervezanas - 25 de enero
- [x] Enviar vídeo a Cristian, planear vídeo de promoción Cervezanas
- [ ] Arreglar creación de usuario Distribuidor
- [ ] Poner a punto la producción en Supabase

### 6 de febrero

- [ ] Onboarding de los roles de usuario: añadir todas las funcionalidades, revisar con Gustavo para que pueda crear el Dossier.
- [x] ERROR AL CREAR DISTRIBUIDOR:

  Mostrar mensaje de error si no se ha creado el usuario. En el caso de distribuidor me lanza un mensaje de violación de foreign key constraint coverage_areas_distribution_id_fkey
  Cuando insertamos un nuevo distribuidor a través de los triggers-function de supabase hay que asegurarse que existan todas las relaciones anteriores, es decir, además de insertar en la tabla public.user insertaremos: public.distributor_user, public.coverage_areas, public.distribution_costs. Esto lo debemos de hacer así, PERO estamos usando una palabra reservada en distributor_user -> El identificador "user" está reservado, por lo que da error. Hay que cambiarlo por "user_id", luego realizar todas las modificaciones en la aplicación (types, llamadas api, etc) y luego podremos comprobar si está funcionando con el cambio.

  Lo que podemos hacer por ahora... es quitar la inserción a través de los triggers-function y hacerlo a través de la aplicación. De esta forma, nos aseguramos que se inserta correctamente.

- [ ] Poner a punto la producción en Supabase.
      Se han eliminado las tablas que no se usan y corregido algunos atributos de variables.

### 8 de febrero

- [x] Onboarding de los roles de usuario: añadir todas las funcionalidades, revisar con Gustavo para que pueda crear el Dossier.
      Se han eliminado las tablas que no se usan y corregido algunos atributos de variables.
- [x] Error con next-intl locales y timezone
- [ ] Monitoreo y tracking de errores en la aplicación
- [ ] Poner a punto la producción en Supabase
      Nos hemos quedado en crear la tabla coverage_areas -> Seguir hacia abajo

--- Reunión organización BBF --- Gustavo, Mariano, M. Angel, Alberto

#### Creación de dossier: debe de ser un documento que enganche, que sea atractivo, que sea fácil de leer, que sea visual, que sea atractivo. Debe de tener la parte comercial (la parte que engancha) y la parte de onboarding (guía de como se usa)

Dossier por roles: consumidor, productor, distribuidor
¿Qué funcionalidades tiene cada uno de los roles? -> Onboarding técnico

Además de que estén los dossier físicamente, pueden estar con código QR y alojados en la web. Tener impresos los QR para los enlaces con el onboarding y dárse de alta.
Habrán dossiers físicos pero no imprimiremos tanto para distribuidores como para productores/consumidores.

Necesitamos posavasos con el código QR para valorar el producto de la cata a ciegas.

#### Cata a ciegas

Al escanear el código QR, el punto de consumo debe de dar el OK para empezar con la cerveza. Hacemos esto pq estas experiencias pueden ser de pago. Si fueran todas gratuitas, no habría problema y no haría falta el OK.

Experiencia del evento: si hay varios PC que usen esta experiencia, se va haciendo un recuento de en cuales ha participado. Esto nos servirá de gamificación y para poder ganar el premio Cervezanas si consiguen acertar todo para todos los PCs.

Insignia para aquellos que han acertado a todas las cervezas de la cata a ciegas.

En vez de Cata a Ciegas -> ¿Quieres jugar a ser Maestro Cervecero?

Dar de alta en cada PC preguntas y respuestas para el juego de Maestro Cervecero.

### 9 de Febrero

- [x] Crear documento Experiencia Maestro Cervecero
- [x] Crear documento Ejemplos Preguntas y Respuestas Genéricas Maestro Cervecero
- [ ] Monitoreo y tracking de errores en la aplicación
- [x] Poner a punto la producción en Supabase
      [x] Nos hemos quedado en crear la tabla coverage_areas -> Seguir hacia abajo
      [x] Todas las tablas han sido modificadas y sincronizadas con desarrollo
      [x] Políticas, supabase storage y FK referencias únicas actualizadas en desarrollo
- [ ] Comprobar que funciona Puntos Cervezanas -> MAPA
- [ ] Distribution tiene una relación a origin_distributor que está apuntando a awards - ? - Arreglar esto.
- [ ] Para pagar. Puede ser in situ (pago con pulsera o como quiera el stand) o a través de Cervezanas.
- [ ] Hay que indicar que la participación en la experiencia es de pago.

- REVIEWS
  Se ha deshabilitado la función de borrado en Reviews hasta que no exista una referencia a order_items y review para manejar si el objeto ha sido o no "criticado" por el usuario. Si se borra una review, se debe de cambiar el estado de order item is_reviewed a false. Si el producto ya ha sido criticado por el usuario, no permitir que se cree una nueva review si se compró otro pack del mismo producto.

  a. [x] CRUD para una review de un producto comprado
  b. Al borrar una review, confirmar la acción con un modal
  c. Al borrar review, cambiar el estado de order item is_reviewed a false
  d. Si el producto ya ha sido criticado por el usuario, no permitir que se cree una nueva review si se compró otro pack del mismo producto
  e. [x] Sistema básico de gamificación -> al realizar compra, review, etc
  f. Si creamos una review, añadir la experiencia a su sistema de gamificación
  g. Si borra una review, restar la experiencia a su sistema de gamificación
  h. Ver las reviews realizadas por un usuario

- [ ] Comprobar porque no se ven los productos bien al estar creando los packs, product_multimedia y awards
- [ ] Redactar el acuerdo de colaboración CERVEZANAS - PRODUCTOR/DISTRIBUIDOR - MIGUEL
- [ ] Comprobar: si la app está en Dark Mode se pueda leer el QR -> Gustavo
- [ ] Notificaciones a través de email - SMTP
  - Cuando se da de alta un productor/distribuidor

#### Reunión - Mariano, M Angel, Gustavo, Alberto --- Experiencia Maestro Cervecero

Para futuro: en un PC se puede hacer citas previas para usar esta experiencia. Puede estar planificado o no -> Si es planificado es con registro.

- [x] Redacción de preguntas a posteriori -> después de catar la cerveza.
- [x] Cambiar cerveza misteriosa por cerveza sorpresa.
- [x] Indicar que conseguirán la cerveza si consiguen todos los logros. Estamos regalando la cerveza para fomentar los logros de los demás.

- [x] Arreglar los problemas con los tipos al ejecutar script pnpm gen-types:dev

---

### 12 de febrero

- [x] Merge cambios de Design

### 14 de febrero

- [x] Error en checkout online
- [x] Reunión Mariano
- [x] Primera versión de experiencias Cervezanas para configuración del productor

### 15 de febrero

- [ ] Añadir experiencia Cervezanas a un PC en un evento
- [ ] Añadir un precio de inscripción a la experiencia
- [ ] Seleccionar una Cerveza para la experiencia. Vincularla a la experiencia con las preguntas y respuestas preconfiguradas.
- [ ] Revisión de contratos con Productores de Cervezas - https://docs.google.com/document/d/1xNllZMIvOH6h0FkmGw1UuNG7zjnvn9S2q_erBB2IGkM/edit

---

### 16 de febrero

- [x] Reunión 16 de febrero - Joan Fiol -> BBF
- [ ] Sign in Google
- [ ] Añadir experiencia Cervezanas a un PC en un evento
- [x] Añadir un precio de inscripción a la experiencia
- [ ] Seleccionar una Cerveza para la experiencia. Vincularla a la experiencia con las preguntas y respuestas preconfiguradas.
- [ ] Revisión de contratos con Productores de Cervezas - https://docs.google.com/document/d/1xNllZMIvOH6h0FkmGw1UuNG7zjnvn9S2q_erBB2IGkM/edit

### 19 de febrero

- [x] Sign in Google
- [ ] Error (a veces) al iniciar sesión con un usuario. Lanza error "Rendered more hooks than during the previous render". Hay que localizar el componente que está generando el conflicto. Puede que sea un useCallback
- [ ] Añadir experiencia Cervezanas a un PC en un evento
- [ ] Seleccionar una Cerveza para la experiencia. Vincularla a la experiencia con las preguntas y respuestas preconfiguradas.
- [ ] Revisión de contratos con Productores de Cervezas - https://docs.google.com/document/d/1xNllZMIvOH6h0FkmGw1UuNG7zjnvn9S2q_erBB2IGkM/edit

### 20 de febrero

- [x] Error (a veces) al iniciar sesión con un usuario. Lanza error "Rendered more hooks than during the previous render". Hay que localizar el componente que está generando el conflicto.
      El error era debido a que en AppContext se estaba renderizando un if baśandose en la variable isLoggedIn y renderizando otro elemento de carga.
- [x] Problemas con re-renderizados al abrir un modal -> El Footer Pagination se volvía a renderizar.

- [ ] Añadir experiencia Cervezanas a un PC en un evento
- [ ] Seleccionar una Cerveza para la experiencia. Vincularla a la experiencia con las preguntas y respuestas preconfiguradas.
- [ ] Revisión de contratos con Productores de Cervezas - https://docs.google.com/document/d/1xNllZMIvOH6h0FkmGw1UuNG7zjnvn9S2q_erBB2IGkM/edit
- [ ] Arreglar restablecer contraseña

### 22 de febrero

- [ ] Añadir experiencia Cervezanas a un PC en un evento
- [~] Seleccionar una Cerveza para la experiencia. Vincularla a la experiencia con las preguntas y respuestas preconfiguradas.

Estamos peleando con el update de Experiencias y Cervezas con Q&A

- [ ] Revisión de contratos con Productores de Cervezas - https://docs.google.com/document/d/1xNllZMIvOH6h0FkmGw1UuNG7zjnvn9S2q_erBB2IGkM/edit
- [ ] Arreglar restablecer contraseña

### 23 de febrero

- [~] Seleccionar una Cerveza para la experiencia. Vincularla a la experiencia con las preguntas y respuestas preconfiguradas.

  1. [x] Añadir Experiencia
  2. [x] Añadir Cerveza a la experiencia
  3. [x] Añadir preguntas y respuestas a la experiencia
  4. [x] Actualizar Experiencia
  5. [x] Actualizar Cerveza de la experiencia
  6. [x] Actualizar preguntas y respuestas de la experiencia
  7. [x] Eliminar Experiencia
  8. [x] Eliminar preguntas y respuestas de la experiencia
  9. [ ] Error al obtener experiencias (a veces)
  10. [x] Display input errors para los formulario de creación y actualización

- [x] Añadir experiencia Cervezanas a un PC en un evento

  1. [x] Añadir experiencia a un nuevo evento
  2. [x] Actualizar las experiencias en un evento existente
  3. [x] Mostrar mensajes de error en formulario

- [ ] Visualizar el juego de maestro cervecero en el PC
  1. [x] Mostrar preguntas y respuestas en PUNTO de CONSUMO
  2. [ ] Cards para preguntas y respuestas
  3. [ ] Loop a través de las preguntas en el juego
  4. [ ] Al final mostrar cerveza en juego
  5. [ ] Mostrar puntuación

--- Reunión Mariano, Miguel, Gustavo, Alberto

Crear página explicativa que llevará el dossier. Al leer el QR del dossier abrirá la página del evento explicativo SOLO con las experiencias que están asociadas para cada punto de consumo.
Breve explicación de cómo es el juego de maestro cervecero. Información acerca del Evento (nombre, fecha, descripción). Tarjetas informativas con los puntos de consumo con las experiencias asociadas (pueden ser iconos, al presionar al icono te llevará a la página del PC para que pueda registrarse en la experiencia).

Habilitar formulario para feedbacks/reporte de errores

### 26 de febrero

- [ ] Crear página explicativa que llevará el dossier. Al leer el QR del dossier abrirá la página del evento explicativo SOLO con las experiencias que están asociadas para cada punto de consumo. Breve explicación de cómo es el juego de maestro cervecero. Información acerca del Evento (nombre, fecha, descripción). Tarjetas informativas con los puntos de consumo con las experiencias asociadas (pueden ser iconos, al presionar al icono te llevará a la página del PC para que pueda registrarse en la experiencia).

- [ ] Habilitar formulario para feedbacks/reporte de errores

- [~] Visualizar el juego de maestro cervecero en el PC 2. [ ] Cards para preguntas y respuestas 3. [ ] Loop a través de las preguntas en el juego 4. [ ] Al final mostrar cerveza en juego 5. [ ] Mostrar puntuación

### 13 de marzo

- [ ] Crear página explicativa que llevará el dossier. Al leer el QR del dossier abrirá la página del evento explicativo SOLO con las experiencias que están asociadas para cada punto de consumo. Breve explicación de cómo es el juego de maestro cervecero. Información acerca del Evento (nombre, fecha, descripción). Tarjetas informativas con los puntos de consumo con las experiencias asociadas (pueden ser iconos, al presionar al icono te llevará a la página del PC para que pueda registrarse en la experiencia).

- [ ] Habilitar formulario para feedbacks/reporte de errores
- [ ] Arreglar restablecer contraseña -> Se está enviando el código para poder restablecer la contraseña. Hacer los redireccionamientos oportunos para poder trabajar en pre y producción.
- [ ] Revisión de contratos con Productores de Cervezas - https://docs.google.com/document/d/1xNllZMIvOH6h0FkmGw1UuNG7zjnvn9S2q_erBB2IGkM/edit
- [ ] Poner a punto la producción en Supabase
- [ ] Comprobar que funciona Puntos Cervezanas -> MAPA
- [ ] En eventos, permitir pago en físico -> Saltar la pasarela de pago, indicar en la orden del pedido que se ha pagado en físico. El barman debe de dar el OK
- [ ] Mostrar en el pedido de evento cual es el punto de consumo al que has comprado

---

- [x] Optimizar estructura del juego de maestro cervecero

1. [x] Nueva estructura de datos
2. [x] Modal para añadir experiencia con el juego
3. [x] Modal para editar la experiencia con el juego
4. [x] Modal para eliminar la experiencia con el juego
5. [x] Eliminar el modelo de datos antiguo en BBDD DEV

- [x] Visualizar el juego de maestro cervecero en el PC

1. [x] Cards para preguntas y respuestas
2. [x] Loop a través de las preguntas en el juego
3. [x] Al final mostrar cerveza/as en juego
4. [x] Mostrar puntuación
5. [x] Hay veces donde no se muestra el juego una vez que está pagado.
6. [x] Si ya ha participado en la experiencia, impedir que se registre de nuevo.

### 14 de marzo

- [x] Crear página explicativa que se accede desde el dossier. Al leer el QR del dossier abrirá la página del evento explicativo SOLO con las experiencias que están asociadas para cada punto de consumo. Breve explicación de cómo es el juego de maestro cervecero. Información acerca del Evento (nombre, fecha, descripción). Tarjetas informativas con los puntos de consumo con las experiencias asociadas (pueden ser iconos, al presionar al icono te llevará a la página del PC para que pueda registrarse en la experiencia).

- [x] Hay veces que no se carga el listado de experiencias en Productor: Error debido a que se hace la llamada Fetch en el listado de experimentos antes de que se haya podido carga el user ID con el que se buscará el listado.
- [x] Añadir precio a la experiencia
- [ ] Breadcrumb para poder volver al apartado del evento donde esté la experiencia
- [x] Botón para volver al evento
- [ ] Habilitar formulario para feedbacks/reporte de errores
- [ ] Arreglar restablecer contraseña -> Se está enviando el código para poder restablecer la contraseña. Hacer los redireccionamientos oportunos para poder trabajar en pre y producción.- [x] Revisión de contratos con Productores de Cervezas - https://docs.google.com/document/d/1xNllZMIvOH6h0FkmGw1UuNG7zjnvn9S2q_erBB2IGkM/edit
- [ ] Comprobar que funciona Puntos Cervezanas -> MAPA
- [ ] En eventos, permitir pago en físico -> Saltar la pasarela de pago, indicar en la orden del pedido que se ha pagado en físico. El barman debe de dar el OK
- [ ] Mostrar en el pedido de evento cual es el punto de consumo al que has comprado
- [x] Error con carrito de eventos -> Se estaba creando un estado vacío, por lo que daba error. Ahora comprueba cada vez que se acceda que exista un carrito de compra para ese evento.
- [ ] Mostrar vista de detalles del producto que existen en el evento -> Punto de Consumo.
- [x] Notificación/Mensaje en el botón de experiencias -> Solo accesible para usuarios registrados
- [ ] Después de realizar el juego de Maestro Cervecero, crear el recuento de puntos para ese evento.
- [ ] Crear tabla de descuentos obtenidos por el usuario en el evento
- [x] Añadir los contratos que deben aceptar los productores y distribuidores al registrarse en la aplicación
- [ ] Eliminar elementos del carrito en el evento

- [WIP] Lógica para participar en una experiencia

  1. [x] Vista de administración para el productor donde pueda ver los registros de los usuarios en las experiencias.
  2. [x] Si ya ha participado en la experiencia, impedir que se registre de nuevo.
  3. [x] Si ya ha participado en la experiencia, mostrar mensaje de que ya ha participado.
  4. [x] Solo pueden participar usuarios consumidores en la experiencia.
  5. [x] Generar un código QR cuando se registre el usuario en la experiencia. Ese código QR es el que mostrará al PC para que pueda participar en la experiencia. El PC debe de escanear el código QR para que el usuario pueda participar en la experiencia y validar el pago.
  6. [ ] Listado de experiencias en un evento las cuales el productor puede administrar. Por ejemplo, para el Maestro Cervecero, se indica el registro, la persona que lo ha hecho y el estado del registro (pagado, no pagado, etc).
  7. [ ] Notificar al PC cuando un usuario se ha registrado en una experiencia.

### 15 de marzo

- [x] Para poder participar en la experiencia -> Poner pago en local - o en el comercio.
- [x] Quitar los productos que se van a vender en el evento, debido a que el propio stand se encargará de ello.
- [ ] Poner a punto la producción en Supabase
- [ ] Que esté todo ok con TPV Santander
- [ ] Popup Modal con SignIn
- [x] Para poder participar en la experiencia -> Poner pago en local - o en el comercio.
- [ ] Realtime actualizacion para experiencia pagada
- [ ] En el caso del stand de Cervezanas, que habrán 2 cervezas para la experiencia de Maestro Cervecero, ¿cómo se cuentan las experiencias? Pq cada una tiene un precio distinto... En la experiencia permitir añadir varias cervezas. Y mostrar en el juego todas las cervezas.
- [ ] Mínimo de haber participado en 4 experiencias para poder participar en el concurso de las 2 entradas y premios.
- [ ] Todos tienen descuento de un 10% en las compras online. Los que más puntos tengan (top 100) en el juego de Maestro Cervecero, tendrán más premios. Recibiras el resultado del concurso en la dirección de correo.
- [x] Quitar los productos que se van a vender en el evento.
- [ ] Todos tienen descuento de un 10% en las compras online. Los que más puntos tengan (top 100) en el juego de Maestro Cervecero, tendrán más premios. Recibiras el resultado del concurso en la dirección de correo.
- [x] En los productos que se venden en el evento, indicar que se venden en el evento. Propiedad is_active en el modelo de datos.
- [~] Para el lunes deben estar los productos de CCVK - además de darse de alta como productor y distribuidor

- [x] Experiencia Completa de Maestro Cervecero

  1. [x] Mostrar el número de experiencias que hay en un evento
  2. [x] Mostrar el número de experiencias que ha realizado un usuario
  3. [x] Sumar los resultados obtenidos en cada experiencia
  4. [~] Mínimo de haber participado en 4 experiencias para poder participar en el concurso de las 2 entradas y premios. Como tendremos el registro de la gente que ha participado, podremos saber si ha participado en 4 experiencias y por lo tanto, incluirlos en un sorteo.
  5. [~] Si participa en 1 experiencia como mínimo, tendrá el descuento de 10% en la siguiente compra online.
  6. [FUTURO] Ranking de TOP 100 de usuarios que han participado en el juego de Maestro Cervecero.
  7. [x] Indicar número de experiencias en el Punto de Consumo
  8. [x] Al participar en una experiencia, introducir las respuestas acertadas y las incorrectas
  9. [x] Al terminar la partida, sumar los puntos en la tabla de BMExperienceParticipants

- [WIP] Evento Cervezanas con usuario ADMINISTRADOR

  1. [x] Crear un evento con la cuenta de Administrador de Cervezanas
  2. [x] Listado de todos los Puntos de Consumo que se pueden añadir al evento. Como es el administrador tendrá acceso a todos los PC existentes
  3. [x] Registrar Puntos de Consumo en EVENTOS CERVEZANAS.
  4. [ ] Si se registra un PC en un evento de Cervezanas a través del ADMINISTRADOR: notificar al productor de ello
  5. [ ] Si se registra un PC en un evento de Cervezanas a través del ADMINISTRADOR: visualizar en el apartado de eventos acerca de ello.
  6. [x] Mostrar solo los eventos autorizados. En el caso de que lo cree el administrador, automáticamente se autoriza.

- [x] Error al modificar un producto en el productor

- [FUTURE] Añadir botón de autorización/desautorización en UpdateEvent
- [ ] Error al signup -> TRIGGER FUNCTION

### 17 de marzo

- [x] Arreglar SIGN UP. No está creando la información necesaria en los schemas PUBLIC.
- [x] Sistema para vincular las experiencias con los puntos de consumo en los eventos que sean creados por el ADMINISTRADOR de CERVEZANAS

- [x] Problemas con la autorización de usuarios en el apartado para administradores:
      ⨯ Error: Unable to find `next-intl` locale because the middleware didn't run on this request. See https://next-intl-docs.vercel.app/docs/routing/middleware#unable-to-find-locale
      Se estaban usando el hook para traducir en el sidebar en un elemento que era Server Component: layout de ADMINISTRADOR.

- [x] Hay veces que no se cargan los listados para eventos -> PRODUCER

- [WIP] Eventos Cervezanas

  1. [x] Si se crea un Evento Cervezanas y se añaden PC a través del ADMINISTRADOR, notificar al productor de ello
  2. [x] Si se crea un evento Cervezanas y se añaden PCs a través del ADMINISTRADOR, visualizar en el apartado de eventos del productor acerca de ello.
  3. [x] Debido a que un administrador puede añadir un PC que no le pertenecen, debe de existir una relación entre ese evento y el punto de consumo (ICPM_events). De esta forma, el productor podrá ver si su PC ha sido añadido a un evento. Si es así, podrá ver la información del evento y el PC.
  4. [ ] Modificar los Puntos de Consumo asociados a un Evento Cervezanas
  5. [x] Modificar las Experiencias de los Puntos de Consumo asociados a un Evento Cervezanas
  6. [x] Añadir accesos directos en el menú desplegable en "cuenta" a productor para acceder a la configuración de experiencias en PC
  7. [ ] Breadcrumb en PC para poder volver al evento
  8. [x] Al presionar en participar -> Actualizar la página para mostrar el código QR al barman
  9. [x] Al presionar varias veces en participar -> CREA varias entradas. Hay que evitar esto.

- [WIP] Testing

  1. [x] Crear producto
  2. [x] Vista de Checkout compra Online
  3. [x] Añadir Información de envío
  4. [x] Añadir Información de facturación
  5. [ ] Realizar compra del producto online
  6. [x] Realizar compra del producto online Bizum
  7. [ ] Realizar compra del producto online Paypal
  8. [x] Ver orden de pedido
  9. [ ] Crear evento
  10. [ ] Crear punto de consumo
  11. [ ] Crear experiencia
  12. [ ] Vincular experiencia con punto de consumo y evento
  13. [ ] Update Producto falla debido a que al traer las imágenes no son tipo FileList
  14. [ ] Vincular Productor con Distribuidor a través de contrato
  15. [x] No se envia notificación al distribuidor para el contrato productor-distribuidor

- [ ] Crear evento con ADMIN
- [x] Error al configurar área de cobertura del distribuidor -> Tipo de dato por defectos para los atributos debe de ser un array vacío
- [x] API Key para obtener listado de países de API countrystatecity añadida para los entornos de Producción y Staging

- [ ] UI/UX para móviles
- [x] Arreglar actualización de productos en el modal

- [x] Pago con Bizum
- [x] Si el usuario cancela el pedido online -> Estado: Cancelado por el usuario
- [x] Si el usuario desde Paypal/Bizum decide cancelar y volver a la página anterior -> Estado: Cancelado por el usuario
- [WIP] Error al actualizar premios en el producto -> Se crean varios diferentes.
- [ ] Cuando se tengan que eliminar elementos de un listado que se selecciona y deselecciona -> usaremos un Array de elementos seleccionados (para insertar) y otro Array de elementos deseleccionados (para eliminar). Es mucho más efectivo hacerlo de esta forma.
- [x] Detectar si el estado del carrito de la compra está abierto o cerrado para que no aparezca abierto siempre.
- [ ] ¿Necesitamos tener en el usuario el parámetro CP_ORGANIZER_STATUS? -> Si ya han aceptado los términos y condiciones creo que no es necesaria esta lógica.
- [ ] Crear usuario para CCVK -> Configurar productos, PC y experiencias
- [x] Si el barman escanéa el código y no está registrado -> LOOP INFINITO -> Pq no estaba redireccionando de manera adecuada a /signin
- [ ] Error al mostrar imágenes del producto
- [x] Permitir guardar el producto aunque no tengan imágenes asociadas (para awards, packs y product multimedia)
- [ ] Añadir como estilo de Cerveza -> aged_beer, ácida
- [ ] Añadir color de Cerveza -> DARK
- [x] Cambiar nombre Add Product a Add Award -> Creación/edición de producto
- [ ] Al crear producto a veces no carga -> Tienes que volver a darle a añadir y pulsar en add
- [ ] Permitir configurar los estilos, colores, etc en el productor de una manera amena.
- [ ] Ordenar cervezas manera alfabetica
- [x] Crear entrada en tabla CONSUMPTION_POINTS AL CREAR UN USUARIO PRODUCTOR
- [ ] Para el momento de crear experiencia -> Indicar en el listado el producto que se está vinculando
- [ ] Si no funciona sign in con Google -> ELIMINARLO
- [ ] Notificar que revisen el email cuando se crea usuario productor o distribuidor
- [ ] No se muestra el pack cuando la inserción es inmediata -> Se tiene que refrescar
- [ ] Cambiar nombre de nuevo Punto Móvil a -> nuevo STAND
- [ ] Quitar el booleano de ORGANIZADOR INTERNO -> VAMOS A HACER QUE TODOS LO SEAN
- [FUTURE] Funcionalidad en el mapa para crear un PC -> poder seleccionar la dirección presionando en un punto en el mapa.
- [ ] Cuando se añade un PC -> Invalidar QUERY para que se actualice la información
- [ ] Traducción question_ADD, associated_experiences, EVENTOS_CERVEZANAS update y añadir
- [x] Vista móvil -> Flex col para elementos del barman en la experiencia
- [x] Añadir signout en menú móvil
- [x] Poner en el footer el correo y el contacto: cervezanas@socialinnolabs.org
      teléfono: 687 85 96 55
- [ ] Implementar seguridad para la lectura de QRs en experiencia -> Solo puede leer el dueño del stand o el administrador.
- [x] BG para online orders y event_orders en menu CONSUMER - DISEÑO PARA LISTAS
- [x] Actualizar vista para que una vez se de el OK en participación de experiencia se actualice la vista en el navegador.
- [ ] Comprobar que los textos son lo suficientemente largos para ser leidos en su totalidad

https://www.lovilotfarmbrewery.com/es/contacto/
