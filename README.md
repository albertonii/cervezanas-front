Cervezanas Frontend

# Cervezanas Frontend

Este proyecto es el frontend de Cervezanas, una tienda en línea para la venta de cervezas artesanales. El proyecto está construido utilizando Next.js y Supabase para la gestión de la base de datos y la autenticación.

## Características

- [x] Gestión de migraciones de bases de datos
- [x] Creación y despliegue de funciones de Supabase
- [x] Generación de tipos directamente desde el esquema de la base de datos
- [x] Realización de solicitudes HTTP autenticadas a la API de Gestión
- [x] Envío de correos electrónicos de confirmación de pedidos
- [x] Cancelación de pedidos expirados

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

Este caso de uso surge por la necesidad que tenemos de realizar los envíos a los ganadores del merchandising del BBF 2024. Tenemos como objetivos:

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

## Pruebas

Las pruebas están escritas utilizando Jest. Para ejecutar las pruebas, utiliza el siguiente comando:

```bash
npm test
```

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio que te gustaría hacer.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
