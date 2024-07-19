import React, { useState } from 'react';
import { faBeerMugEmpty } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from './IconButton';

interface Props {
    onClick?: () => void;
    withText?: boolean;
}

export function AddCardButton({ onClick }: Props) {
    const [animateCartBtn, setAnimateCartBtn] = useState(false);

    const handleOnClick = () => {
        if (onClick) {
            onClick();
            setAnimateCartBtn(true);
            setTimeout(() => {
                setAnimateCartBtn(false);
            }, 500);
        }
    };

    return (
        <IconButton
            onClick={handleOnClick}
            classContainer="border-2 border-bear-light inline-flex items-center text-sm lg:text-lg font-medium mb-2 md:mb-0
                bg-purple-500 px-5 py-1 hover:shadow-lg tracking-wider text-beer-softBlonde hover:text-beer-dark 
                hover:bg-beer-blonde w-[100px]"
            classIcon={`w-[40px] h-[40px]
                    ${animateCartBtn && 'animate-wiggle'}
                `}
            icon={faBeerMugEmpty}
            isActive={false}
            primary
            classSpanChildren="pl-0 pr-1 py-1"
            title={'Add to cart'}
        />
    );
}
