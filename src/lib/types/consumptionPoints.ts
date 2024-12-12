import { IEvent } from './eventOrders';
import { IProductPack, IUserTable } from './types';

export interface IConsumptionPoints {
    id: string;
    created_at: string;
    owner_id: string;
    cp_organizer_status: number;
    cv_name: string;
    cover_letter_name: string;
    cp?: IConsumptionPoint[];
    users?: IUserTable;
}

export interface ICPProductsEditModal {
    id: string;
    created_at: string;
    cp_id: any;
    product_pack_id: string;
    stock: number;
    stock_consumed: number;
}

export interface ICPProductsEditCPModal {
    id: string;
    created_at: string;
    cp_id: any;
    product_pack_id: string;
    stock: number;
    stock_consumed: number;
}

export interface IConsumptionPoint {
    id: string;
    created_at: string;
    cp_id: string;
    cp_name: string;
    cp_description: string;
    organizer_name: string;
    organizer_lastname: string;
    organizer_email: string;
    organizer_phone: string;
    address: string;
    logo_url: string;
    status: string;
    maximum_capacity: number;
    is_booking_required: boolean;
    is_internal_organizer: boolean;
    geoArgs: any[]; // Si tienes un tipo específico, úsalo aquí
    owner_id: string;
    type: 'fixed' | 'mobile'; // Diferencia entre fijo y móvil
    cp_events?: IConsumptionPointEvent[]; // Eventos asociados
    users?: IUserTable;
}

export interface IConsumptionPointProduct {
    id: string;
    created_at: string;
    product_name: string;
    pack_name: string;
    quantity: number;
    price: number;
    stock_consumed: number;
    stock: number;
    is_active: boolean;
    cp_id: string;
    product_pack_id: string;
    product_packs?: IProductPack;
    cp?: IConsumptionPoint;
}

export interface IConsumptionPointEvent {
    id: string;
    created_at: string;
    cp_id: string;
    cp_name: string;
    cp_description: string;
    status: string;
    address?: string;
    event_id: string;
    owner_id: string;
    is_active: boolean;
    is_cervezanas_event: boolean;
    start_date: string;
    end_date: string;
    stand_location: string;
    view_configuration: 'one_step' | 'two_steps' | 'three_steps';
    has_pending_payment: boolean;
    is_booking_required: boolean;
    maximum_capacity: number;
    events?: IEvent;
    cp_products?: IConsumptionPointProduct[]; // Productos asociados
    cp?: IConsumptionPoint;
    users?: IUserTable;
}

export interface IConsumptionPointEventNoCircularDependency {
    id: string;
    created_at: string;
    cp_id: string;
    cp_name: string;
    cp_description: string;
    status: string;
    address?: string;
    event_id: string;
    owner_id: string;
    is_active: boolean;
    is_cervezanas_event: boolean;
    start_date?: string;
    end_date?: string;
    stand_location?: string;
    view_configuration?: 'one_step' | 'two_steps' | 'three_steps';
    has_pending_payment?: boolean;
    is_booking_required?: boolean;
    maximum_capacity?: number;
}
