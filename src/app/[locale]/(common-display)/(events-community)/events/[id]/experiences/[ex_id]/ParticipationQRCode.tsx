import React from 'react';
import QRCode from 'react-qr-code';

import { useLocale } from 'next-intl';
import {
    CERVEZANAS_BEER_URL,
    LOCALHOST_3000,
    ROUTE_BARMAN,
    ROUTE_EXPERIENCE_PARTICIPANT,
    ROUTE_PRODUCER,
} from '@/config';
import { useRouter } from 'next/navigation';

interface Props {
    experienceParticipantId: string;
}

export default function ParticipationQRCode({
    experienceParticipantId,
}: Props) {
    const locale = useLocale();
    const router = useRouter();

    const environmentState = process.env.NODE_ENV;

    const host =
        environmentState === 'development'
            ? LOCALHOST_3000
            : CERVEZANAS_BEER_URL;

    const experienceParticipatantBarmanUrl = `${host}/${locale}${ROUTE_PRODUCER}${ROUTE_BARMAN}${ROUTE_EXPERIENCE_PARTICIPANT}/${experienceParticipantId}`;
    // console.info(experienceParticipatantBarmanUrl);

    const handleOnClick = () => {
        router.push(experienceParticipatantBarmanUrl);
    };

    return (
        <section
            className="space-y-4 transition-all"
            onClick={() => handleOnClick()}
        >
            <QRCode
                value={experienceParticipatantBarmanUrl}
                className=""
                size={150}
            />

            {/* <ShareLink link={experienceParticipatantBarmanUrl} /> */}
        </section>
    );
}
