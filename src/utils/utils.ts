import { uuid } from 'uuidv4';
import { ROLE_ENUM } from '@/lib//enums';
import { RouteLocaleNames, routes } from './breadcrumb_routes';

export function isValidObject(object: any) {
    return object != null && object !== '' && !isEmpty(object);
}

export function isNotEmptyArray(array: any[]) {
    return Array.isArray(array) && array.length > 0;
}

export function isEmpty(value: any) {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
}

export function encodeBase64(string: string) {
    return Buffer.from(string).toString('base64');
}

export function decodeBase64(string: string) {
    return Buffer.from(string, 'base64').toString();
}

export function generateDownloadableLink(blob: any, filename: string) {
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${decodeURIComponent(filename)}`);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode?.removeChild(link);
}

export function generateFileName(fName: string) {
    if (!fName) return '';

    const fileExt = fName.split('.').pop();
    const fileName = `${uuid()}.${fileExt}`;
    const encodedFileName = encodeURIComponent(fileName);
    return encodedFileName;
}

export function generateFileNameExtension(fName: string) {
    if (!fName) return '';
    const fileExt = fName.split('.').pop();
    const fileNameExtension = `.${fileExt}`;
    const encodedFileName = encodeURIComponent(fileNameExtension);

    return encodedFileName;
}

export function isFileEmpty(file: File) {
    return file.size === 0;
}

export function isFileListEmpty(file: FileList) {
    return file.length === 0;
}

export function cleanObject(obj: any) {
    const cleanedObj: any = {};
    Object.keys(obj).forEach((key) => {
        if (obj[key] && (obj[key].id !== false || obj[key].id.length > 1)) {
            cleanedObj[key] = obj[key];
        }
    });
    return cleanedObj;
}

// Used in input search fields -> Products, international distribution, etc
export function filterSearchInputQuery(
    list: any[],
    query: string,
    currentPage: number,
    resultsPerPage: number,
) {
    const listToDisplay = list?.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
    );

    return slicePaginationResults(listToDisplay, currentPage, resultsPerPage);
}

export function slicePaginationResults(
    list: any[],
    currentPage: number,
    resultsPerPage: number,
) {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return list?.slice(startIndex, endIndex);
}

export const generateLink = (role: ROLE_ENUM, option: string) => {
    switch (option) {
        case 'profile':
            return `/${role}/profile/settings`;

        case 'products':
            return `/${role}/profile/products`;

        case 'events':
            return `/${role}/profile/events`;

        case 'online_orders':
            return `/${role}/profile/online_orders`;

        case 'event_orders':
            return `/${role}/profile/${option}`;

        case 'campaigns':
            return `/${role}/profile/${option}`;

        case 'signout':
            return `/${role}/profile/${option}`;

        case 'submitted_aps':
            return `/${role}/profile`;

        case 'monthly_products':
            return `/${role}/profile/${option}`;

        case 'reports':
            return `/admin/profile/${option}`;

        case 'logistics':
            return `/${role}/profile/${option}`;

        case 'notifications':
            return `/${role}/profile/${option}`;

        case 'cps':
            return `/${role}/profile/${option}`;

        case 'contracts_cps':
            return `/${role}/profile/${option}`;

        case 'authorized_users':
            return `/admin/profile/${option}`;

        case 'business_orders':
            return `/${role}/profile/${option}`;

        case 'contracts':
            return `/${role}/profile/${option}`;

        case 'reviews':
            return `/${role}/profile/${option}`;

        case 'distributors_associated':
            return `/${role}/profile/${option}`;

        case 'experiences':
            return `/${role}/profile/${option}`;

        case 'consumption_points':
            return `/${role}/profile/${option}`;

        default:
            return `/${role}/profile/settings`;
    }
};

// Función para normalizar nombres de archivos en TypeScript
export function normalizeFileName(fileName: string): string {
    // Eliminar caracteres especiales excepto puntos, guiones y guiones bajos
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-_]/g, '');

    // Codificar URI para manejar caracteres especiales permitidos en nombres de archivos
    const encodedFileName = encodeURIComponent(sanitizedFileName);

    return encodedFileName;
}

// Función para obtener la URL de un archivo almacenado en Supabase Storage
export async function getPublicFileUrl(
    supabase: any,
    bucketName: string,
    filePath: string,
): Promise<string> {
    const { data, error } = await supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    if (error) {
        throw new Error(`Error al obtener URL del archivo: ${error.message}`);
    }

    return data.publicUrl ?? '';
}

// Función para descargar un archivo desde Supabase Storage
export async function downloadFile(
    supabase: any,
    bucketName: string,
    filePath: string,
): Promise<Blob> {
    const { data, error } = await supabase.storage
        .from(bucketName)
        .download(filePath);

    if (error) {
        throw new Error(`Error al descargar el archivo: ${error.message}`);
    }

    return data;
}

// To shuffle quiz questions
export const shuffleArray = (array: any[]) =>
    [...array].sort(() => Math.random() - 0.5);

// B R E A D C R U M B S
export const getBreadcrumbs = (path: string, locale: 'en' | 'es') => {
    const pathArray = path.split('/').filter((p) => p);
    const breadcrumbs = [
        {
            path: '/',
            name: 'Inicio',
        },
    ];

    let currentPath = '';

    for (const segment of pathArray) {
        // Remove locale from path
        if (segment === 'es' || segment === 'en') {
            continue;
        }

        currentPath += `/${segment}`;

        // Manejar rutas dinámicas
        const dynamicPath = Object.keys(routes).find(
            (route) =>
                route.includes(':') &&
                new RegExp(route.replace(/:\w+/g, '\\w+')).test(currentPath),
        );

        const routeInfo: RouteLocaleNames | undefined =
            routes[currentPath] || (dynamicPath && routes[dynamicPath]);

        if (routeInfo) {
            breadcrumbs.push({
                path: routeInfo.path || currentPath,
                name: routeInfo[locale],
            });
        } else {
            // Si no se encuentra una ruta específica, agregar un segmento sin nombre específico
            breadcrumbs.push({
                path: currentPath,
                name: segment,
            });
        }
    }

    return breadcrumbs;
};
