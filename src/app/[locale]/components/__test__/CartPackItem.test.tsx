import { screen } from '@testing-library/react';
import { render } from '@/utils/testing_/test-util';
import { IProductPack, IProductPackCartItem } from '@/lib/types/types';
import { CartPackItem } from '../cart/CartPackItem';

const item: IProductPackCartItem = {
    id: '1',
    name: 'Jaira IPA',
    image: 'public/assets/marketplace_product_default.png',
    price: 2,
    quantity: 6,
    packs: [
        {
            id: '1',
            created_at: '2021-08-10T15:00:00.000Z',

            name: 'Pack 1',
            price: 1000,
            quantity: 6,
            img_url: 'public/assets/marketplace_product_default.png',
            randomUUID: '1',
            product_id: '1',
        },
    ],
};

const pack: IProductPack = {
    id: '1',
    created_at: '2021-08-10T15:00:00.000Z',
    name: 'Pack 1',
    price: 1000,
    quantity: 6,
    img_url: 'public/assets/marketplace_product_default.png',
    randomUUID: '1',
    product_id: '1',
};

describe('Cart Item', () => {
    it('Should render the Cart Item', () => {
        render(<CartPackItem item={item} pack={pack} />);

        const cartPackItem = screen.getByTestId('cart-pack-item');

        expect(cartPackItem).toBeInTheDocument();
    });
});
