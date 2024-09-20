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
        <div className="relative">
            {isVisible && <AddToCartPopup onClose={onClose} />}

            <IconButton
                onClick={handleOnClick}
                classContainer="text-base lg:text-lg"
                classIcon={`w-[38px] h-[38px]
                    ${animateCartBtn && 'animate-wiggle'}
                `}
                icon={faBeerMugEmpty}
                isActive={false}
                primary
                title={'Add to cart'}
            >
                {t('add_to_cart')}
            </IconButton>
        </div>
    );
}
