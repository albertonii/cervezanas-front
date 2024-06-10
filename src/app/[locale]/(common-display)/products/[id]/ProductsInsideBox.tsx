import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { IBoxPack } from '../../../../../lib/types/product';
import { IProduct, IProductPack } from '../../../../../lib/types/types';
import { useShoppingCart } from '../../../../context/ShoppingCartContext';
import { AddCardButton } from '../../../components/common/AddCartButton';
import MarketCartButtons2 from '../../../components/common/MarketCartButtons2';
import { useMessage } from '../../../components/message/useMessage';
import BoxItem from './BoxItem';

interface Props {
    product: IProduct;
    boxPack: IBoxPack;
}

export default function ProductsInsideBox({ product, boxPack }: Props) {
    const t = useTranslations();

    const [packQuantity, setPackQuantity] = useState(1);

    const { isLoggedIn } = useAuth();
    const { addPackToCart } = useShoppingCart();
    const { handleMessage } = useMessage();

    const handleIncreasePackQuantity = () => {
        setPackQuantity(packQuantity + 1);
    };

    const handleDecreasePackQuantity = () => {
        if (packQuantity > 1) setPackQuantity(packQuantity - 1);
    };

    const handleAddToCart = () => {
        // not empty array products
        if (!product) {
            handleMessage({
                type: 'error',
                message: 'errors.adding_product_to_cart',
            });
            return;
        }

        if (!isLoggedIn) {
            handleMessage({
                type: 'info',
                message: 'must_be_logged_in_add_store',
            });
            return;
        }

        const packCartItem: IProductPack = {
            id: product.id ?? '',
            created_at: product.created_at ?? '',
            quantity: packQuantity,
            price: product.price ?? 0,
            img_url: product.product_multimedia?.p_principal ?? '',
            name: product.name ?? '',
            randomUUID: '',
            product_id: product.id ?? '',
        };

        addPackToCart(product, packCartItem);
        setPackQuantity(1);
    };

    return (
        <div>
            {boxPack && boxPack.box_pack_items && (
                <div className="mt-10">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                            {t('product_packs')}
                        </h4>
                    </div>

                    <fieldset className="mt-4">
                        <div className="mt-6 flex space-x-2">
                            <MarketCartButtons2
                                item={boxPack.box_pack_items[0]}
                                quantity={packQuantity}
                                handleIncreaseCartQuantity={() =>
                                    handleIncreasePackQuantity()
                                }
                                handleDecreaseCartQuantity={() =>
                                    handleDecreasePackQuantity()
                                }
                                handleRemoveFromCart={() => void 0}
                                displayDeleteButton={false}
                            />

                            <AddCardButton
                                withText={true}
                                onClick={() => handleAddToCart()}
                            />
                        </div>
                    </fieldset>
                </div>
            )}

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
