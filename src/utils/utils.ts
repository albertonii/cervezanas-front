import { uuid } from 'uuidv4';
import { ROLE_ENUM } from '@/lib//enums';
import { routes } from './breadcrumb_routes';

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

export const fileTypeToExtension = (fileType: string): string => {
    switch (fileType) {
        case 'image/jpeg':
            return 'jpg';
        case 'image/png':
            return 'png';
        case 'image/webp':
            return 'webp';
        case 'image/gif':
            return 'gif';
        default:
            return 'blob';
    }
};

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

        case 'breweries':
            return `/${role}/profile/${option}`;

        case 'experiences':
            return `/${role}/profile/${option}`;

        case 'consumption_points':
            return `/${role}/profile/${option}`;

        case 'invoice_module':
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

export type Breadcrumb = {
    name: string;
    path: string;
};

export const getBreadcrumbs = async (
    pathname: string,
    locale: string,
): Promise<Breadcrumb[]> => {
    const pathSegments = pathname.split('/').filter(Boolean);

    // Eliminar el segmento del idioma
    if (pathSegments[0] === locale) {
        pathSegments.shift();
    }

    const breadcrumbs: Breadcrumb[] = [];
    let accumulatedPath = '';

    for (let i = 0; i < pathSegments.length; i++) {
        accumulatedPath += `/${pathSegments[i]}`;

        let routeKey = accumulatedPath;

        // Manejar segmentos dinámicos
        if (!routes[routeKey]) {
            // Intentar encontrar un patrón de ruta coincidente
            routeKey =
                Object.keys(routes).find((routePattern) => {
                    const patternSegments = routePattern
                        .split('/')
                        .filter(Boolean);
                    if (patternSegments.length !== i + 1) return false;

                    return patternSegments.every((seg, index) => {
                        return (
                            seg.startsWith(':') || seg === pathSegments[index]
                        );
                    });
                }) || routeKey;
        }

        const route = routes[routeKey];

        if (route) {
            let name = route[locale as 'en' | 'es'];
            let path = `/${locale}${accumulatedPath}`;

            // Si la ruta tiene un segmento dinámico, reemplazarlo con el valor real
            if (routeKey.includes(':')) {
                const patternSegments = routeKey.split('/').filter(Boolean);
                const params: Record<string, string> = {};

                patternSegments.forEach((seg, index) => {
                    if (seg.startsWith(':')) {
                        const paramName = seg.substring(1);
                        params[paramName] = pathSegments[index];
                    }
                });

                // Para IDs de eventos, productos, PC, obtener el nombre del evento
                if (params['id']) {
                    if (accumulatedPath.includes('/products')) {
                        const productName = await fetchProductName(
                            params['id'],
                        );

                        if (productName) {
                            name = productName;
                        } else {
                            name = params['id']; // Fallback al ID si no se encuentra el nombre
                        }
                    } else if (accumulatedPath.includes('/events')) {
                        const eventName = await fetchEventName(params['id']);

                        if (eventName) {
                            name = eventName;
                        } else {
                            name = params['id']; // Fallback al ID si no se encuentra el nombre
                        }
                    } else if (
                        accumulatedPath.includes('/consumption_points')
                    ) {
                        const campaignName =
                            await fetchConsumptionPointsEventById(params['id']);

                        if (campaignName) {
                            name = campaignName;
                        } else {
                            name = params['id']; // Fallback al ID si no se encuentra el nombre
                        }
                    }
                }

                // Reconstruir la ruta con los parámetros reales
                path =
                    `/${locale}` +
                    patternSegments
                        .map((seg, index) => {
                            if (seg.startsWith(':')) {
                                return `/${pathSegments[index]}`;
                            }
                            return `/${seg}`;
                        })
                        .join('');
            }

            breadcrumbs.push({ name, path });
        } else {
            // Fallback si no se encuentra la ruta
            breadcrumbs.push({
                name: pathSegments[i],
                path: `/${locale}${accumulatedPath}`,
            });
        }
    }

    return breadcrumbs;
};

// Function to fetch event name based on ID
const fetchEventName = async (eventId: string): Promise<string | null> => {
    try {
        const response = await fetch(`/api/events/name?id=${eventId}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.name; // Assuming the API returns { name: 'Event Name' }
    } catch (error) {
        console.error('Error fetching event name:', error);
        return null;
    }
};

const fetchProductName = async (productId: string): Promise<string | null> => {
    try {
        const response = await fetch(`/api/products/name?id=${productId}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.name; // Assuming the API returns { name: 'Product Name' }
    } catch (error) {
        console.error('Error fetching product name:', error);
        return null;
    }
};

const fetchConsumptionPointsEventById = async (
    cpId: string,
): Promise<string | null> => {
    try {
        const response = await fetch(`/api/consumption_points/name?id=${cpId}`);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.name; // Assuming the API returns { name: 'Product Name' }
    } catch (error) {
        console.error('Error fetching product name:', error);
        return null;
    }
};

export const calculateInvoicePeriod = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
};

const validatePromoCode = (promoCode: string) => {};

export const createNotification = async (
    supabase: any,
    user_id: string,
    source_id: string,
    link: string,
    message: string,
) => {
    // Notify user that has been accepted/rejected has a distributor
    const { error } = await supabase.from('notifications').insert({
        message: `${message}`,
        user_id: user_id,
        link: link,
        source: source_id,
    });

    if (error) {
        return { error, message: 'Error al crear notificación' };
    }

    return { error: null, message: 'Notificación creada exitosamente' };
};
