import { ISubRegionCoverageAreas } from '../lib/types/distribution_areas';

export function isSameSubRegion(
    subRegion1: ISubRegionCoverageAreas,
    subRegion2: ISubRegionCoverageAreas,
) {
    return (
        subRegion1.country_iso_code === subRegion2.country_iso_code &&
        subRegion1.region === subRegion2.region &&
        subRegion1.name === subRegion2.name
    );
}
