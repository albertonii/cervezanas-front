import React from 'react';
import QRCode from 'react-qr-code';
import ShareLink from '@/app/[locale]/components/ui/ShareLink';
import { useLocale } from 'next-intl';
import { ROUTE_BARMAN, ROUTE_PRODUCER, ROUTE_PRODUCT } from '@/config';

interface Props {
    eventOrderItemId: string;
    domain: string;
}

export default function GenerateProductQR({ eventOrderItemId, domain }: Props) {
    const locale = useLocale();
    // const router = useRouter();

    const environmentState = process.env.NODE_ENV;

    const host =
        environmentState === 'development'
            ? domain
            : 'https://cervezanas-front.vercel.app';

    const productBarmanUrl = `${host}/${locale}${ROUTE_PRODUCER}${ROUTE_BARMAN}${ROUTE_PRODUCT}/${eventOrderItemId}`;
    console.info(productBarmanUrl);

    const handleOnClick = () => {
        // router.push(productUrl);
    };

    return (
        <section
            className="space-y-4 transition-all"
            onClick={() => handleOnClick()}
        >
            <QRCode value={productBarmanUrl} className="" size={150} />

            <ShareLink link={productBarmanUrl} />
        </section>
    );
}
