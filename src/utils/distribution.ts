import { ICoverageArea } from '../lib/types/types';

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
