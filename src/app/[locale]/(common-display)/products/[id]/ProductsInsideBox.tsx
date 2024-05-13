import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { IBoxPack } from '../../../../../lib/types/product';
import ProductMiniature from '../../../components/ProductMiniature';
import BoxItem from './BoxItem';

interface Props {
    boxPack: IBoxPack;
}

export default function ProductsInsideBox({ boxPack }: Props) {
    const t = useTranslations();

    return (
        <div>
            <h2>La caja contiene los siguientes productos:</h2>

            <table className="w-full text-center  dark:text-gray-400 border rounded-full shadown-xl">
                <thead className="bg-beer-draft text-md uppercase text-white dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 ">
                            {t('product')}
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                            {t('quantity')}
                        </th>
                    </tr>
                </thead>

                <tbody className="bg-beer-softBlonde text-gray-700">
                    {boxPack &&
                        boxPack.box_pack_items?.map((item) => {
                            return <BoxItem item={item} />;
                        })}
                </tbody>
            </table>
        </div>
    );
}
