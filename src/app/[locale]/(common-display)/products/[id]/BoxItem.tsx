import Link from 'next/link';
import React, { useState } from 'react';
import { IBoxPackItem } from '../../../../../lib/types/product';
import ProductMiniature from '../../../components/ProductMiniature';

interface Props {
    item: IBoxPackItem;
}

export default function BoxItem({ item }: Props) {
    const [isHovering, setIsHovering] = useState(false);

    if (!item.products) {
        return <></>;
    }

    console.log(item.products);

    return (
        <>
            <div className="relative">
                {isHovering && <ProductMiniature product={item.products} />}
            </div>

            <tr
                key={item.id}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="hover:bg-beer-softFoam dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
            >
                <td className="space-x-2 px-6 py-4 font-semibold hover:cursor-pointer ">
                    <Link
                        href={`/products/${item.product_id}`}
                        target={'_blank'}
                        className="hover:text-beer-draft transition-all duration-300 ease-in-out"
                    >
                        {item.products.name}
                    </Link>
                </td>

                <td className="space-x-2 px-6 py-4 font-semibold">
                    {item.quantity}
                </td>
            </tr>
        </>
    );
}
