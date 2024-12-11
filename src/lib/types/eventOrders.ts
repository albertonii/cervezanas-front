import { EventOrderCPSStatus } from '@/constants';
import { EventCategory } from '../enums';
import { IConsumptionPointEvent } from './consumptionPoints';
import { IProductPack, IUserTable } from './types';

export interface IEventOrder {
    id: string;
    created_at: string;
    updated_at: string;
    customer_id?: string;
    event_id: string;
    status: string; //     'with_services_to_consume'| 'order_placed'| 'paid'| 'served'| 'error';
    total: number;
    subtotal: number;
    currency: string;
    discount: number;
    discount_code: string;
    order_number: string;
    tax: number;
    guest_email?: string;
    users?: IUserTable;
    events?: IEvent;
    event_order_cps?: IEventOrderCPS[];
}

export interface IEventOrderCPS {
    id: string;
    created_at: string;
    order_number: string;
    // status: 'not_started' | 'pending' | 'preparing' | 'ready' | 'completed';
    status: EventOrderCPSStatus;
    notes: string;
    cp_id: string;
    has_pending_payment: boolean;
    event_order_id: string;
    event_orders?: IEventOrder;
    event_order_items?: IEventOrderItem[];
    cp_events?: IConsumptionPointEvent;
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
    category: EventCategory; // tours de cerveza | catas de cerveza | talleres de elaboración de cervezas | tap takeovers | lanzamientos de nuevas cervezas | musicales | eventos benéficos | networking | competencias de elaboración | reuniones sociales | charlas | exhibiciones | eventos maridaje y gastronomía | ferias y exposiciones | preguntas y respuestas (Q&A) | happy hours
    // geoArgs: GeocodeResult[];
    geoArgs: any[];
    address: string;
    owner_id: string;
    cp_events: IConsumptionPointEvent[];
    users: IUserTable;
    is_activated: boolean;
    is_cervezanas_event: boolean;
}
