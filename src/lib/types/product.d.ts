import { IProduct } from './types';

export interface IBoxPack {
    id: string;
    slots_per_box: number;
    product_id: string;
    products?: IProduct[];
    box_pack_items?: IBoxPackItem[];
}

export interface IBoxPackItem {
    id?: string;
    box_pack_id?: string;
    product_id: string;
    quantity: number;
    slots_per_product: number;
    products?: IProduct;
    boxs?: IBoxPack[];
}

export interface ModalAddBoxPackFormData {
    is_public: boolean;
    is_available: boolean;
    is_for_event: boolean;
    name: string;
    description: string;
    price: number;
    weight: number;
    slots_per_box: number;
    box_packs?: ModalAddBoxPackItemFormData[];
}

export interface ModalAddBoxPackItemFormData {
    quantity: number;
    slots_per_product: number;
    product_id?: string; // Es el id del producto, no de la caja-box
}

export interface ModalUpdateBoxPackFormData {
    slots_per_box: number;
    is_public: boolean;
    is_available: boolean;
    is_for_event: boolean;
    name: string;
    description: string;
    price: number;
    weight: number;
    box_pack_items?: ModalUpdateBoxPackItemFormData[];
    products?: IProductBoxFormData[];
    media_files?: IProductMediaFormData[];
}

export interface ModalUpdateBoxPackItemFormData {
    id: string;
    box_pack_id: string;
    product_id: string;
    quantity: number;
    slots_per_product: number;
    products?: IProductBoxFormData;
}

interface IProductBoxFormData {
    id: string;
    created_at: string;
    name: string;
    description: string;
    type: ProductType;
    is_public: boolean;
    discount_percent: number;
    weight: number;
    promo_code: string;
    price: number; // TODO : quitar el price - pq está en product_pack
    campaign_id: string;
    is_archived: boolean;
    category: string;
    is_monthly: boolean;
    owner_id: string;
    // product_lots?: IProductLot[];
    beers?: IBeerFormData;
    // product_inventory?: IProductInventory;
}

export interface IBeerFormData {
    product_id: string; // FK
    created_at: string;
    category: string;
    fermentation: string;
    color: string;
    family: string;
    aroma: string;
    is_gluten: boolean;
    format: string;
    volume: number;
    sku: string;
    intensity: number;
    srm: number;
    og: number;
    fg: number;
    ibu: number;
    ingredients?: string[];
    pairing?: string[];
    recommended_glass?: string;
    brewers_note?: string;
}
