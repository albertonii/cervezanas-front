'use client';

import MobileMenu from './MobileMenu';
import ScreenMenu from './ScreenMenu';
import AuthPopup from './components/user/AuthPopup';
import useDeviceDetection from '@/hooks/useDeviceDetection';
import { useState } from 'react';

interface Props {
    i18nLocaleArray: string[];
}

export default function HeaderMenu({ i18nLocaleArray }: Props) {
    const device = useDeviceDetection();

    const [showLoginPopup, setShowLoginPopup] = useState(false);

    return (
        <header className="header sm:relative w-full bg-beer-foam bg-transparent z-10 max-w-full">
            <nav>
                {device === 'Mobile' ? (
                    <MobileMenu i18nLocaleArray={i18nLocaleArray} />
                ) : (
                    <ScreenMenu
                        i18nLocaleArray={i18nLocaleArray}
                        onLoginClick={() => setShowLoginPopup(true)}
                    />
                )}
            </nav>

            {showLoginPopup && (
                <AuthPopup onClose={() => setShowLoginPopup(false)} />
            )}
        </header>
    );
}
