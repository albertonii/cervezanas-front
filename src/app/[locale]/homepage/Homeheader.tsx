import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import Slider from '@/app/[locale]/components/slider/Slider';

export function Homeheader() {
    const t = useTranslations();
    const router = useRouter();

    return (
        <>
            {/*  bloque 1 */}
            <Slider></Slider>
            {/*  bloque 2 */}
        </>
    );
}
