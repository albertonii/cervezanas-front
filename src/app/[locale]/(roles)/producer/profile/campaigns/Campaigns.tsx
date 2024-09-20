'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ICampaign, IProduct } from '@/lib//types/types';
import { DeleteCampaign } from '@/app/[locale]/components/modals/DeleteCampaign';
import { AddCampaign } from './AddCampaign';
import { CampaignList } from './CampaignList';
import ProfileSectionHeader from '@/app/[locale]/components/ui/ProfileSectionHeader';

interface Props {
    campaigns: ICampaign[];
    products: IProduct[];
    counter: number;
}

export function Campaigns({ products, counter }: Props) {
    const t = useTranslations();

    const [campaignModal, setCampaignModal] = useState<ICampaign>();

    const [acceptLinkProductsCampaign, setAcceptLinkProductsCampaign] =
        useState<boolean>(false);

    const [isEditShowModal, setIsEditShowModal] = useState(false);
    const [isDeleteShowModal, setIsDeleteShowModal] = useState(false);

    useEffect(() => {
        if (acceptLinkProductsCampaign) {
            setAcceptLinkProductsCampaign(false);
        }
    }, [acceptLinkProductsCampaign]);

    const handleEditShowModal = (value: boolean) => {
        setIsEditShowModal(value);
    };

    const handleDeleteShowModal = (value: boolean) => {
        setIsDeleteShowModal(value);
    };

    const handleCampaignModal = (campaign: ICampaign) => {
        setCampaignModal(campaign);
    };

    return (
        <section className="px-4 py-6 " aria-label="Campaigns">
            <ProfileSectionHeader
                headerTitle="campaigns"
                btnActions={<AddCampaign />}
            />

            <CampaignList
                handleEditShowModal={handleEditShowModal}
                handleDeleteShowModal={handleDeleteShowModal}
                handleCampaignModal={handleCampaignModal}
                counter={counter}
            />

            {isEditShowModal && <></>}

            {isDeleteShowModal && campaignModal && (
                <DeleteCampaign
                    campaign={campaignModal}
                    showModal={isDeleteShowModal}
                    handleDeleteShowModal={handleDeleteShowModal}
                />
            )}
        </section>
    );
}
