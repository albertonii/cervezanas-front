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
                className="lowercase font-semibold text-beer-draft font-['NexaRust-script'] text-4xl md:text-7xl -rotate-2 ml-10"
            >
                {t(headerTitle)}
            </h1>

            {headerDescription && (
                <p
                    id="description"
                    className="mb-10 font-['Ubuntu-regular'] md:text-lg lg:text-xl text-gray-200 ml-2 tracking-wide leading-relaxed bg-cerv-coal p-2 bg-opacity-70 rounded-full -mt-6 shadow-lg"
                >
                    <div className="border-beer-blonde border-2 rounded-full p-6 bg-beer-dark bg-opacity-70 text-base italic text-cerv-cream">
                        {t(headerDescription)}
                    </div>
                </p>
            )}

            {btnActions && <div className="flex space-x-4">{btnActions}</div>}
        </header>
    );
};

export default ProfileSectionHeader;
