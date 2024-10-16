import { Globe } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface Props {
    i18nLocaleArray: string[];
}

const LanguageScreenMenuButton = ({ i18nLocaleArray }: Props) => {
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const pathName = usePathname();

    const redirectedPathName = (locale: string) => {
        if (!pathName) return '/';
        const segments = pathName.split('/');
        segments[1] = locale;
        return segments.join('/');
    };

    return (
        <div className="flex items-center space-x-6 relative">
            <div className="relative">
                <button
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="icon-btn"
                    aria-label="Cambiar idioma"
                >
                    <Globe size={30} color="#fefefe" />
                </button>

                {isLanguageOpen && (
                    <div className="dropdown-menu">
                        {i18nLocaleArray.map((lang, index) => (
                            <a
                                key={index}
                                href={redirectedPathName(lang)}
                                className="dropdown-item"
                            >
                                {lang}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LanguageScreenMenuButton;
