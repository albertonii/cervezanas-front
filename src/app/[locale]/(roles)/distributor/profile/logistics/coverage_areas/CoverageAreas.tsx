'use client';

import useFetchDistributionByOwnerId from '../../../../../../../hooks/useFetchDistribution';
import CityDistribution from '../(city)/CityDistribution';
import HorizontalMenu from '../HorizontalMenuCoverageDestination';
import ProvinceDistribution from '../(province)/ProvinceDistribution';
import InternationalDistribution from '../(international)/InternationalDistribution';
import EuropeDistribution from '../(europe)/EuropeDistribution';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DistributionDestinationType } from '../../../../../../../lib/enums';
import RegionDistribution from '../(region)/RegionDistribution';

export default function CoverageAreas() {
    const t = useTranslations();
    const [menuOption, setMenuOption] = useState<string>(
        DistributionDestinationType.INTERNATIONAL,
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
        distributor?.coverage_areas.international?.map((country) => {
            return country.replace(/\w\S*/g, (txt) => {
                return txt.replace(/\b\w/g, (v) => v.toUpperCase());
            });
        }) ?? [];

    const renderSwitch = () => {
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
        <fieldset className="w-full rounded-xl border border-beer-softBlondeBubble border-b-gray-200 bg-beer-foam p-4">
            <legend className="text-2xl font-medium text-beer-dark">
                {t('distribution_destination')}
            </legend>

            {/* Horizontal menu  */}
            <HorizontalMenu setMenuOption={setMenuOption} />

            {/* Coverage Area content  */}
            <section>{renderSwitch()}</section>

            {/* Map Area Content  */}
        </fieldset>
    );
}
