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

## Pruebas

Las pruebas están escritas utilizando Jest. Para ejecutar las pruebas, utiliza el siguiente comando:

```bash
npm test
```

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para discutir cualquier cambio que te gustaría hacer.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
