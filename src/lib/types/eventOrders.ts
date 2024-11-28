export interface IEventOrder {
    id: string;
    order_number: string;
    items: IEventOrderItem[];
    status: 'not_started' | 'pending' | 'preparing' | 'ready' | 'completed';
    timestamp: string;
    vendor_id: string;
    vendor_name: string;
    user_id: string;
    username: string;
    user_phone?: string;
    total: number;
    pickup_kocation: string;
    estimated_time?: number;
    is_activated: boolean;
    notes?: string;
}

export interface IEventOrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export interface IEventVendor {
    id: string;
    name: string;
    description: string;
    location: string;
}

export const statusTranslations = {
    not_started: 'Sin iniciar',
    pending: 'Pendiente',
    preparing: 'En preparación',
    ready: 'Listo para recoger',
    completed: 'Entregado',
};
