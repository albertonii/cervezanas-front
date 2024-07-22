import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { handleSelectedDistributionCostType } from '../../../actions';

interface Props {
    fromDBDistributionType: string;
    distributionType: string;
    distributionCostsId: string;
}

/**
 * Component to select the distribution cost
 * @returns
 * checkbox text input with the distribution cost type selected
 *  */
const SelectDistributionCost = ({
    fromDBDistributionType,
    distributionType,
    distributionCostsId,
}: Props) => {
    const t = useTranslations();
    const { handleMessage } = useMessage();

    const [checkboxChecked, setCheckboxChecked] = useState(
        fromDBDistributionType === distributionType ? true : false,
    );

    const handleCheckboxChange = async () => {
        const res = await handleSelectedDistributionCostType(
            distributionType,
            distributionCostsId,
        );

        if (!res || res instanceof Error) {
            handleMessage({
                message:
                    'No se ha podido guardar el modelo de costes de distribución seleccionado',
                type: 'error',
            });
            return;
        }

        const successMessage = `Ahora ${t(
            distributionType,
        )} es el modelo de costes de distribución por defecto`;

        setCheckboxChecked(true);

        handleMessage({
            message: successMessage,
            type: 'success',
        });
    };

    return (
        <div className="flex items-center space-x-3">
            <input
                type="checkbox"
                id="distributionType"
                checked={checkboxChecked}
                onChange={handleCheckboxChange}
                className="hover:cursor-pointer h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft"
            />
            <label
                htmlFor="includeDistributionCost"
                className="text-gray-800 font-medium"
            >
                Seleccionar y guardar <b>{t(distributionType)}</b> como modelo
                de costes de distribución
            </label>
        </div>
    );
};

export default SelectDistributionCost;
