import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { AreaAndWeightCostFormValidationSchema } from './AreaAndWeightCostForm';
import {
    AreaAndWeightInformationFormData,
    IAreaAndWeightInformation,
    IAreaAndWeightInformation_,
} from '../../../../../../../../lib/types/types';

interface SidebarProps {
    form: UseFormReturn<AreaAndWeightCostFormValidationSchema>;
    onItemClick: (areaId: string) => void;
}

const AreaSidebar: React.FC<SidebarProps> = ({ form, onItemClick }) => {
    const t = useTranslations();

    const [expanded, setExpanded] = useState<string | null>(null);
    const [selected, setSelected] = useState<string | null>(null);

    const { getValues, setValue } = form;

    const { cities, sub_regions, regions, international } = getValues();

    const items = {
        // cities,
        sub_regions,
        // regions,
        // international,
    };

    return (
        <aside
            className="
                        lg:absolute lg:-top-40 lg:right-full lg:mr-10 lg:z-10
                        rounded-xl transform duration-300 ease-in-out shadow-lg 
                        bg-[url('/assets/rec-graf4b.png')] bg-repeat bg-top bg-auto overflow-y-auto 
                        dark:bg-gray-800 w-40 min-h-[20vh] h-auto max-h-[40vh] lg:max-h-screen bg-gray-800 text-white 
                        overflow-auto min-w-[10vw]
                    "
        >
            {Object.entries(items).map(([key, values], index) => {
                return (
                    <div key={key + index} className="py-2">
                        <button
                            className="w-full flex justify-between items-center text-left px-4 py-2 hover:bg-gray-600"
                            onClick={() =>
                                setExpanded(key === expanded ? null : key)
                            }
                        >
                            {t(key)}
                            <FontAwesomeIcon
                                icon={
                                    expanded === key
                                        ? faChevronDown
                                        : faChevronRight
                                }
                                className="transition-transform duration-200"
                            />
                        </button>

                        <ul className="space-y-2 font-medium px-4 max-h-[24vh] lg:max-h-[40vh] overflow-y-auto bg-gray-700 bg-opacity-50">
                            {expanded === key &&
                                values.map(
                                    (
                                        value: AreaAndWeightInformationFormData,
                                    ) => {
                                        return (
                                            <li
                                                key={value.id}
                                                className={`flex items-center rounded-lg p-2 text-sm font-normal text-gray-200 
                                        hover:bg-beer-blonde hover:text-gray-800 transition-all ease-in-out duration-100
                                        dark:text-white dark:hover:bg-gray-700 hover:cursor-pointer 
                                        ${
                                            selected === value.name
                                                ? 'bg-gray-700'
                                                : ''
                                        }`}
                                                onClick={() => {
                                                    setSelected(
                                                        value.name ?? null,
                                                    );

                                                    onItemClick(value.id!);
                                                }}
                                            >
                                                {value.name}
                                            </li>
                                        );
                                    },
                                )}
                        </ul>
                    </div>
                );
            })}
        </aside>
    );
};

export default AreaSidebar;
