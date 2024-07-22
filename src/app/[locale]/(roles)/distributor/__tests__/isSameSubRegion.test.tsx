import { ICoverageArea } from '@/lib//types/types';
import { isSameSubRegion } from '@/utils/distribution';

describe('isSameSubRegion', () => {
    it('should return true for identical sub-regions', async () => {
        const subRegion1: ICoverageArea = {
            country: 'US',
            country_iso_code: 'US',
            region: 'California',
            sub_region: 'Bay Area',
            distributor_id: '1',
            administrative_division: 'sub_region',
        };
        const subRegion2: ICoverageArea = {
            country: 'US',
            country_iso_code: 'US',
            region: 'California',
            sub_region: 'Bay Area',
            distributor_id: '1',
            administrative_division: 'sub_region',
        };
        expect(await isSameSubRegion(subRegion1, subRegion2)).toBe(true);
    });

    it('should return false for different countries', async () => {
        const subRegion1: ICoverageArea = {
            country: 'US',
            country_iso_code: 'US',
            region: 'California',
            sub_region: 'Bay Area',
            distributor_id: '1',
            administrative_division: 'sub_region',
        };
        const subRegion2: ICoverageArea = {
            country: 'US',
            country_iso_code: 'CA',
            region: 'California',
            sub_region: 'Bay Area',
            distributor_id: '1',
            administrative_division: 'sub_region',
        };
        expect(await isSameSubRegion(subRegion1, subRegion2)).toBe(false);
    });

    it('should return false for different regions', async () => {
        const subRegion1: ICoverageArea = {
            country: 'US',
            country_iso_code: 'CA',
            region: 'California',
            sub_region: 'Bay Area',
            distributor_id: '1',
            administrative_division: 'sub_region',
        };
        const subRegion2: ICoverageArea = {
            country: 'US',
            country_iso_code: 'US',
            region: 'Nevada',
            sub_region: 'Bay Area',
            distributor_id: '1',
            administrative_division: 'sub_region',
        };
        expect(await isSameSubRegion(subRegion1, subRegion2)).toBe(false);
    });

    it('should return false for different names', async () => {
        const subRegion1: ICoverageArea = {
            country: 'US',
            country_iso_code: 'CA',
            region: 'California',
            sub_region: 'Bay Area',
            distributor_id: '1',
            administrative_division: 'sub_region',
        };
        const subRegion2: ICoverageArea = {
            country: 'US',
            country_iso_code: 'US',
            region: 'California',
            sub_region: 'Los Angeles',
            distributor_id: '1',
            administrative_division: 'sub_region',
        };
        expect(await isSameSubRegion(subRegion1, subRegion2)).toBe(false);
    });
});
