Cervezanas Frontend

# Cervezanas Frontend

Este proyecto es el frontend de Cervezanas, una comunidad en línea los amantes de la cerveza artesanal. El proyecto está construido utilizando Next.js y Supabase para la gestión de la base de datos y la autenticación.

## Requisitos Previos

- Node.js (versión 14 o superior)
- NPM o PNPM o Yarn
- Supabase CLI

## Instalación

1. Clonar el repositorio
2. Instalar dependencias
3. Configurar variables de entorno

## Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto y añade las siguientes variables de entorno:
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_RESEND_API_KEY=tu_resend_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm run dev`

Ejecuta la aplicación en modo de desarrollo.  
Abre [http://localhost:3000](http://localhost:3000) para verlo en tu navegador.

### `npm run build`

Construye la aplicación para producción en la carpeta `build`.  
Empaqueta React en modo de producción y optimiza la construcción para el mejor rendimiento.

### `npm start`

Ejecuta la aplicación en modo de producción.  
Asegúrate de haber ejecutado `npm run build` primero.

### `npm test`

Ejecuta las pruebas utilizando Jest.

## Estructura del Proyecto

- `/src`: Contiene el código fuente de la aplicación.
  - `/app`: Contiene las páginas y componentes de la aplicación.
    - `/api`: Contiene las rutas API de Next.js.
      - `/emails`: Contiene las rutas para el envío de correos electrónicos.
      - `/shopping_basket`: Contiene las rutas relacionadas con el carrito de compras.
    - `/components`: Contiene los componentes reutilizables de la aplicación.
    - `/styles`: Contiene los archivos de estilos CSS.
    - `/utils`: Contiene utilidades y funciones auxiliares.

## Funciones Principales

### Envío de Correos Electrónicos

La función `POST` en `route.ts` se encarga de enviar correos electrónicos de confirmación de pedidos utilizando la API de Resend.

### Cancelación de Pedidos Expirados

La función `cancel_expired_orders` en `route.ts` se encarga de cancelar los pedidos que han expirado.

## Funciones Principales

### Envío de Correos Electrónicos

La función `POST` en `route.ts` se encarga de enviar correos electrónicos de confirmación de pedidos utilizando la API de Resend.

### Cancelación de Pedidos Expirados

La función `cancel_expired_orders` en `route.ts` se encarga de cancelar los pedidos que han expirado.

### Autenticación de Usuarios

Utiliza Supabase para la autenticación de usuarios, permitiendo el registro, inicio de sesión y gestión de sesiones.

### Gestión de Carritos de Compra

Permite a los usuarios añadir, actualizar y eliminar productos de su carrito de compras.

### Visualización de Productos

Muestra una lista de productos disponibles para la compra, con detalles como nombre, precio y descripción.

### Gestión de Pedidos

Permite a los usuarios realizar pedidos, ver el estado de sus pedidos y recibir notificaciones por correo electrónico.

## CRON Jobs

La aplicación utiliza **CRON Jobs** para automatizar tareas esenciales que mejoran la eficiencia y la experiencia del usuario.

### Generación de Registros Mensuales de Ventas

- **Descripción**: Genera automáticamente los registros mensuales de ventas para cada productor al inicio de cada mes.
- **Ruta**: `/api/cron/generate_monthly_sales_records`
- **Frecuencia**: Se ejecuta el primer día de cada mes a las 00:00 horas.
- **Propósito**: Facilitar a los productores el acceso a sus informes de ventas mensuales, permitiéndoles generar y emitir las facturas correspondientes a través de la plataforma.

### Cancelación Automática de Pedidos Expirados

- **Descripción**: Cancela los pedidos que han excedido el tiempo máximo permitido para su realización (por defecto, 30 minutos).
- **Ruta**: `/api/cron/cancel_expired_orders`
- **Frecuencia**: Se ejecuta diariamente a las 00:00 horas.
- **Propósito**: Mantener la base de datos limpia y actualizada, mejorando la eficiencia del sistema.

## Códigos de Promoción

Atributos: id, created_at, code, discount_type, discount_value, max_uses, uses, expiration_date, updated_at, description, start_date, is_active, max_usage_per_user, product_id

Tipos de descuento promocional:

- Por porcentaje descuento - "percentage"
- Asociados a productos con porcentaje descuento - "product"

Cada vez que se aplica un código promocional hay que validarlo dos veces: una antes de realizar el pedio y otra al presionar en el botón para proceder al pago. Una vez confirmado el pago, se deberá aumentar los contadores de uso del código promocional para asegurar que las validaciones siguen siendo correctas, además de introducir en la tabla user_promo_codes el usuario que ha obtenido dicho código promocional.

### Gestión de Códigos Promocionales al realizar un pedido

Es crucial que, al momento de procesar el pedido (es decir, cuando el usuario hace clic en "Pagar" y se confirma el pago), realices nuevamente las validaciones del código promocional en el backend. Esto garantiza que:

- El código promocional sigue siendo válido y no ha expirado.
- No se ha excedido el límite de uso global o por usuario.
- Se evita que el usuario manipule los datos en el frontend.

Para ello debemos de:

1. Modificar el Endpoint de Creación de pedidos
   Si se envía un código promocional debe ser validado.

2. Actualizar contadores de uso
   Hay que incrementar `uses` y registrar su uso en la tabla `user_promo_codes`

### Gestión de Códigos Promocionales vinculados a un producto

Este caso de uso surge por la necesidad que tenemos de realizar los envíos a los ganadores del merchandising del BBF 2025. Tenemos como objetivos:

- Regalar merchandising a los usuarios.
- Los usuarios canjean un código promocional en el carrito de la compra antes de proceder al pago.
- Este código está relacionado con un producto específico al cual se aplicará un descuento del 100% (u otro porcentaje especificado).

Para ello debemos:

- Asociar cada código promocional a productos específicos.
  En el momento de validar un código promocional hay que tener en cuenta que es válido, está activo, que está asociado a un producto específico y que el usuario cumple con las restricciones de uso.

- Permitir que el usuario ingrese un código promocional en el carrito y aplicar el descuento al producto correspondiente.
- Manejar la lógica de descuento para que se aplique solo al producto especificado y no al resto del carrito.
- Asegurar que el código promocional se consuma correctamente y se controle su uso (por ejemplo, limitar el número de usos por usuario o en total).
- Modificar las tablas y la lógica del backend para soportar esta nueva funcionalidad.

#### Tabla promo_codes_products

Para hacer los códios promocionales más versátiles, creamos esta tabla para poder aplicar un mismo código a múltiples productos.

# Sistema de Tickets para la gestión de pedidos en eventos - Plataforma de Cervezanas

Descripción del diseño y funcionamiento del sistema de tickets para la plataforma de Cervezanas, permitiendo a los usuarios comprar productos en eventos en tiempo real y gestionar eficientemente los pedidos a través de un sistema similar al utilizado por cadenas como McDonald's.

---

## Índice

- [Introducción](#introducción)
- [Objetivos del Sistema](#objetivos-del-sistema)
- [Flujo de Operaciones](#flujo-de-operaciones)
- [Modelos de Datos](#modelos-de-datos)
  - [Descripción de las Tablas](#descripción-de-las-tablas)
- [Detalles del Funcionamiento](#detalles-del-funcionamiento)
  - [Carrito de Compra Unificado](#carrito-de-compra-unificado)
  - [Generación de Pedidos por Punto de Consumo](#generación-de-pedidos-por-punto-de-consumo)
  - [Gestión de Estados de Pedidos](#gestión-de-estados-de-pedidos)
  - [Control del Usuario sobre la Preparación](#control-del-usuario-sobre-la-preparación)
- [Interfaz para Vendedores](#interfaz-para-vendedores)
- [Consideraciones Adicionales](#consideraciones-adicionales)
  - [Identificadores de Pedidos](#identificadores-de-pedidos)
  - [Notificaciones en Tiempo Real](#notificaciones-en-tiempo-real)
  - [Integración con Pasarelas de Pago](#integración-con-pasarelas-de-pago)
  - [Gestión de Inventario](#gestión-de-inventario)
  - [Seguridad y Control de Acceso](#seguridad-y-control-de-acceso)
- [Conclusión](#conclusión)

---

## Introducción

La plataforma de Cervezanas ofrece a los usuarios acceso a información de eventos en tiempo real. Al registrarse en un evento, los usuarios indican que están presentes físicamente y pueden realizar compras de productos a través de la plataforma para luego canjearlos en los Puntos de Consumo (PC) del evento.

Este documento detalla el diseño del sistema de tickets que permite gestionar eficientemente los pedidos, tanto para los usuarios como para los responsables de los PC, asegurando una experiencia fluida y organizada.

## Objetivos del Sistema

- **Permitir a los usuarios añadir productos de diferentes Puntos de Consumo al mismo carrito.**
- **Generar pedidos separados por cada PC al confirmar la compra, agrupando los productos correspondientes.**
- **Permitir a los usuarios controlar cuándo se comienza a preparar su pedido en cada PC.**
- **Facilitar a los responsables de los PC la gestión independiente de los pedidos y sus estados.**
- **Optimizar la experiencia del usuario y la eficiencia operativa de los PC.**

## Flujo de Operaciones

1. **Exploración y Selección de Productos:**

   - El usuario navega por los diferentes PC disponibles en el evento.
   - Añade productos de múltiples PC al carrito de compra unificado.

2. **Proceso de Pago:**

   - Al confirmar la compra, se realiza un único pago que abarca todos los productos seleccionados.
   - El sistema genera un **pedido principal** y, a partir de él, crea **pedidos separados por cada PC**, agrupando los productos correspondientes.

3. **Control de Preparación por el Usuario:**

   - El usuario puede decidir cuándo desea que se comience a preparar su pedido en cada PC.
   - A través de la aplicación, puede indicar al PC que inicie la preparación de su pedido cuando esté listo para recogerlo.

4. **Gestión de Pedidos por los PC:**

   - Cada PC recibe los pedidos correspondientes a sus productos.
   - Los responsables pueden gestionar los estados de sus pedidos de forma independiente.

5. **Entrega de Pedidos:**
   - Una vez que el pedido está preparado, el PC notifica al usuario.
   - El usuario recoge su pedido presentando el número de pedido o código QR.
   - El PC marca el pedido como entregado, completando el proceso.

---

## Modelos de Datos

### Descripción de las Tablas

#### 1. **Usuarios (`users`)**

Información básica de los usuarios de la plataforma.

#### 2. **Eventos (`events`)**

Detalles de los eventos disponibles en la plataforma.

- `updated_at`

#### 3. **Puntos de Consumo (`consumption_points`)**

Puntos de Consumo o stands disponibles en los eventos.

_Nota: Los Puntos de Consumo no están vinculados directamente a eventos para permitir su reutilización._

#### 4. **Productos (`products`)**

Productos disponibles en la plataforma.

_Nota: Los productos no están vinculados directamente a Puntos de Consumo para permitir su reutilización._

#### 5. **Productos en Puntos de Consumo (`consumption_point_products`)**

Asociación entre productos y Puntos de Consumo, permitiendo modificar atributos como el precio para casos específicos.

- **Campos Importantes:**
  - `consumption_point_id` (FK a `consumption_points.id`)
  - `product_id` (FK a `products.id`)
  - `price` (precio específico en este PC)
  - `available_quantity` (opcional)

#### 6. **Eventos y Puntos de Consumo (`event_consumption_points`)**

Asociación entre eventos y Puntos de Consumo disponibles en ellos.

- **Campos Importantes:**
  - `event_id` (FK a `events.id`)
  - `consumption_point_id` (FK a `consumption_points.id`)

#### 7. **Carritos de Compra (`carts`)**

Carritos de compra de los usuarios, permitiendo añadir productos de múltiples Puntos de Consumo.

- **Campos Importantes:**
  - `id` (PK)
  - `user_id` (FK a `users.id`)
  - `event_id` (FK a `events.id`)

#### 8. **Ítems del Carrito (`cart_items`)**

Productos añadidos al carrito por los usuarios.

- **Campos Importantes:**
  - `id` (PK)
  - `cart_id` (FK a `carts.id`)
  - `consumption_point_product_id` (FK a `consumption_point_products.id`)
  - `quantity`

#### 9. **Pedidos Principales (`orders`)**

Pedido global que agrupa todos los pedidos por PC de una compra.

- **Campos Importantes:**
  - `id` (PK)
  - `order_number` (número de pedido único y secuencial)
  - `user_id` (FK a `users.id`)
  - `event_id` (FK a `events.id`)
  - `total_amount`
  - `status` (Estado general del pedido)

#### 10. **Pedidos por Punto de Consumo (`order_consumption_points`)**

Pedidos específicos para cada PC, derivados del pedido principal.

- **Campos Importantes:**
  - `id` (PK)
  - `order_id` (FK a `orders.id`)
  - `consumption_point_id` (FK a `consumption_points.id`)
  - `order_number` (número de pedido específico por PC)
  - `status` (Estados específicos por PC)

#### 11. **Ítems del Pedido por PC (`order_items`)**

Productos incluidos en cada pedido por PC.

- **Campos Importantes:**
  - `id` (PK)
  - `order_consumption_point_id` (FK a `order_consumption_points.id`)
  - `consumption_point_product_id` (FK a `consumption_point_products.id`)
  - `quantity`
  - `unit_price`
  - `total_price` (cantidad \* precio unitario)

---

## Detalles del Funcionamiento

### Carrito de Compra Unificado

- **Objetivo:** Permitir a los usuarios añadir productos de diferentes Puntos de Consumo al mismo carrito.

- **Funcionamiento:**
  - El usuario explora los Puntos de Consumo disponibles en un evento.
  - Añade productos de múltiples PC al carrito unificado.
  - El carrito es único por usuario y evento.

### Generación de Pedidos por Punto de Consumo

- **Objetivo:** Facilitar la gestión independiente de pedidos por cada PC.

- **Funcionamiento:**
  - Al confirmar la compra, se realiza un único pago.
  - El sistema genera un pedido principal en `orders`.
  - Los productos del carrito se agrupan por PC.
  - Se crean pedidos separados en `order_consumption_points` para cada PC, con sus respectivos ítems en `order_items`.

### Gestión de Estados de Pedidos

- **Estados del Pedido por PC:**

  - `Pending`: Pedido creado pero no listo para preparar.
  - `Ready to Prepare`: El usuario indica que desea que se comience a preparar.
  - `In Preparation`: El PC está preparando el pedido.
  - `Prepared`: El pedido está listo para recoger.
  - `Delivered`: El pedido ha sido entregado al usuario.
  - `Cancelled`: Pedido cancelado.

- **Funcionamiento:**
  - **Usuario:**
    - Puede cambiar el estado de su pedido a `Ready to Prepare` cuando desee que el PC comience la preparación.
  - **Punto de Consumo:**
    - Gestiona sus pedidos de forma independiente.
    - Actualiza el estado del pedido según el progreso.

### Control del Usuario sobre la Preparación

- **Objetivo:** Otorgar al usuario la flexibilidad de decidir cuándo se prepara su pedido.

- **Funcionamiento:**
  - Desde la aplicación, el usuario puede indicar al PC que inicie la preparación cambiando el estado del pedido.
  - Permite al usuario planificar su recorrido en el evento y evitar esperas innecesarias.

---

## Interfaz para Vendedores

- **Vista de Pedidos:**

  - Dos columnas principales:
    - **"Incoming":** Pedidos en estado `Ready to Prepare`.
    - **"In Progress":** Pedido en estado `In Progress`
    - **"Prepared":** Pedidos en estado `Prepared`.
  - Los pedidos desaparecen de la vista al ser marcados como `Delivered`.

- **Acciones Disponibles:**

  - Cambiar el estado del pedido:
    - `In Preparation` al comenzar a preparar.
    - `Prepared` al terminar la preparación.
    - `Delivered` al entregar el pedido al usuario.
  - Visualizar detalles del pedido y los productos incluidos.

- **Beneficios:**
  - Facilita una gestión ágil y eficiente de los pedidos.
  - Permite al vendedor centrarse en los pedidos que están listos para preparar.

---

## Consideraciones Adicionales

### Identificadores de Pedidos

- **Número de Pedido Principal (`orders.order_number`):**

  - Referencia global de la compra.

- **Número de Pedido por PC (`order_consumption_points.order_number`):**
  - Utilizado para la interacción entre el usuario y el PC específico.
  - Es el número que el usuario presenta al recoger su pedido.

### Notificaciones en Tiempo Real

- **Para el Usuario:**

  - Recibe notificaciones cuando el estado de su pedido cambia.

- **Para el Vendedor:**
  - Es notificado cuando un usuario cambia el estado de su pedido a `Ready to Prepare`.

### Gestión de Inventario

- **Actualización de Stock:**
  - Al confirmar un pedido, se actualiza la cantidad disponible en `consumption_point_products.available_quantity`.
  - Evita vender productos agotados y permite una mejor gestión de recursos.

---

## Conclusión

El sistema de tickets diseñado permite una experiencia optimizada para los usuarios y una gestión eficiente para los Puntos de Consumo en la plataforma de Cervezanas. Al permitir a los usuarios controlar cuándo se preparan sus pedidos y generar pedidos separados por PC, se logra un equilibrio entre flexibilidad y eficiencia operativa.

Este enfoque:

- **Mejora la satisfacción del usuario** al reducir tiempos de espera y otorgar mayor control.
- **Facilita la gestión para los vendedores** al permitirles centrarse en los pedidos listos para preparar.
- **Optimiza los recursos y procesos** en eventos con múltiples Puntos de Consumo.

---

## Pruebas

Las pruebas están escritas utilizando Jest. Para ejecutar las pruebas, utiliza el siguiente comando:

```bash
npm test
```

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio que te gustaría hacer.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
