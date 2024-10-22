import AddToCartPopup from './AddToCartPopup';
import React, { useState, useEffect } from 'react';
import { faBeerMugEmpty } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from 'next-intl';
import { IconButton } from '../ui/buttons/IconButton';

interface Props {
    onClick?: () => void;
    withText?: boolean;
    isVisible?: boolean;
    onClose?: () => void;
}

export function AddCardButton({ onClick, isVisible, onClose }: Props) {
    const t = useTranslations();

    const [animateCartBtn, setAnimateCartBtn] = useState(false);

    useEffect(() => {
        if (isVisible && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000); // La notificación desaparecerá después de 3 segundos

            return () => clearTimeout(timer);
        }
    }, [isVisible]);

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
<div className="relative group">
    {isVisible && <AddToCartPopup onClose={onClose} />}

    <IconButton
        onClick={handleOnClick}
        classContainer="text-base lg:text-lg text-left transform transition-transform group-hover:scale-105 group-hover:shadow-lg group-hover:outline group-hover:outline-1 group-hover:outline-white group-hover:outline-offset-[-3px]"
        classIcon={`w-[40px] h-[40px] px-3 float-left mr-0 lg:mr-2 text-beer-gold group-hover:text-beer-dark py-1 group-hover:w-[45px] group-hover:h-[45px] group-hover:py-0 group-hover:rotate-3 group-hover:px-2 group-hover:filter group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,1)] transition-all transform
            ${animateCartBtn && 'animate-wiggle'}
        `}
        icon={faBeerMugEmpty}
        isActive={false}
        primary
        title={'Add to cart'}
    >
        <div className="text-base ml-3 leading-tight w-full pr-6 py-1">
            {t('add_to_cart')}
        </div>
    </IconButton>
</div>





    );
}
