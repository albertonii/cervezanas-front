'use client';

import useFetchDistributionByOwnerId from '../../../../../../../hooks/useFetchDistribution';
import CityDistribution from '../(city)/CityDistribution';
import HorizontalMenu from '../HorizontalMenuCoverageDestination';
import ProvinceDistribution from '../(province)/ProvinceDistribution';
import InternationalDistribution from '../(international)/InternationalDistribution';
import EuropeDistribution from '../(europe)/EuropeDistribution';
import RegionDistribution from '../(region)/RegionDistribution';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DistributionDestinationType } from '../../../../../../../lib/enums';
import { Tooltip } from '../../../../../components/common/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function CoverageAreas() {
    const t = useTranslations();
    const [menuOption, setMenuOption] = useState<string>(
        DistributionDestinationType.CITY,
    );

    const { data: distributor, error } = useFetchDistributionByOwnerId();

    if (error) {
        console.error(error);
    }

    // TODO: Hay que buscar una forma de normalizar los nombres de los paises
    // para puedan estar autoseleccionados al momento de recibir el listado de países que
    // tiene el distribuidor. Si lo hacemos de la manera de abajo
    // hay causíticas que no ten<zemos en cuenta: Bosnia and Herzegovina no se marcaría
    const internationalCountries =
        distributor?.coverage_areas?.international?.map((country) => {
            return country.replace(/\w\S*/g, (txt) => {
                return txt.replace(/\b\w/g, (v) => v.toUpperCase());
            });
        }) ?? [];

    const renderSwitch = () => {
        if (distributor?.coverage_areas === undefined) return null;

        switch (menuOption) {
            case DistributionDestinationType.LOCAL:
                return (
                    <>
                        {/* {distribution && (
                            <LocalDistribution
                                localDistribution={
                                distribution.coverage_areas.local_distribution
                                }
                            />
                        )} */}
                    </>
                );

            case DistributionDestinationType.CITY:
                return (
                    <>
                        {distributor && (
                            <CityDistribution
                                cities={distributor.coverage_areas.cities}
                                coverageAreaId={distributor.coverage_areas.id}
                                distributionCosts={
                                    distributor.distribution_costs!
                                }
                            />
                        )}
                    </>
                );

            case DistributionDestinationType.PROVINCE:
                return (
                    <>
                        {distributor && (
                            <ProvinceDistribution
                                provinces={distributor.coverage_areas.provinces}
                                coverageAreaId={distributor.coverage_areas.id}
                            />
                        )}
                    </>
                );

            case DistributionDestinationType.REGION:
                return (
                    <>
                        {distributor && (
                            <RegionDistribution
                                regions={distributor.coverage_areas.regions}
                                coverageAreaId={distributor.coverage_areas.id}
                            />
                        )}
                    </>
                );

            case DistributionDestinationType.EUROPE:
                return (
                    <>
                        {distributor && (
                            <EuropeDistribution
                                countries={distributor?.coverage_areas.europe}
                                coverageAreaId={distributor.coverage_areas.id}
                            />
                        )}
                    </>
                );

            case DistributionDestinationType.INTERNATIONAL:
                return (
                    <>
                        {distributor && (
                            <InternationalDistribution
                                countries={internationalCountries}
                                coverageAreaId={distributor.coverage_areas.id}
                            />
                        )}
                    </>
                );
            default:
                return <span>local</span>;
        }
    };

    return (
        <fieldset className="space-y-6 p-6 rounded-lg border border-gray-300 bg-white shadow-sm max-w-3xl mx-auto">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-semibold text-gray-800">
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
            </div>

            {/* Horizontal menu  */}
            <HorizontalMenu setMenuOption={setMenuOption} />

            {/* Coverage Area content  */}
            <section>{renderSwitch()}</section>

            {/* Map Area Content  */}
        </fieldset>
    );
}
