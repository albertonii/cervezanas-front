'use client';

import HorizontalMenuCoverageCost from '../HorizontalMenuCoverageCost';
import AreaAndWeightCostForm from './AreaAndWeightPriceRange/AreaAndWeightCostForm';
import FlatrateAndWeightCostForm from './FlatrateAndWeight/FlatrateAndWeightCostForm';
import FlatrateCostForm from './FlatrateCost/FlatrateCostForm';
import PriceRangeCostForm from './PrinceRange/PriceRangeCostForm';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DistributionCostType } from '../../../../../../../lib/enums';
import { IDistributionCost } from '../../../../../../../lib/types/types';
import { Tooltip } from '../../../../../components/common/Tooltip';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { updateIsDistributionCostsIncludedInProduct } from '../../../actions';

interface Props {
    distributionCosts: IDistributionCost;
}

export default function DistributionCost({ distributionCosts }: Props) {
    const t = useTranslations();
    const [includeDistributionCost, setIncludeDistributionCost] =
        useState<boolean>(false);

    const [
        isLoadingDistributionCostsIncluded,
        setIsLoadingDistributioncostsIncluded,
    ] = useState(false);

    const [menuOption, setMenuOption] = useState<string>(
        DistributionCostType.AREA_AND_WEIGHT,
    );

    const handleCheckboxChange = async () => {
        setIsLoadingDistributioncostsIncluded(true);
        setIncludeDistributionCost(!includeDistributionCost);

        await updateIsDistributionCostsIncludedInProduct(
            distributionCosts.id,
            !includeDistributionCost,
        );

        setIsLoadingDistributioncostsIncluded(false);
    };

    // Tarifa de envío por franja de peso del pedido (kg)
    // Tarifa de envío por franja de volumen del pedido (m3)
    // Tarifa de envío por franja de unidades del pedido (unidades)
    const renderSwitch = () => {
        switch (menuOption) {
            case DistributionCostType.PRICE_RANGE:
                return <PriceRangeCostForm />;

            case DistributionCostType.FLATRATE:
                return (
                    <FlatrateCostForm
                        flatrateCost={distributionCosts.flatrate_cost}
                        distributionCostId={distributionCosts.id}
                    />
                );

            case DistributionCostType.FLATRATE_AND_WEIGHT:
                return (
                    <FlatrateAndWeightCostForm
                        extraCostPerKG={distributionCosts.cost_extra_per_kg}
                        flatrateAndWeightCost={
                            distributionCosts.flatrate_and_weight_cost
                        }
                        distributionCostId={distributionCosts.id}
                    />
                );

            case DistributionCostType.AREA_AND_WEIGHT:
                return (
                    <AreaAndWeightCostForm
                        extraCostPerKG={distributionCosts.cost_extra_per_kg}
                        areaAndWeightCost={
                            distributionCosts.area_and_weight_cost
                        }
                        distributionCostId={distributionCosts.id}
                    />
                );

            default:
                return <></>;
        }
    };

    return (
        <fieldset className="space-y-6 p-6 rounded-lg border border-gray-300 bg-white shadow-sm max-w-3xl mx-auto">
            {isLoadingDistributionCostsIncluded && (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-100 bg-opacity-50 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-beer-blonde"></div>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-semibold text-gray-800">
                        {t('distribution_cost')}
                    </h2>

                    <Tooltip
                        content="Configure los costos de distribución para la venta online"
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
                    Selecciona una de las siguientes opciones para comenzar a
                    vender online. Puedes seleccionar el modelo de costes de
                    distribución que mejor se adapte a tus necesidades como
                    distribuidor e indicar los costes asociados.
                </p>

                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="includeDistributionCost"
                        checked={includeDistributionCost}
                        onChange={handleCheckboxChange}
                        className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
                    />
                    <label
                        htmlFor="includeDistributionCost"
                        className="text-gray-800 font-medium"
                    >
                        Los Costes de Distribución están incluidos en el
                        producto
                    </label>
                </div>

                {includeDistributionCost && (
                    <>
                        <p className="mt-2 text-sm text-red-600">
                            Nota: Esta opción solo se debe marcar si el
                            productor y distribuidor/transportista son el mismo
                            usuario. El coste de envío será 0, pero el precio
                            del producto cubrirá los costes de distribución. Si
                            selecciona esta opción, la configuración de los
                            costes de distribución no se aplicará.
                        </p>
                    </>
                )}

                <div
                    className={`
                        ${includeDistributionCost ? 'hidden' : 'block'}
                    `}
                >
                    <HorizontalMenuCoverageCost setMenuOption={setMenuOption} />
                </div>
            </div>

            <div
                className={`
                    ${includeDistributionCost ? 'hidden' : 'block'}
                    transition-opacity duration-300 ease-in-out
                `}
            >
                {renderSwitch()}
            </div>
        </fieldset>
    );
}
