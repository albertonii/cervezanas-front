import { ICoverageArea, IProductPackCartItem } from '@/lib/types/types';

export function isSameRegion(region1: ICoverageArea, region2: ICoverageArea) {
    return (
        region1.country_iso_code === region2.country_iso_code &&
        region1.region === region2.region
    );
}

export function isSameSubRegion(
    subRegion1: ICoverageArea,
    subRegion2: ICoverageArea,
) {
    return (
        subRegion1.country_iso_code === subRegion2.country_iso_code &&
        subRegion1.region === subRegion2.region &&
        subRegion1.sub_region === subRegion2.sub_region
    );
}

// Normalizar datos de la información de envío
export function normalizeAddress(str: string) {
    return str
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '');
}

export function calculateProductPacksWeight(productPack: IProductPackCartItem) {
    const packQuantity = productPack.packs[0].quantity;
    const packWeight = productPack.products?.weight ?? 0;
    const totalWeight = packWeight * packQuantity;

    // Convert gr to KG
    return totalWeight / 1000;
}
