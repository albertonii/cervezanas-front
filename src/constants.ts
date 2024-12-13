import { ViewsMap } from './lib/types/types';

export const VIEWS: ViewsMap = {
    SIGN_IN: 'signin',
    SIGN_UP: 'signup',
    FORGOTTEN_PASSWORD: 'forgotten_password',
    MAGIC_LINK: 'magic_link',
    UPDATE_PASSWORD: 'update_password',
};

export const EVENTS = {
    PASSWORD_RECOVERY: 'PASSWORD_RECOVERY',
    SIGNED_IN: 'SIGNED_IN',
    SIGNED_OUT: 'SIGNED_OUT',
    USER_UPDATED: 'USER_UPDATED',
    INITIAL_SESSION: 'INITIAL_SESSION',
};

export const PAYMENT_METHOD = {
    CREDIT_CARD: 'CREDIT_CARD',
    DEBIT_CARD: 'DEBIT_CARD',
    CASH: 'CASH',
    TRANSFER: 'TRANSFER',
    CHECK: 'CHECK',
    OTHER: 'OTHER',
    PAYPAL: 'PAYPAL',
};

export const PREPENDED_CLASS_NAMES = 'supabase-ui-auth';

export const COMMON = {
    MARKETPLACE_PRODUCT: '/assets/marketplace_product_default.png',
    NO_BEER: '/assets/nobeer.png',
    BG_IMG: '/icons/bg-240.png',
    PROFILE_IMG: '/icons/profile-240.png',
};

export const ORDER_TYPE = {
    ONLINE: 'online',
    EVENT: 'event',
    EVENT_PRODUCT: 'event_product',
    DISTRIBUTOR_ONLINE: 'distributor_online',
};

export const ONLINE_ORDER_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    ORDER_PLACED: 'order_placed',
    CANCELLED: 'cancelled',
    CANCELLED_BY_EXPIRATION: 'cancelled_by_expiration',
    ERROR: 'error',
};

export const DISTRIBUTOR_ONLINE_ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    ERROR: 'error',
};

export const EVENT_ORDER_STATUS = {
    ORDER_PLACED: 'order_placed',
    PAID: 'paid',
    WITH_SERVICES_TO_CONSUME: 'with_services_to_consume',
    SERVED: 'served',
    ERROR: 'error',
    PENDING_PAYMENT: 'pending_payment',
};

export type EventOrderCPSStatus =
    | 'not_started'
    | 'pending'
    | 'preparing'
    | 'ready'
    | 'completed'
    | 'pending_payment'
    | 'cancelled';

export const EVENT_ORDER_CPS_STATUS = {
    NOT_STARTED: 'not_started',
    PENDING: 'pending',
    PREPARING: 'preparing',
    READY: 'ready',
    COMPLETED: 'completed',
    PENDING_PAYMENT: 'pending_payment',
    CANCELLED: 'cancelled',
};

export const EVENT_ORDER_ITEM_STATUS = {
    INITIAL: 'initial',
    WITH_STOCK: 'with_stock',
    WITHOUT_STOCK: 'without_stock',
    CONSUMED: 'consumed',
    NOT_SAVED: 'not_saved',
};

export const INVOICE_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    ERROR: 'error',
};

/**
 * CSS class names
 * used for generating prepended classes
 */
export const CLASS_NAMES = {
    // interfaces
    ROOT: 'root',
    SIGN_IN: VIEWS.SIGN_IN,
    SIGN_UP: VIEWS.SIGN_UP,
    FORGOTTEN_PASSWORD: VIEWS.FORGOTTEN_PASSWORD,
    MAGIC_LINK: VIEWS.MAGIC_LINK,
    UPDATE_PASSWORD: VIEWS.UPDATE_PASSWORD,
    // ui
    anchor: 'ui-anchor',
    button: 'ui-button',
    container: 'ui-container',
    divider: 'ui-divider',
    input: 'ui-input',
    label: 'ui-label',
    loader: 'ui-loader',
    message: 'ui-message',
};

export const SupabaseProps = {
    BASE_URL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/`,
    STORAGE_PRODUCTS_IMG_URL: 'storage/v1/object/public/products/',
    STORAGE_PRODUCTS_ARTICLE_IMG_URL:
        'storage/v1/object/public/products/articles/',
    STORAGE_AWARDS_IMG_URL: 'storage/v1/object/public/products/awards/',
    P_PRINCIPAL_URL: 'p_principal/',
    P_BACK_URL: 'p_back/',
    P_EXTRA_1_URL: 'p_extra_1/',
    P_EXTRA_2_URL: 'p_extra_2/',
    P_EXTRA_3_URL: 'p_extra_3/',
    P_EXTRA_4_URL: 'p_extra_4/',
    ARTICLES: 'articles/',
    BASE_STORAGE_URL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`,
    BASE_AVATARS_URL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/`,
    BASE_PRODUCTS_URL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/`,
    BASE_DOCUMENTS_URL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/`,
    BASE_PRODUCTS_ARTICLES_URL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/articles/`,
    PRODUCT_P_PRINCIPAL: 'p_principal/',
    CUSTOM_BG_URL: 'custom_bg/',
    PROFILE_PHOTO_URL: 'profile_photo/',
    AWARDS_URL: 'awards/',
    PACKS_URL: 'packs/',
    BREWERIES_LOGOS: 'breweries_logos/',
};

export const DS_API = {
    DS_URL: `https://distributionsystemapi.onrender.com/`,
    DS_COUNTRIES: 'countries/',
    DS_REGIONS: 'regions/',
    DS_SUB_REGIONS: 'sub_regions/',
    DS_COMMUNITIES: 'communities/',
    DS_PROVINCES: 'provinces/',
    DS_CITIES: 'cities/',
};

export const API_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

export const APP_URLS = {
    PRODUCER_ONLINE_ORDER: 'producer/online_order/',
    CONSUMER_ONLINE_ORDER: 'consumer/online_order/',
    DISTRIBUTOR_ONLINE_ORDER: 'distributor/online_order/',
    PRODUCER_EVENT_ORDER: 'producer/event_order/',
    CONSUMER_EVENT_ORDER: 'consumer/event_order/',
    DISTRIBUTOR_EVENT_ORDER: 'distributor/event_order/',
};

export const MULTIMEDIA = {
    P_PRINCIPAL: 'p_principal',
    P_BACK: 'p_back',
    P_EXTRA_1: 'p_extra_1',
    P_EXTRA_2: 'p_extra_2',
    P_EXTRA_3: 'p_extra_3',
};

export const STATUS_OPTIONS = [
    { label: 'Activo', value: 'active' },
    { label: 'Finalizado', value: 'finished' },
    { label: 'Error', value: 'error' },
    { label: 'Cancelado', value: 'cancelled' },
    { label: 'Pausado', value: 'paused' },
];

export const VIEW_CONFIGURATION_OPTIONS = [
    { label: '1 Paso', value: 'one_step' },
    { label: '2 Pasos', value: 'two_steps' },
    { label: '3 Pasos', value: 'three_steps' },
];
