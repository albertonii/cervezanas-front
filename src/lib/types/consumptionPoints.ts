import { IEvent } from './eventOrders';
import { IProductPack, IUserTable } from './types';

export interface IConsumptionPoints {
    id: string;
    created_at: string;
    owner_id: string;
    cp_organizer_status: number;
    cv_name: string;
    cover_letter_name: string;
    cp_fixed: ICPFixed[];
    cp_mobile: ICPMobile[];
    users?: IUserTable;
}

export interface ICPFixed {
    id: string;
    created_at: string;
    cp_name: string;
    cp_description: string;
    organizer_name: string;
    organizer_lastname: string;
    organizer_email: string;
    organizer_phone: string;
    start_date: string;
    end_date: string;
    address: string;
    logo_url: string;
    status: string;
    maximum_capacity: number;
    is_booking_required: boolean;
    cp_id: string;
    is_internal_organizer: boolean;
    cpf_products?: ICPFProducts[];
    // geoArgs: GeocodeResult[];
    geoArgs: any[];
    consumption_points?: IConsumptionPoints;
    owner_id: string;
}

export interface ICPMobile {
    id: string;
    created_at: string;
    cp_id: string;
    cp_name: string;
    cp_description: string;
    organizer_name: string;
    organizer_lastname: string;
    organizer_email: string;
    organizer_phone: string;
    start_date: string;
    end_date: string;
    address: string;
    status: string;
    logo_url: string;
    maximum_capacity: number;
    is_booking_required: boolean;
    // geoArgs: GeoArgs[];
    geoArgs: any[];
    is_internal_organizer: boolean;
    cpm_products?: ICPMProducts[];
    consumption_points?: IConsumptionPoints;
    owner_id: string;
}

export interface ICPFProducts {
    id: string;
    created_at: string;
    stock: number;
    stock_consumed: number;
    cp_id: string;
    product_pack_id: string;
    is_active: boolean;
    product_packs?: IProductPack;
    cp_fixed?: ICPFixed;
}

export interface ICPMProducts {
    id: string;
    created_at: string;
    stock: number;
    stock_consumed: number;
    cp_id: string;
    product_pack_id: string;
    is_active: boolean;
    product_packs?: IProductPack;
    cp_mobile?: ICPMobile;
}

export interface IRefCPMProducts {
    id: string;
    created_at: string;
    cp_id: any;
    product_pack_id: IProductPack;
    stock: number;
    stock_consumed: number;
}

export interface ICPProductsEditModal {
    id: string;
    created_at: string;
    cp_id: any;
    product_pack_id: string;
    stock: number;
    stock_consumed: number;
}

export interface ICPMProductsEditCPMobileModal {
    id: string;
    created_at: string;
    cp_id: any;
    product_pack_id: string;
    stock: number;
    stock_consumed: number;
}

export interface ICPMProductsEditCPFixedModal {
    id: string;
    created_at: string;
    cp_id: any;
    product_pack_id: string;
    stock: number;
    stock_consumed: number;
}

export interface ICPM_events {
    cp_id: string;
    created_at: string;
    event_id: string;
    is_active: boolean;
    is_cervezanas_event: boolean;
    owner_id: string;
    cp_mobile?: ICPMobile;
    events?: IEvent;
}

export interface ICPF_events {
    cp_id: string;
    event_id: string;
    is_active: boolean;
    is_cervezanas_event: boolean;
    owner_id: string;
    cp_fixed?: ICPFixed;
    events?: IEvent;
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
    cp_products?: IConsumptionPointProduct[]; // Productos asociados
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
    event_id: string;
    owner_id: string;
    is_active: boolean;
    is_cervezanas_event: boolean;
    start_date: string;
    end_date: string;
    events?: IEvent;
    cp?: IConsumptionPoint;
    users?: IUserTable;
}
