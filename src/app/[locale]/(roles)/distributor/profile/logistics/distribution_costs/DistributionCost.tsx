'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { DistributionCostType } from '../../../../../../../lib/enums';
import { IDistributionCost } from '../../../../../../../lib/types/types';
import HorizontalMenuCoverageCost from '../HorizontalMenuCoverageCost';
import FlatrateAndWeightCostForm from './FlatrateAndWeightCostForm';
import FlatrateCostForm from './FlatrateCostForm';
import PriceRangeCostForm from './PriceRangeCostForm';

interface Props {
    distributionCosts: IDistributionCost;
}

export default function DistributionCost({ distributionCosts }: Props) {
    const t = useTranslations();

    const [menuOption, setMenuOption] = useState<string>(
        DistributionCostType.FLATRATE,
    );

    // Tarifa de envío por franja de peso del pedido (kg)
    // Tarifa de envío por franja de volumen del pedido (m3)
    // Tarifa de envío por franja de unidades del pedido (unidades)
    const renderSwitch = () => {
        switch (menuOption) {
            case DistributionCostType.RANGE:
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
                        flatrateAndWeightCost={
                            distributionCosts.flatrate_and_weight_cost
                        }
                        distributionCostId={distributionCosts.id}
                    />
                );

            default:
                return <></>;
        }
    };

    return (
        <fieldset className="space-y-4 rounded-xl border border-b-gray-200 bg-beer-foam p-4">
            <legend className="text-2xl font-medium text-beer-dark">
                {t('distribution_cost')}
            </legend>

            <HorizontalMenuCoverageCost setMenuOption={setMenuOption} />

            {renderSwitch()}
        </fieldset>
    );
}
