import Button from './Button';
import Image from 'next/image';
import React from 'react';
import { useShoppingCart } from '@/app/context/ShoppingCartContext';

const ShoppingCartScreenMenuButton = () => {
    const { cartQuantity, openCart, closeCart } = useShoppingCart();

    return (
        <div className="relative flex h-full items-center justify-center font-medium w-[50px]">
            <Button
                class={
                    'border-none transition-all hover:scale-110 hover:cursor-pointer hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent relative rounded-full lg:mr-4'
                }
                onClick={() => openCart()}
                title={''}
            >
                <Image
                    alt={'Go to Shopping cart'}
                    src={'/icons/shopping-cart-nobg.svg'}
                    width={40}
                    height={40}
                    className={
                        'rounded-full bg-beer-blonde w-[40px] lg:w-[50px] p-[5px] border-beer-softBlondeBubble border-2 max-w-[80px]'
                    }
                />
                <span
                    className={`
                white absolute bottom-0 right-0 flex h-6 w-6 translate-x-2 translate-y-2 items-center justify-center rounded-full bg-beer-softBlonde 
            `}
                >
                    {cartQuantity()}
                </span>
            </Button>
        </div>
    );
};

export default ShoppingCartScreenMenuButton;
