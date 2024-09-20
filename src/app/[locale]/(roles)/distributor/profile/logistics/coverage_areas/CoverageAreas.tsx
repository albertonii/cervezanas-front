'use client';

import useFetchDistributionByOwnerId from '../../../../../../../hooks/useFetchDistributorByOwnerId';
import HorizontalMenu from '../HorizontalMenuCoverageDestination';
import SubRegionDistribution from '../(sub_region)/SubRegionDistribution';
import RegionDistribution from '../(region)/RegionDistribution';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { IDistributorUser } from '@/lib/types/types';
import { DistributionDestinationType } from '@/lib/enums';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from '@/app/[locale]/components/ui/Tooltip';

export default function CoverageAreas() {
    const t = useTranslations();
    const [menuOption, setMenuOption] = useState<string>(
        DistributionDestinationType.SUB_REGION,
    );

    const [distributor, setDistributor] = useState<IDistributorUser>();

    const { data, error, isFetchedAfterMount } =
        useFetchDistributionByOwnerId();

    useEffect(() => {
        if (isFetchedAfterMount) {
            setDistributor(data);
        }

        return () => {};
    }, [data, isFetchedAfterMount]);

    // TODO: Hay que buscar una forma de normalizar los nombres de los paises
    // para puedan estar autoseleccionados al momento de recibir el listado de países que
    // tiene el distribuidor. Si lo hacemos de la manera de abajo
    // hay causíticas que no tenemos en cuenta: Bosnia and Herzegovina no se marcaría
    // const internationalCountries =
    //     distributor?.coverage_areas?.international?.map((country) => {
    //         return country.replace(/\w\S*/g, (txt) => {
    //             return txt.replace(/\b\w/g, (v) => v.toUpperCase());
    //         });
    //     }) ?? [];

    const renderSwitch = () => {
        if (distributor?.coverage_areas === undefined) return null;

        switch (menuOption) {
            // case DistributionDestinationType.CITY:
            //     return (
            //         <>
            //             {distributor && (
            //                 <CityDistribution
            //                     cities={distributor.coverage_areas.cities}
            //                     coverageAreaId={distributor.coverage_areas.id}
            //                     distributionCosts={
            //                         distributor.distribution_costs!
            //                     }
            //                 />
            //             )}
            //         </>
            //     );

            case DistributionDestinationType.SUB_REGION:
                return (
                    <>
                        {distributor.coverage_areas && (
                            <SubRegionDistribution
                                fromDB={distributor.coverage_areas}
                                distributionCosts={
                                    distributor.distribution_costs!
                                }
                            />
                        )}
                    </>
                );

            case DistributionDestinationType.REGION:
                return (
                    <>
                        {distributor && (
                            <RegionDistribution
                                fromDB={distributor.coverage_areas}
                                distributionCosts={
                                    distributor.distribution_costs!
                                }
                            />
                        )}
                    </>
                );

            // case DistributionDestinationType.EUROPE:
            //     return (
            //         <>
            //             {distributor && (
            //                 <EuropeDistribution
            //                     countries={distributor?.coverage_areas.europe}
            //                     coverageAreaId={distributor.coverage_areas.id}
            //                 />
            //             )}
            //         </>
            //     );

            // case DistributionDestinationType.INTERNATIONAL:
            //     return (
            //         <>
            //             {distributor && (
            //                 <InternationalDistribution
            //                     countries={internationalCountries}
            //                     coverageAreaId={distributor.coverage_areas.id}
            //                 />
            //             )}
            //         </>
            //     );
            default:
                return <span>local</span>;
        }
    };

    if (error) {
        return <div>Error: {String(error)}</div>;
    }

    return (
        <fieldset className="space-y-6 p-6 rounded-lg border border-gray-300 bg-white shadow-sm max-w-3xl mx-auto">
            <div className="flex justify-between items-center space-y-4">
                <h2 className="text-4xl font-['NexaRust-script']">
                    {t('distribution_destination')}
                </h2>

                <Tooltip
                    content="Configure los destinos de distribución para la venta online"
                    delay={0}
                    width={200}
                >
                    <FontAwesomeIcon
                        icon={faInfoCircle}
                        style={{ color: '#90470b' }}
                        title={'Information'}
                        className="h-14 w-14 fill-beer-blonde text-base"
                    />
                </Tooltip>
            </div>

            <p className="text-gray-600 text-base leading-relaxed">
                {t('select_coverage_areas_to_start_selling')}
            </p>

            {/* Horizontal menu  */}
            <HorizontalMenu setMenuOption={setMenuOption} />

            {/* Coverage Area content  */}
            <section>{renderSwitch()}</section>

            {/* Map Area Content  */}
        </fieldset>
    );
}
