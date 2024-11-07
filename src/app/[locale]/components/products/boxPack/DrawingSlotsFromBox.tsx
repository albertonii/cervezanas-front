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
                className={`h-[80px] w-[80px] bg-contain bg-top bg-no-repeat ${
                    i < actualSlotsPerBox
                        ? "bg-[url('/assets/hueco-caja-chapa.webp')]"
                        : "bg-[url('/assets/hueco-caja.webp')]"
                }`}
            ></div>,
        );
    }

    return (
        <div
            className="col-span-2 px-16 py-8  bg-white bg-[url('/assets/caja.webp')] bg-center bg-no-repeat"
            style={{ backgroundSize: '100% 100%' }}
        >
            <div className="grid grid-cols-2 gap-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8">
                {slots}
            </div>
        </div>
    );
};

export default DrawingSlotsFromBox;
