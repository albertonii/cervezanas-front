import { ICPFixed, ICPMobile } from './consumptionPoints';
import { IUserTable } from './types';

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

export interface IEvent {
    id: string;
    created_at: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    logo_url: string;
    promotional_url: string;
    status: string;
    // geoArgs: GeocodeResult[];
    geoArgs: any[];
    address: string;
    owner_id: string;
    cp_mobile: ICPMobile[];
    cp_fixed: ICPFixed[];
    users: IUserTable;
    is_activated: boolean;
    is_cervezanas_event: boolean;
}
