import { IProduct } from './types';

export interface IBoxPack {
    id: string;
    slots_per_box: number;
    // products?: IProduct[];
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
