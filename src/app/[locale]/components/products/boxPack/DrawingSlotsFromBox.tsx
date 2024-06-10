import React from 'react';
import { faBeer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface BoxProductSlotsSelectionProps {
    slotsPerBox: number;
    actualSlotsPerBox: number;
}

const DrawingSlotsFromBox: React.FC<BoxProductSlotsSelectionProps> = ({
    slotsPerBox,
    actualSlotsPerBox,
}) => {
    const slots = [];

    for (let i = 0; i < slotsPerBox; i++) {
        slots.push(
            <div
                key={i}
                className={`h-16 w-16 border ${
                    i < actualSlotsPerBox ? 'bg-beer-blonde' : 'bg-gray-300'
                }`}
            >
                {i < actualSlotsPerBox && (
                    <FontAwesomeIcon
                        icon={faBeer}
                        title={'chevron_circle_down'}
                        color={'#000'}
                        style={{
                            fontSize: '1.5rem',
                            width: '100%',
                            height: '100%',
                        }}
                    />
                )}
            </div>,
        );
    }

    return (
        <div className="col-span-2 border-4 border-gray-500 p-4 bg-white shadow-md">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10">
                {slots}
            </div>
        </div>
    );
};

export default DrawingSlotsFromBox;
