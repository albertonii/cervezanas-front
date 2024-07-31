'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ICampaign, IProduct } from '@/lib//types/types';
import { DeleteCampaign } from '@/app/[locale]/components/modals/DeleteCampaign';
import { AddCampaign } from './AddCampaign';
import { CampaignList } from './CampaignList';

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
            <header className="flex flex-col space-y-4">
                <p className="flex justify-between py-4" id="header">
                    <span
                        id="title"
                        className="text-5xl uppercase font-semibold text-white"
                    >
                        {t('campaigns')}
                    </span>
                </p>

                <div className="w-40">
                    <AddCampaign />
                </div>
            </header>

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
