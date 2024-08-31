import React, { useState, useEffect } from 'react';
import { faBeerMugEmpty } from '@fortawesome/free-solid-svg-icons';
import { IconButton } from './IconButton';
import { motion } from 'framer-motion';

interface Props {
    onClick?: () => void;
    withText?: boolean;
    isVisible?: boolean;
    onClose?: () => void;
}

export function AddCardButton({ onClick, isVisible, onClose }: Props) {
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
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="absolute -top-24 right-4 w-[160px] z-50 bg-beer-foam"
                >
                    <div className="bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-amber-500 rounded-lg shadow-lg overflow-hidden">
                        <div className="flex flex-col items-center justify-between p-4">
                            <h3 className="text-amber-800 font-bold text-md">
                                ¡Salud!
                            </h3>
                            <span>Añadido al carrito</span>
                        </div>
                        <div className="bg-amber-500 h-1 w-full">
                            <motion.div
                                className="bg-amber-700 h-full"
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: 5 }}
                                onAnimationComplete={onClose}
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            <IconButton
                onClick={handleOnClick}
                classContainer="border-2 border-bear-light inline-flex items-center text-sm lg:text-lg font-medium mb-2 md:mb-0
                bg-purple-500 px-5 py-1 hover:shadow-lg tracking-wider text-beer-dark 
                hover:bg-beer-blonde w-[100px]"
                classIcon={`w-[40px] h-[40px]
                    ${animateCartBtn && 'animate-wiggle'}
                `}
                icon={faBeerMugEmpty}
                isActive={false}
                primary
                title={'Add to cart'}
            />
        </div>
    );
}
