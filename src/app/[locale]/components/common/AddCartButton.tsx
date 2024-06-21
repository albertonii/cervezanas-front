import React from 'react';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from './IconButton';

interface Props {
    onClick?: () => void;
    withText?: boolean;
}

export function AddCardButton({ onClick }: Props) {
    return (
        <IconButton
            onClick={onClick}
            classContainer="transition-all ease-in duration-300 border-2 border-bear-light inline-flex items-center text-sm lg:text-lg font-medium mb-2 md:mb-0 bg-purple-500 px-5 py-1 hover:shadow-lg tracking-wider text-beer-softBlonde hover:text-beer-dark  hover:bg-beer-blonde w-[100px]"
            classIcon="w-[40px] h-[30px]"
            icon={faShoppingCart}
            isActive={false}
            primary
            classSpanChildren="pl-0 pr-1 py-1"
            title={'Add to cart'}
        />
    );
}
