import { screen } from '@testing-library/react';
import { render } from '@/utils/testing/test-util';
import { IProductPackCartItem } from '@/lib//types/types';
import { CartItem } from '../cart/CartItem';

const item: IProductPackCartItem = {
    id: '1',
    name: 'Jaira IPA',
    image: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    price: 2,
    quantity: 6,
    packs: [
        {
            id: '1',
            created_at: '2021-08-10T15:00:00.000Z',

            name: 'Pack 1',
            price: 1000,
            quantity: 6,
            img_url:
                'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
            randomUUID: '1',
            product_id: '1',
        },
    ],
};

describe('Cart Item', () => {
    it('Should render the Cart Item', () => {
        render(<CartItem item={item} />);
        const cartItem = screen.getByTestId('cart-item');
        expect(cartItem).toBeInTheDocument();
    });
});
