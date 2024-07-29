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
    // Agrega más rutas según sea necesario
} as const;
