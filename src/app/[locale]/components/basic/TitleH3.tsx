import React from 'react';
import { useTranslations } from 'next-intl';

interface Props {
    name: string;
    description?: string;
    btnActions?: React.ReactNode;
}

const ProfileSectionHeader = ({ name, description, btnActions }: Props) => {
    const t = useTranslations();

    return (
        <header
            className="flex flex-col justify-between items-start rounded-lg space-y-1 pb-4"
            id="header"
        >
            <h1
                id="title"
                className="lowercase font-semibold text-beer-draft font-['NexaRust-script'] text-lg md:text-3xl"
            >
                {t(name)}
            </h1>

            {description && (
                <p
                    id="description"
                    className="mb-4 font-['Ubuntu-regular'] md:text-lg lg:text-lg text-gray-200 tracking-wide leading-relaxed -mt-6 "
                >
                    <div className="text-base italic text-beer-dark">
                        {t(description)}
                    </div>
                </p>
            )}

            {btnActions && <div className="flex space-x-4">{btnActions}</div>}
        </header>
    );
};

export default ProfileSectionHeader;
