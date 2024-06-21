import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronDown,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
    items: {
        cities: string[];
        provinces: string[];
        regions: string[];
        international: string[];
    };
    onItemClick: (area: string) => void;
}

const AreaSidebar: React.FC<SidebarProps> = ({ items, onItemClick }) => {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <aside
            className="rounded-xl transform duration-300 ease-in-out shadow-lg lg:relative lg:top-0 
                        bg-[url('/assets/rec-graf4b.png')] bg-repeat bg-top bg-auto overflow-y-auto 
                        dark:bg-gray-800 w-40 min-h-[20vh] h-auto max-h-screen bg-gray-800 text-white 
                        overflow-auto"
        >
            {Object.entries(items).map(([key, values]) => (
                <div key={key}>
                    <button
                        className="w-full flex justify-between items-center text-left px-4 py-2 hover:bg-gray-600"
                        onClick={() =>
                            setExpanded(key === expanded ? null : key)
                        }
                    >
                        {key}
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
                                    {value}
                                </li>
                            ))}
                    </ul>
                </div>
            ))}
        </aside>
    );
};

export default AreaSidebar;
