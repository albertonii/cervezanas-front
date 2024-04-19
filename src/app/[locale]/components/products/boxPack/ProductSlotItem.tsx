import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { IProduct } from '../../../../../lib/types/types';
import { FormatName } from '../../../../../lib/beerEnum';
import SlotControlButtons from '../../common/SlotControlButtons';
import useBoxPackStore from '../../../../store/boxPackStore';

interface Props {
    product: IProduct;
    form: UseFormReturn<any, any>;
    productItems?: string[];
}

const ProductSlotItem: React.FC<Props> = ({ product, form, productItems }) => {
    const t = useTranslations();
    const { register } = form;

    const [selectedPacks, setSelectedPacks] = useState(productItems);
    const { addSlot } = useBoxPackStore();

    if (!product.beers) return <></>;

    const formatName = product.beers?.format ?? '';
    const formatIcon =
        formatName === FormatName.bottle
            ? '/icons/format/bottle.svg'
            : formatName === FormatName.can
            ? '/icons/format/can.png'
            : formatName === FormatName.draft
            ? '/icons/format/keg.svg'
            : '/icons/format/bottle.svg';

    const handleCheckboxChange = (packId: string, isChecked: boolean) => {
        setSelectedPacks((prevSelectedPacks) => {
            if (isChecked) {
                return [...(prevSelectedPacks || []), packId];
            } else {
                return (prevSelectedPacks || []).filter((id) => id !== packId);
            }
        });

        // setValue(`product_items.${product.id}.id`, selectedPacks);
    };

    return (
        <div className="mx-4 my-1 rounded-lg border border-gray-200">
            <div className={`flex justify-between px-4 py-2 text-lg `}>
                <div className="flex items-center justify-center space-x-2">
                    <span className="mr-2 font-semibold text-beer-gold hover:cursor-pointer">
                        {product.name}
                    </span>
                </div>

                <SlotControlButtons
                    quantity={0}
                    item={undefined}
                    handleIncreaseCartQuantity={() => {}}
                    handleDecreaseCartQuantity={() => {}}
                    handleRemoveFromCart={() => {}}
                />
            </div>
        </div>
    );
};

export default ProductSlotItem;
