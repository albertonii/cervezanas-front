import { ICoverageArea_ } from '../lib/types/types';

export function isSameSubRegion(
    subRegion1: ICoverageArea_,
    subRegion2: ICoverageArea_,
) {
    return (
        subRegion1.country_iso_code === subRegion2.country_iso_code &&
        subRegion1.region === subRegion2.region &&
        subRegion1.sub_region === subRegion2.sub_region
    );
}
