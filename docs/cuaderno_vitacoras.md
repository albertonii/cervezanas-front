# Listado de tareas:

- Asociar peso a cada pack de producto
- Agrupar los pedidos de distribuidor si comparten mismo order Id. De esta forma sabrán que son de un mismo pedido.
- Agrupar los pedidos de productos si comparten mismo order Id. De esta forma sabrán que son de un mismo pedido.

# Tareas realizadas

- [x] Comprobar realización de compra de pedido y creación de business order
- [x] Visualizar pedido para el consumidor
- [x] Visualizar pedido y permitir actualización del estado del pedido para el productor
- [x] CRUD para indicar coste de distribución por parte del distribuidor
- [x] Mostrar coste de distribución al consumidor antes de hacer la compra
- [x] Cuando un usuario realiza su compra, debe de visualizarse todos los productos y todos los packs asociados a ello. Ahora mismo solo se está mostrando el primer producto comprado de la orden de compra.

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
