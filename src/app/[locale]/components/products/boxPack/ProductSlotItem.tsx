import InputLabel from '../../common/InputLabel';
import useBoxPackStore from '../../../../store/boxPackStore';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { UseFormReturn } from 'react-hook-form';
import { IProduct } from '../../../../../lib/types/types';
import { IBoxPackItem } from '../../../../../lib/types/product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';

interface Props {
    product: IProduct;
    form: UseFormReturn<any, any>;
    productItems?: string[];
}

const ProductSlotItem: React.FC<Props> = ({ product, form, productItems }) => {
    const t = useTranslations();
    const { register } = form;

    const [slotsPerProduct, setSlotsPerProduct] = useState(1);

    const [selectedPacks, setSelectedPacks] = useState(productItems);
    const [showAccordion, setShowAccordion] = useState(false);
    const { onChangeSlotsPerProduct, addSlot, removeProductSlot } =
        useBoxPackStore();

    if (!product.beers) return <></>;

    useEffect(() => {
        if (slotsPerProduct)
            onChangeSlotsPerProduct(product.id, slotsPerProduct);
    }, [slotsPerProduct]);

    const handleCheckboxChange = (productId: string, isChecked: boolean) => {
        setSelectedPacks((prevSelectedPacks) => {
            if (isChecked) {
                const boxPackItem: IBoxPackItem = {
                    product_id: productId,
                    quantity: 1,
                    slots_per_product: 1,
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

        // setValue(`product_items.${product.id}.id`, selectedPacks);
    };

    const handleShowAccordion = () => {
        setShowAccordion(!showAccordion);
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
                        id={`checkbox-product-${product.id}`}
                        type="checkbox"
                        {...register(`product.${product.id}.id`)}
                        // checked={selectedPacks?.includes(product.id)}
                        onChange={(e) =>
                            handleCheckboxChange(product.id, e.target.checked)
                        }
                        value={product.id}
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
                    label={'quantity'}
                    labelText={t('quantity')}
                    registerOptions={{
                        required: true,
                        valueAsNumber: true,
                        min: 1,
                    }}
                    inputType={'number'}
                    defaultValue={1}
                />

                <InputLabel
                    form={form}
                    label={'slots_per_product'}
                    labelText={t('slots_per_product')}
                    registerOptions={{
                        required: true,
                        valueAsNumber: true,
                        min: 1,
                        value: slotsPerProduct,
                    }}
                    inputType={'number'}
                    // defaultValue={slotsPerProduct}
                    onChange={(e) => setSlotsPerProduct(e.target.valueAsNumber)}
                />
                {/* <SlotControlButtons
                    quantity={0}
                    item={undefined}
                    handleIncreaseCartQuantity={() => {}}
                    handleDecreaseCartQuantity={() => {}}
                    handleRemoveFromCart={() => {}}
                /> */}
            </div>
        </section>
    );
};

export default ProductSlotItem;
