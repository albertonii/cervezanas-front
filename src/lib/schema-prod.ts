export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            awards: {
                Row: {
                    created_at: string | null;
                    description: string | null;
                    id: string;
                    img_url: string | null;
                    name: string | null;
                    product_id: string | null;
                    year: number | null;
                };
                Insert: {
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    img_url?: string | null;
                    name?: string | null;
                    product_id?: string | null;
                    year?: number | null;
                };
                Update: {
                    created_at?: string | null;
                    description?: string | null;
                    id?: string;
                    img_url?: string | null;
                    name?: string | null;
                    product_id?: string | null;
                    year?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'awards_product_id_fkey';
                        columns: ['product_id'];
                        isOneToOne: false;
                        referencedRelation: 'products';
                        referencedColumns: ['id'];
                    },
                ];
            };
            beers: {
                Row: {
                    aroma: string;
                    category: string | null;
                    color: string;
                    composition: string | null;
                    country: string | null;
                    created_at: string;
                    era: string;
                    family: string;
                    fermentation: string;
                    fg: number | null;
                    format: string | null;
                    id: string;
                    intensity: number | null;
                    is_gluten: boolean;
                    og: number | null;
                    origin: string;
                    owner_id: string | null;
                    product_id: string;
                    sku: string | null;
                    srm: number | null;
                    volume: number | null;
                    weight: number | null;
                };
                Insert: {
                    aroma: string;
                    category?: string | null;
                    color: string;
                    composition?: string | null;
                    country?: string | null;
                    created_at?: string;
                    era: string;
                    family: string;
                    fermentation: string;
                    fg?: number | null;
                    format?: string | null;
                    id?: string;
                    intensity?: number | null;
                    is_gluten: boolean;
                    og?: number | null;
                    origin: string;
                    owner_id?: string | null;
                    product_id: string;
                    sku?: string | null;
                    srm?: number | null;
                    volume?: number | null;
                    weight?: number | null;
                };
                Update: {
                    aroma?: string;
                    category?: string | null;
                    color?: string;
                    composition?: string | null;
                    country?: string | null;
                    created_at?: string;
                    era?: string;
                    family?: string;
                    fermentation?: string;
                    fg?: number | null;
                    format?: string | null;
                    id?: string;
                    intensity?: number | null;
                    is_gluten?: boolean;
                    og?: number | null;
                    origin?: string;
                    owner_id?: string | null;
                    product_id?: string;
                    sku?: string | null;
                    srm?: number | null;
                    volume?: number | null;
                    weight?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'beers_product_id_fkey';
                        columns: ['product_id'];
                        isOneToOne: true;
                        referencedRelation: 'products';
                        referencedColumns: ['id'];
                    },
                ];
            };
            billing_info: {
                Row: {
                    address: string | null;
                    city: string | null;
                    country: string | null;
                    created_at: string | null;
                    document_id: string | null;
                    id: string;
                    is_default: boolean | null;
                    lastname: string | null;
                    name: string | null;
                    owner_id: string | null;
                    phone: string | null;
                    state: string | null;
                    updated_at: string | null;
                    zipcode: number | null;
                };
                Insert: {
                    address?: string | null;
                    city?: string | null;
                    country?: string | null;
                    created_at?: string | null;
                    document_id?: string | null;
                    id?: string;
                    is_default?: boolean | null;
                    lastname?: string | null;
                    name?: string | null;
                    owner_id?: string | null;
                    phone?: string | null;
                    state?: string | null;
                    updated_at?: string | null;
                    zipcode?: number | null;
                };
                Update: {
                    address?: string | null;
                    city?: string | null;
                    country?: string | null;
                    created_at?: string | null;
                    document_id?: string | null;
                    id?: string;
                    is_default?: boolean | null;
                    lastname?: string | null;
                    name?: string | null;
                    owner_id?: string | null;
                    phone?: string | null;
                    state?: string | null;
                    updated_at?: string | null;
                    zipcode?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'billing_info_owner_id_fkey';
                        columns: ['owner_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            business_orders: {
                Row: {
                    created_at: string;
                    distributor_id: string | null;
                    id: string;
                    order_id: string | null;
                    producer_id: string | null;
                    status: string | null;
                };
                Insert: {
                    created_at?: string;
                    distributor_id?: string | null;
                    id?: string;
                    order_id?: string | null;
                    producer_id?: string | null;
                    status?: string | null;
                };
                Update: {
                    created_at?: string;
                    distributor_id?: string | null;
                    id?: string;
                    order_id?: string | null;
                    producer_id?: string | null;
                    status?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'business_orders_order_id_fkey';
                        columns: ['order_id'];
                        isOneToOne: false;
                        referencedRelation: 'orders';
                        referencedColumns: ['id'];
                    },
                ];
            };
            campaign_item: {
                Row: {
                    campaign_id: string;
                    created_at: string | null;
                    product_id: string;
                    product_price: number | null;
                };
                Insert: {
                    campaign_id: string;
                    created_at?: string | null;
                    product_id: string;
                    product_price?: number | null;
                };
                Update: {
                    campaign_id?: string;
                    created_at?: string | null;
                    product_id?: string;
                    product_price?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'campaign_item_campaign_id_fkey';
                        columns: ['campaign_id'];
                        isOneToOne: false;
                        referencedRelation: 'campaigns';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'campaign_item_product_id_fkey';
                        columns: ['product_id'];
                        isOneToOne: false;
                        referencedRelation: 'products';
                        referencedColumns: ['id'];
                    },
                ];
            };
            campaigns: {
                Row: {
                    campaign_discount: number | null;
                    created_at: string | null;
                    description: string | null;
                    end_date: string | null;
                    goal: string | null;
                    id: string;
                    img_url: string | null;
                    is_public: boolean | null;
                    name: string | null;
                    owner_id: string | null;
                    slogan: string | null;
                    social_cause: string | null;
                    start_date: string | null;
                    status: string | null;
                };
                Insert: {
                    campaign_discount?: number | null;
                    created_at?: string | null;
                    description?: string | null;
                    end_date?: string | null;
                    goal?: string | null;
                    id?: string;
                    img_url?: string | null;
                    is_public?: boolean | null;
                    name?: string | null;
                    owner_id?: string | null;
                    slogan?: string | null;
                    social_cause?: string | null;
                    start_date?: string | null;
                    status?: string | null;
                };
                Update: {
                    campaign_discount?: number | null;
                    created_at?: string | null;
                    description?: string | null;
                    end_date?: string | null;
                    goal?: string | null;
                    id?: string;
                    img_url?: string | null;
                    is_public?: boolean | null;
                    name?: string | null;
                    owner_id?: string | null;
                    slogan?: string | null;
                    social_cause?: string | null;
                    start_date?: string | null;
                    status?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'campaigns_owner_id_fkey';
                        columns: ['owner_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            consumption_points: {
                Row: {
                    cover_letter_name: string | null;
                    cp_organizer_status: number | null;
                    created_at: string | null;
                    cv_name: string | null;
                    id: string;
                    owner_id: string | null;
                };
                Insert: {
                    cover_letter_name?: string | null;
                    cp_organizer_status?: number | null;
                    created_at?: string | null;
                    cv_name?: string | null;
                    id?: string;
                    owner_id?: string | null;
                };
                Update: {
                    cover_letter_name?: string | null;
                    cp_organizer_status?: number | null;
                    created_at?: string | null;
                    cv_name?: string | null;
                    id?: string;
                    owner_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'consumption_points_owner_id_fkey';
                        columns: ['owner_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            coverage_areas: {
                Row: {
                    cities: string[] | null;
                    created_at: string;
                    distributor_id: string | null;
                    europe: string[] | null;
                    id: string;
                    international: string[] | null;
                    privinces: string[] | null;
                    regions: string[] | null;
                };
                Insert: {
                    cities?: string[] | null;
                    created_at?: string;
                    distributor_id?: string | null;
                    europe?: string[] | null;
                    id?: string;
                    international?: string[] | null;
                    privinces?: string[] | null;
                    regions?: string[] | null;
                };
                Update: {
                    cities?: string[] | null;
                    created_at?: string;
                    distributor_id?: string | null;
                    europe?: string[] | null;
                    id?: string;
                    international?: string[] | null;
                    privinces?: string[] | null;
                    regions?: string[] | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'coverage_areasdistributor_id_fkey';
                        columns: ['distributor_id'];
                        isOneToOne: true;
                        referencedRelation: 'distributor_user';
                        referencedColumns: ['user_id'];
                    },
                ];
            };
            cp_fixed: {
                Row: {
                    address: string | null;
                    cp_description: string | null;
                    cp_id: string | null;
                    cp_name: string | null;
                    created_at: string | null;
                    end_date: string | null;
                    geoArgs: Json | null;
                    id: string;
                    is_booking_required: boolean | null;
                    is_internal_organizer: boolean | null;
                    logo_url: string | null;
                    maximum_capacity: number | null;
                    organizer_email: string | null;
                    organizer_lastname: string | null;
                    organizer_name: string | null;
                    organizer_phone: string | null;
                    start_date: string | null;
                    status: string | null;
                };
                Insert: {
                    address?: string | null;
                    cp_description?: string | null;
                    cp_id?: string | null;
                    cp_name?: string | null;
                    created_at?: string | null;
                    end_date?: string | null;
                    geoArgs?: Json | null;
                    id?: string;
                    is_booking_required?: boolean | null;
                    is_internal_organizer?: boolean | null;
                    logo_url?: string | null;
                    maximum_capacity?: number | null;
                    organizer_email?: string | null;
                    organizer_lastname?: string | null;
                    organizer_name?: string | null;
                    organizer_phone?: string | null;
                    start_date?: string | null;
                    status?: string | null;
                };
                Update: {
                    address?: string | null;
                    cp_description?: string | null;
                    cp_id?: string | null;
                    cp_name?: string | null;
                    created_at?: string | null;
                    end_date?: string | null;
                    geoArgs?: Json | null;
                    id?: string;
                    is_booking_required?: boolean | null;
                    is_internal_organizer?: boolean | null;
                    logo_url?: string | null;
                    maximum_capacity?: number | null;
                    organizer_email?: string | null;
                    organizer_lastname?: string | null;
                    organizer_name?: string | null;
                    organizer_phone?: string | null;
                    start_date?: string | null;
                    status?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'cp_fixed_cp_id_fkey';
                        columns: ['cp_id'];
                        isOneToOne: false;
                        referencedRelation: 'consumption_points';
                        referencedColumns: ['id'];
                    },
                ];
            };
            cp_mobile: {
                Row: {
                    address: string | null;
                    cp_description: string | null;
                    cp_id: string | null;
                    cp_name: string | null;
                    created_at: string | null;
                    end_date: string | null;
                    geoArgs: Json | null;
                    id: string;
                    is_booking_required: boolean | null;
                    is_internal_organizer: boolean | null;
                    logo_url: string | null;
                    maximum_capacity: number | null;
                    organizer_email: string | null;
                    organizer_lastname: string | null;
                    organizer_name: string | null;
                    organizer_phone: string | null;
                    start_date: string | null;
                    status: string | null;
                };
                Insert: {
                    address?: string | null;
                    cp_description?: string | null;
                    cp_id?: string | null;
                    cp_name?: string | null;
                    created_at?: string | null;
                    end_date?: string | null;
                    geoArgs?: Json | null;
                    id?: string;
                    is_booking_required?: boolean | null;
                    is_internal_organizer?: boolean | null;
                    logo_url?: string | null;
                    maximum_capacity?: number | null;
                    organizer_email?: string | null;
                    organizer_lastname?: string | null;
                    organizer_name?: string | null;
                    organizer_phone?: string | null;
                    start_date?: string | null;
                    status?: string | null;
                };
                Update: {
                    address?: string | null;
                    cp_description?: string | null;
                    cp_id?: string | null;
                    cp_name?: string | null;
                    created_at?: string | null;
                    end_date?: string | null;
                    geoArgs?: Json | null;
                    id?: string;
                    is_booking_required?: boolean | null;
                    is_internal_organizer?: boolean | null;
                    logo_url?: string | null;
                    maximum_capacity?: number | null;
                    organizer_email?: string | null;
                    organizer_lastname?: string | null;
                    organizer_name?: string | null;
                    organizer_phone?: string | null;
                    start_date?: string | null;
                    status?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'cp_mobile_cp_id_fkey';
                        columns: ['cp_id'];
                        isOneToOne: false;
                        referencedRelation: 'consumption_points';
                        referencedColumns: ['id'];
                    },
                ];
            };
            cpf_events: {
                Row: {
                    cp_id: string;
                    event_id: string;
                    is_active: boolean | null;
                };
                Insert: {
                    cp_id: string;
                    event_id: string;
                    is_active?: boolean | null;
                };
                Update: {
                    cp_id?: string;
                    event_id?: string;
                    is_active?: boolean | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'cpf_events_cp_id_fkey';
                        columns: ['cp_id'];
                        isOneToOne: true;
                        referencedRelation: 'cp_fixed';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'cpf_events_event_id_fkey';
                        columns: ['event_id'];
                        isOneToOne: true;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                ];
            };
            cpf_products: {
                Row: {
                    cp_id: string | null;
                    created_at: string | null;
                    id: string;
                    product_pack_id: string | null;
                    stock: number | null;
                    stock_consumed: number | null;
                };
                Insert: {
                    cp_id?: string | null;
                    created_at?: string | null;
                    id?: string;
                    product_pack_id?: string | null;
                    stock?: number | null;
                    stock_consumed?: number | null;
                };
                Update: {
                    cp_id?: string | null;
                    created_at?: string | null;
                    id?: string;
                    product_pack_id?: string | null;
                    stock?: number | null;
                    stock_consumed?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'cpf_products_cp_id_fkey';
                        columns: ['cp_id'];
                        isOneToOne: true;
                        referencedRelation: 'cp_fixed';
                        referencedColumns: ['id'];
                    },
                ];
            };
            cpm_events: {
                Row: {
                    cp_id: string;
                    event_id: string;
                    is_active: boolean | null;
                };
                Insert: {
                    cp_id: string;
                    event_id: string;
                    is_active?: boolean | null;
                };
                Update: {
                    cp_id?: string;
                    event_id?: string;
                    is_active?: boolean | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'cpm_events_cp_id_fkey';
                        columns: ['cp_id'];
                        isOneToOne: true;
                        referencedRelation: 'cp_mobile';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'cpm_events_event_id_fkey';
                        columns: ['event_id'];
                        isOneToOne: true;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                ];
            };
            cpm_products: {
                Row: {
                    cp_id: string | null;
                    created_at: string | null;
                    id: string;
                    product_pack_id: string | null;
                    stock: number | null;
                    stock_consumed: number | null;
                };
                Insert: {
                    cp_id?: string | null;
                    created_at?: string | null;
                    id?: string;
                    product_pack_id?: string | null;
                    stock?: number | null;
                    stock_consumed?: number | null;
                };
                Update: {
                    cp_id?: string | null;
                    created_at?: string | null;
                    id?: string;
                    product_pack_id?: string | null;
                    stock?: number | null;
                    stock_consumed?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'cpm_products_cp_id_fkey';
                        columns: ['cp_id'];
                        isOneToOne: true;
                        referencedRelation: 'cp_mobile';
                        referencedColumns: ['id'];
                    },
                ];
            };
            customize_settings: {
                Row: {
                    colors: string[] | null;
                    created_at: string | null;
                    family_styles: string[] | null;
                    id: string;
                    owner_id: string | null;
                };
                Insert: {
                    colors?: string[] | null;
                    created_at?: string | null;
                    family_styles?: string[] | null;
                    id?: string;
                    owner_id?: string | null;
                };
                Update: {
                    colors?: string[] | null;
                    created_at?: string | null;
                    family_styles?: string[] | null;
                    id?: string;
                    owner_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'customize_settings_owner_id_fkey';
                        columns: ['owner_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            distribution: {
                Row: {
                    business_order_id: string | null;
                    created_at: string;
                    delivery_date: string | null;
                    estimated_time: number | null;
                    feedback: string | null;
                    id: string;
                    origin_distributor: string | null;
                    price: number | null;
                    shipment_date: string | null;
                    type: string | null;
                };
                Insert: {
                    business_order_id?: string | null;
                    created_at?: string;
                    delivery_date?: string | null;
                    estimated_time?: number | null;
                    feedback?: string | null;
                    id?: string;
                    origin_distributor?: string | null;
                    price?: number | null;
                    shipment_date?: string | null;
                    type?: string | null;
                };
                Update: {
                    business_order_id?: string | null;
                    created_at?: string;
                    delivery_date?: string | null;
                    estimated_time?: number | null;
                    feedback?: string | null;
                    id?: string;
                    origin_distributor?: string | null;
                    price?: number | null;
                    shipment_date?: string | null;
                    type?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'distribution_business_order_id_fkey';
                        columns: ['business_order_id'];
                        isOneToOne: true;
                        referencedRelation: 'business_orders';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'distribution_origin_distributor_fkey';
                        columns: ['origin_distributor'];
                        isOneToOne: true;
                        referencedRelation: 'distributor_user';
                        referencedColumns: ['user_id'];
                    },
                ];
            };
            distribution_contracts: {
                Row: {
                    created_at: string;
                    distributor_accepted: boolean | null;
                    distributor_id: string;
                    message: string | null;
                    producer_accepted: boolean | null;
                    producer_id: string;
                    status: string | null;
                };
                Insert: {
                    created_at?: string;
                    distributor_accepted?: boolean | null;
                    distributor_id: string;
                    message?: string | null;
                    producer_accepted?: boolean | null;
                    producer_id: string;
                    status?: string | null;
                };
                Update: {
                    created_at?: string;
                    distributor_accepted?: boolean | null;
                    distributor_id?: string;
                    message?: string | null;
                    producer_accepted?: boolean | null;
                    producer_id?: string;
                    status?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'distribution_contracts_distributor_id_fkey';
                        columns: ['distributor_id'];
                        isOneToOne: true;
                        referencedRelation: 'distributor_user';
                        referencedColumns: ['user_id'];
                    },
                    {
                        foreignKeyName: 'distribution_contracts_producer_id_fkey';
                        columns: ['producer_id'];
                        isOneToOne: true;
                        referencedRelation: 'producer_user';
                        referencedColumns: ['user_id'];
                    },
                ];
            };
            distribution_costs: {
                Row: {
                    created_at: string;
                    distributor_id: string | null;
                    id: string;
                };
                Insert: {
                    created_at?: string;
                    distributor_id?: string | null;
                    id?: string;
                };
                Update: {
                    created_at?: string;
                    distributor_id?: string | null;
                    id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'distribution_costs_distributor_id_fkey';
                        columns: ['distributor_id'];
                        isOneToOne: true;
                        referencedRelation: 'distributor_user';
                        referencedColumns: ['user_id'];
                    },
                ];
            };
            distributor_user: {
                Row: {
                    bank_account: string | null;
                    company_description: string | null;
                    company_name: string | null;
                    created_at: string;
                    is_authorized: boolean | null;
                    location_id: string | null;
                    nif: string | null;
                    user_id: string;
                };
                Insert: {
                    bank_account?: string | null;
                    company_description?: string | null;
                    company_name?: string | null;
                    created_at?: string;
                    is_authorized?: boolean | null;
                    location_id?: string | null;
                    nif?: string | null;
                    user_id: string;
                };
                Update: {
                    bank_account?: string | null;
                    company_description?: string | null;
                    company_name?: string | null;
                    created_at?: string;
                    is_authorized?: boolean | null;
                    location_id?: string | null;
                    nif?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'distributor_user_location_id_fkey';
                        columns: ['location_id'];
                        isOneToOne: true;
                        referencedRelation: 'profile_location';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'distributor_user_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            event_order_items: {
                Row: {
                    created_at: string | null;
                    id: string;
                    is_reviewed: boolean | null;
                    order_id: string;
                    product_id: string;
                    product_pack_id: string;
                    quantity: number | null;
                    quantity_served: number | null;
                    status: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    is_reviewed?: boolean | null;
                    order_id: string;
                    product_id: string;
                    product_pack_id: string;
                    quantity?: number | null;
                    quantity_served?: number | null;
                    status?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    is_reviewed?: boolean | null;
                    order_id?: string;
                    product_id?: string;
                    product_pack_id?: string;
                    quantity?: number | null;
                    quantity_served?: number | null;
                    status?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'event_order_items_order_id_fkey';
                        columns: ['order_id'];
                        isOneToOne: true;
                        referencedRelation: 'event_orders';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'event_order_items_product_id_fkey';
                        columns: ['product_id'];
                        isOneToOne: true;
                        referencedRelation: 'products';
                        referencedColumns: ['id'];
                    },
                ];
            };
            event_orders: {
                Row: {
                    created_at: string | null;
                    currency: string | null;
                    customer_id: string | null;
                    discount: number | null;
                    promo_code: string | null;
                    event_id: string | null;
                    id: string;
                    order_number: string | null;
                    payment_method: string | null;
                    status: string | null;
                    subtotal: number | null;
                    tax: number | null;
                    total: number | null;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    currency?: string | null;
                    customer_id?: string | null;
                    discount?: number | null;
                    promo_code?: string | null;
                    event_id?: string | null;
                    id?: string;
                    order_number?: string | null;
                    payment_method?: string | null;
                    status?: string | null;
                    subtotal?: number | null;
                    tax?: number | null;
                    total?: number | null;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    currency?: string | null;
                    customer_id?: string | null;
                    discount?: number | null;
                    promo_code?: string | null;
                    event_id?: string | null;
                    id?: string;
                    order_number?: string | null;
                    payment_method?: string | null;
                    status?: string | null;
                    subtotal?: number | null;
                    tax?: number | null;
                    total?: number | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'event_orders_customer_id_fkey';
                        columns: ['customer_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'event_orders_event_id_fkey';
                        columns: ['event_id'];
                        isOneToOne: true;
                        referencedRelation: 'events';
                        referencedColumns: ['id'];
                    },
                ];
            };
            events: {
                Row: {
                    address: string | null;
                    created_at: string | null;
                    description: string | null;
                    end_date: string | null;
                    geoArgs: Json | null;
                    id: string;
                    logo_url: string | null;
                    name: string | null;
                    owner_id: string | null;
                    promotional_url: string | null;
                    start_date: string | null;
                    status: string | null;
                };
                Insert: {
                    address?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    end_date?: string | null;
                    geoArgs?: Json | null;
                    id?: string;
                    logo_url?: string | null;
                    name?: string | null;
                    owner_id?: string | null;
                    promotional_url?: string | null;
                    start_date?: string | null;
                    status?: string | null;
                };
                Update: {
                    address?: string | null;
                    created_at?: string | null;
                    description?: string | null;
                    end_date?: string | null;
                    geoArgs?: Json | null;
                    id?: string;
                    logo_url?: string | null;
                    name?: string | null;
                    owner_id?: string | null;
                    promotional_url?: string | null;
                    start_date?: string | null;
                    status?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'events_owner_id_fkey';
                        columns: ['owner_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            fixed_event_order_items: {
                Row: {
                    created_at: string | null;
                    id: string;
                    order_id: string | null;
                    product_id: string | null;
                    stock_original: number | null;
                    stock_to_consume: number | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    order_id?: string | null;
                    product_id?: string | null;
                    stock_original?: number | null;
                    stock_to_consume?: number | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    order_id?: string | null;
                    product_id?: string | null;
                    stock_original?: number | null;
                    stock_to_consume?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'fixed_event_order_items_order_id_fkey';
                        columns: ['order_id'];
                        isOneToOne: false;
                        referencedRelation: 'fixed_event_orders';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'fixed_event_order_items_product_id_fkey';
                        columns: ['product_id'];
                        isOneToOne: false;
                        referencedRelation: 'products';
                        referencedColumns: ['id'];
                    },
                ];
            };
            fixed_event_orders: {
                Row: {
                    cp_f_owner: string | null;
                    created_at: string | null;
                    currency: string | null;
                    customer_id: string | null;
                    discount: number | null;
                    promo_code: string | null;
                    id: string;
                    order_number: string | null;
                    payment_method: string | null;
                    status: string | null;
                    subtotal: number | null;
                    total: number | null;
                    updated_at: string | null;
                };
                Insert: {
                    cp_f_owner?: string | null;
                    created_at?: string | null;
                    currency?: string | null;
                    customer_id?: string | null;
                    discount?: number | null;
                    promo_code?: string | null;
                    id?: string;
                    order_number?: string | null;
                    payment_method?: string | null;
                    status?: string | null;
                    subtotal?: number | null;
                    total?: number | null;
                    updated_at?: string | null;
                };
                Update: {
                    cp_f_owner?: string | null;
                    created_at?: string | null;
                    currency?: string | null;
                    customer_id?: string | null;
                    discount?: number | null;
                    promo_code?: string | null;
                    id?: string;
                    order_number?: string | null;
                    payment_method?: string | null;
                    status?: string | null;
                    subtotal?: number | null;
                    total?: number | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'fixed_event_orders_cp_f_owner_fkey';
                        columns: ['cp_f_owner'];
                        isOneToOne: true;
                        referencedRelation: 'cp_fixed';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'fixed_event_orders_customer_id_fkey';
                        columns: ['customer_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            flatrate_cost: {
                Row: {
                    created_at: string;
                    distribution_costs_id: string;
                    europe_distribution_cost: number | null;
                    international_distribution_cost: number | null;
                    is_checked_europe: boolean | null;
                    is_checked_international: boolean | null;
                    is_checked_local: boolean | null;
                    is_checked_national: boolean | null;
                    local_distribution_cost: number | null;
                    national_distribution_cost: number | null;
                };
                Insert: {
                    created_at?: string;
                    distribution_costs_id: string;
                    europe_distribution_cost?: number | null;
                    international_distribution_cost?: number | null;
                    is_checked_europe?: boolean | null;
                    is_checked_international?: boolean | null;
                    is_checked_local?: boolean | null;
                    is_checked_national?: boolean | null;
                    local_distribution_cost?: number | null;
                    national_distribution_cost?: number | null;
                };
                Update: {
                    created_at?: string;
                    distribution_costs_id?: string;
                    europe_distribution_cost?: number | null;
                    international_distribution_cost?: number | null;
                    is_checked_europe?: boolean | null;
                    is_checked_international?: boolean | null;
                    is_checked_local?: boolean | null;
                    is_checked_national?: boolean | null;
                    local_distribution_cost?: number | null;
                    national_distribution_cost?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'flatrate_cost_distribution_costs_id_fkey';
                        columns: ['distribution_costs_id'];
                        isOneToOne: true;
                        referencedRelation: 'distribution_costs';
                        referencedColumns: ['id'];
                    },
                ];
            };
            gamification: {
                Row: {
                    created_at: string;
                    experience: number | null;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    experience?: number | null;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    experience?: number | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'gamification_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            likes: {
                Row: {
                    created_at: string | null;
                    id: string;
                    owner_id: string | null;
                    product_id: string;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    owner_id?: string | null;
                    product_id: string;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    owner_id?: string | null;
                    product_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'likes_owner_id_fkey';
                        columns: ['owner_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'likes_product_id_fkey';
                        columns: ['product_id'];
                        isOneToOne: false;
                        referencedRelation: 'products';
                        referencedColumns: ['id'];
                    },
                ];
            };
            local_distribution: {
                Row: {
                    country: string | null;
                    coverage_area_id: string | null;
                    created_at: string;
                    from: number | null;
                    id: string;
                    to: number | null;
                };
                Insert: {
                    country?: string | null;
                    coverage_area_id?: string | null;
                    created_at?: string;
                    from?: number | null;
                    id?: string;
                    to?: number | null;
                };
                Update: {
                    country?: string | null;
                    coverage_area_id?: string | null;
                    created_at?: string;
                    from?: number | null;
                    id?: string;
                    to?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'local_distribution_coverage_area_id_fkey';
                        columns: ['coverage_area_id'];
                        isOneToOne: true;
                        referencedRelation: 'coverage_areas';
                        referencedColumns: ['id'];
                    },
                ];
            };
            monthly_products: {
                Row: {
                    category: string | null;
                    created_at: string;
                    month: number | null;
                    product_id: string;
                    year: number | null;
                };
                Insert: {
                    category?: string | null;
                    created_at?: string;
                    month?: number | null;
                    product_id: string;
                    year?: number | null;
                };
                Update: {
                    category?: string | null;
                    created_at?: string;
                    month?: number | null;
                    product_id?: string;
                    year?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'monthly_products_product_id_fkey';
                        columns: ['product_id'];
                        isOneToOne: true;
                        referencedRelation: 'products';
                        referencedColumns: ['id'];
                    },
                ];
            };
            notifications: {
                Row: {
                    created_at: string | null;
                    id: string;
                    link: string | null;
                    message: string | null;
                    read: boolean | null;
                    source: string | null;
                    user_id: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    link?: string | null;
                    message?: string | null;
                    read?: boolean | null;
                    source?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    link?: string | null;
                    message?: string | null;
                    read?: boolean | null;
                    source?: string | null;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'notifications_source_fkey';
                        columns: ['source'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'notifications_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            order_items: {
                Row: {
                    business_order_id: string;
                    created_at: string;
                    is_reviewed: boolean | null;
                    product_pack_id: string;
                    quantity: number | null;
                };
                Insert: {
                    business_order_id: string;
                    created_at?: string;
                    is_reviewed?: boolean | null;
                    product_pack_id: string;
                    quantity?: number | null;
                };
                Update: {
                    business_order_id?: string;
                    created_at?: string;
                    is_reviewed?: boolean | null;
                    product_pack_id?: string;
                    quantity?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'order_items_business_order_id_fkey';
                        columns: ['business_order_id'];
                        isOneToOne: false;
                        referencedRelation: 'business_orders';
                        referencedColumns: ['id'];
                    },
                ];
            };
            orders: {
                Row: {
                    billing_info_id: string | null;
                    card_id: string | null;
                    created_at: string | null;
                    currency: string | null;
                    customer_name: string | null;
                    discount: number | null;
                    promo_code: string | null;
                    estimated_date: string | null;
                    id: string;
                    issue_date: string | null;
                    order_number: string | null;
                    owner_id: string | null;
                    payment_method: string | null;
                    shipping: number | null;
                    shipping_info_id: string | null;
                    status: string | null;
                    subtotal: number | null;
                    tax: number | null;
                    total: number | null;
                    tracking_id: string | null;
                    type: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    billing_info_id?: string | null;
                    card_id?: string | null;
                    created_at?: string | null;
                    currency?: string | null;
                    customer_name?: string | null;
                    discount?: number | null;
                    promo_code?: string | null;
                    estimated_date?: string | null;
                    id?: string;
                    issue_date?: string | null;
                    order_number?: string | null;
                    owner_id?: string | null;
                    payment_method?: string | null;
                    shipping?: number | null;
                    shipping_info_id?: string | null;
                    status?: string | null;
                    subtotal?: number | null;
                    tax?: number | null;
                    total?: number | null;
                    tracking_id?: string | null;
                    type?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    billing_info_id?: string | null;
                    card_id?: string | null;
                    created_at?: string | null;
                    currency?: string | null;
                    customer_name?: string | null;
                    discount?: number | null;
                    promo_code?: string | null;
                    estimated_date?: string | null;
                    id?: string;
                    issue_date?: string | null;
                    order_number?: string | null;
                    owner_id?: string | null;
                    payment_method?: string | null;
                    shipping?: number | null;
                    shipping_info_id?: string | null;
                    status?: string | null;
                    subtotal?: number | null;
                    tax?: number | null;
                    total?: number | null;
                    tracking_id?: string | null;
                    type?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'orders_billing_info_id_fkey';
                        columns: ['billing_info_id'];
                        isOneToOne: true;
                        referencedRelation: 'billing_info';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'orders_owner_id_fkey';
                        columns: ['owner_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'orders_shipping_info_id_fkey';
                        columns: ['shipping_info_id'];
                        isOneToOne: true;
                        referencedRelation: 'shipping_info';
                        referencedColumns: ['id'];
                    },
                ];
            };
            producer_user: {
                Row: {
                    company_description: string | null;
                    company_name: string | null;
                    created_at: string;
                    is_authorized: boolean | null;
                    location_id: string | null;
                    user_id: string;
                };
                Insert: {
                    company_description?: string | null;
                    company_name?: string | null;
                    created_at?: string;
                    is_authorized?: boolean | null;
                    location_id?: string | null;
                    user_id: string;
                };
                Update: {
                    company_description?: string | null;
                    company_name?: string | null;
                    created_at?: string;
                    is_authorized?: boolean | null;
                    location_id?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'producer_user_location_id_fkey';
                        columns: ['location_id'];
                        isOneToOne: false;
                        referencedRelation: 'profile_location';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'producer_user_user_id_fkey';
                        columns: ['user_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            product_inventory: {
                Row: {
                    created_at: string | null;
                    id: string;
                    limit_notification: number | null;
                    product_id: string | null;
                    quantity: number | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    limit_notification?: number | null;
                    product_id?: string | null;
                    quantity?: number | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    limit_notification?: number | null;
                    product_id?: string | null;
                    quantity?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'product_inventory_product_id_fkey';
                        columns: ['product_id'];
                        isOneToOne: true;
                        referencedRelation: 'products';
                        referencedColumns: ['id'];
                    },
                ];
            };
            product_lots: {
                Row: {
                    created_at: string | null;
                    expiration_date: string | null;
                    id: string;
                    limit_notification: number | null;
                    lot_id: string | null;
                    lot_name: string | null;
                    lot_number: string | null;
                    manufacture_date: string | null;
                    owner_id: string | null;
                    packaging: string | null;
                    product_id: string | null;
                    quantity: number | null;
                    recipe: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    expiration_date?: string | null;
                    id?: string;
                    limit_notification?: number | null;
                    lot_id?: string | null;
                    lot_name?: string | null;
                    lot_number?: string | null;
                    manufacture_date?: string | null;
                    owner_id?: string | null;
                    packaging?: string | null;
                    product_id?: string | null;
                    quantity?: number | null;
                    recipe?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    expiration_date?: string | null;
                    id?: string;
                    limit_notification?: number | null;
                    lot_id?: string | null;
                    lot_name?: string | null;
                    lot_number?: string | null;
                    manufacture_date?: string | null;
                    owner_id?: string | null;
                    packaging?: string | null;
                    product_id?: string | null;
                    quantity?: number | null;
                    recipe?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'product_lots_owner_id_fkey';
                        columns: ['owner_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'product_lots_product_id_fkey';
                        columns: ['product_id'];
                        isOneToOne: true;
                        referencedRelation: 'products';
                        referencedColumns: ['id'];
                    },
                ];
            };
            product_multimedia: {
                Row: {
                    p_back: string | null;
                    p_extra_1: string | null;
                    p_extra_2: string | null;
                    p_extra_3: string | null;
                    p_extra_4: string | null;
                    p_principal: string | null;
                    product_id: string;
                    v_extra_1: string | null;
                    v_extra_2: string | null;
                    v_principal: string | null;
                };
                Insert: {
                    p_back?: string | null;
                    p_extra_1?: string | null;
                    p_extra_2?: string | null;
                    p_extra_3?: string | null;
                    p_extra_4?: string | null;
                    p_principal?: string | null;
                    product_id: string;
                    v_extra_1?: string | null;
                    v_extra_2?: string | null;
                    v_principal?: string | null;
                };
                Update: {
                    p_back?: string | null;
                    p_extra_1?: string | null;
                    p_extra_2?: string | null;
                    p_extra_3?: string | null;
                    p_extra_4?: string | null;
                    p_principal?: string | null;
                    product_id?: string;
                    v_extra_1?: string | null;
                    v_extra_2?: string | null;
                    v_principal?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'product_multimedia_product_id_fkey';
                        columns: ['product_id'];
                        isOneToOne: true;
                        referencedRelation: 'products';
                        referencedColumns: ['id'];
                    },
                ];
            };
            product_packs: {
                Row: {
                    created_at: string;
                    img_url: string | null;
                    name: string | null;
                    price: number | null;
                    product_id: string;
                    quantity: number | null;
                    randomUUID: string | null;
                };
                Insert: {
                    created_at?: string;
                    img_url?: string | null;
                    name?: string | null;
                    price?: number | null;
                    product_id: string;
                    quantity?: number | null;
                    randomUUID?: string | null;
                };
                Update: {
                    created_at?: string;
                    img_url?: string | null;
                    name?: string | null;
                    price?: number | null;
                    product_id?: string;
                    quantity?: number | null;
                    randomUUID?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'product_packs_product_id_fkey';
                        columns: ['product_id'];
                        isOneToOne: true;
                        referencedRelation: 'products';
                        referencedColumns: ['id'];
                    },
                ];
            };
            products: {
                Row: {
                    article_number: number | null;
                    campaign_id: string | null;
                    category: string | null;
                    created_at: string;
                    description: string;
                    promo_code: string | null;
                    discount_percent: number | null;
                    id: string;
                    is_archived: boolean | null;
                    is_monthly: boolean | null;
                    is_public: boolean | null;
                    name: string;
                    owner_id: string | null;
                    price: number | null;
                    social_cause_id: number | null;
                    type: string;
                    variant_number: number | null;
                };
                Insert: {
                    article_number?: number | null;
                    campaign_id?: string | null;
                    category?: string | null;
                    created_at?: string;
                    description: string;
                    promo_code?: string | null;
                    discount_percent?: number | null;
                    id?: string;
                    is_archived?: boolean | null;
                    is_monthly?: boolean | null;
                    is_public?: boolean | null;
                    name: string;
                    owner_id?: string | null;
                    price?: number | null;
                    social_cause_id?: number | null;
                    type: string;
                    variant_number?: number | null;
                };
                Update: {
                    article_number?: number | null;
                    campaign_id?: string | null;
                    category?: string | null;
                    created_at?: string;
                    description?: string;
                    promo_code?: string | null;
                    discount_percent?: number | null;
                    id?: string;
                    is_archived?: boolean | null;
                    is_monthly?: boolean | null;
                    is_public?: boolean | null;
                    name?: string;
                    owner_id?: string | null;
                    price?: number | null;
                    social_cause_id?: number | null;
                    type?: string;
                    variant_number?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'products_owner_id_fkey';
                        columns: ['owner_id'];
                        isOneToOne: false;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            profile_location: {
                Row: {
                    address_1: string | null;
                    address_2: string | null;
                    company: string | null;
                    country: string | null;
                    created_at: string | null;
                    document_id: string | null;
                    id: string;
                    lastname: string | null;
                    name: string | null;
                    owner_id: string | null;
                    phone: string | null;
                    postalcode: number | null;
                    province: string | null;
                    town: string | null;
                };
                Insert: {
                    address_1?: string | null;
                    address_2?: string | null;
                    company?: string | null;
                    country?: string | null;
                    created_at?: string | null;
                    document_id?: string | null;
                    id?: string;
                    lastname?: string | null;
                    name?: string | null;
                    owner_id?: string | null;
                    phone?: string | null;
                    postalcode?: number | null;
                    province?: string | null;
                    town?: string | null;
                };
                Update: {
                    address_1?: string | null;
                    address_2?: string | null;
                    company?: string | null;
                    country?: string | null;
                    created_at?: string | null;
                    document_id?: string | null;
                    id?: string;
                    lastname?: string | null;
                    name?: string | null;
                    owner_id?: string | null;
                    phone?: string | null;
                    postalcode?: number | null;
                    province?: string | null;
                    town?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'profile_location_owner_id_fkey';
                        columns: ['owner_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            reviews: {
                Row: {
                    appearance: number | null;
                    aroma: number | null;
                    bitterness: number | null;
                    comment: string | null;
                    created_at: string | null;
                    id: string;
                    mouthfeel: number | null;
                    overall: number | null;
                    owner_id: string | null;
                    product_id: string | null;
                    taste: number | null;
                    updated_at: string | null;
                };
                Insert: {
                    appearance?: number | null;
                    aroma?: number | null;
                    bitterness?: number | null;
                    comment?: string | null;
                    created_at?: string | null;
                    id?: string;
                    mouthfeel?: number | null;
                    overall?: number | null;
                    owner_id?: string | null;
                    product_id?: string | null;
                    taste?: number | null;
                    updated_at?: string | null;
                };
                Update: {
                    appearance?: number | null;
                    aroma?: number | null;
                    bitterness?: number | null;
                    comment?: string | null;
                    created_at?: string | null;
                    id?: string;
                    mouthfeel?: number | null;
                    overall?: number | null;
                    owner_id?: string | null;
                    product_id?: string | null;
                    taste?: number | null;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'reviews_owner_id_fkey';
                        columns: ['owner_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'reviews_product_id_fkey';
                        columns: ['product_id'];
                        isOneToOne: false;
                        referencedRelation: 'products';
                        referencedColumns: ['id'];
                    },
                ];
            };
            shipping_info: {
                Row: {
                    address: string | null;
                    address_extra: string | null;
                    address_observations: string | null;
                    city: string | null;
                    country: string | null;
                    created_at: string | null;
                    document_id: string | null;
                    id: string;
                    is_default: boolean | null;
                    lastname: string | null;
                    name: string | null;
                    owner_id: string | null;
                    phone: string | null;
                    state: string | null;
                    updated_at: string | null;
                    zipcode: number | null;
                };
                Insert: {
                    address?: string | null;
                    address_extra?: string | null;
                    address_observations?: string | null;
                    city?: string | null;
                    country?: string | null;
                    created_at?: string | null;
                    document_id?: string | null;
                    id?: string;
                    is_default?: boolean | null;
                    lastname?: string | null;
                    name?: string | null;
                    owner_id?: string | null;
                    phone?: string | null;
                    state?: string | null;
                    updated_at?: string | null;
                    zipcode?: number | null;
                };
                Update: {
                    address?: string | null;
                    address_extra?: string | null;
                    address_observations?: string | null;
                    city?: string | null;
                    country?: string | null;
                    created_at?: string | null;
                    document_id?: string | null;
                    id?: string;
                    is_default?: boolean | null;
                    lastname?: string | null;
                    name?: string | null;
                    owner_id?: string | null;
                    phone?: string | null;
                    state?: string | null;
                    updated_at?: string | null;
                    zipcode?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'shipping_info_owner_id_fkey';
                        columns: ['owner_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            user_reports: {
                Row: {
                    created_at: string;
                    description: string | null;
                    file: string | null;
                    id: string;
                    is_resolved: boolean | null;
                    reporter_id: string | null;
                    title: string | null;
                };
                Insert: {
                    created_at?: string;
                    description?: string | null;
                    file?: string | null;
                    id?: string;
                    is_resolved?: boolean | null;
                    reporter_id?: string | null;
                    title?: string | null;
                };
                Update: {
                    created_at?: string;
                    description?: string | null;
                    file?: string | null;
                    id?: string;
                    is_resolved?: boolean | null;
                    reporter_id?: string | null;
                    title?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'user_reports_reporter_id_fkey';
                        columns: ['reporter_id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
            users: {
                Row: {
                    avatar_url: string | null;
                    bg_url: string | null;
                    birthdate: string | null;
                    cp_organizer_status: number | null;
                    created_at: string | null;
                    email: string | null;
                    id: string;
                    image: string | null;
                    is_provider: boolean | null;
                    lastname: string | null;
                    name: string | null;
                    role: string | null;
                    updated_at: string | null;
                    username: string | null;
                };
                Insert: {
                    avatar_url?: string | null;
                    bg_url?: string | null;
                    birthdate?: string | null;
                    cp_organizer_status?: number | null;
                    created_at?: string | null;
                    email?: string | null;
                    id: string;
                    image?: string | null;
                    is_provider?: boolean | null;
                    lastname?: string | null;
                    name?: string | null;
                    role?: string | null;
                    updated_at?: string | null;
                    username?: string | null;
                };
                Update: {
                    avatar_url?: string | null;
                    bg_url?: string | null;
                    birthdate?: string | null;
                    cp_organizer_status?: number | null;
                    created_at?: string | null;
                    email?: string | null;
                    id?: string;
                    image?: string | null;
                    is_provider?: boolean | null;
                    lastname?: string | null;
                    name?: string | null;
                    role?: string | null;
                    updated_at?: string | null;
                    username?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: 'users_id_fkey';
                        columns: ['id'];
                        isOneToOne: true;
                        referencedRelation: 'users';
                        referencedColumns: ['id'];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            delete_claim: {
                Args: {
                    uid: string;
                    claim: string;
                };
                Returns: string;
            };
            get_claim: {
                Args: {
                    uid: string;
                    claim: string;
                };
                Returns: Json;
            };
            get_claims: {
                Args: {
                    uid: string;
                };
                Returns: Json;
            };
            get_my_claim: {
                Args: {
                    claim: string;
                };
                Returns: Json;
            };
            get_my_claims: {
                Args: Record<PropertyKey, never>;
                Returns: Json;
            };
            is_claims_admin: {
                Args: Record<PropertyKey, never>;
                Returns: boolean;
            };
            set_claim: {
                Args: {
                    uid: string;
                    claim: string;
                    value: Json;
                };
                Returns: string;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (Database['public']['Tables'] & Database['public']['Views'])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
              Database[PublicTableNameOrOptions['schema']]['Views'])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
          Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
          Database['public']['Views'])
    ? (Database['public']['Tables'] &
          Database['public']['Views'])[PublicTableNameOrOptions] extends {
          Row: infer R;
      }
        ? R
        : never
    : never;

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof Database['public']['Tables']
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
          Insert: infer I;
      }
        ? I
        : never
    : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof Database['public']['Tables']
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
          Update: infer U;
      }
        ? U
        : never
    : never;

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof Database['public']['Enums']
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never;
