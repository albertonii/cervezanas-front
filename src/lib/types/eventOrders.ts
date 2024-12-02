import { IConsumptionPoint, IConsumptionPointEvent } from './consumptionPoints';
import { IProductPack, IUserTable } from './types';

export interface IEventOrder {
    id: string;
    created_at: string;
    updated_at: string;
    customer_id: string;
    event_id: string;
    status: string;
    // status:
    //     'with_services_to_consume'| 'order_placed'| 'paid'| 'served'| 'error';
    total: number;
    subtotal: number;
    currency: string;
    discount: number;
    discount_code: string;
    order_number: string;
    tax: number;
    users?: IUserTable;
    events?: IEvent;
    event_order_items?: IEventOrderItem[];
}

export interface IEventOrderCPS {
    id: string;
    created_at: string;
    order_number: string;
    // status: 'not_started' | 'pending' | 'preparing' | 'ready' | 'completed';
    status: string;
    notes: string;
    cp_id: string;
    event_order_id: string;
    event_orders?: IEventOrder;
    event_order_items?: IEventOrderItem[];
    cp_events?: IConsumptionPointEvent[];
}

export interface IEventOrderItem {
    id: string;
    event_order_cp_id: string;
    created_at: string;
    quantity: number;
    status: string;
    is_reviewed: boolean;
    quantity_served: number;
    product_pack_id: string;
    event_order_cps?: IEventOrderCPS;
    product_packs?: IProductPack;
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
    cps_event: IConsumptionPointEvent[];
    users: IUserTable;
    is_activated: boolean;
    is_cervezanas_event: boolean;
}
