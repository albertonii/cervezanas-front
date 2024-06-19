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
                        extraCostPerKG={distributionCosts.cost_extra_per_kg}
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
            <p className="flex flex-col justify-between py-4" id="header">
                <h2
                    id="title"
                    className="text-2xl uppercase font-semibold text-beer-dark"
                >
                    {t('distribution_cost')}
                </h2>

                <span className="text-gray-700 text-sm">
                    Aquí puedes seleccionar la opción que mejor se adapte a tus
                    necesidades como distribuidor. A continuación, se presentan
                    las opciones disponibles:
                    <ul className="list-disc pl-5 mt-2">
                        <li>
                            <strong>Por Zona y Peso:</strong> Configura zonas de
                            cobertura y calcula los costes de distribución según
                            el peso y la zona de destino.
                        </li>
                        <li>
                            <strong>
                                Coste de Distribución Incluido en el Producto:
                            </strong>{' '}
                            Elige esta opción si el coste de envío ya está
                            incluido en el precio del producto. El coste de
                            envío será 0, pero el precio del producto cubrirá
                            los costes de distribución.
                        </li>
                    </ul>
                </span>
            </p>

            <HorizontalMenuCoverageCost setMenuOption={setMenuOption} />

            {renderSwitch()}
        </fieldset>
    );
}
