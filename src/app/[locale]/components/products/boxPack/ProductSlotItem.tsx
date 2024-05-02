import InputLabel from '../../common/InputLabel';
import useBoxPackStore from '../../../../store/boxPackStore';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { IProduct } from '../../../../../lib/types/types';
import { IBoxPackItem } from '../../../../../lib/types/product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { useMessage } from '../../message/useMessage';

interface Props {
    product: IProduct;
    form: UseFormReturn<any, any>;
    index: number;
}

const ProductSlotItem: React.FC<Props> = ({ product, form, index }) => {
    const t = useTranslations();

    const { setError, clearErrors } = form;

    const { boxPack } = useBoxPackStore();
    const { handleMessage } = useMessage();

    const [selectedPacks, setSelectedPacks] = useState(
        boxPack?.boxPackItems.map((item) => item.product_id),
    );
    const [showAccordion, setShowAccordion] = useState(false);

    const [quantity, setQuantity] = useState(1);
    const [slotsPerProduct, setSlotsPerProduct] = useState(1);

    const {
        onChangeSlotsPerProduct,
        onChangeQuantityProduct,
        addSlot,
        removeProductSlot,
    } = useBoxPackStore();

    if (!product.beers) return <></>;

    const handleCheckboxChange = (productId: string, isChecked: boolean) => {
        setSelectedPacks((prevSelectedPacks) => {
            if (isChecked) {
                const boxPackItem: IBoxPackItem = {
                    product_id: productId,
                    quantity: quantity,
                    slots_per_product: slotsPerProduct,
                    product: product,
                };

                addSlot(boxPackItem);

                return [...(prevSelectedPacks || []), productId];
            } else {
                removeProductSlot(productId);

                return (prevSelectedPacks || []).filter(
                    (id) => id !== productId,
                );
            }
        });

        if (!showAccordion && isChecked) {
            handleShowAccordion();
        }
    };

    const handleShowAccordion = () => {
        setShowAccordion(!showAccordion);
    };
    const handleOnChangeQuantity = (productId: string, quantity: number) => {
        // Remove from boxPackItems the productID selected, so we can do the math with the new quantity number from input
        const boxPackItems = boxPack.boxPackItems.filter(
            (item) => item.product_id !== productId,
        );

        const isValid = isQuantityLowerThanMaxSlotsPerBox(
            boxPackItems,
            quantity,
            boxPack.slots_per_box,
        );

        if (!isValid) {
            handleMessage({
                type: 'error',
                message: t('error_slots_exceeded', {
                    slots: boxPack.slots_per_box,
                }),
            });

            setError('slots_per_box', {
                type: 'custom',
                message:
                    'Update maximum slots per box to add more products in the box',
            });

            return;
        }

        clearErrors('slots_per_box');

        setQuantity(quantity);
        onChangeQuantityProduct(productId, quantity);
    };

    const handleOnChangeSlotsPerProduct = (
        productId: string,
        slotsPerProd: number,
    ) => {
        // Remove from boxPackItems the productID selected, so we can do the math with the new slotsPerProd number from input
        const boxPackItems = boxPack.boxPackItems.filter(
            (item) => item.product_id !== productId,
        );

        const isValid = isSlotsPerProductTotalLowerThanMaxSlotsPerBox(
            boxPackItems,
            slotsPerProd,
            boxPack.slots_per_box,
        );

        if (!isValid) {
            handleMessage({
                type: 'error',
                message: t('error_slots_exceeded', {
                    slots: boxPack.slots_per_box,
                }),
            });

            setError('slots_per_box', {
                type: 'custom',
                message:
                    'Update maximum slots per box to add more products in the box',
            });

            return;
        }

        clearErrors('slots_per_box');

        setSlotsPerProduct(slotsPerProd);
        onChangeSlotsPerProduct(productId, slotsPerProd);
    };

    return (
        <section className="mx-4 my-1 rounded-lg border border-gray-200">
            <div
                className={`
                ${
                    showAccordion
                        ? 'bg-gray-100 text-beer-draft'
                        : 'text-beer-gold'
                } 
                flex justify-between px-4 py-2 text-lg `}
            >
                <div className="flex items-center justify-center space-x-2">
                    <input
                        type="checkbox"
                        checked={selectedPacks?.includes(product.id)}
                        onChange={(e) =>
                            handleCheckboxChange(product.id, e.target.checked)
                        }
                        // value={product.id}
                        className={`h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft`}
                    />

                    <FontAwesomeIcon
                        icon={faChevronCircleDown}
                        style={{ color: showAccordion ? '#90470b' : '#EE9900' }}
                        title={'chevron_circle_down'}
                        width={20}
                        height={20}
                        className={`${
                            showAccordion && 'rotate-180'
                        } hover:cursor-pointer`}
                        onClick={handleShowAccordion}
                    />

                    <span
                        className="mr-2 font-semibold text-beer-gold hover:cursor-pointer"
                        onClick={handleShowAccordion}
                    >
                        {product.name}
                    </span>
                </div>
            </div>

            <div
                className={`px-6 grid grid-cols-2 gap-2 ${
                    showAccordion ? 'max-h-[1000px] py-4' : 'max-h-0'
                } duration-800 overflow-hidden transition-all ease-in-out`}
            >
                <InputLabel
                    form={form}
                    inputType={'number'}
                    label={`box_packs.${index}.quantity`}
                    labelText={t('quantity')}
                    registerOptions={{
                        required: true,
                        valueAsNumber: true,
                        min: 1,
                    }}
                    defaultValue={1}
                    onChange={(e) =>
                        handleOnChangeQuantity(
                            product.id,
                            e.target.valueAsNumber,
                        )
                    }
                    value={quantity}
                />

                <InputLabel
                    form={form}
                    label={`box_packs.${index}.slots_per_product`}
                    labelText={t('slots_per_product')}
                    inputType={'number'}
                    registerOptions={{
                        required: true,
                        valueAsNumber: true,
                        min: 1,
                    }}
                    defaultValue={1}
                    onChange={(e) =>
                        handleOnChangeSlotsPerProduct(
                            product.id,
                            e.target.valueAsNumber,
                        )
                    }
                    value={slotsPerProduct}
                />
            </div>
        </section>
    );
};

export default ProductSlotItem;

const isQuantityLowerThanMaxSlotsPerBox = (
    boxPackItems: IBoxPackItem[],
    productQuantity: number,
    maxSlotsPerBox: number,
) => {
    const totalQuantity = boxPackItems.reduce(
        (acc, item) => acc + item.quantity,
        0,
    );

    console.log(totalQuantity, productQuantity, maxSlotsPerBox);

    if (totalQuantity + productQuantity > maxSlotsPerBox) {
        return false;
    }

    return true;
};

const isSlotsPerProductTotalLowerThanMaxSlotsPerBox = (
    boxPackItems: IBoxPackItem[],
    slotsPerProduct: number,
    maxSlotsPerBox: number,
) => {
    const totalSlots = boxPackItems.reduce(
        (acc, item) => acc + item.slots_per_product,
        0,
    );
    console.log(totalSlots, slotsPerProduct, maxSlotsPerBox);

    if (totalSlots + slotsPerProduct > maxSlotsPerBox) {
        return false;
    }

    return true;
};
