import React, { useState } from 'react';
import { ROLE_ENUM } from '@/lib//enums';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../(auth)/Context/useAuth';
import { UpProducerModal } from '@/app/[locale]/components/modals/UpProducerModal';
import { DownProducerModal } from '@/app/[locale]/components/modals/DownProducerModal';
import { UpDistributorModal } from '@/app/[locale]/components/modals/UpDistributorModal';
import { DownDistributorModal } from '@/app/[locale]/components/modals/DownDistributorModal';
import Button from '../ui/buttons/Button';

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
        <section
            id="account_basic_data"
            className="mb-4 space-y-3 bg-white px-6 py-4 rounded-xl border"
        >
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
                <h2
                    id="account-data"
                    className="text-4xl font-['NexaRust-script']"
                >
                    {t('profile_title_roles')}
                </h2>
                <span className="text-base ">
                    <i>{t('profile_description_roles')}</i>
                </span>
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
        </section>
    );
};

export default UserRoles;
