import { IProduct } from './types';

export interface IBoxPack {
    id: string;
    slots: number;
    products?: IProduct[];
}

export interface IBoxPackItem {
    id?: string;
    box_pack_id?: string;
    product_id: string;
    quantity: number;
    slots_per_product: number;
    product?: IProduct;
    boxs?: IBoxPack[];
}

export interface ModalAddBoxPackFormData {
    box_pack_id: string;
    product_id: string;
    quantity: number;
    is_public: boolean;
    name: string;
    description: string;
    box_packs: ModalAddBoxPackItemFormData[];
}

export interface ModalAddBoxPackItemFormData {
    box_pack_id: string;
    product_id: string;
    quantity: number;
    slots_per_product: number;
}
