import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { UseFormReturn } from 'react-hook-form';
import { WeightRangeCostFormValidationSchema } from './AreaAndWeightCostForm';
import { useTranslations } from 'next-intl';

interface SidebarProps {
    form: UseFormReturn<WeightRangeCostFormValidationSchema>;
    onItemClick: (area: {
        id: string;
        name: string;
        type: string;
        area_and_weight_cost_id: string;
    }) => void;
}

const AreaSidebar: React.FC<SidebarProps> = ({ form, onItemClick }) => {
    const t = useTranslations();

    const [expanded, setExpanded] = useState<string | null>(null);
    const [selected, setSelected] = useState<string | null>(null);

    const { getValues } = form;

    const { cities, provinces, regions, international } = getValues();

    const items = {
        cities,
        provinces,
        regions,
        international,
    };

    console.log(items);

    return (
        <aside
            className="
                        lg:absolute lg:top-0 lg:right-full lg:mr-10 lg:z-10
                        rounded-xl transform duration-300 ease-in-out shadow-lg 
                        bg-[url('/assets/rec-graf4b.png')] bg-repeat bg-top bg-auto overflow-y-auto 
                        dark:bg-gray-800 w-40 min-h-[20vh] h-auto max-h-screen bg-gray-800 text-white 
                        overflow-auto
                    "
        >
            {Object.entries(items).map(([key, values], index) => {
                return (
                    <div key={key + index}>
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

                        <ul className="space-y-2 font-medium px-4 py-2">
                            {expanded === key &&
                                values.map((value) => (
                                    <li
                                        key={value}
                                        className={`flex items-center rounded-lg p-2 text-sm font-normal text-gray-200 
                                        hover:bg-beer-blonde hover:text-gray-800 transition-all ease-in-out duration-100
                                        dark:text-white dark:hover:bg-gray-700 hover:cursor-pointer 
                                        ${
                                            selected === value
                                                ? 'bg-gray-700'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            setSelected(value);
                                            onItemClick(value);
                                        }}
                                    >
                                        {value.name}
                                    </li>
                                ))}
                        </ul>
                    </div>
                );
            })}
        </aside>
    );
};

export default AreaSidebar;
