'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { useAuth } from '../../(auth)/Context/useAuth';

interface Props {
    onClose?: () => void;
}

const AddToCartPopup = ({ onClose }: Props) => {
    const { user } = useAuth(); // Obtiene la información del usuario

    if (!user) return null; // Si no hay usuario logueado, no mostrar el popup

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute -top-24 right-4 w-[160px] z-50  overflow-hidden"
        >
            <div className="bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-amber-500 bg-cerv-banana rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col items-center justify-between p-4 text-white -rotate-2">
                    <h3 className="text-amber-800 font-bold text-xl">
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
    );
};

export default AddToCartPopup;
