import { ISubRegionCoverageAreas } from '../../../../../lib/types/distribution_areas';
import { isSameSubRegion } from '../actions';

describe('isSameSubRegion', () => {
    it('should return true for identical sub-regions', async () => {
        const subRegion1: ISubRegionCoverageAreas = {
            country: 'US',
            country_iso_code: 'US',
            region: 'California',
            name: 'Bay Area',
            distributor_id: '1',
        };
        const subRegion2: ISubRegionCoverageAreas = {
            country: 'US',
            country_iso_code: 'US',
            region: 'California',
            name: 'Bay Area',
            distributor_id: '1',
        };
        expect(await isSameSubRegion(subRegion1, subRegion2)).toBe(true);
    });

    it('should return false for different countries', async () => {
        const subRegion1: ISubRegionCoverageAreas = {
            country: 'US',
            country_iso_code: 'US',
            region: 'California',
            name: 'Bay Area',
            distributor_id: '1',
        };
        const subRegion2: ISubRegionCoverageAreas = {
            country: 'US',
            country_iso_code: 'CA',
            region: 'California',
            name: 'Bay Area',
            distributor_id: '1',
        };
        expect(await isSameSubRegion(subRegion1, subRegion2)).toBe(false);
    });

    it('should return false for different regions', async () => {
        const subRegion1: ISubRegionCoverageAreas = {
            country: 'US',
            country_iso_code: 'CA',
            region: 'California',
            name: 'Bay Area',
            distributor_id: '1',
        };
        const subRegion2: ISubRegionCoverageAreas = {
            country: 'US',
            country_iso_code: 'US',
            region: 'Nevada',
            name: 'Bay Area',
            distributor_id: '1',
        };
        expect(await isSameSubRegion(subRegion1, subRegion2)).toBe(false);
    });

    it('should return false for different names', async () => {
        const subRegion1: ISubRegionCoverageAreas = {
            country: 'US',
            country_iso_code: 'CA',
            region: 'California',
            name: 'Bay Area',
            distributor_id: '1',
        };
        const subRegion2: ISubRegionCoverageAreas = {
            country: 'US',
            country_iso_code: 'US',
            region: 'California',
            name: 'Los Angeles',
            distributor_id: '1',
        };
        expect(await isSameSubRegion(subRegion1, subRegion2)).toBe(false);
    });
});
