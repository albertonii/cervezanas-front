import AddToCartPopup from './AddToCartPopup';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { IconButton } from '../ui/buttons/IconButton';
import { faBeerMugEmpty } from '@fortawesome/free-solid-svg-icons';

interface Props {
    onClick?: () => void;
    withText?: boolean;
    isVisible?: boolean;
    onClose?: () => void;
}

export function AddCartButton({ onClick, isVisible = false, onClose }: Props) {
    const t = useTranslations();
    const [animateCartBtn, setAnimateCartBtn] = useState(false);

    useEffect(() => {
        if (isVisible && onClose) {
            const timer = setTimeout(onClose, 2000); // Oculta la notificación tras 2 segundos
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const handleOnClick = () => {
        if (onClick) {
            onClick();
            setAnimateCartBtn(true);
            setTimeout(() => setAnimateCartBtn(false), 500); // Animación breve al añadir al carrito
        }
    };

    return (
        <div className="relative group w-full h-[120px] sm:h-[80px] h-[60px]">
            {/* Popup de añadido al carrito */}
            {isVisible && <AddToCartPopup onClose={onClose} />}

            {/* Botón principal */}
            <IconButton
                primary
                onClick={handleOnClick}
                classContainer="flex items-center justify-start w-full gap-2 group-hover:scale-105 transition-transform sm:h-full shadow-md bg-gradient-to-t from-beer-softBlonde to-white h-[60px] "
                classIcon={`w-[40px] sm:w-[45px] xl:w-10 h-[40px] sm:h-[45px] xl:h-8 transition-all transform group-hover:rotate-3 
                    ${animateCartBtn ? 'animate-wiggle' : ''}`}
                icon={faBeerMugEmpty}
                title={t('add_to_cart')}
            >
                <span className="text-base text-left hidden xl:block">
                    {t('add_to_cart')}
                </span>
            </IconButton>
        </div>
    );
}
