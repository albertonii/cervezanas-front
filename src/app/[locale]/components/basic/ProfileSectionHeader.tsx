import React from 'react';
import { useTranslations } from 'next-intl';

interface Props {
    headerTitle: string;
    headerDescription?: string;
    btnActions?: React.ReactNode;
}

const ProfileSectionHeader = ({
    headerTitle,
    headerDescription,
    btnActions,
}: Props) => {
    const t = useTranslations();

    return (
        <header
            className="flex flex-col justify-between py-4 items-start rounded-lg shadow-lg"
            id="header"
        >
            <h1
                id="title"
                className="lowercase font-semibold text-white font-['NexaRust-script'] text-5xl md:text-7xl -rotate-2 ml-10"
            >
                {t(headerTitle)}
            </h1>

            {headerDescription && (
                <p
                    id="description"
                    className="text-base md:text-lg lg:text-2xl text-gray-200 mt-1 ml-2 tracking-wide leading-relaxed"
                >
                    {t(headerDescription)}
                </p>
            )}

            {btnActions && <div className="flex space-x-4">{btnActions}</div>}
        </header>
    );
};

export default ProfileSectionHeader;
