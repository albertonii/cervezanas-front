import React, { useState } from 'react';
import { ROLE_ENUM } from '@/lib//enums';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../(auth)/Context/useAuth';
import { UpProducerModal } from '@/app/[locale]/components/modals/UpProducerModal';
import { DownProducerModal } from '@/app/[locale]/components/modals/DownProducerModal';
import { UpDistributorModal } from '@/app/[locale]/components/modals/UpDistributorModal';
import { DownDistributorModal } from '@/app/[locale]/components/modals/DownDistributorModal';
import Button from '../ui/buttons/Button';
import Title from '../ui/Title';
import Label from '../ui/Label';
import ProfileSettingsContainer from '../ui/ProfileSettingsContainer';

const UserRoles = () => {
    const t = useTranslations();
    const { roles } = useAuth();

    const [showUpDistributorRoleModal, setShowUpDistributorRoleModal] =
        useState<boolean>(false);

    const [showDownDistributorRoleModal, setShowDownDistributorRoleModal] =
        useState<boolean>(false);

    const [showUpProducerRoleModal, setShowUpProducerRoleModal] =
        useState<boolean>(false);

    const [showDownProducerRoleModal, setShowDownProducerRoleModal] =
        useState<boolean>(false);

    const handleShowUpDistributorModal = (show: boolean = false) => {
        setShowUpDistributorRoleModal(show);
    };

    const handleShowDownDistributorModal = (show: boolean) => {
        setShowDownDistributorRoleModal(show);
    };

    const handleShowUpProducerModal = (show: boolean = false) => {
        setShowUpProducerRoleModal(show);
    };

    const handleShowDownProducerModal = (show: boolean = false) => {
        setShowDownProducerRoleModal(show);
    };

    return (
        <ProfileSettingsContainer sectionId="account_basic_data">
            {showUpDistributorRoleModal && (
                <UpDistributorModal
                    handleShowUpDistributorModal={handleShowUpDistributorModal}
                    showModal={showUpDistributorRoleModal}
                />
            )}

            {showDownDistributorRoleModal && (
                <DownDistributorModal
                    handleShowDownDistributorModal={
                        handleShowDownDistributorModal
                    }
                    showModal={showDownDistributorRoleModal}
                />
            )}

            {showUpProducerRoleModal && (
                <UpProducerModal
                    handleShowUpProducerModal={handleShowUpProducerModal}
                    showModal={showUpProducerRoleModal}
                />
            )}

            {showDownProducerRoleModal && (
                <DownProducerModal
                    handleShowDownProducerModal={handleShowDownProducerModal}
                    showModal={showDownProducerRoleModal}
                />
            )}

            <div>
                <Title size="large" color="black">
                    {t('profile_title_roles')}
                </Title>

                <Label className="block text-sm sm:text-base h-[auto]">
                    <i>{t('profile_description_roles')}</i>
                </Label>

                <span className="text-base "></span>
            </div>

            <div id="roles" className="flex flex-wrap">
                {roles?.map((role: string) => (
                    <div
                        key={role}
                        className="bg-gray-200 text-gray-800 rounded-full px-2 py-1 m-1"
                    >
                        {t(`role.${role}`)}
                    </div>
                ))}
            </div>

            <section>
                {roles?.includes(ROLE_ENUM.Distributor) ? (
                    <Button
                        primary
                        small
                        onClick={() => handleShowDownDistributorModal(true)}
                    >
                        {t('request_distributor_deregistration')}
                    </Button>
                ) : (
                    <Button
                        onClick={() => handleShowUpDistributorModal(true)}
                        primary
                        small
                    >
                        {t('request_distributor_registration')}
                    </Button>
                )}
            </section>

            <section>
                {roles?.includes(ROLE_ENUM.Productor) ? (
                    <Button
                        primary
                        small
                        onClick={() => handleShowDownProducerModal(true)}
                    >
                        {t('request_producer_deregistration')}
                    </Button>
                ) : (
                    <Button
                        onClick={() => handleShowUpProducerModal(true)}
                        primary
                        small
                    >
                        {t('request_producer_registration')}
                    </Button>
                )}
            </section>
        </ProfileSettingsContainer>
    );
};

export default UserRoles;
