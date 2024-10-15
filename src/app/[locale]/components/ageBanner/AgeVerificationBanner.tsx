'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AgeVerificationBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    useEffect(() => {
        const hasVerified = Cookies.get('ageVerified');
        if (!hasVerified) {
            setIsVisible(true);
        }
    }, []);

    const handleYes = () => {
        Cookies.set('ageVerified', 'true', { expires: 365 });
        setIsVisible(false);
    };

    const handleNo = () => {
        setHasAccess(false); 
        setIsVisible(false); 
    };

    if (!isVisible) {
        return hasAccess === false ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
                <div className="rounded bg-white bg-[url('/assets/madera-dark-account.webp')] bg-cover bg-top bg-no-repeat p-2 text-center shadow-lg">
                <div className="border-2 rounded-md border-beer-blonde p-10">
                    <h2 className="mb-4 -rotate-2 font-['NexaRust-script'] text-4xl text-white md:text-5xl">Acceso Denegado</h2>
                    <p className="mb-4 text-white">
                        Debes ser mayor de edad para navegar por esta web.
                    </p>
                    </div>
                </div>
            </div>
        ) : null; 
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="rounded bg-white bg-[url('/assets/madera-dark-account.webp')] bg-cover bg-top bg-no-repeat p-2 text-center shadow-lg ">
                <div className="border-2 rounded-md border-beer-blonde p-10">
                    <h2 className="-mt-2 mb-4 -rotate-2 font-['NexaRust-script'] text-4xl text-white md:text-5xl">
                        ¿Eres mayor de 18 años?
                    </h2>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleYes}
                            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 w-[100px] border-gray-200 border-2 hover:border-white"
                        >
                            Sí
                        </button>
                        <button
                            onClick={handleNo}
                            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 w-[100px] border-gray-200 border-2 hover:border-white"
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgeVerificationBanner;
