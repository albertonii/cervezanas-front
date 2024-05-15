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
    name: string;
    description: string;
    price: number;
    weight: number;
    slots_per_box: number;
    box_packs?: ModalAddBoxPackItemFormData[];
    p_principal?: any;
    p_back?: any;
    p_extra_1?: any;
    p_extra_2?: any;
    p_extra_3?: any;
}

export interface ModalAddBoxPackItemFormData {
    quantity: number;
    slots_per_product: number;
    product_id?: string; // Es el id del producto, no de la caja-box
}

export interface ModalUpdateBoxPackFormData {
    id: string;
    slots_per_box: number;
    product_id: string;
    is_public: boolean;
    name: string;
    description: string;
    price: number;
    weight: number;
    box_pack_items?: ModalUpdateBoxPackItemFormData[];
    products?: IProductBoxFormData[];
    p_principal?: any;
    p_back?: any;
    p_extra_1?: any;
    p_extra_2?: any;
    p_extra_3?: any;
}

export interface ModalUpdateBoxPackItemFormData {
    id: string;
    box_pack_id: string;
    product_id: string;
    quantity: number;
    slots_per_product: number;
    products?: IProductBoxFormData;
    // box_packs?: ModalUpdateBoxPackFormData[];
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
    discount_code: string;
    price: number; // TODO : quitar el price - pq está en product_pack
    campaign_id: string;
    is_archived: boolean;
    category: string;
    is_monthly: boolean;
    owner_id: string;
    // product_lots?: IProductLot[];
    beers?: IBeerFormData;
    // product_inventory?: IProductInventory;
    // product_multimedia?: IProductMultimedia;
}

export interface IBeerFormData {
    product_id: string; // FK
    created_at: string;
    category: string;
    fermentation: string;
    color: string;
    family: string;
    era: string;
    aroma: string;
    is_gluten: boolean;
    format: string;
    volume: number;
    sku: string;
    intensity: number;
    origin: string;
    country: string;
    composition: string;
    srm: number;
    og: number;
    fg: number;
    ibu: number;
}
