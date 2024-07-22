import InputLabel from '../../common/InputLabel';
import useBoxPackStore from '@/app/store//boxPackStore';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { useMessage } from '../../message/useMessage';
import { IProduct } from '@/lib//types/types';
import { IBoxPackItem } from '@/lib//types/product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { Type } from '@/lib//productEnum';

interface Props {
    product: IProduct;
    form: UseFormReturn<any, any>;
    index: number;
}

const UpdateProductSlotItem: React.FC<Props> = ({ product, form, index }) => {
    const t = useTranslations();

    const { setError, clearErrors } = form;

    const { handleMessage } = useMessage();

    const { boxPack } = useBoxPackStore();

    const [selectedPacks, setSelectedPacks] = useState<string[]>(
        form
            .getValues('box_pack_items')
            .map((item: IBoxPackItem) => item.product_id),
    );
    const [showAccordion, setShowAccordion] = useState(false);

    const [quantity, setQuantity] = useState(
        boxPack.boxPackItems[index]?.quantity,
    );
    const [slotsPerProduct, setSlotsPerProduct] = useState(
        boxPack.boxPackItems[index]?.slots_per_product,
    );

    const [checkboxError, setCheckboxError] = useState(false);

    const {
        onChangeSlotsPerProduct,
        onChangeQuantityProduct,
        addSlot,
        removeProductSlot,
    } = useBoxPackStore();

    if (product.type !== Type.BEER) return <></>;
    // if (!selectedPacks) return <></>;

    const handleCheckboxChange = (productId: string, isChecked: boolean) => {
        setSelectedPacks((prevSelectedPacks) => {
            if (isChecked && boxPack && boxPack?.boxPackItems) {
                // Remove from boxPackItems the productID selected, so we can do the math with the new quantity number from input
                const boxPackItems = boxPack.boxPackItems.filter(
                    (item) => item.product_id !== productId,
                );

                const isValid = isQuantityLowerThanMaxSlotsPerBox(
                    boxPackItems,
                    quantity * slotsPerProduct,
                    boxPack.slots_per_box,
                );

                if (!isValid) {
                    setCheckboxError(true);

                    setError('slots_per_box', {
                        type: 'custom',
                        message: `${t('errors.max_slots_per_box_exceeded')}`,
                    });

                    return prevSelectedPacks;
                }

                // Clear errors
                setCheckboxError(false);
                clearErrors('slots_per_box');

                const boxPackItem: IBoxPackItem = {
                    product_id: productId,
                    quantity: quantity,
                    slots_per_product: slotsPerProduct,
                    products: product,
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

    const handleOnChangeQuantity = (
        productId: string,
        inputQuantity: number,
    ) => {
        if (boxPack === undefined) return;
        if (boxPack.boxPackItems === undefined) return;

        // Remove from boxPackItems the productID selected, so we can do the math with the new quantity number from input
        const boxPackItems = boxPack.boxPackItems.filter(
            (item) => item.product_id !== productId,
        );

        const isValid = isQuantityLowerThanMaxSlotsPerBox(
            boxPackItems,
            inputQuantity * slotsPerProduct,
            boxPack.slots_per_box,
        );

        if (!isValid) {
            handleMessage({
                type: 'error',
                message: t('errors.slots_exceeded', {
                    slots: boxPack.slots_per_box,
                }),
            });

            setError('slots_per_box', {
                type: 'custom',
                message: `${t('errors.max_slots_per_box_exceeded')}`,
            });

            // Allow to reduce the input quantity so we can get rid of error message
            if (inputQuantity < quantity) {
                setQuantity(inputQuantity);
                onChangeQuantityProduct(productId, inputQuantity);
            }

            return;
        }

        clearErrors('slots_per_box');

        setQuantity(inputQuantity);
        onChangeQuantityProduct(productId, inputQuantity);
    };

    const handleOnChangeSlotsPerProduct = (
        productId: string,
        inputSlotsPerProd: number,
    ) => {
        if (boxPack === undefined) return;
        if (boxPack.boxPackItems === undefined) return;

        // Remove from boxPackItems the productID selected, so we can do the math with the new slotsPerProd number from input
        const boxPackItems = boxPack.boxPackItems.filter(
            (item) => item.product_id !== productId,
        );

        const isValid = isQuantityLowerThanMaxSlotsPerBox(
            boxPackItems,
            quantity * inputSlotsPerProd,
            boxPack.slots_per_box,
        );

        if (!isValid) {
            handleMessage({
                type: 'error',
                message: t('errors.slots_exceeded', {
                    slots: boxPack.slots_per_box,
                }),
            });

            setError('slots_per_box', {
                type: 'custom',
                message: `${t('errors.max_slots_per_box_exceeded')}`,
            });

            // Allow to reduce the input slot_per_product so we can get rid of error message
            if (inputSlotsPerProd < slotsPerProduct) {
                setSlotsPerProduct(inputSlotsPerProd);
                onChangeSlotsPerProduct(productId, inputSlotsPerProd);
            }

            return;
        }

        clearErrors('slots_per_box');

        setSlotsPerProduct(inputSlotsPerProd);
        onChangeSlotsPerProduct(productId, inputSlotsPerProd);
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
                        className={`h-4 w-4 rounded border-gray-300 bg-gray-100 text-beer-blonde focus:ring-2 focus:ring-beer-blonde 
                            dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-beer-draft
                            ${
                                checkboxError &&
                                'border-red-500 focus:ring-red-500'
                            }    
                        `}
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

export default UpdateProductSlotItem;

const isQuantityLowerThanMaxSlotsPerBox = (
    boxPackItems: IBoxPackItem[],
    totalNewSlots: number,
    maxSlotsPerBox: number,
) => {
    const totalQuantity = boxPackItems.reduce(
        (acc, item) => acc + item.quantity * item.slots_per_product,
        0,
    );

    if (totalQuantity + totalNewSlots > maxSlotsPerBox) {
        return false;
    }

    return true;
};
