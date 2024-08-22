import React from 'react';
import SubRegionTable from '@/app/[locale]/(roles)/distributor/profile/logistics/(sub_region)/SubRegionTable';
import { IDistributorUser } from '@/lib/types/types';
import { useTranslations } from 'next-intl';

interface Props {
    distributor: IDistributorUser;
}

const DistributorCoverageAreas = ({ distributor }: Props) => {
    const t = useTranslations();

    return (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('public_user_information.distributor_coverage_areas')}
            </h2>

            <div className="overflow-x-auto">
                <SubRegionTable subRegions={distributor.coverage_areas!} />
            </div>
        </div>
    );
};

export default DistributorCoverageAreas;
