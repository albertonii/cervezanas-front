export type RouteLocaleNames = {
    en: string;
    es: string;
    path?: string;
};

export const routes: Record<string, RouteLocaleNames> = {
    '/': { en: 'Home', es: 'Inicio' },
    '/about': { en: 'About Us', es: 'Sobre Nosotros' },
    '/contact': { en: 'Contact', es: 'Contacto' },
    '/products': { en: 'Marketplace', es: 'Mercado', path: '/marketplace' },
    '/products/:id': {
        en: 'Product Details',
        es: 'Detalles del Producto',
    },
    '/marketplace': { en: 'Marketplace', es: 'Mercado', path: '/marketplace' },
    '/producer': {
        en: 'Producer',
        es: 'Productor',
        path: '/producer/profile/settings',
    },
    '/producer/profile': {
        en: 'Profile',
        es: 'Perfil',
        path: '/producer/profile/settings',
    },
    '/producer/profile/settings': {
        en: 'Settings',
        es: 'Configuración',
        path: '/producer/profile/settings',
    },
    '/producer/profile/products': {
        en: 'Products',
        es: 'Productos',
    },
    '/producer/profile/distributors_associated': {
        en: 'Associated Distributors',
        es: 'Distribuidores Asociados',
    },
    '/producer/profile/events': {
        en: 'Events',
        es: 'Eventos',
    },
    '/producer/profile/consumption_points': {
        en: 'Consumption Points',
        es: 'Puntos de Consumo',
    },
    '/producer/profile/experiences': {
        en: 'Experiences',
        es: 'Experiencias',
    },
    '/producer/profile/online_orders': {
        en: 'Online Orders',
        es: 'Pedidos en Línea',
    },
    '/producer/profile/event_orders': {
        en: 'Event Orders',
        es: 'Pedidos de Eventos',
    },
    '/producer/profile/notifications': {
        en: 'Notifications',
        es: 'Notificaciones',
    },

    '/distributor': { en: 'Distributor', es: 'Distribuidor' },
    '/distributor/profile': {
        en: 'Profile',
        es: 'Perfil',
        path: '/distributor/profile/settings',
    },
    '/distributor/profile/settings': {
        en: 'Settings',
        es: 'Configuración',
        path: '/distributor/profile/settings',
    },
    '/distributor/profile/logistics': {
        en: 'Logistics',
        es: 'Logística',
    },
    '/distributor/profile/contracts': {
        en: 'Contracts',
        es: 'Contratos',
    },
    '/distributor/profile/business_orders': {
        en: 'Online Orders',
        es: 'Pedidos en Línea',
    },
    '/distributor/profile/notifications': {
        en: 'Notifications',
        es: 'Notificaciones',
    },
    '/consumer': { en: 'Consumer', es: 'Consumidor' },
    '/consumer/profile': {
        en: 'Profile',
        es: 'Perfil',
        path: '/consumer/profile/settings',
    },
    '/consumer/profile/settings': {
        en: 'Settings',
        es: 'Configuración',
        path: '/consumer/profile/settings',
    },
    'consumer/profile/event_orders': {
        en: 'Event Orders',
        es: 'Pedidos de Eventos',
    },
    'consumer/profile/online_orders': {
        en: 'Online Orders',
        es: 'Pedidos en Línea',
    },
    'consumer/profile/reviews': {
        en: 'Reviews',
        es: 'Reseñas',
    },
    'consumer/profile/notifications': {
        en: 'Notifications',
        es: 'Notificaciones',
    },
} as const;
