import React, { useEffect } from 'react';
import useBoxPackStore from '../../../../store/boxPackStore';

export default function BoxProductSlotsSelection() {
    const { boxPack } = useBoxPackStore();

    return (
        <section className="border-2 rounded-lg shadow-lg p-4 h-[45vh] overflow-y-scroll">
            {boxPack.boxPackItems.map((item) => (
                <div
                    key={item.product_id}
                    className="flex justify-between items-center"
                >
                    <span>{item.product?.name}</span>
                    <span>{item.quantity}</span>
                    <span>{item.slots_per_product}</span>
                </div>
            ))}
        </section>
    );
}
