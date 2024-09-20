import BoxItem from './BoxItem';
import MarketCartButtons2 from '@/app/[locale]/components/cart/MarketCartButtons2';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IBoxPack } from '@/lib//types/product';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAuth } from '../../../(auth)/Context/useAuth';
import { IProduct, IProductPack } from '@/lib//types/types';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';
import { useMessage } from '@/app/[locale]/components/message/useMessage';
import { AddCardButton } from '@/app/[locale]/components/cart/AddCartButton';

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
            <h2 className="mt-8 text-xl py-1 font-semibold text-center bg-cerv-banana text-white rounded">
                La caja contiene los siguientes productos
            </h2>

            <table className="w-full text-center dark:text-gray-400 border rounded-full shadown-xl ">
                <thead className="text-md uppercase text-white dark:bg-gray-700 dark:text-gray-400 bg-cerv-coal">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 font-['NexaRust-script'] lowercase text-3xl"
                        >
                            {t('product')}
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 font-['NexaRust-script'] lowercase text-3xl"
                        >
                            {t('quantity')}
                        </th>
                    </tr>
                </thead>

                <tbody className="bg-white text-gray-700 text-xl border-beer-blonde border-b-2 border-t-2 shadow-lg h-[10vh]">
                    {boxPack &&
                        boxPack.box_pack_items?.map((item) => {
                            return <BoxItem item={item} />;
                        })}
                </tbody>
            </table>

            {boxPack && boxPack.box_pack_items && (
                <div className="mt-6">
                    <div className="flex space-x-2 bg-gray-100 p-1 shadow-lg relative float-left justify-center items-center">
                        <section aria-labelledby="information-heading">
                            <h3 id="information-heading" className="sr-only">
                                {t('product_information')}
                            </h3>

                            <p className="text-2xl font-semibold mt-6 bg-cerv-banana max-w-[140px] text-center p-5 rounded-full text-white shadow-xl  border-white border-4">
                                {formatCurrency(product?.price)}
                            </p>
                            <div className="m-auto text-center">
                                <img
                                    className="m-auto"
                                    src="/assets/home/detalle.svg"
                                    width="80"
                                ></img>
                            </div>
                        </section>

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
                </div>
            )}
        </div>
    );
}
