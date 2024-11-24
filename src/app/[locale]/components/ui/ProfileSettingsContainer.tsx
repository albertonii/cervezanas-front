import React from 'react';

interface Props {
    children: React.ReactNode;
    sectionId: string;
}

const ProfileSettingsContainer = ({ children, sectionId }: Props) => {
    return (
        <section
            id={sectionId}
            className="mb-4 space-y-3 bg-white px-6 py-4 rounded-xl border dark:bg-gray-600 px-6 py-4 shadow-2xl"
        >
            {children}
        </section>
    );
};

export default ProfileSettingsContainer;
